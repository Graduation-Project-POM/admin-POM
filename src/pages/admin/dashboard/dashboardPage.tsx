import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
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
  CircularProgress,
  Alert,
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  dashboardContainer,
  pageTitle,
  statCard,
  statTitle,
  statValue,
  statIconBox,
  sectionCard,
  sectionTitle,
  quickActionButton,
  pendingTrainerPaper,
  trainerAvatar,
  approveButton,
  tableContainer,
  tableHeadCell,
  tableBodyCell,
} from "./dashboardStyle";
import { dashboardService, type AdminDashboardData } from "../../../services/dashboardService";
import { studentService } from "../../../services/studentService";
import { getApiErrorMessage } from "../../../utils/apiError";

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
    { title: t("admin.dashboard.stats.totalUsers"), value: data?.totalUsers ?? 0, icon: Users, iconBg: "#fee2e2", iconColor: "#8B1D23" },
    { title: t("admin.dashboard.stats.activeTrainers"), value: data?.totalTrainers ?? 0, icon: UserCheck, iconBg: "#e0f2e9", iconColor: "#1f6e43" },
    { title: t("admin.dashboard.stats.totalStudents"), value: data?.totalStudents ?? 0, icon: GraduationCap, iconBg: "#fff0db", iconColor: "#b45309" },
    { title: t("admin.dashboard.stats.pendingApprovals"), value: data?.pendingStudents.length ?? 0, subtitle: t("admin.dashboard.stats.needsAction"), icon: AlertCircle, iconBg: "#fee2e2", iconColor: "#b91c1c" },
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
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress sx={{ color: "#8B1D23" }} />
      </Box>
    );
  }

  return (
    <Box sx={dashboardContainer}>
      <Typography variant="h4" sx={pageTitle}>
        {t("admin.dashboard.title")}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card sx={statCard}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box>
                    <Typography sx={statTitle}>{stat.title}</Typography>
                    <Typography sx={statValue}>{stat.value.toLocaleString()}</Typography>
                    {stat.subtitle && (
                      <Typography variant="caption" sx={{ color: "#64748b", mt: 1, display: "block" }}>
                        {stat.subtitle}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={statIconBox(stat.iconBg)}>
                    <stat.icon size={24} color={stat.iconColor} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ ...sectionCard, mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={sectionTitle}>
                {t("admin.dashboard.quickActions.title")}
              </Typography>
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
            </CardContent>
          </Card>

          <Card sx={sectionCard}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={sectionTitle}>
                {t("admin.dashboard.pendingApprovals.title")}
              </Typography>
              {data && data.pendingStudents.length === 0 ? (
                <Typography sx={{ color: "#94a3b8", fontWeight: 600, py: 2 }}>
                  {t("admin.dashboard.pendingApprovals.empty", "No pending approvals")}
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {data?.pendingStudents.slice(0, 6).map((student) => (
                    <Paper key={student.id} elevation={0} sx={pendingTrainerPaper}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={trainerAvatar}>{student.name.charAt(0)}</Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 600, color: "#0f172a" }}>{student.name}</Typography>
                          <Typography variant="caption" sx={{ color: "#64748b" }}>
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
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ ...sectionCard, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={sectionTitle}>
                {t("admin.dashboard.overview.title", "Platform Overview")}
              </Typography>
              <TableContainer component={Paper} elevation={0} sx={{ ...tableContainer, overflowX: "auto" }}>
                <Table sx={{ minWidth: 300 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f8fafc" }}>
                      <TableCell sx={tableHeadCell}>{t("admin.dashboard.overview.metric", "Metric")}</TableCell>
                      <TableCell sx={tableHeadCell} align="right">{t("admin.dashboard.overview.count", "Count")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {overview.map((row) => (
                      <TableRow key={row.label} hover>
                        <TableCell sx={tableBodyCell}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <row.icon size={16} color="#8B1D23" />
                            {row.label}
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ ...tableBodyCell, fontWeight: 800 }}>
                          {row.value.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
