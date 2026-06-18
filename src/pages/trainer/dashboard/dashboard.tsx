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
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Users, Briefcase, Trophy, BookOpen } from "lucide-react";
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
  pendingItemPaper,
  itemAvatar,
  tableContainer as tableContainerStyle,
  tableHeadCell,
  tableBodyCell,
} from "./dashboardStyle";
import { dashboardService, type TrainerDashboardData } from "../../../services/dashboardService";
import { getContestStatus } from "../../../utils/contestStatus";
import { getApiErrorMessage } from "../../../utils/apiError";

const statusChipSx = (status: string) => ({
  fontWeight: 700,
  fontSize: "11px",
  bgcolor: status === "Ongoing" ? "#ecfdf5" : status === "Upcoming" ? "#fffbeb" : "#f1f5f9",
  color: status === "Ongoing" ? "#059669" : status === "Upcoming" ? "#d97706" : "#64748b",
});

const TrainerDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [data, setData] = useState<TrainerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    dashboardService
      .getTrainerData()
      .then(setData)
      .catch((err) => setError(getApiErrorMessage(err, t("trainer.dashboard.loadFailed", "Failed to load dashboard"))))
      .finally(() => setLoading(false));
  }, [t]);

  const stats = [
    { title: t("trainer.dashboard.stats.totalStudents"), value: data?.students ?? 0, icon: Users, iconBg: "#fee2e2", iconColor: "#8B1D23" },
    { title: t("trainer.dashboard.stats.myGroups", "My Groups"), value: data?.groups.length ?? 0, icon: Briefcase, iconBg: "#e0f2e9", iconColor: "#1f6e43" },
    { title: t("trainer.dashboard.stats.myContests", "My Contests"), value: data?.contests.length ?? 0, icon: Trophy, iconBg: "#fff0db", iconColor: "#b45309" },
    { title: t("trainer.dashboard.stats.myProblems", "My Problems"), value: data?.myProblems ?? 0, icon: BookOpen, iconBg: "#fee2e2", iconColor: "#b91c1c" },
  ];

  const quickActions = [
    { label: t("navbar.groups"), icon: Briefcase, path: "/trainer/groups" },
    { label: t("navbar.contests"), icon: Trophy, path: "/trainer/contests" },
    { label: t("navbar.problemsShort"), icon: BookOpen, path: "/trainer/problems" },
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
        {t("trainer.dashboard.title")}
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
                {t("trainer.dashboard.quickActions.title")}
              </Typography>
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
              <Typography variant="h6" sx={sectionTitle}>
                {t("trainer.dashboard.myGroups.title", "My Groups")}
              </Typography>
              {data && data.groups.length === 0 ? (
                <Typography sx={{ color: "#94a3b8", fontWeight: 600, py: 2 }}>
                  {t("trainer.dashboard.myGroups.empty", "You don't own any groups yet")}
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {data?.groups.slice(0, 6).map((group) => (
                    <Paper key={group.id} elevation={0} sx={pendingItemPaper}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={itemAvatar}>{group.name.charAt(0)}</Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 600, color: "#0f172a" }}>{group.name}</Typography>
                          <Typography variant="caption" sx={{ color: "#64748b" }}>
                            {t("trainer.dashboard.myGroups.students", { count: group.studentCount ?? 0 })}
                          </Typography>
                        </Box>
                      </Box>
                      <Button size="small" variant="outlined" sx={quickActionButton} onClick={() => navigate("/trainer/groups")}>
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
          <Card sx={{ ...sectionCard, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={sectionTitle}>
                {t("trainer.dashboard.myContests.title", "My Contests")}
              </Typography>
              {data && data.contests.length === 0 ? (
                <Typography sx={{ color: "#94a3b8", fontWeight: 600, py: 2 }}>
                  {t("trainer.dashboard.myContests.empty", "No contests yet")}
                </Typography>
              ) : (
                <TableContainer component={Paper} elevation={0} sx={tableContainerStyle}>
                  <Table sx={{ minWidth: 300 }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#f8fafc" }}>
                        <TableCell sx={tableHeadCell}>{t("trainer.dashboard.myContests.tableTitle", "Contest")}</TableCell>
                        <TableCell sx={tableHeadCell}>{t("trainer.dashboard.myContests.tableStatus", "Status")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data?.contests.slice(0, 8).map((contest) => {
                        const status = getContestStatus(contest.startAt, contest.endAt);
                        return (
                          <TableRow key={contest.id} hover>
                            <TableCell sx={tableBodyCell}>{contest.title}</TableCell>
                            <TableCell>
                              <Chip label={status} size="small" sx={statusChipSx(status)} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
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

export default TrainerDashboard;
