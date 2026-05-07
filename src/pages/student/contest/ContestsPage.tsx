import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { SharedTable } from '../../../components/ui/tables';
import { PageContainer } from './contestStyle';
import type { SContestProblem } from '../../../types/index';

const contestProblems: SContestProblem[] = [
  { id: 'A', title: 'Divisibility Chain', type: 'NT', difficulty: 'Easy', submissions: 31, solvedByUser: true, userSolutionId: 'sol1' },
  { id: 'B', title: 'Quadratic Residues', type: 'Alg', difficulty: 'Medium', submissions: 24, solvedByUser: false },
  { id: 'C', title: 'Sequence Convergence', type: 'Alg', difficulty: 'Medium', submissions: 10, solvedByUser: false },
  { id: 'D', title: 'Prime Factorization Trick', type: 'NT', difficulty: 'Hard', submissions: 9, solvedByUser: false },
  { id: 'E', title: 'The Infinite Product', type: 'Alg', difficulty: 'V.Hard', submissions: 2, solvedByUser: false },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy': return { bg: '#dcfce7', text: '#166534' };
    case 'Medium': return { bg: '#fef3c7', text: '#92400e' };
    case 'Hard': return { bg: '#fee2e2', text: '#991b1b' };
    case 'V.Hard': return { bg: '#f3e8ff', text: '#6b21a5' };
    default: return { bg: '#f1f5f9', text: '#475569' };
  }
};

const columns = [
  { id: 'id', label: '#' },
  { id: 'title', label: 'Problem' },
  { id: 'type', label: 'Type' },
  {
    id: 'difficulty',
    label: 'Difficulty',
    render: (row: SContestProblem) => {
      const diffColor = getDifficultyColor(row.difficulty);
      return (
        <Box
          sx={{
            display: 'inline-block',
            padding: '4px 10px',
            borderRadius: '6px',
            backgroundColor: diffColor.bg,
            color: diffColor.text,
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          {row.difficulty}
        </Box>
      );
    },
  },
  {
    id: 'submissions',
    label: 'Submissions',
    render: (row: SContestProblem) => (
      <Typography sx={{ fontWeight: 600, color: '#475569' }}>{row.submissions}x</Typography>
    ),
  },
  {
    id: 'mySolution',
    label: 'My Solution',
    render: (row: SContestProblem) => (
      <Button
        component={Link}
        to={row.solvedByUser ? `/student/solution/${row.userSolutionId}` : '#'}
        variant="text"
        size="small"
        sx={{
          color: row.solvedByUser ? '#8B1D23' : '#94a3b8',
          textTransform: 'none',
          fontWeight: 600,
          '&:hover': { textDecoration: 'underline', backgroundColor: 'transparent' },
        }}
        disabled={!row.solvedByUser}
      >
        View My Solution
      </Button>
    ),
  },
];

export const StudentContestsPage: React.FC = () => {
  return (
    <PageContainer>
      <SharedTable
        title="Problems in this contest"
        data={contestProblems}
        columns={columns}
        onRowSelect={(selectedIds) => console.log('Selected:', selectedIds)}
      />
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          💡 Click "View My Solution" to see your submitted work.
        </Typography>
      </Box>
    </PageContainer>
  );
};

export default StudentContestsPage;