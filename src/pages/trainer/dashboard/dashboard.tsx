import React from "react";
import { useTranslation } from "react-i18next";
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
  IconButton,
  Stack,
} from "@mui/material";
import {
  Users,
  Calendar,
  CheckCircle,
  MessageSquare,
  UserPlus,
  Video,
  Megaphone,
  BarChart3,
  Edit,
  Plus,
  ArrowUp,
  Clock,
  FileText,
} from "lucide-react";
import {
  dashboardContainer,
  pageTitle,
  statCard,
  statTitle,
  statValue,
  statTrendBox,
  statIconBox,
  sectionCard,
  sectionTitle,
  quickActionButton,
  pendingItemPaper,
  itemAvatar,
  approveButton,
  tableContainer as tableContainerStyle,
  tableHeadCell,
  tableBodyCell,
  tableDateCell,
  addAnnouncementButton,
  addUserButton,
  publishedChip,
  draftChip,
} from "./dashboardStyle";

import type { TrainerStatCard, PendingRequest, TrainerAnnouncement } from "../../../types/trainerTypes";

 const TrainerDashboard: React.FC = () => {
  const { t } = useTranslation();

  const stats: TrainerStatCard[] = [
    {
      title: t("trainer.dashboard.stats.totalStudents"),
      value: 124,
      trend: { value: 8, label: t("trainer.dashboard.stats.thisMonth"), direction: "up" },
      icon: Users,
      iconBg: "#fee2e2",
      iconColor: "#8B1D23",
    },
    {
      title: t("trainer.dashboard.stats.upcomingSessions"),
      value: 6,
      subtitle: t("trainer.dashboard.stats.nextSession"),
      icon: Calendar,
      iconBg: "#e0f2e9",
      iconColor: "#1f6e43",
    },
    {
      title: t("trainer.dashboard.stats.completedSessions"),
      value: 42,
      trend: { value: 12, label: t("trainer.dashboard.stats.thisWeek"), direction: "up" },
      icon: CheckCircle,
      iconBg: "#fff0db",
      iconColor: "#b45309",
    },
    {
      title: t("trainer.dashboard.stats.pendingFeedback"),
      value: 3,
      subtitle: t("trainer.dashboard.stats.needsReview"),
      icon: MessageSquare,
      iconBg: "#fee2e2",
      iconColor: "#b91c1c",
    },
  ];

  const pendingRequests: PendingRequest[] = [
    { id: 1, name: "Omar Khalil", type: t("trainer.dashboard.pendingRequests.enrollmentRequest"), course: "Data Structures", date: "Feb 18" },
    { id: 2, name: "Sara Mousa", type: t("trainer.dashboard.pendingRequests.assignmentSubmission"), course: "Algorithms", date: "Feb 17" },
    { id: 3, name: "Lina Taha", type: t("trainer.dashboard.pendingRequests.enrollmentRequest"), course: "Web Development", date: "Feb 16" },
  ];

  const announcements: TrainerAnnouncement[] = [
    { id: 1, title: "Midterm Exam Schedule", date: "Feb 19", status: "Published" },
    { id: 2, title: "Office Hours Changed", date: "Feb 15", status: "Published" },
    { id: 3, title: "New Reading Materials", date: "Feb 10", status: "Draft" },
    { id: 4, title: "Guest Lecture Next Week", date: "Feb 8", status: "Published" },
  ];

  const quickActions = [
    { label: t("trainer.dashboard.quickActions.manageStudents"), icon: Users, path: "/trainer/students" },
    { label: t("trainer.dashboard.quickActions.createSession"), icon: Video, path: "/trainer/sessions/new" },
    { label: t("trainer.dashboard.quickActions.postAnnouncement"), icon: Megaphone, path: "/trainer/announcements" },
    { label: t("trainer.dashboard.quickActions.viewReports"), icon: BarChart3, path: "/trainer/reports" },
    { label: t("trainer.dashboard.quickActions.assignments"), icon: FileText, path: "/trainer/assignments" },
    { label: t("trainer.dashboard.quickActions.schedule"), icon: Clock, path: "/trainer/schedule" },
  ];

  const handleApprove = (id: number) => console.log(`Approve request ${id}`);
  const handleEdit = (id: number) => console.log(`Edit request ${id}`);
  const handleAddAnnouncement = () => console.log("Add announcement");
  const handleAddStudent = () => console.log("Add student");

  const getStatusChip = (status: string) => {
    if (status === "Published") {
      return <Chip label={t("trainer.dashboard.announcements.published")} size="small" sx={publishedChip} />;
    }
    return <Chip label={t("trainer.dashboard.announcements.draft")} size="small" sx={draftChip} />;
  };

  return (
    <Box sx={dashboardContainer}>
      <Typography variant="h4" sx={pageTitle}>
        {t("trainer.dashboard.title")}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card sx={statCard}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box>
                    <Typography sx={statTitle}>{stat.title}</Typography>
                    <Typography sx={statValue}>{stat.value.toLocaleString()}</Typography>
                    {stat.trend && (
                      <Box sx={statTrendBox}>
                        <ArrowUp size={14} color="#1f6e43" />
                        <Typography variant="caption" sx={{ color: "#1f6e43", fontWeight: 500 }}>
                          ↑ {stat.trend.value}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748b" }}>
                          {stat.trend.label}
                        </Typography>
                      </Box>
                    )}
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
        {/* Left Column */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ ...sectionCard, mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={sectionTitle}>
                {t("trainer.dashboard.quickActions.title")}
              </Typography>
              <Grid container spacing={1.5}>
                {quickActions.map((action, idx) => (
                  <Grid size={{ xs: 6, sm: 4 }} key={idx}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<action.icon size={16} />}
                      sx={quickActionButton}
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
                {t("trainer.dashboard.pendingRequests.title")}
              </Typography>
              <Stack spacing={2}>
                {pendingRequests.map((request) => (
                  <Paper key={request.id} elevation={0} sx={pendingItemPaper}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={itemAvatar}>{request.name.charAt(0)}</Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 600, color: "#0f172a" }}>
                          {request.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748b" }}>
                          {request.type} – {request.course} • {request.date}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<CheckCircle size={14} />}
                        onClick={() => handleApprove(request.id)}
                        sx={approveButton}
                      >
                        {t("trainer.dashboard.pendingRequests.review")}
                      </Button>
                      <IconButton size="small" onClick={() => handleEdit(request.id)} sx={{ color: "#64748b" }}>
                        <Edit size={16} />
                      </IconButton>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ ...sectionCard, height: "100%", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ p: 3, flex: 1 }}>
              <Typography variant="h6" sx={sectionTitle}>
                {t("trainer.dashboard.announcements.title")}
              </Typography>
              <TableContainer component={Paper} elevation={0} sx={tableContainerStyle}>
                <Table sx={{ minWidth: 300 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f8fafc" }}>
                      <TableCell sx={tableHeadCell}>{t("trainer.dashboard.announcements.tableTitle")}</TableCell>
                      <TableCell sx={tableHeadCell}>{t("trainer.dashboard.announcements.tableDate")}</TableCell>
                      <TableCell sx={tableHeadCell}>{t("trainer.dashboard.announcements.tableStatus")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {announcements.map((announcement) => (
                      <TableRow key={announcement.id} hover>
                        <TableCell sx={tableBodyCell}>{announcement.title}</TableCell>
                        <TableCell sx={tableDateCell}>{announcement.date}</TableCell>
                        <TableCell>{getStatusChip(announcement.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Plus size={16} />}
                  onClick={handleAddAnnouncement}
                  sx={addAnnouncementButton}
                >
                  {t("trainer.dashboard.announcements.addAnnouncement")}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<UserPlus size={16} />}
                  onClick={handleAddStudent}
                  sx={addUserButton}
                >
                  {t("trainer.dashboard.announcements.addStudent")}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TrainerDashboard;