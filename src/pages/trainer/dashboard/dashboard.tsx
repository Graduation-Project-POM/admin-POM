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
  Stack,
} from "@mui/material";
import { Users, Briefcase, Trophy, BookOpen, Zap } from "lucide-react";
import {
  quickActionButton,
  pendingItemPaper,
  itemAvatar,
  tableContainer as tableContainerStyle,
  tableHeadCell,
  tableBodyCell,
} from "./dashboardStyle";
import { PageHeader, SectionCard, StatCard } from "../../../components/common/shell";
import { EmptyState, ErrorState, LoadingState } from "../../../components/common/states";
import { dashboardService, type TrainerDashboardData } from "../../../services/dashboardService";
import { getContestStatus } from "../../../utils/contestStatus";
import { getApiErrorMessage } from "../../../utils/apiError";
import { neutral, statusTone } from '../../../theme';

const statusChipSx = (status: string) => ({
  fontWeight: 700,
  fontSize: "11px",
  bgcolor: status === "Ongoing" ? statusTone.success.bg : status === "Upcoming" ? statusTone.warning.bg : neutral[100],
  color: status === "Ongoing" ? statusTone.success.solid : status === "Upcoming" ? statusTone.warning.solid : neutral[500],
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
    { title: t("trainer.dashboard.stats.totalStudents"), value: data?.students ?? 0, icon: Users, tone: "brand" as const },
    { title: t("trainer.dashboard.stats.myGroups", "My Groups"), value: data?.groups.length ?? 0, icon: Briefcase, tone: "success" as const },
    { title: t("trainer.dashboard.stats.myContests", "My Contests"), value: data?.contests.length ?? 0, icon: Trophy, tone: "warning" as const },
    { title: t("trainer.dashboard.stats.myProblems", "My Problems"), value: data?.myProblems ?? 0, icon: BookOpen, tone: "info" as const },
  ];

  const quickActions = [
    { label: t("navbar.groups"), icon: Briefcase, path: "/trainer/groups" },
    { label: t("navbar.contests"), icon: Trophy, path: "/trainer/contests" },
    { label: t("navbar.problemsShort"), icon: BookOpen, path: "/trainer/problems" },
  ];

  if (loading) {
    return <LoadingState />;
  }

  return (
    <Box sx={{ py: 2 }}>
      <PageHeader
        title={t("trainer.dashboard.title")}
        subtitle={t("trainer.dashboard.subtitle")}
      />

      {error && (
        <Box sx={{ mb: 3 }}>
          <ErrorState message={error} onClose={() => setError(null)} />
        </Box>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <StatCard title={stat.title} value={stat.value} icon={stat.icon} tone={stat.tone} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ mb: 4 }}>
            <SectionCard title={t("trainer.dashboard.quickActions.title")} icon={Zap}>
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

          <SectionCard title={t("trainer.dashboard.myGroups.title", "My Groups")} icon={Briefcase}>
              {data && data.groups.length === 0 ? (
                <EmptyState
                  variant="bare"
                  icon={<Briefcase size={24} />}
                  title={t("trainer.dashboard.myGroups.empty", "You don't own any groups yet")}
                  description={t("trainer.dashboard.myGroups.emptyHint")}
                />
              ) : (
                <Stack spacing={2}>
                  {data?.groups.slice(0, 6).map((group) => (
                    <Paper key={group.id} elevation={0} sx={pendingItemPaper}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={itemAvatar}>{group.name.charAt(0)}</Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 600, color: neutral[900] }}>{group.name}</Typography>
                          <Typography variant="caption" sx={{ color: neutral[500] }}>
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
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard title={t("trainer.dashboard.myContests.title", "My Contests")} icon={Trophy} fullHeight>
              {data && data.contests.length === 0 ? (
                <EmptyState
                  variant="bare"
                  icon={<Trophy size={24} />}
                  title={t("trainer.dashboard.myContests.empty", "No contests yet")}
                  description={t("trainer.dashboard.myContests.emptyHint")}
                />
              ) : (
                <TableContainer component={Paper} elevation={0} sx={{ ...tableContainerStyle, overflowX: "auto" }}>
                  <Table sx={{ minWidth: 300 }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: neutral[50] }}>
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
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TrainerDashboard;
