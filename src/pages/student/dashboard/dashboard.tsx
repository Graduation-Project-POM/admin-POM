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
  LinearProgress,
  Stack,
} from "@mui/material";
import {
  Target,
  Trophy,
  Star,
  TrendingUp,
  Users,
  BookOpen,
  Clock,
  Calendar,
  Flame,
  CheckCircle2,
  Award,
  ArrowUpRight,
  UserPlus,
  Zap,
  BarChart3,
  Medal,
} from "lucide-react";
import {
  dashboardContainer,
  welcomeBanner,
  statCard,
  statTitle,
  statValue,
  statTrendBox,
  statIconBox,
  sectionCard,
  sectionTitle,
  quickActionButton,
  activityItem,
  contestCard,
  tableContainer,
  tableHeadCell,
  tableBodyCell,
  gradeChip,
} from "./dashboardStyle";
import type { StudentStats, RecentActivity, UpcomingContest, TopGroup } from "../../../types/index";


const studentStats: StudentStats = {
  name: "Ahmed Ali",
  avatar: "AA",
  totalProblemsSolved: 45,
  totalProblems: 67,
  completedContests: 8,
  totalContests: 12,
  averageGrade: 87,
  globalRank: 15,
  totalStudents: 156,
  currentStreak: 12,
  longestStreak: 21,
};

const recentActivities: RecentActivity[] = [
  { id: "1", title: "Submitted solution for 'Longest Common Subsequence'", group: "Advanced Algorithms", time: "2 hours ago", icon: <CheckCircle2 size={16} color="#059669" />, bgColor: "#ecfdf5" },
  { id: "2", title: "Received grade 95/100 for 'Binary Search'", group: "Advanced Algorithms", time: "1 day ago", icon: <Star size={16} color="#d97706" />, bgColor: "#fffbeb" },
  { id: "3", title: "Joined 'Dynamic Programming' contest", group: "Advanced Algorithms", time: "3 days ago", icon: <Trophy size={16} color="#8B1D23" />, bgColor: "#fef2f2" },
  { id: "4", title: "Enrolled in 'Competitive Programming' group", group: "New Group", time: "1 week ago", icon: <Users size={16} color="#0284c7" />, bgColor: "#f0f9ff" },
  { id: "5", title: "Earned 'Streak Master' badge", group: "Achievement", time: "1 week ago", icon: <Award size={16} color="#7c3aed" />, bgColor: "#f5f3ff" },
];

const upcomingContests: UpcomingContest[] = [
  { id: "1", title: "Final Challenge", group: "Advanced Algorithms", startDate: "2026-02-17", problemsCount: 10, difficulty: "Hard", daysLeft: 5 },
  { id: "2", title: "Graph Theory Basics", group: "Data Structures Fundamentals", startDate: "2026-02-20", problemsCount: 6, difficulty: "Medium", daysLeft: 8 },
];

const topGroups: TopGroup[] = [
  { id: "1", name: "Advanced Algorithms", progress: 65, rank: 3, students: 24 },
  { id: "2", name: "Data Structures Fundamentals", progress: 40, rank: 7, students: 18 },
  { id: "3", name: "Beginner Practice", progress: 100, rank: 1, students: 32 },
];

const gradedProblems = [
  { id: 1, title: "Binary Search", grade: 95, maxGrade: 100, feedback: "Good work!" },
  { id: 2, title: "Merge Sort", grade: 80, maxGrade: 100, feedback: "Optimize space" },
  { id: 3, title: "Quick Sort", grade: 100, maxGrade: 100, feedback: "Perfect" },
];

const quickActions = [
  { label: "Browse Contests", icon: Trophy, path: "/student/contests" },
  { label: "My Groups", icon: Users, path: "/student/groups" },
  { label: "View Progress", icon: BarChart3, path: "/student/progress" },
  { label: "Join Group", icon: UserPlus, path: "/student/join-group" },
  { label: "Daily Challenge", icon: Zap, path: "/student/daily" },
  { label: "Leaderboard", icon: Medal, path: "/student/leaderboard" },
];

const StudentDashboardPage: React.FC = () => {
  const solveRate = Math.round((studentStats.totalProblemsSolved / studentStats.totalProblems) * 100);
  const contestCompletionRate = Math.round((studentStats.completedContests / studentStats.totalContests) * 100);

  const handleQuickAction = (path: string) => console.log(`Navigate to ${path}`);
  const handleViewContest = (id: string) => console.log(`View contest ${id}`);

  return (
    <Box sx={dashboardContainer}>
      {/* Welcome Banner */}
      <Box sx={welcomeBanner}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: "rgba(255,255,255,0.2)", fontSize: "1.5rem", fontWeight: 800, border: "2px solid rgba(255,255,255,0.5)" }}>
              {studentStats.avatar}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>مرحباً, {studentStats.name.split(" ")[0]}! 👋</Typography>
              <Typography sx={{ opacity: 0.9, display: "flex", alignItems: "center", gap: 1 }}>
                <Flame size={18} /> أنت في موجة مستمرة لمدة {studentStats.currentStreak} يوماً – لا تتوقف!
              </Typography>
            </Box>
          </Box>
          <Chip label="Student" icon={<Star size={14} />} sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700, borderRadius: "40px" }} />
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={statCard}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography sx={statTitle}>Problems Solved</Typography>
                  <Typography sx={statValue}>{studentStats.totalProblemsSolved}</Typography>
                  <Box sx={statTrendBox}>
                    <ArrowUpRight size={14} color="#1f6e43" />
                    <Typography variant="caption" sx={{ color: "#1f6e43", fontWeight: 500 }}>+5</Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>this week</Typography>
                  </Box>
                </Box>
                <Box sx={statIconBox("#fee2e2")}><Target size={24} color="#8B1D23" /></Box>
              </Box>
              <LinearProgress variant="determinate" value={solveRate} sx={{ mt: 2, height: 6, borderRadius: "10px", bgcolor: "#fee2e2", "& .MuiLinearProgress-bar": { bgcolor: "#8B1D23" } }} />
              <Typography variant="caption" sx={{ color: "#64748b", mt: 0.5, display: "block" }}>{solveRate}% of {studentStats.totalProblems} total</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={statCard}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography sx={statTitle}>Contests Done</Typography>
                  <Typography sx={statValue}>{studentStats.completedContests}/{studentStats.totalContests}</Typography>
                </Box>
                <Box sx={statIconBox("#e0f2e9")}><Trophy size={24} color="#1f6e43" /></Box>
              </Box>
              <LinearProgress variant="determinate" value={contestCompletionRate} sx={{ mt: 2, height: 6, borderRadius: "10px", bgcolor: "#d1fae5", "& .MuiLinearProgress-bar": { bgcolor: "#059669" } }} />
              <Typography variant="caption" sx={{ color: "#64748b", mt: 0.5, display: "block" }}>{contestCompletionRate}% completion rate</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={statCard}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography sx={statTitle}>Average Grade</Typography>
                  <Typography sx={statValue}>{studentStats.averageGrade}%</Typography>
                </Box>
                <Box sx={statIconBox("#fffbeb")}><Star size={24} color="#d97706" /></Box>
              </Box>
              <Box sx={{ display: "flex", gap: 0.5, mt: 2 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={18} color={star <= Math.round(studentStats.averageGrade / 20) ? "#d97706" : "#e5e7eb"} fill={star <= Math.round(studentStats.averageGrade / 20) ? "#d97706" : "none"} />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={statCard}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography sx={statTitle}>Global Rank</Typography>
                  <Typography sx={statValue}>#{studentStats.globalRank}</Typography>
                </Box>
                <Box sx={statIconBox("#f0f9ff")}><TrendingUp size={24} color="#0284c7" /></Box>
              </Box>
              <Typography variant="caption" sx={{ color: "#64748b", mt: 2, display: "block" }}>out of {studentStats.totalStudents} students</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid size={{ xs: 12, md: 6 }}>
          {/* Quick Actions */}
          <Card sx={{ ...sectionCard, mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={sectionTitle}>Quick Actions</Typography>
              <Grid container spacing={1.5}>
                {quickActions.map((action, idx) => (
                  <Grid size={{ xs: 6, sm: 4 }} key={idx}>
                    <Button fullWidth variant="outlined" startIcon={<action.icon size={16} />} sx={quickActionButton} onClick={() => handleQuickAction(action.path)}>
                      {action.label}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Top Groups */}
          <Card sx={{ ...sectionCard, mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={sectionTitle}>My Groups</Typography>
              <Stack spacing={2}>
                {topGroups.map((group) => (
                  <Paper key={group.id} elevation={0} sx={{ p: 2, borderRadius: "16px", border: "1px solid #eef2f6" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: "#fef2f2", color: "#8B1D23", width: 40, height: 40 }}>{group.name.charAt(0)}</Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>{group.name}</Typography>
                          <Typography variant="caption" sx={{ color: "#64748b" }}>{group.students} students</Typography>
                        </Box>
                      </Box>
                      <Chip label={`Rank #${group.rank}`} size="small" sx={{ bgcolor: group.rank === 1 ? "#fef3c7" : group.rank === 2 ? "#f1f5f9" : "#fef2f2", fontWeight: 700 }} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>Progress</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: "#8B1D23" }}>{group.progress}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={group.progress} sx={{ height: 6, borderRadius: "10px", bgcolor: "#fee2e2", "& .MuiLinearProgress-bar": { bgcolor: "#8B1D23" } }} />
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card sx={sectionCard}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={sectionTitle}>Recent Activity</Typography>
              <Stack spacing={1.5}>
                {recentActivities.map((act) => (
                  <Box key={act.id} sx={activityItem}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Box sx={{ width: 32, height: 32, borderRadius: "12px", bgcolor: act.bgColor, display: "flex", alignItems: "center", justifyContent: "center" }}>{act.icon}</Box>
                      <Box>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 600 }}>{act.title}</Typography>
                        <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                          <Typography variant="caption" sx={{ color: "#94a3b8" }}>{act.group}</Typography>
                          <Typography variant="caption" sx={{ color: "#cbd5e1" }}>•</Typography>
                          <Typography variant="caption" sx={{ color: "#94a3b8" }}>{act.time}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, md: 6 }}>
          {/* Upcoming Contests */}
          <Card sx={{ ...sectionCard, mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={sectionTitle}>Upcoming Contests</Typography>
              <Stack spacing={2}>
                {upcomingContests.map((contest) => (
                  <Box key={contest.id} sx={contestCard} onClick={() => handleViewContest(contest.id)}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                      <Box>
                        <Typography sx={{ fontWeight: 700 }}>{contest.title}</Typography>
                        <Typography variant="caption" sx={{ color: "#64748b" }}>{contest.group}</Typography>
                      </Box>
                      <Chip label={contest.difficulty} size="small" sx={{ bgcolor: contest.difficulty === "Hard" ? "#fee2e2" : "#fffbeb", color: contest.difficulty === "Hard" ? "#b91c1c" : "#b45309", fontWeight: 700 }} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}><BookOpen size={12} /><Typography variant="caption" sx={{ fontWeight: 600 }}>{contest.problemsCount} problems</Typography></Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}><Clock size={12} /><Typography variant="caption" sx={{ fontWeight: 600 }}>{new Date(contest.startDate).toLocaleDateString()}</Typography></Box>
                      </Box>
                      <Chip label={`${contest.daysLeft} days left`} size="small" sx={{ bgcolor: "#fef2f2", color: "#8B1D23", fontWeight: 700 }} />
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          {/* Recent Grades Table */}
          <Card sx={sectionCard}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={sectionTitle}>Recent Grades</Typography>
              <TableContainer component={Paper} elevation={0} sx={tableContainer}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f8fafc" }}>
                      <TableCell sx={tableHeadCell}>Problem</TableCell>
                      <TableCell sx={tableHeadCell} align="center">Grade</TableCell>
                      <TableCell sx={tableHeadCell}>Feedback</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {gradedProblems.map((problem) => (
                      <TableRow key={problem.id} hover>
                        <TableCell sx={tableBodyCell}>{problem.title}</TableCell>
                        <TableCell align="center">
                          <Chip label={`${problem.grade}/${problem.maxGrade}`} size="small" sx={gradeChip(problem.grade)} />
                        </TableCell>
                        <TableCell sx={{ color: "#64748b", fontSize: "0.75rem" }}>{problem.feedback}</TableCell>
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

export default StudentDashboardPage;