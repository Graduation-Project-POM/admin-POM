import React from 'react';
import { Typography, Container, Box } from '@mui/material';
import { ContestCard } from '../../../components/ui/card/contestCard';
import type { ContestData } from '../../../types';

const mockContests: ContestData[] = [
  {
    id: 1,
    title: 'Spring Programming Contest 2026',
    status: 'Upcoming',
    difficulty: 'Medium',
    participants: 156,
    problemsCount: 8,
    maxSlots: 500,
    startDate: 'Apr 15, 2026 at 09:00 AM',
    endDate: 'Apr 22, 2026 at 09:00 PM',  
    description: 'Annual spring coding competition with exciting prizes',
  },
  {
    id: 2,
    title: 'Code Rush 2026',
    status: 'Ended',
    difficulty: 'Hard',
    participants: 189,
    problemsCount: 6,
    maxSlots: 200,
    startDate: 'Mar 20, 2026 at 10:00 AM',
    endDate: 'Mar 20, 2026 at 06:00 PM',
    description: 'Fast-paced coding challenge for competitive programmers',
  },
  {
    id: 3,
    title: "Beginner's Challenge",
    status: 'Upcoming',
    difficulty: 'Easy',
    participants: 67,
    problemsCount: 5,
    maxSlots: undefined,
    startDate: 'May 1, 2026 at 10:00 AM',
    endDate: 'May 7, 2026 at 10:00 PM',
    description: 'Perfect for newcomers to test their skills',
  },
];

export const ContestsPage: React.FC = () => {
  const handleView = (id: number) => console.log('View contest', id);
  const handleEdit = (id: number) => console.log('Edit contest', id);
  const handleProblems = (id: number) => console.log('Problems contest', id);
  const handleDelete = (id: number) => console.log('Delete contest', id);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Contests
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
        Competitive programming contests and challenges
      </Typography>

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
        {mockContests.map((contest) => (
          <Box key={contest.id}>
            <ContestCard
              contest={contest}
              onView={handleView}
              onEdit={handleEdit}
              onProblems={handleProblems}
              onDelete={handleDelete}
            />
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default ContestsPage;