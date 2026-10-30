import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Stack,
} from "@mui/material";
import {
  Users,
  UserCheck,
  GraduationCap,
  AlertCircle,
  UserCog,
  Briefcase,
  Trophy,
  BarChart3,
  CheckCircle,
  BookOpen,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  quickActionButton,
  pendingTrainerPaper,
  trainerAvatar,
  approveButton,
  tableContainer,
  tableHeadCell,
  tableBodyCell,
} from "./dashboardStyle";
import { PageHeader, SectionCard, StatCard } from "../../../components/common/shell";
import { EmptyState, ErrorState, LoadingState } from "../../../components/common/states";
import { dashboardService, type AdminDashboardData } from "../../../services/dashboardService";
import { studentService } from "../../../services/studentService";
import { getApiErrorMessage } from "../../../utils/apiError";
import { brand, neutral } from '../../../theme';

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approving, setApproving] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    dashboardService
      .getAdminData()
      .then(setData)
      .catch((err) => setError(getApiErrorMessage(err, t("admin.dashboard.loadFailed", "Failed to load dashboard"))))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (id: number) => {
    setApproving(id);
    try {
      await studentService.accept(id);
      setData((prev) =>
        prev ? { ...prev, pendingStudents: prev.pendingStudents.filter((s) => s.id !== id) } : prev,
      );
    } catch (err) {
      setError(getApiErrorMessage(err, t("admin.dashboard.pendingApprovals.approveFailed", "Failed to approve")));
    } finally {
      setApproving(null);
    }
  };

  const stats = [
    { title: t("admin.dashboard.stats.totalUsers"), value: data?.totalUsers ?? 0, icon: Users, tone: "brand" as const },
    { title: t("admin.dashboard.stats.activeTrainers"), value: data?.totalTrainers ?? 0, icon: UserCheck, tone: "success" as const },
    { title: t("admin.dashboard.stats.totalStudents"), value: data?.totalStudents ?? 0, icon: GraduationCap, tone: "info" as const },
    { title: t("admin.dashboard.stats.pendingApprovals"), value: data?.pendingStudents.length ?? 0, subtitle: t("admin.dashboard.stats.needsAction"), icon: AlertCircle, tone: "warning" as const },
  ];

  const overview = [
    { label: t("admin.dashboard.overview.groups", "Groups"), value: data?.groups ?? 0, icon: Briefcase },
    { label: t("admin.dashboard.overview.contests", "Contests"), value: data?.contests ?? 0, icon: Trophy },
    { label: t("admin.dashboard.overview.problems", "Problems"), value: data?.problems ?? 0, icon: BookOpen },
  ];

  const quickActions = [
    { label: t("admin.dashboard.quickActions.manageUsers"), icon: Users, path: "/admin/users" },
    { label: t("admin.dashboard.quickActions.reviewTrainers"), icon: UserCog, path: "/admin/approvals" },
    { label: t("admin.dashboard.quickActions.contests"), icon: Trophy, path: "/admin/contests" },
    { label: t("admin.dashboard.quickActions.partners"), icon: Briefcase, path: "/admin/groups" },
    { label: t("admin.dashboard.quickActions.reports"), icon: BarChart3, path: "/admin/problems" },
  ];

  if (loading) {
    return <LoadingState />;
  }

  return (
    <Box>
      <PageHeader
        title={t("admin.dashboard.title")}
        subtitle={t("admin.dashboard.subtitle")}
      />

      {error && (
        <Box sx={{ mb: 3 }}>
          <ErrorState message={error} onClose={() => setError(null)} />
        </Box>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <StatCard
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              icon={stat.icon}
              tone={stat.tone}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ mb: 4 }}>
            <SectionCard title={t("admin.dashboard.quickActions.title")} icon={Zap}>
              <Grid container spacing={1.5}>
                {quickActions.map((action, idx) => (
                  <Grid size={{ xs: 6, sm: 4 }} key={idx}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<action.icon size={16} />}
                      sx={quickActionButton}
                      onClick={() => navigate(action.path)}
                    >
                      {action.label}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </SectionCard>
          </Box>

          <SectionCard title={t("admin.dashboard.pendingApprovals.title")} icon={UserCog}>
              {data && data.pendingStudents.length === 0 ? (
                <EmptyState
                  variant="bare"
                  icon={<CheckCircle size={24} />}
                  title={t("admin.dashboard.pendingApprovals.empty", "No pending approvals")}
                  description={t("admin.dashboard.pendingApprovals.emptyHint")}
                />
              ) : (
                <Stack spacing={2}>
                  {data?.pendingStudents.slice(0, 6).map((student) => (
                    <Paper key={student.id} elevation={0} sx={pendingTrainerPaper}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={trainerAvatar}>{student.name.charAt(0)}</Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 600, color: neutral[900] }}>{student.name}</Typography>
                          <Typography variant="caption" sx={{ color: neutral[500] }}>
                            {student.email || t("admin.dashboard.pendingApprovals.student", "Student")}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<CheckCircle size={14} />}
                        onClick={() => handleApprove(student.id)}
                        disabled={approving === student.id}
                        sx={approveButton}
                      >
                        {t("admin.dashboard.pendingApprovals.approve")}
                      </Button>
                    </Paper>
                  ))}
                </Stack>
              )}
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard title={t("admin.dashboard.overview.title", "Platform Overview")} icon={BarChart3} fullHeight>
              <TableContainer component={Paper} elevation={0} sx={{ ...tableContainer, overflowX: "auto" }}>
                <Table sx={{ minWidth: 300 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: neutral[50] }}>
                      <TableCell sx={tableHeadCell}>{t("admin.dashboard.overview.metric", "Metric")}</TableCell>
                      <TableCell sx={tableHeadCell} align="right">{t("admin.dashboard.overview.count", "Count")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {overview.map((row) => (
                      <TableRow key={row.label} hover>
                        <TableCell sx={tableBodyCell}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <row.icon size={16} color={brand[500]} />
                            {row.label}
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ ...tableBodyCell, fontWeight: 700 }}>
                          {row.value.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
