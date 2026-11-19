import { useState, useEffect, useCallback } from "react";
import { Avatar, Typography, Box, Stack } from "@mui/material";
import { CheckCircle, XCircle, Eye, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  PageContainer,
  HeaderSection,
  IconBadge,
  PendingCard,
  UserAvatar,
  ActionButton,
  StatusChip,
  UserCell,
} from "./ApprovalStyle";
import { ConfirmationModal } from "../../../components/common/modal/ConfirmationModal";
import { SharedTable } from "../../../components/ui/table/tables";
import { useTranslation } from "react-i18next";
import { approvalService, type ApprovalRequest } from "../../../services/userService";
import { getApiErrorMessage, toDisplayError } from "../../../utils/apiError";
import { brand, neutral } from '../../../theme';
import { ErrorState, LoadingState } from '../../../components/common/states';
import { notifyApprovalsChanged } from "../../../hooks/usePendingApprovals";

type ConfirmState = {
  open: boolean;
  type: "approve" | "reject" | "delete" | "bulk_delete" | null;
  request?: ApprovalRequest;
  // User ids (reject and delete remove the user account).
  ids?: number[];
};

interface ApprovalHistoryRow {
  // User id, so table selection maps straight onto delete.
  id: string;
  name: string;
  email: string;
  role: ApprovalRequest["role"];
  detail: string;
  submitted: string;
  status: string;
}

const initials = (name: string) => name.split(" ").map((n) => n[0]).join("");
const profilePath = (r: ApprovalRequest) => `/profile/${r.role.toLowerCase()}/${r.profileId}`;

export const AdminApprovalsPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmState>({ open: false, type: null });

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    approvalService
      .getAll()
      .then(setRequests)
      .catch((err) => setError(getApiErrorMessage(err, t("admin.approvals.loadFailed", "Failed to load approvals"))))
      .finally(() => setLoading(false));
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const pending = requests.filter((r) => !r.isAccepted);
  const accepted = requests.filter((r) => r.isAccepted);

  const roleLabel = (role: ApprovalRequest["role"]) => t(`admin.users.form.roles.${role.toLowerCase()}`, role);
  const registrationLabel = (role: ApprovalRequest["role"]) =>
    role === "Trainer"
      ? t("admin.approvals.trainerApplication", "Trainer registration")
      : t("admin.approvals.studentApplication", "Student registration");

  const runConfirmedAction = async () => {
    const { type, request, ids } = confirm;
    setBusy(true);
    setError(null);
    try {
      if (type === "approve" && request) await approvalService.accept(request);
      else if ((type === "reject" || type === "delete") && request) await approvalService.remove(request.userId);
      else if (type === "bulk_delete" && ids) await Promise.all(ids.map((id) => approvalService.remove(id)));
      notifyApprovalsChanged();
      load();
    } catch (err) {
      throw toDisplayError(err, t("admin.approvals.actionFailed", "Action failed"));
    } finally {
      setBusy(false);
    }
  };

  const historyRows: ApprovalHistoryRow[] = accepted.map((r) => ({
    id: String(r.userId),
    name: r.name,
    email: r.email,
    role: r.role,
    detail: r.detail || "—",
    submitted: r.createdAt ? new Date(r.createdAt).toLocaleDateString(i18n.language) : "—",
    status: "Approved",
  }));

  const columns = [
    {
      id: "name",
      label: t("admin.approvals.columns.name"),
      render: (row: ApprovalHistoryRow) => (
        <UserCell>
          <Avatar sx={{ width: 36, height: 36, backgroundColor: brand[500], fontSize: "12px", fontWeight: 700 }}>
            {initials(row.name)}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: "14px", color: neutral[800] }}>{row.name}</Typography>
            <Typography sx={{ fontSize: "12px", color: neutral[400] }}>{row.email}</Typography>
          </Box>
        </UserCell>
      ),
    },
    {
      id: "role",
      label: t("admin.approvals.columns.role"),
      render: (row: ApprovalHistoryRow) => roleLabel(row.role),
    },
    { id: "detail", label: t("admin.approvals.columns.details") },
    { id: "submitted", label: t("admin.approvals.columns.submitted") },
    {
      id: "status",
      label: t("admin.approvals.columns.status"),
      render: (row: ApprovalHistoryRow) => (
        <StatusChip label={t("admin.approvals.status.approved", "Approved")} status={row.status} />
      ),
    },
  ];

  if (loading) {
    return (
      <LoadingState />
    );
  }

  return (
    <PageContainer>
      <HeaderSection>
        <IconBadge>✓</IconBadge>
        <Box>
          <Typography sx={{ fontSize: "28px", fontWeight: 800, color: neutral[800], letterSpacing: "-0.5px" }}>
            {t("admin.approvals.title")}
          </Typography>
          <Typography sx={{ fontSize: "14px", color: neutral[500], fontWeight: 500, mt: "6px" }}>
            {t("admin.approvals.subtitle")}
          </Typography>
        </Box>
      </HeaderSection>

      {error && (
        <ErrorState message={error} onClose={() => setError(null)} />
      )}

      <Typography sx={{ fontSize: "16px", fontWeight: 700, color: neutral[800], mb: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
        <Clock size={20} color={brand[500]} />
        {t("admin.approvals.pendingRequests")}
      </Typography>

      {pending.length === 0 ? (
        <Box sx={{ mb: 6, p: 4, bgcolor: neutral[50], borderRadius: "16px", border: `2px dashed ${neutral[200]}`, textAlign: "center" }}>
          <Typography sx={{ color: neutral[400], fontWeight: 600 }}>{t("admin.approvals.noPending")}</Typography>
        </Box>
      ) : (
        <Stack spacing={2} sx={{ mb: 6 }}>
          {pending.map((request) => (
            <PendingCard key={request.userId}>
              <Box sx={{ p: 3 }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ alignItems: "center", width: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: "200px", flex: 1 }}>
                    <UserAvatar>{initials(request.name)}</UserAvatar>
                    <Box>
                      <Typography sx={{ fontSize: "18px", fontWeight: 700, color: neutral[800] }}>{request.name}</Typography>
                      <Typography sx={{ fontSize: "13px", color: neutral[400], mt: "2px", fontWeight: 600 }}>
                        {registrationLabel(request.role)}
                        {request.email ? ` · ${request.email}` : ""}
                      </Typography>
                    </Box>
                  </Box>

                  <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: "wrap" }}>
                    <ActionButton variant="outlined" startIcon={<Eye size={16} />} onClick={() => navigate(profilePath(request))}>
                      {t("admin.approvals.actions.view")}
                    </ActionButton>
                    <ActionButton variant="contained" startIcon={<CheckCircle size={16} />} disabled={busy} onClick={() => setConfirm({ open: true, type: "approve", request })}>
                      {t("admin.approvals.actions.approve")}
                    </ActionButton>
                    <ActionButton variant="outlined" color="error" startIcon={<XCircle size={16} />} disabled={busy} onClick={() => setConfirm({ open: true, type: "reject", request })}>
                      {t("admin.approvals.actions.reject")}
                    </ActionButton>
                  </Stack>
                </Stack>
              </Box>
            </PendingCard>
          ))}
        </Stack>
      )}

      <Typography sx={{ fontSize: "16px", fontWeight: 700, color: neutral[800], mb: "16px" }}>
        {t("admin.approvals.approvalHistory")}
      </Typography>
      <SharedTable
        data={historyRows}
        columns={columns}
        onEdit={(row: ApprovalHistoryRow) => {
          const request = accepted.find((r) => String(r.userId) === row.id);
          if (request) navigate(profilePath(request));
        }}
        onDelete={(ids: string[]) => setConfirm({ open: true, type: "bulk_delete", ids: ids.map(Number) })}
        onSingleDelete={(id: string) =>
          setConfirm({ open: true, type: "delete", request: accepted.find((r) => String(r.userId) === id) })
        }
        searchPlaceholder={t("admin.approvals.searchPlaceholder")}
      />

      <ConfirmationModal
        open={confirm.open}
        onClose={() => setConfirm({ open: false, type: null })}
        onConfirm={runConfirmedAction}
        title={
          confirm.type === "approve"
            ? t("admin.approvals.confirm.approveTitle")
            : confirm.type === "reject"
              ? t("admin.approvals.confirm.rejectTitle")
              : confirm.type === "bulk_delete"
                ? t("admin.approvals.confirm.bulkDeleteTitle")
                : t("admin.approvals.confirm.deleteTitle")
        }
        message={
          confirm.type === "approve"
            ? t("admin.approvals.confirm.approveMessage", {
                name: confirm.request?.name,
                role: confirm.request ? roleLabel(confirm.request.role) : "",
              })
            : confirm.type === "reject"
              ? t("admin.approvals.confirm.rejectMessage", { name: confirm.request?.name })
              : confirm.type === "bulk_delete"
                ? t("admin.approvals.confirm.bulkDeleteMessage", { count: confirm.ids?.length })
                : t("admin.approvals.confirm.deleteMessage")
        }
        confirmLabel={
          confirm.type === "approve"
            ? t("admin.approvals.confirm.approveLabel")
            : confirm.type === "reject"
              ? t("admin.approvals.confirm.rejectLabel")
              : t("admin.approvals.confirm.deleteLabel")
        }
        isDanger={confirm.type !== "approve"}
      />
    </PageContainer>
  );
};
