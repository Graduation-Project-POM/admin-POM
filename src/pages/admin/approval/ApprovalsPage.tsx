import { useState, useEffect, useCallback } from "react";
import { Avatar, Typography, Box, Stack } from "@mui/material";
import { CheckCircle, XCircle, Eye, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  PageContainer,
  PendingCard,
  UserAvatar,
  ActionButton,
  StatusChip,
  UserCell,
} from "./ApprovalStyle";
import { ConfirmationModal } from "../../../components/common/modal/ConfirmationModal";
import { SharedTable } from "../../../components/ui/table/tables";
import { useTranslation } from "react-i18next";
import { studentService, type StudentListItem } from "../../../services/studentService";
import { getApiErrorMessage } from "../../../utils/apiError";
import { brand, neutral } from '../../../theme';
import { ErrorState, LoadingState } from '../../../components/common/states';
import { PageHeader } from "../../../components/common/shell";

type ConfirmState = {
  open: boolean;
  type: "approve" | "reject" | "delete" | "bulk_delete" | null;
  student?: StudentListItem;
  ids?: number[];
};

interface ApprovalHistoryRow {
  id: string;
  name: string;
  email: string;
  gradeLevel: string;
  joinYear: string;
  status: string;
}

export const AdminApprovalsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmState>({ open: false, type: null });

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    studentService
      .getAllDetailed()
      .then(setStudents)
      .catch((err) => setError(getApiErrorMessage(err, t("admin.approvals.loadFailed", "Failed to load approvals"))))
      .finally(() => setLoading(false));
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const pending = students.filter((s) => !s.isAccepted);
  const accepted = students.filter((s) => s.isAccepted);

  const runConfirmedAction = async () => {
    const { type, student, ids } = confirm;
    setConfirm({ open: false, type: null });
    setBusy(true);
    setError(null);
    try {
      if (type === "approve" && student) await studentService.accept(student.id);
      else if (type === "reject" && student) await studentService.remove(student.id);
      else if (type === "delete" && student) await studentService.remove(student.id);
      else if (type === "bulk_delete" && ids) await Promise.all(ids.map((id) => studentService.remove(id)));
      load();
    } catch (err) {
      setError(getApiErrorMessage(err, t("admin.approvals.actionFailed", "Action failed")));
    } finally {
      setBusy(false);
    }
  };

  const historyRows: ApprovalHistoryRow[] = accepted.map((s) => ({
    id: String(s.id),
    name: s.name,
    email: s.email,
    gradeLevel: s.gradeLevel,
    joinYear: s.joinYear,
    status: "Approved",
  }));

  const columns = [
    {
      id: "name",
      label: t("admin.approvals.columns.name"),
      render: (row: ApprovalHistoryRow) => (
        <UserCell>
          <Avatar sx={{ width: 36, height: 36, backgroundColor: brand[500], fontSize: "12px", fontWeight: 700 }}>
            {row.name.split(" ").map((n: string) => n[0]).join("")}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: "14px", color: neutral[800] }}>{row.name}</Typography>
            <Typography sx={{ fontSize: "12px", color: neutral[400] }}>{row.email}</Typography>
          </Box>
        </UserCell>
      ),
    },
    { id: "gradeLevel", label: t("profile.view.gradeLevel") },
    { id: "joinYear", label: t("profile.view.joinYear") },
    {
      id: "status",
      label: t("admin.approvals.columns.status"),
      render: (row: ApprovalHistoryRow) => <StatusChip label={row.status} status={row.status} />,
    },
  ];

  if (loading) {
    return (
      <LoadingState />
    );
  }

  return (
    <PageContainer>
      <PageHeader title={t("admin.approvals.title")} subtitle={t("admin.approvals.subtitle")} />

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
          {pending.map((student) => (
            <PendingCard key={student.id}>
              <Box sx={{ p: 3 }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ alignItems: "center", width: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: "200px", flex: 1 }}>
                    <UserAvatar>{student.name.split(" ").map((n) => n[0]).join("")}</UserAvatar>
                    <Box>
                      <Typography sx={{ fontSize: "18px", fontWeight: 700, color: neutral[800] }}>{student.name}</Typography>
                      <Typography sx={{ fontSize: "13px", color: neutral[400], mt: "2px", fontWeight: 600 }}>
                        {student.email || t("admin.approvals.studentApplication", "Student registration")}
                      </Typography>
                    </Box>
                  </Box>

                  <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: "wrap" }}>
                    <ActionButton variant="outlined" startIcon={<Eye size={16} />} onClick={() => navigate(`/profile/student/${student.id}`)}>
                      {t("admin.approvals.actions.view")}
                    </ActionButton>
                    <ActionButton variant="contained" startIcon={<CheckCircle size={16} />} disabled={busy} onClick={() => setConfirm({ open: true, type: "approve", student })}>
                      {t("admin.approvals.actions.approve")}
                    </ActionButton>
                    <ActionButton variant="outlined" color="error" startIcon={<XCircle size={16} />} disabled={busy} onClick={() => setConfirm({ open: true, type: "reject", student })}>
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
        onEdit={(row: ApprovalHistoryRow) => navigate(`/profile/student/${row.id}`)}
        onDelete={(ids: string[]) => setConfirm({ open: true, type: "bulk_delete", ids: ids.map(Number) })}
        onSingleDelete={(id: string) =>
          setConfirm({ open: true, type: "delete", student: accepted.find((s) => String(s.id) === id) })
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
            ? t("admin.approvals.confirm.approveMessage", { name: confirm.student?.name })
            : confirm.type === "reject"
              ? t("admin.approvals.confirm.rejectMessage", { name: confirm.student?.name })
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
