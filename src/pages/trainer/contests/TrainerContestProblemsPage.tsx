import React from 'react';
import { SharedTable } from '../../../components/ui/tables';
import {
  Box,
  Chip,
  Typography,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const primaryColor = '#7A1E1E';

const DifficultyChip = styled(Chip)<{ difficulty: string }>(({ difficulty }) => ({
  fontSize: '11px',
  height: '22px',
  fontWeight: 600,
  ...(difficulty === 'Easy' && { backgroundColor: '#e7f7ec', color: '#166534' }),
  ...(difficulty === 'Medium' && { backgroundColor: '#fff7e0', color: '#92400e' }),
  ...(difficulty === 'Hard' && { backgroundColor: '#fdecec', color: '#991b1b' }),
}));

type ContestProblem = {
  id: string;
  problem: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  studentsSolved: string; // e.g. "132/156"
  totalSubmissions: number;
  acceptanceRate: number; // percentage
};

const mockProblems: ContestProblem[] = [
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
    problem: 'Graph Shortest Path',
    difficulty: 'Hard',
    studentsSolved: '45/156',
    totalSubmissions: 123,
    acceptanceRate: 29,
  },
  {
    id: '4',
    problem: 'Dynamic Programming - Knapsack',
    difficulty: 'Medium',
    studentsSolved: '87/156',
    totalSubmissions: 176,
    acceptanceRate: 56,
  },
];

export const TrainerContestProblemsPage = () => {
  const columns = [
    {
      id: 'problem',
      label: 'Problem',
      render: (row: ContestProblem) => (
        <Typography sx={{ fontWeight: 600, color: primaryColor }}>
          {row.problem}
        </Typography>
      ),
    },
    {
      id: 'difficulty',
      label: 'Difficulty',
      render: (row: ContestProblem) => (
        <DifficultyChip label={row.difficulty} difficulty={row.difficulty} />
      ),
    },
    {
      id: 'studentsSolved',
      label: 'Students Solved',
    },
    {
      id: 'totalSubmissions',
      label: 'Total Submissions',
    },
    {
      id: 'acceptanceRate',
      label: 'Acceptance Rate',
      render: (row: ContestProblem) => (
        <Typography fontWeight={500}>
          {row.acceptanceRate}%
        </Typography>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      render: (row: ContestProblem) => (
        <Button
          variant="text"
          size="small"
          sx={{
            color: primaryColor,
            fontWeight: 600,
            textTransform: 'none',
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <SharedTable
      title="Contest Problems"
      data={mockProblems}
      columns={columns}
      searchPlaceholder="Search problems..."
    />
  );
};

export default TrainerContestProblemsPage;