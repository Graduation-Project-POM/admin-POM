import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
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
  Chip,
  Paper,
  Avatar,
  LinearProgress,
  Stack,
} from "@mui/material";
import { Target, Trophy, Star, Users, BookOpen, Zap, GraduationCap } from "lucide-react";
import {
  welcomeBanner,
  quickActionButton,
  tableContainer,
  tableHeadCell,
  tableBodyCell,
  gradeChip,
} from "./dashboardStyle";
import { SectionCard, StatCard } from "../../../components/common/shell";
import { EmptyState, ErrorState, LoadingState } from "../../../components/common/states";
import { dashboardService, type StudentDashboardData, type StudentContestAlert } from "../../../services/dashboardService";
import { useAuth } from "../../../services/AuthContext";
import { getApiErrorMessage } from "../../../utils/apiError";
import { ContestDeadlineWarning } from "../../../components/student/ContestDeadlineWarning";
import { brand, neutral, radius } from '../../../theme';

const initials = (name: string) =>
  name.trim().split(/\s+/).map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "S";

const StudentDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userName } = useAuth();

  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [contestAlerts, setContestAlerts] = useState<StudentContestAlert[]>([]);
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

  useEffect(() => {
    dashboardService
      .getStudentContestAlerts()
      .then(setContestAlerts)
      .catch(() => setContestAlerts([]));
  }, []);

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
    return <LoadingState />;
  }

  return (
    <Box sx={{ py: 2 }}>
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
            <Chip label={t("student.dashboard.roleBadge")} icon={<Star size={14} />} sx={{ mt: 1, bgcolor: "rgba(255,255,255,0.2)", color: neutral[0], fontWeight: 700, borderRadius: "40px" }} />
          </Box>
        </Box>
      </Box>

      {error && (
        <Box sx={{ mb: 3 }}>
          <ErrorState message={error} onClose={() => setError(null)} />
        </Box>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t("student.dashboard.stats.problemsSolved")}
            value={data?.problemsSolved ?? 0}
            icon={Target}
            tone="brand"
            subtitle={t("student.dashboard.stats.solveRate", { rate: solveRate, total: data?.totalProblems ?? 0 })}
            footer={
              <LinearProgress
                variant="determinate"
                value={solveRate}
                aria-label={t("student.dashboard.stats.problemsSolved")}
                sx={{
                  height: 6,
                  borderRadius: `${radius.pill}px`,
                  bgcolor: brand[100],
                  "& .MuiLinearProgress-bar": { bgcolor: brand[500], borderRadius: `${radius.pill}px` },
                }}
              />
            }
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t("student.dashboard.stats.myGroups", "My Groups")}
            value={data?.groups.length ?? 0}
            icon={Users}
            tone="success"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t("student.dashboard.stats.averageGrade")}
            value={`${data?.averageGrade ?? 0}%`}
            icon={Star}
            tone="warning"
            subtitle={t("student.dashboard.stats.gradedCount", { count: data?.gradedCount ?? 0 })}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t("student.dashboard.stats.totalProblems", "Available Problems")}
            value={data?.totalProblems ?? 0}
            icon={BookOpen}
            tone="info"
          />
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ mb: 4 }}>
            <SectionCard title={t("student.dashboard.quickActions.title")} icon={Zap}>
              <Grid container spacing={1.5}>
                {quickActions.map((action, idx) => (
                  <Grid size={{ xs: 6, sm: 4 }} key={idx}>
                    <Button fullWidth variant="outlined" startIcon={<action.icon size={16} />} sx={quickActionButton} onClick={() => navigate(action.path)}>
                      {action.label}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </SectionCard>
          </Box>

          <SectionCard title={t("student.dashboard.myGroups.title")} icon={Users}>
              {data && data.groups.length === 0 ? (
                <EmptyState
                  variant="bare"
                  icon={<Users size={24} />}
                  title={t("student.dashboard.myGroups.empty", "You're not enrolled in any group yet")}
                  description={t("student.dashboard.myGroups.emptyHint")}
                />
              ) : (
                <Stack spacing={2}>
                  {data?.groups.slice(0, 6).map((group) => (
                    <Paper key={group.id} elevation={0} sx={{ p: 2, borderRadius: `${radius.xl}px`, border: `1px solid ${neutral[200]}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
                        <Avatar sx={{ bgcolor: brand[50], color: brand[500], width: 40, height: 40 }}>{group.name.charAt(0)}</Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>{group.name}</Typography>
                          <Typography variant="caption" sx={{ color: neutral[500] }}>
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
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ContestDeadlineWarning alerts={contestAlerts} />

          <SectionCard title={t("student.dashboard.recentGrades.title")} icon={GraduationCap}>
              {recentGrades.length === 0 ? (
                <EmptyState
                  variant="bare"
                  icon={<GraduationCap size={24} />}
                  title={t("student.dashboard.recentGrades.empty", "No graded submissions yet")}
                  description={t("student.dashboard.recentGrades.emptyHint")}
                />
              ) : (
                <TableContainer component={Paper} elevation={0} sx={tableContainer}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: neutral[50] }}>
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
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboardPage;
