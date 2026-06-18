import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
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
  Chip,
  Paper,
  Avatar,
  LinearProgress,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Target, Trophy, Star, Users, BookOpen } from "lucide-react";
import {
  dashboardContainer,
  welcomeBanner,
  statCard,
  statTitle,
  statValue,
  statIconBox,
  sectionCard,
  sectionTitle,
  quickActionButton,
  tableContainer,
  tableHeadCell,
  tableBodyCell,
  gradeChip,
} from "./dashboardStyle";
import { dashboardService, type StudentDashboardData } from "../../../services/dashboardService";
import { useAuth } from "../../../services/AuthContext";
import { getApiErrorMessage } from "../../../utils/apiError";

const initials = (name: string) =>
  name.trim().split(/\s+/).map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "S";

const StudentDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userName } = useAuth();

  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    dashboardService
      .getStudentData()
      .then(setData)
      .catch((err) => setError(getApiErrorMessage(err, t("student.dashboard.loadFailed", "Failed to load dashboard"))))
      .finally(() => setLoading(false));
  }, [t]);

  const solveRate =
    data && data.totalProblems > 0 ? Math.round((data.problemsSolved / data.totalProblems) * 100) : 0;

  const recentGrades = (data?.submissions ?? [])
    .filter((s) => s.grade != null)
    .slice(0, 5);

  const quickActions = [
    { label: t("student.dashboard.quickActions.browseContests"), icon: Trophy, path: "/student/contests" },
    { label: t("student.dashboard.quickActions.myGroups"), icon: Users, path: "/student/groups" },
    { label: t("navbar.allProblems"), icon: BookOpen, path: "/student/problems" },
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
      {/* Welcome Banner */}
      <Box sx={welcomeBanner}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: "rgba(255,255,255,0.2)", fontSize: "1.5rem", fontWeight: 800, border: "2px solid rgba(255,255,255,0.5)" }}>
            {initials(userName ?? "")}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {t("student.dashboard.greeting", { name: (userName ?? "").split(" ")[0] })}
            </Typography>
            <Chip label={t("student.dashboard.roleBadge")} icon={<Star size={14} />} sx={{ mt: 1, bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700, borderRadius: "40px" }} />
          </Box>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={statCard}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography sx={statTitle}>{t("student.dashboard.stats.problemsSolved")}</Typography>
                  <Typography sx={statValue}>{data?.problemsSolved ?? 0}</Typography>
                </Box>
                <Box sx={statIconBox("#fee2e2")}><Target size={24} color="#8B1D23" /></Box>
              </Box>
              <LinearProgress variant="determinate" value={solveRate} sx={{ mt: 2, height: 6, borderRadius: "10px", bgcolor: "#fee2e2", "& .MuiLinearProgress-bar": { bgcolor: "#8B1D23" } }} />
              <Typography variant="caption" sx={{ color: "#64748b", mt: 0.5, display: "block" }}>
                {t("student.dashboard.stats.solveRate", { rate: solveRate, total: data?.totalProblems ?? 0 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={statCard}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography sx={statTitle}>{t("student.dashboard.stats.myGroups", "My Groups")}</Typography>
                  <Typography sx={statValue}>{data?.groups.length ?? 0}</Typography>
                </Box>
                <Box sx={statIconBox("#e0f2e9")}><Users size={24} color="#1f6e43" /></Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={statCard}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography sx={statTitle}>{t("student.dashboard.stats.averageGrade")}</Typography>
                  <Typography sx={statValue}>{data?.averageGrade ?? 0}%</Typography>
                </Box>
                <Box sx={statIconBox("#fffbeb")}><Star size={24} color="#d97706" /></Box>
              </Box>
              <Typography variant="caption" sx={{ color: "#64748b", mt: 2, display: "block" }}>
                {t("student.dashboard.stats.gradedCount", { count: data?.gradedCount ?? 0 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={statCard}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography sx={statTitle}>{t("student.dashboard.stats.totalProblems", "Available Problems")}</Typography>
                  <Typography sx={statValue}>{data?.totalProblems ?? 0}</Typography>
                </Box>
                <Box sx={statIconBox("#f0f9ff")}><BookOpen size={24} color="#0284c7" /></Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ ...sectionCard, mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={sectionTitle}>{t("student.dashboard.quickActions.title")}</Typography>
              <Grid container spacing={1.5}>
                {quickActions.map((action, idx) => (
                  <Grid size={{ xs: 6, sm: 4 }} key={idx}>
                    <Button fullWidth variant="outlined" startIcon={<action.icon size={16} />} sx={quickActionButton} onClick={() => navigate(action.path)}>
                      {action.label}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          <Card sx={sectionCard}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={sectionTitle}>{t("student.dashboard.myGroups.title")}</Typography>
              {data && data.groups.length === 0 ? (
                <Typography sx={{ color: "#94a3b8", fontWeight: 600, py: 2 }}>
                  {t("student.dashboard.myGroups.empty", "You're not enrolled in any group yet")}
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {data?.groups.slice(0, 6).map((group) => (
                    <Paper key={group.id} elevation={0} sx={{ p: 2, borderRadius: "16px", border: "1px solid #eef2f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: "#fef2f2", color: "#8B1D23", width: 40, height: 40 }}>{group.name.charAt(0)}</Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>{group.name}</Typography>
                          <Typography variant="caption" sx={{ color: "#64748b" }}>
                            {t("student.dashboard.myGroups.students", { count: group.studentCount ?? 0 })}
                          </Typography>
                        </Box>
                      </Box>
                      <Button size="small" variant="outlined" sx={quickActionButton} onClick={() => navigate("/student/groups")}>
                        {t("buttons.view")}
                      </Button>
                    </Paper>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={sectionCard}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={sectionTitle}>{t("student.dashboard.recentGrades.title")}</Typography>
              {recentGrades.length === 0 ? (
                <Typography sx={{ color: "#94a3b8", fontWeight: 600, py: 2 }}>
                  {t("student.dashboard.recentGrades.empty", "No graded submissions yet")}
                </Typography>
              ) : (
                <TableContainer component={Paper} elevation={0} sx={tableContainer}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#f8fafc" }}>
                        <TableCell sx={tableHeadCell}>{t("student.dashboard.recentGrades.problem")}</TableCell>
                        <TableCell sx={tableHeadCell} align="center">{t("student.dashboard.recentGrades.grade")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentGrades.map((sub) => (
                        <TableRow key={sub.id} hover>
                          <TableCell sx={tableBodyCell}>{sub.problemTitle ?? `#${sub.problemId}`}</TableCell>
                          <TableCell align="center">
                            <Chip label={`${sub.grade}/100`} size="small" sx={gradeChip(sub.grade ?? 0)} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboardPage;
