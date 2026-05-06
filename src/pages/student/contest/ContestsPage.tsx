// StudentContestsPage.tsx
import React, { useState, useMemo } from 'react';
import {
  Box, Chip, Stack, Button, Typography, Paper, Grid, styled,
} from '@mui/material';
import {
  Trophy, BookOpen, TrendingUp, RotateCcw, Filter,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SharedTable } from '../../../components/ui/tables';

// ========== Styled Components (مشابه للصفحات السابقة) ==========
const PageContainer = styled(Box)({
  padding: '32px 24px',
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
  minHeight: '100vh',
});

const HeaderSection = styled(Box)({
  marginBottom: '32px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '20px',
});

const TitleBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const StatsCard = styled(Paper)({
  padding: '16px 20px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

// ========== Types ==========
interface ContestProblem {
  id: string;          // المعرف الفريد
  title: string;
  type: string;        // NT, Alg, Geo, Combinatorics
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'V.Hard';
  submissions: number;
  solvedByUser: boolean;  // هل حل الطالب هذه المسألة؟
  userSolutionId?: string; // معرف الحل لعرضه
}

// ========== Mock Data ==========
const contestProblems: ContestProblem[] = [
  { id: 'A', title: 'Divisibility Chain', type: 'NT', difficulty: 'Easy', submissions: 31, solvedByUser: true, userSolutionId: 'sol1' },
  { id: 'B', title: 'Quadratic Residues', type: 'Alg', difficulty: 'Medium', submissions: 24, solvedByUser: false },
  { id: 'C', title: 'Sequence Convergence', type: 'Alg', difficulty: 'Medium', submissions: 10, solvedByUser: false },
  { id: 'D', title: 'Prime Factorization Trick', type: 'NT', difficulty: 'Hard', submissions: 9, solvedByUser: false },
  { id: 'E', title: 'The Infinite Product', type: 'Alg', difficulty: 'V.Hard', submissions: 2, solvedByUser: false },
];

// ========== Helper ==========
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy': return { bg: '#dcfce7', text: '#166534' };
    case 'Medium': return { bg: '#fef3c7', text: '#92400e' };
    case 'Hard': return { bg: '#fee2e2', text: '#991b1b' };
    case 'V.Hard': return { bg: '#f3e8ff', text: '#6b21a5' };
    default: return { bg: '#f1f5f9', text: '#475569' };
  }
};

// تعريف الأعمدة لـ SharedTable
const columns = [
  { id: 'id', label: '#' },
  { id: 'title', label: 'Problem' },
  { id: 'type', label: 'Type' },
  {
    id: 'difficulty',
    label: 'Difficulty',
    render: (row: ContestProblem) => {
      const diffColor = getDifficultyColor(row.difficulty);
      return (
        <Box sx={{ display: 'inline-block', padding: '4px 10px', borderRadius: '6px', backgroundColor: diffColor.bg, color: diffColor.text, fontSize: '12px', fontWeight: 600 }}>
          {row.difficulty}
        </Box>
      );
    },
  },
  {
    id: 'submissions',
    label: 'Submissions',
    render: (row: ContestProblem) => (
      <Typography sx={{ fontWeight: 600, color: '#475569' }}>{row.submissions}x</Typography>
    ),
  },
  {
    id: 'mySolution',
    label: 'My Solution',
    render: (row: ContestProblem) => (
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
  // يمكن إضافة فلاتر إذا أردت (حسب النوع، الصعوبة) – نتركها اختيارية
  const [filterType, setFilterType] = useState<string>('All');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');

  const filteredData = useMemo(() => {
    let filtered = [...contestProblems];
    if (filterType !== 'All') filtered = filtered.filter(p => p.type === filterType);
    if (filterDifficulty !== 'All') filtered = filtered.filter(p => p.difficulty === filterDifficulty);
    return filtered;
  }, [filterType, filterDifficulty]);

  const solvedCount = filteredData.filter(p => p.solvedByUser).length;
  const totalCount = filteredData.length;
  const solvedPercentage = totalCount > 0 ? (solvedCount / totalCount) * 100 : 0;

  const resetFilters = () => {
    setFilterType('All');
    setFilterDifficulty('All');
  };

  // قيم فريدة للفلاتر (اختياري)
  const uniqueTypes = ['All', ...new Set(contestProblems.map(p => p.type))];
  const uniqueDifficulties = ['All', ...new Set(contestProblems.map(p => p.difficulty))];

  return (
    <PageContainer>

      {/* Shared Table */}
      <SharedTable
        title="Problems in this contest"
        data={filteredData}
        columns={columns}
        searchPlaceholder="Search problem..."
        onRowSelect={(selectedIds) => console.log('Selected:', selectedIds)}
      />
      <Box mt={2} textAlign="center">
        <Typography variant="caption" color="text.secondary">
          💡 Click "View My Solution" to see your submitted work.
        </Typography>
      </Box>
    </PageContainer>
  );
};

export default StudentContestsPage;