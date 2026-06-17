import { useState } from "react";
import { Avatar, Typography, Box, Stack } from "@mui/material";
import {
  CheckCircle,
  XCircle,
  Eye,
  Clock,
} from "lucide-react";
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
import { ViewTrainerDetails } from "./View";
import { ConfirmationModal } from "../../../components/common/modal/ConfirmationModal";
import { SharedTable } from "../../../components/ui/table/tables";
import Edit from "./Edit";
import { useTranslation } from "react-i18next";

const INITIAL_PENDING = {
  id: "0",
  name: "David Wilson",
  email: "david.wilson@example.com",
  phone: "+1 234 567 8903",
  submitted: "2026-03-28",
  specialization: "Advanced Algorithms, Competitive Programming",
  bio: "Passionate educator with 8+ years of experience in teaching competitive programming and algorithms.",
};

const INITIAL_HISTORY = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    specialization: "Data Structures, Python",
    submitted: "2026-03-25",
    status: "Approved",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    specialization: "Web Development, JavaScript",
    submitted: "2026-03-22",
    status: "Approved",
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    email: "emma.r@example.com",
    specialization: "Machine Learning, AI",
    submitted: "2026-03-20",
    status: "Rejected",
  },
  {
    id: "4",
    name: "James Kim",
    email: "james.kim@example.com",
    specialization: "Competitive Programming, C++",
    submitted: "2026-03-18",
    status: "Approved",
  },
  {
    id: "5",
    name: "Lisa Wang",
    email: "lisa.wang@example.com",
    specialization: "Database Design, SQL",
    submitted: "2026-03-15",
    status: "Approved",
  },
];

export const AdminApprovalsPage = () => {
  const { t } = useTranslation();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null);
  const [pendingRequest, setPendingRequest] = useState<any>(INITIAL_PENDING);
  const [history, setHistory] = useState(INITIAL_HISTORY);

  const [confirmConfig, setConfirmConfig] = useState<{
    open: boolean;
    type: "approve" | "reject" | "delete" | "bulk_delete" | null;
    onConfirmOverride?: () => void;
    itemCount?: number;
  }>({
    open: false,
    type: null,
  });

  const handleApproveClick = () =>
    setConfirmConfig({ open: true, type: "approve" });
  const handleRejectClick = () =>
    setConfirmConfig({ open: true, type: "reject" });

  const handleEditSave = (updatedTrainer: any) => {
    if (pendingRequest && updatedTrainer.id === pendingRequest.id) {
      setPendingRequest({
        ...pendingRequest,
        ...updatedTrainer,
      });
    } else {
      setHistory(
        history.map((item) =>
          item.id === updatedTrainer.id ? { ...item, ...updatedTrainer } : item,
        ),
      );
    }
    setEditOpen(false);
    setSelectedTrainer(null);
  };

  const handleHistoryEdit = (row: any) => {
    setSelectedTrainer(row);
    setEditOpen(true);
  };

  const handleHistoryDelete = (id: string) => {
    setConfirmConfig({
      open: true,
      type: "delete",
      onConfirmOverride: () => {
        setHistory(history.filter((item) => item.id !== id));
      },
    });
  };

  const handleBulkDelete = (ids: string[]) => {
    setConfirmConfig({
      open: true,
      type: "bulk_delete",
      itemCount: ids.length,
      onConfirmOverride: () => {
        setHistory((prev) => prev.filter((item) => !ids.includes(item.id)));
      },
    });
  };

  const handleConfirmAction = () => {
    if (confirmConfig.onConfirmOverride) {
      confirmConfig.onConfirmOverride();
      setConfirmConfig({ open: false, type: null });
      return;
    }
    if (!pendingRequest) return;

    const newStatus =
      confirmConfig.type === "approve" ? "Approved" : "Rejected";

    setHistory([
      {
        ...pendingRequest,
        status: newStatus,
      },
      ...history,
    ]);

    setPendingRequest(null);
    setConfirmConfig({ open: false, type: null });
  };

  const columns = [
    {
      id: "name",
      label: t("admin.approvals.columns.name"),
      render: (row: any) => (
        <UserCell>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              backgroundColor: "#8B1D23",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            {row.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </Avatar>
          <Box>
            <Typography
              sx={{ fontWeight: 600, fontSize: "14px", color: "#1e293b" }}
            >
              {row.name}
            </Typography>
            <Typography sx={{ fontSize: "12px", color: "#94a3b8" }}>
              {row.email}
            </Typography>
          </Box>
        </UserCell>
      ),
    },
    { id: "specialization", label: t("admin.approvals.columns.specialization") },
    { id: "submitted", label: t("admin.approvals.columns.submitted") },
    {
      id: "status",
      label: t("admin.approvals.columns.status"),
      render: (row: any) => (
        <StatusChip label={row.status} status={row.status} />
      ),
    },
  ];

  return (
    <PageContainer>
      <HeaderSection>
        <IconBadge>✓</IconBadge>
        <Box>
          <Typography
            sx={{
              fontSize: "28px",
              fontWeight: 800,
              color: "#1e293b",
              letterSpacing: "-0.5px",
            }}
          >
            {t("admin.approvals.title")}
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              color: "#64748b",
              fontWeight: 500,
              mt: "6px",
            }}
          >
            {t("admin.approvals.subtitle")}
          </Typography>
        </Box>
      </HeaderSection>

      {pendingRequest ? (
        <Box sx={{ mb: 6 }}>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#1e293b",
              mb: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Clock size={20} color="#8B1D23" />
            {t("admin.approvals.pendingRequests")}
          </Typography>

          <PendingCard>
            <Box sx={{ p: 4 }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={4}
                sx={{
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    minWidth: "200px",
                  }}
                >
                  <UserAvatar>
                    {pendingRequest.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </UserAvatar>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "#1e293b",
                      }}
                    >
                      {pendingRequest.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "#94a3b8",
                        mt: "2px",
                        fontWeight: 600,
                      }}
                    >
                      {t("admin.approvals.trainerApplication")}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", flex: 1 }}
                >
                  <Stack direction="row" spacing={1.5}>
                    <ActionButton
                      variant="outlined"
                      startIcon={<Eye size={16} />}
                      onClick={() => setDetailsOpen(true)}
                    >
                      {t("admin.approvals.actions.view")}
                    </ActionButton>

                    <ActionButton
                      variant="contained"
                      startIcon={<CheckCircle size={16} />}
                      onClick={handleApproveClick}
                    >
                      {t("admin.approvals.actions.approve")}
                    </ActionButton>

                    <ActionButton
                      variant="outlined"
                      color="error"
                      startIcon={<XCircle size={16} />}
                      onClick={handleRejectClick}
                    >
                      {t("admin.approvals.actions.reject")}
                    </ActionButton>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </PendingCard>
        </Box>
      ) : (
        <Box
          sx={{
            mb: 6,
            p: 4,
            bgcolor: "#f8fafc",
            borderRadius: "16px",
            border: "2px dashed #e2e8f0",
            textAlign: "center",
          }}
        >
          <Typography sx={{ color: "#94a3b8", fontWeight: 600 }}>
            {t("admin.approvals.noPending")}
          </Typography>
        </Box>
      )}

      <Typography
        sx={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", mb: "16px" }}
      >
        {t("admin.approvals.approvalHistory")}
      </Typography>
      <SharedTable
        data={history}
        columns={columns}
        onEdit={handleHistoryEdit}
        onDelete={handleBulkDelete}
        onSingleDelete={handleHistoryDelete}
        searchPlaceholder={t("admin.approvals.searchPlaceholder")}
      />

      <ViewTrainerDetails
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        trainer={pendingRequest}
      />

      <Edit
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedTrainer(null);
        }}
        trainer={selectedTrainer || pendingRequest}
        onSave={handleEditSave}
      />

      <ConfirmationModal
        open={confirmConfig.open}
        onClose={() => setConfirmConfig({ open: false, type: null })}
        onConfirm={handleConfirmAction}
        title={
          confirmConfig.type === "approve"
            ? t("admin.approvals.confirm.approveTitle")
            : confirmConfig.type === "reject"
              ? t("admin.approvals.confirm.rejectTitle")
              : confirmConfig.type === "bulk_delete"
                ? t("admin.approvals.confirm.bulkDeleteTitle")
                : t("admin.approvals.confirm.deleteTitle")
        }
        message={
          confirmConfig.type === "approve"
            ? t("admin.approvals.confirm.approveMessage", { name: pendingRequest?.name })
            : confirmConfig.type === "reject"
              ? t("admin.approvals.confirm.rejectMessage", { name: pendingRequest?.name })
              : confirmConfig.type === "bulk_delete"
                ? t("admin.approvals.confirm.bulkDeleteMessage", { count: confirmConfig.itemCount })
                : t("admin.approvals.confirm.deleteMessage")
        }
        confirmLabel={
          confirmConfig.type === "approve"
            ? t("admin.approvals.confirm.approveLabel")
            : confirmConfig.type === "reject"
              ? t("admin.approvals.confirm.rejectLabel")
              : t("admin.approvals.confirm.deleteLabel")
        }
        isDanger={confirmConfig.type !== "approve"}
      />
    </PageContainer>
  );
};

