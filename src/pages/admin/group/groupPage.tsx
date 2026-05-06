import React from 'react';
import { Typography, Container, Box } from '@mui/material';
import { GroupCard } from '../../../components/ui/card/GroupCard';
import type { GroupData } from '../../../types/index';

const mockGroups: GroupData[] = [
  {
    id: '1',
    title: 'Advanced Algorithms',
    description: 'Focus on advanced algorithmic concepts and competitive programming',
    studentsCount: 24,
    trainerCount: 1,
    trainerName: 'Jane Smith',
    createdDate: '2026-01-15',
  },
  {
    id: '2',
    title: 'Data Structures Fundamentals',
    description: 'Learn fundamental data structures and their applications',
    studentsCount: 18,
    trainerCount: 1,
    trainerName: 'Jane Smith',
    createdDate: '2026-02-01',
  },
  {
    id: '3',
    title: 'Beginner Practice',
    description: 'Entry-level problem solving and programming basics',
    studentsCount: 32,
    trainerCount: 1,
    trainerName: 'Emily Davis',
    createdDate: '2026-01-20',
  },
];

export const GroupsPage: React.FC = () => {
  const handleView = (id: string) => console.log('View group', id);
  const handleEdit = (id: string) => console.log('Edit group', id);
  const handleMembers = (id: string) => console.log('Members group', id);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        My Groups
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
        Groups you are participating in or managing
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
        {mockGroups.map((group) => (
          <Box key={group.id}>
            <GroupCard
              group={group}
              onView={handleView}
              onEdit={handleEdit}
              onMembers={handleMembers}
            />
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default GroupsPage;