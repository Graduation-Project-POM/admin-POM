import React from "react";
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
  UserCheck,
  TrendingUp,
  AlertCircle,
  UserPlus,
  UserCog,
  Megaphone,
  Briefcase,
  Trophy,
  BarChart3,
  CheckCircle,
  Edit,
  Plus,
  ArrowUp,
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
  pendingTrainerPaper,
  trainerAvatar,
  approveButton,
  tableContainer,
  tableHeadCell,
  tableBodyCell,
  tableDateCell,
  addAnnouncementButton,
  addUserButton,
  publishedChip,
  draftChip,
} from "./dashboardStyle";

import type {StatCardData,PendingTrainer,Announcement } from "../../../types"


const AdminDashboard: React.FC = () => {
  const stats: StatCardData[] = [
    {
      title: "Total Users",
      value: 386,
      trend: { value: 12, label: "this week", direction: "up" },
      icon: Users,
      iconBg: "#fee2e2",
      iconColor: "#8B1D23",
    },
    {
      title: "Active Trainers",
      value: 318,
      subtitle: "83% of total",
      icon: UserCheck,
      iconBg: "#e0f2e9",
      iconColor: "#1f6e43",
    },
    {
      title: "Total Students",
      value: 4821,
      trend: { value: 204, label: "today", direction: "up" },
      icon: TrendingUp,
      iconBg: "#fff0db",
      iconColor: "#b45309",
    },
    {
      title: "Pending Approvals",
      value: 3,
      subtitle: "Needs action",
      icon: AlertCircle,
      iconBg: "#fee2e2",
      iconColor: "#b91c1c",
    },
  ];

  const pendingTrainers: PendingTrainer[] = [
    { id: 1, name: "Dr. Rania Al-Wanan", title: "Trainer", university: "Khadoori University" },
    { id: 2, name: "Ahmad Nasser", title: "Trainer", university: "Birzeit University" },
    { id: 3, name: "Layla Haddad", title: "Trainer", university: "An-Najah University" },
  ];

  const announcements: Announcement[] = [
    { id: 1, title: "Winter Camp 2026 Results", date: "Jan 15", status: "Published" },
    { id: 2, title: "Registration Open – PMO 2026", date: "Jan 10", status: "Published" },
    { id: 3, title: "Monthly Contest – February", date: "Jan 8", status: "Draft" },
    { id: 4, title: "New Training Materials", date: "Jan 5", status: "Published" },
  ];

  const quickActions = [
    { label: "Manage Users", icon: Users, path: "/admin/users" },
    { label: "Review Trainers", icon: UserCog, path: "/admin/approvals" },
    { label: "Post News", icon: Megaphone, path: "/admin/announcements" },
    { label: "Partners", icon: Briefcase, path: "/admin/partners" },
    { label: "Contests", icon: Trophy, path: "/admin/contests" },
    { label: "Reports", icon: BarChart3, path: "/admin/reports" },
  ];

  const handleApprove = (id: number) => console.log(`Approve trainer ${id}`);
  const handleEdit = (id: number) => console.log(`Edit trainer ${id}`);
  const handleAddAnnouncement = () => console.log("Add announcement");
  const handleAddUser = () => console.log("Add user");

  const getStatusChip = (status: string) => {
    if (status === "Published") {
      return <Chip label="Published" size="small" sx={publishedChip} />;
    }
    return <Chip label="Draft" size="small" sx={draftChip} />;
  };

  return (
    <Box sx={dashboardContainer}>
      <Typography variant="h4" sx={pageTitle}>
        Admin Dashboard
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
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ ...sectionCard, mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={sectionTitle}>
                Quick Actions
              </Typography>
              <Grid container spacing={1.5}>
                {quickActions.map((action, idx) => (
                  <Grid size={{ xs: 6, sm: 4 }} key={idx}>
                    <Button fullWidth variant="outlined" startIcon={<action.icon size={16} />} sx={quickActionButton}>
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
                Pending Approvals
              </Typography>
              <Stack spacing={2}>
                {pendingTrainers.map((trainer) => (
                  <Paper key={trainer.id} elevation={0} sx={pendingTrainerPaper}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={trainerAvatar}>{trainer.name.charAt(0)}</Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 600, color: "#0f172a" }}>{trainer.name}</Typography>
                        <Typography variant="caption" sx={{ color: "#64748b" }}>
                          {trainer.title} - {trainer.university}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<CheckCircle size={14} />}
                        onClick={() => handleApprove(trainer.id)}
                        sx={approveButton}
                      >
                        Approve
                      </Button>
                      <IconButton size="small" onClick={() => handleEdit(trainer.id)} sx={{ color: "#64748b" }}>
                        <Edit size={16} />
                      </IconButton>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ ...sectionCard, height: "100%", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ p: 3, flex: 1 }}>
              <Typography variant="h6" sx={sectionTitle}>
                Announcements
              </Typography>
              <TableContainer component={Paper} elevation={0} sx={tableContainer}>
                <Table sx={{ minWidth: 300 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f8fafc" }}>
                      <TableCell sx={tableHeadCell}>Title</TableCell>
                      <TableCell sx={tableHeadCell}>Date</TableCell>
                      <TableCell sx={tableHeadCell}>Status</TableCell>
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
                <Button variant="contained" startIcon={<Plus size={16} />} onClick={handleAddAnnouncement} sx={addAnnouncementButton}>
                  + Announcement
                </Button>
                <Button variant="outlined" startIcon={<UserPlus size={16} />} onClick={handleAddUser} sx={addUserButton}>
                  + Add User
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;