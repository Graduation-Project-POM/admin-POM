import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  styled,
} from '@mui/material';
import {
  Calendar,
  Users,
  Clock,
  ArrowLeft,
  Target,
  ChevronRight,
} from 'lucide-react';
import type { Contest, ContestProblem } from '../../../types';

// ========== Styled Components ==========
const PageContainer = styled(Box)({
  padding: '40px 24px',
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
  minHeight: '100vh',
});

const HeaderSection = styled(Box)({
  marginBottom: '40px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  gap: '24px',
  '@media (max-width: 768px)': {
    flexDirection: 'column',
  },
});

const TitleBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
});

const IconBadge = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 56,
  height: 56,
  borderRadius: '16px',
  background: 'linear-gradient(135deg, rgba(139, 29, 35, 0.15) 0%, rgba(139, 29, 35, 0.05) 100%)',
  color: '#8B1D23',
  fontSize: '28px',
  flexShrink: 0,
});

const BackButton = styled(Button)({
  marginBottom: '24px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '14px',
  color: '#64748b',
  borderColor: '#e2e8f0',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  padding: '8px 16px',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#8B1D23',
    color: '#8B1D23',
    backgroundColor: 'rgba(139, 29, 35, 0.04)',
    transform: 'translateX(-4px)',
  },
});

const ContestCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  border: '1px solid #e2e8f0',
  backgroundColor: '#ffffff',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #8B1D23 0%, #d32f2f 100%)',
    transform: 'scaleX(0)',
    transformOrigin: 'left',
    transition: 'transform 0.4s ease',
  },

  '&:hover': {
    transform: 'translateY(-12px)',
    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.12)',
    '&::before': {
      transform: 'scaleX(1)',
    },
  },
}));

const CardHeaderBox = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '20px',
  gap: '12px',
});

const ContestTitle = styled(Typography)({
  fontSize: '18px',
  fontWeight: 700,
  color: '#1e293b',
  lineHeight: 1.4,
  marginBottom: '0',
  flex: 1,
});

const StatusChip = styled(Chip)<{ status: string }>(({ status }) => {
  const statusMap: Record<string, any> = {
    Ongoing: {
      bg: '#dcfce7',
      text: '#166534',
    },
    Upcoming: {
      bg: '#fef3c7',
      text: '#92400e',
    },
    Ended: {
      bg: '#fee2e2',
      text: '#991b1b',
    },
  };

  const statusColor = statusMap[status];
  return {
    backgroundColor: statusColor.bg,
    color: statusColor.text,
    border: 'none',
    fontWeight: 600,
    fontSize: '12px',
    height: '28px',
  };
});

const InfoStack = styled(Stack)({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginBottom: '20px',
});

const InfoItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const InfoIcon = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  backgroundColor: '#f1f5f9',
  color: '#8B1D23',
  fontSize: '16px',
  flexShrink: 0,
});

const InfoLabel = styled(Typography)({
  fontSize: '13px',
  color: '#64748b',
  fontWeight: 500,
});

const InfoValue = styled(Typography)({
  fontSize: '14px',
  color: '#1e293b',
  fontWeight: 700,
});

const ProgressSection = styled(Box)({
  marginTop: '20px',
  padding: '16px',
  backgroundColor: '#f8fafc',
  borderRadius: '12px',
});

const ProgressLabel = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px',
});

const ProgressLabelText = styled(Typography)({
  fontSize: '12px',
  fontWeight: 600,
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

const ProgressPercentage = styled(Typography)({
  fontSize: '13px',
  fontWeight: 700,
  color: '#8B1D23',
});

const StyledLinearProgress = styled(LinearProgress)({
  height: '8px',
  borderRadius: '4px',
  backgroundColor: '#e2e8f0',
  '& .MuiLinearProgress-bar': {
    borderRadius: '4px',
    background: 'linear-gradient(90deg, #8B1D23 0%, #d32f2f 100%)',
  },
});

const ActionButton = styled(Button)(({ variant }: any) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '14px',
  borderRadius: '10px',
  transition: 'all 0.3s ease',
  padding: '10px 16px',

  ...(variant === 'contained' && {
    backgroundColor: '#8B1D23',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(139, 29, 35, 0.2)',
    '&:hover': {
      backgroundColor: '#6d1620',
      boxShadow: '0 6px 20px rgba(139, 29, 35, 0.3)',
      transform: 'translateY(-2px)',
    },
  }),

  ...(variant === 'outlined' && {
    borderColor: '#e2e8f0',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    '&:hover': {
      borderColor: '#8B1D23',
      color: '#8B1D23',
      backgroundColor: 'rgba(139, 29, 35, 0.04)',
    },
  }),
}));

const DifficultyChip = styled(Chip)<{ difficulty: string }>(({ difficulty }) => {
  const difficultyMap: Record<string, any> = {
    Easy: {
      bg: '#dcfce7',
      text: '#166534',
    },
    Medium: {
      bg: '#fef3c7',
      text: '#92400e',
    },
    Hard: {
      bg: '#fee2e2',
      text: '#991b1b',
    },
  };

  const diffColor = difficultyMap[difficulty];
  return {
    fontSize: '11px',
    height: '28px',
    fontWeight: 600,
    backgroundColor: diffColor.bg,
    color: diffColor.text,
    border: 'none',
  };
});

const TableContainer = styled(Box)({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
  overflow: 'hidden',
});

const TableHeader = styled(Box)({
  padding: '20px 24px',
  borderBottom: '1px solid #e2e8f0',
});

const TableTitle = styled(Typography)({
  fontSize: '20px',
  fontWeight: 800,
  color: '#1e293b',
  marginBottom: '4px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const TableSubtitle = styled(Typography)({
  fontSize: '14px',
  color: '#64748b',
  fontWeight: 500,
});

// ========== Data ==========
const contestsData: Contest[] = [
  {
    id: 1,
    name: 'Spring Coding Challenge 2026',
    status: 'Ongoing',
    startDate: 'April 1, 2026',
    endDate: 'April 10, 2026',
    participants: 156,
    problems: 8,
    duration: '10 days',
    timeProgress: 65,
  },
  {
    id: 2,
    name: 'Algorithm Masters Cup',
    status: 'Ongoing',
    startDate: 'March 28, 2026',
    endDate: 'April 5, 2026',
    participants: 203,
    problems: 12,
    duration: '8 days',
    timeProgress: 72,
  },
  {
    id: 3,
    name: 'Winter Coding Challenge',
    status: 'Upcoming',
    startDate: 'December 15, 2026',
    endDate: 'December 22, 2026',
    participants: 0,
    problems: 10,
    duration: '7 days',
  },
  {
    id: 4,
    name: 'JavaScript Fundamentals',
    status: 'Ended',
    startDate: 'January 1, 2026',
    endDate: 'January 15, 2026',
    participants: 89,
    problems: 6,
    duration: '15 days',
  },
  {
    id: 5,
    name: 'Database Design Marathon',
    status: 'Upcoming',
    startDate: 'May 1, 2026',
    endDate: 'May 10, 2026',
    participants: 0,
    problems: 9,
    duration: '10 days',
  },
  {
    id: 6,
    name: 'Mobile App Development',
    status: 'Ongoing',
    startDate: 'March 15, 2026',
    endDate: 'March 30, 2026',
    participants: 78,
    problems: 7,
    duration: '15 days',
    timeProgress: 45,
  },
];

const contestProblemsMap: Record<number, ContestProblem[]> = {
  1: [
    {
      id: '1',
      problem: 'Two Sum Problem',
      difficulty: 'Easy',
      studentsSolved: '132/156',
      totalSubmissions: 245,
      acceptanceRate: 85,
    },
    {
      id: '2',
      problem: 'Binary Tree Traversal',
      difficulty: 'Medium',
      studentsSolved: '98/156',
      totalSubmissions: 187,
      acceptanceRate: 63,
    },
    {
      id: '3',
      problem: 'Longest Palindrome Substring',
      difficulty: 'Hard',
      studentsSolved: '45/156',
      totalSubmissions: 142,
      acceptanceRate: 32,
    },
    {
      id: '4',
      problem: 'Reverse Linked List',
      difficulty: 'Easy',
      studentsSolved: '145/156',
      totalSubmissions: 256,
      acceptanceRate: 87,
    },
  ],
  2: [
    {
      id: '5',
      problem: 'Maximum Subarray',
      difficulty: 'Easy',
      studentsSolved: '180/203',
      totalSubmissions: 310,
      acceptanceRate: 82,
    },
    {
      id: '6',
      problem: 'Merge K Sorted Lists',
      difficulty: 'Hard',
      studentsSolved: '67/203',
      totalSubmissions: 198,
      acceptanceRate: 42,
    },
    {
      id: '7',
      problem: 'Word Ladder',
      difficulty: 'Medium',
      studentsSolved: '112/203',
      totalSubmissions: 256,
      acceptanceRate: 58,
    },
  ],
  3: [
    {
      id: '1',
      problem: 'Two Sum Problem',
      difficulty: 'Easy',
      studentsSolved: '0/0',
      totalSubmissions: 0,
      acceptanceRate: 0,
    },
  ],
  4: [
    {
      id: '8',
      problem: 'Callback Hell',
      difficulty: 'Medium',
      studentsSolved: '67/89',
      totalSubmissions: 145,
      acceptanceRate: 56,
    },
  ],
  5: [
    {
      id: '9',
      problem: 'Database Normalization',
      difficulty: 'Medium',
      studentsSolved: '0/0',
      totalSubmissions: 0,
      acceptanceRate: 0,
    },
  ],
  6: [
    {
      id: '10',
      problem: 'React Hooks',
      difficulty: 'Medium',
      studentsSolved: '52/78',
      totalSubmissions: 134,
      acceptanceRate: 67,
    },
  ],
};

// ========== Component ==========
export const ContestsManager: React.FC = () => {
  const [selectedContestId, setSelectedContestId] = useState<number | null>(null);

  // ========== Problems Detail View ==========
  if (selectedContestId !== null) {
    const contestProblems = contestProblemsMap[selectedContestId] || [];
    const contestName = contestsData.find((c) => c.id === selectedContestId)?.name || 'Contest';

    return (
      <PageContainer>
        <BackButton
          variant="outlined"
          startIcon={<ArrowLeft size={18} />}
          onClick={() => setSelectedContestId(null)}
        >
          Back to Contests
        </BackButton>

        <TableContainer>
          <TableHeader>
            <TableTitle>
              🏆 {contestName}
            </TableTitle>
            <TableSubtitle>
              Manage and monitor contest problems
            </TableSubtitle>
          </TableHeader>

          {/* Problems Table */}
          <Box sx={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px',
              }}
            >
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>
                    Problem
                  </th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>
                    Difficulty
                  </th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>
                    Students Solved
                  </th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>
                    Total Submissions
                  </th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>
                    Acceptance Rate
                  </th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {contestProblems.map((problem, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={{ padding: '14px 16px', color: '#1e293b', fontWeight: 600 }}>
                      {problem.problem}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <DifficultyChip
                        label={problem.difficulty}
                        difficulty={problem.difficulty}
                        size="small"
                      />
                    </td>
                    <td style={{ padding: '14px 16px', color: '#64748b' }}>
                      {problem.studentsSolved}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#64748b' }}>
                      {problem.totalSubmissions}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <Box
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#8B1D23',
                        }}
                      >
                        {problem.acceptanceRate}%
                      </Box>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <Button
                        variant="text"
                        size="small"
                        sx={{
                          color: '#8B1D23',
                          fontWeight: 600,
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: 'rgba(139, 29, 35, 0.1)',
                          },
                        }}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </TableContainer>
      </PageContainer>
    );
  }

  // ========== Contests List View ==========
  return (
    <PageContainer>
      {/* Header */}
      <HeaderSection>
        <TitleBox>
          <IconBadge>🏆</IconBadge>
          <Box>
            <Typography
              sx={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#1e293b',
                letterSpacing: '-0.5px',
              }}
            >
              Contests
            </Typography>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#64748b',
                fontWeight: 500,
                marginTop: '6px',
              }}
            >
              Create and manage coding contests
            </Typography>
          </Box>
        </TitleBox>
      </HeaderSection>

      {/* Contests Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
        }}
      >
        {contestsData.map((contest) => (
          <ContestCard key={contest.id}>
            <CardContent sx={{ flexGrow: 1 }}>
              {/* Header */}
              <CardHeaderBox>
                <ContestTitle>{contest.name}</ContestTitle>
                <StatusChip label={contest.status} status={contest.status} size="small" />
              </CardHeaderBox>

              {/* Info Items */}
              <InfoStack>
                {/* Date */}
                <InfoItem>
                  <InfoIcon>
                    <Calendar size={18} />
                  </InfoIcon>
                  <Box>
                    <InfoLabel>Duration</InfoLabel>
                    <InfoValue>
                      {contest.startDate} - {contest.endDate}
                    </InfoValue>
                  </Box>
                </InfoItem>

                {/* Participants */}
                <InfoItem>
                  <InfoIcon>
                    <Users size={18} />
                  </InfoIcon>
                  <Box>
                    <InfoLabel>Participants</InfoLabel>
                    <InfoValue>{contest.participants || 'Not started yet'}</InfoValue>
                  </Box>
                </InfoItem>

                {/* Problems */}
                <InfoItem>
                  <InfoIcon>
                    <Target size={18} />
                  </InfoIcon>
                  <Box>
                    <InfoLabel>Problems</InfoLabel>
                    <InfoValue>{contest.problems}</InfoValue>
                  </Box>
                </InfoItem>

                {/* Duration */}
                <InfoItem>
                  <InfoIcon>
                    <Clock size={18} />
                  </InfoIcon>
                  <Box>
                    <InfoLabel>Duration</InfoLabel>
                    <InfoValue>{contest.duration}</InfoValue>
                  </Box>
                </InfoItem>
              </InfoStack>

              {/* Progress Bar (Only for Ongoing) */}
              {contest.status === 'Ongoing' && contest.timeProgress !== undefined && (
                <ProgressSection>
                  <ProgressLabel>
                    <ProgressLabelText>Time Progress</ProgressLabelText>
                    <ProgressPercentage>{contest.timeProgress}%</ProgressPercentage>
                  </ProgressLabel>
                  <StyledLinearProgress variant="determinate" value={contest.timeProgress} />
                </ProgressSection>
              )}
            </CardContent>

            {/* Action Button */}
            <Box sx={{ p: 2, pt: 0 }}>
              <ActionButton
                variant="contained"
                fullWidth
                onClick={() => setSelectedContestId(contest.id)}
                endIcon={<ChevronRight size={16} />}
              >
                View Details
              </ActionButton>
            </Box>
          </ContestCard>
        ))}
      </Box>
    </PageContainer>
  );
};

export default ContestsManager;