import React from 'react';
import { SharedTable } from '../../../components/ui/table/tables';
import {
  Box,
  Chip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const primaryColor = '#7A1E1E';

const TagsContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
});

const SmallChip = styled(Chip)({
  fontSize: '11px',
  height: '22px',
  fontWeight: 500,
  backgroundColor: '#f3f4f6',
  color: '#374151',
});

const DifficultyChip = styled(Chip)<{ difficulty: string }>(({ difficulty }) => ({
  fontSize: '11px',
  height: '22px',
  fontWeight: 600,
  ...(difficulty === 'Easy' && { backgroundColor: '#e7f7ec', color: '#166534' }),
  ...(difficulty === 'Medium' && { backgroundColor: '#fff7e0', color: '#92400e' }),
  ...(difficulty === 'Hard' && { backgroundColor: '#fdecec', color: '#991b1b' }),
}));

type Problem = {
  id: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  visibility: 'general' | 'group-specific';
  submissions: number;
  successRate: number;
};

const mockProblems: Problem[] = [
  {
    id: '1',
    title: 'Two Sum',
    category: 'Array',
    difficulty: 'Easy',
    tags: ['Hash Table', 'Array'],
    visibility: 'general',
    submissions: 245,
    successRate: 78,
  },
  {
    id: '2',
    title: 'Binary Tree Maximum Path Sum',
    category: 'Tree',
    difficulty: 'Hard',
    tags: ['Dynamic Programming', 'Tree'],
    visibility: 'group-specific',
    submissions: 87,
    successRate: 42,
  },
  {
    id: '3',
    title: 'Merge Intervals',
    category: 'Array',
    difficulty: 'Medium',
    tags: ['Array', 'Sorting'],
    visibility: 'general',
    submissions: 156,
    successRate: 65,
  },
];

export const AdminProblemsPage = () => {
  const columns = [
    {
      id: 'title',
      label: 'Title',
      render: (row: Problem) => (
        <Typography sx={{ fontWeight: 600, color: primaryColor }}>
          {row.title}
        </Typography>
      ),
    },
    { id: 'category', label: 'Category' },
    {
      id: 'difficulty',
      label: 'Difficulty',
      render: (row: Problem) => (
        <DifficultyChip label={row.difficulty} difficulty={row.difficulty} />
      ),
    },
    {
      id: 'tags',
      label: 'Tags',
      render: (row: Problem) => (
        <TagsContainer>
          {row.tags.map((tag, idx) => (
            <SmallChip key={idx} label={tag} />
          ))}
        </TagsContainer>
      ),
    },
    {
      id: 'visibility',
      label: 'Visibility',
      render: (row: Problem) => (
        <Chip
          label={row.visibility === 'general' ? 'General' : 'Group-specific'}
          sx={{
            fontSize: '11px',
            height: '22px',
            bgcolor: row.visibility === 'general' ? '#e7f7ec' : '#ffe0e0',
            color: row.visibility === 'general' ? '#166534' : '#991b1b',
          }}
        />
      ),
    },
    {
      id: 'stats',
      label: 'Stats',
      render: (row: Problem) => (
        <Box>
          <Typography variant="caption" display="block">
            {row.submissions} submissions
          </Typography>
          <Typography variant="caption" fontWeight={600}>
            {row.successRate}% success
          </Typography>
        </Box>
      ),
    },
  ];

  return (
    <SharedTable
      title="Problem Bank"
      data={mockProblems}
      columns={columns}
      searchPlaceholder="Search problems..."
    />
  );
};

export default AdminProblemsPage;