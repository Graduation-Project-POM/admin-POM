import React, { useState } from 'react';
import { Box, Typography, Button, CardContent } from '@mui/material';
import {
  Calendar,
  Users,
  Clock,
  ArrowLeft,
  Target,
  ChevronRight,
} from 'lucide-react';
import {
  PageContainer,
  HeaderSection,
  TitleBox,
  IconBadge,
  BackButton,
  ContestCard,
  CardHeaderBox,
  ContestTitle,
  StatusChip,
  InfoStack,
  InfoItem,
  InfoIcon,
  InfoLabel,
  InfoValue,
  ProgressSection,
  ProgressLabel,
  ProgressLabelText,
  ProgressPercentage,
  StyledLinearProgress,
  ActionButton,
  DifficultyChip,
  TableContainer,
  TableHeader,
  TableTitle,
  TableSubtitle,
  contestsData,
  contestProblemsMap,
} from './contestStyle';

export const ContestsManager: React.FC = () => {
  const [selectedContestId, setSelectedContestId] = useState<number | null>(null);

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
            <TableTitle>🏆 {contestName}</TableTitle>
            <TableSubtitle>Manage and monitor contest problems</TableSubtitle>
          </TableHeader>

          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>Problem</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>Difficulty</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>Students Solved</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>Total Submissions</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>Acceptance Rate</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contestProblems.map((problem, index) => (
                  <tr
                    key={index}
                    style={{ borderBottom: '1px solid #f1f5f9' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '14px 16px', color: '#1e293b', fontWeight: 600 }}>{problem.problem}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <DifficultyChip label={problem.difficulty} difficulty={problem.difficulty} size="small" />
                    </td>
                    <td style={{ padding: '14px 16px', color: '#64748b' }}>{problem.studentsSolved}</td>
                    <td style={{ padding: '14px 16px', color: '#64748b' }}>{problem.totalSubmissions}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <Box sx={{ fontSize: '14px', fontWeight: 600, color: '#8B1D23' }}>{problem.acceptanceRate}%</Box>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <Button
                        variant="text"
                        size="small"
                        sx={{
                          color: '#8B1D23',
                          fontWeight: 600,
                          textTransform: 'none',
                          '&:hover': { backgroundColor: 'rgba(139, 29, 35, 0.1)' },
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

  return (
    <PageContainer>
      <HeaderSection>
        <TitleBox>
          <IconBadge>🏆</IconBadge>
          <Box>
            <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>
              Contests
            </Typography>
            <Typography sx={{ fontSize: '14px', color: '#64748b', fontWeight: 500, marginTop: '6px' }}>
              Create and manage coding contests
            </Typography>
          </Box>
        </TitleBox>
      </HeaderSection>

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
          <ContestCard key={contest.id} onClick={() => setSelectedContestId(contest.id)}>
            <CardContent sx={{ flexGrow: 1 }}>
              <CardHeaderBox>
                <ContestTitle>{contest.name}</ContestTitle>
                <StatusChip label={contest.status} status={contest.status} size="small" />
              </CardHeaderBox>

              <InfoStack>
                <InfoItem>
                  <InfoIcon><Calendar size={18} /></InfoIcon>
                  <Box>
                    <InfoLabel>Duration</InfoLabel>
                    <InfoValue>{contest.startDate} - {contest.endDate}</InfoValue>
                  </Box>
                </InfoItem>
                <InfoItem>
                  <InfoIcon><Users size={18} /></InfoIcon>
                  <Box>
                    <InfoLabel>Participants</InfoLabel>
                    <InfoValue>{contest.participants || 'Not started yet'}</InfoValue>
                  </Box>
                </InfoItem>
                <InfoItem>
                  <InfoIcon><Target size={18} /></InfoIcon>
                  <Box>
                    <InfoLabel>Problems</InfoLabel>
                    <InfoValue>{contest.problems}</InfoValue>
                  </Box>
                </InfoItem>
                <InfoItem>
                  <InfoIcon><Clock size={18} /></InfoIcon>
                  <Box>
                    <InfoLabel>Duration</InfoLabel>
                    <InfoValue>{contest.duration}</InfoValue>
                  </Box>
                </InfoItem>
              </InfoStack>

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

            <Box sx={{ p: 2, pt: 0 }}>
              <ActionButton variant="contained" fullWidth endIcon={<ChevronRight size={16} />}>
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