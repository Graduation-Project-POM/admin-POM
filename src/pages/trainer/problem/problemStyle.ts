import { styled } from '@mui/material/styles';
import {
  Box,
  TextField,
  FormControl,
  Card,
  Typography,
  Chip,
  Button,
} from '@mui/material';

export const PageContainer = styled(Box)({
  padding: '32px 24px',
  minHeight: '100vh',
});

export const HeaderSection = styled(Box)({
  marginBottom: '40px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '24px',
  '@media (max-width: 768px)': {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

export const TitleBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

export const IconBadge = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 56,
  height: 56,
  borderRadius: '16px',
  background: 'linear-gradient(135deg, rgba(139, 29, 35, 0.1) 0%, rgba(139, 29, 35, 0.05) 100%)',
  color: '#8B1D23',
  fontSize: '28px',
});

export const SearchFilterBox = styled(Box)({
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
  marginBottom: '32px',
  '@media (max-width: 768px)': {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '12px',
  },
});

export const StyledSearchField = styled(TextField)({
  flex: 1,
  minWidth: '300px',
  '@media (max-width: 768px)': {
    width: '100%',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    },
    '&.Mui-focused': {
      boxShadow: '0 4px 20px rgba(139, 29, 35, 0.15)',
      borderColor: '#8B1D23',
    },
  },
  '& .MuiOutlinedInput-input': {
    fontSize: '14px',
    fontWeight: 500,
  },
});

export const StyledFormControl = styled(FormControl)({
  minWidth: 180,
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    fontSize: '14px',
    fontWeight: 600,
    color: '#1e293b',
    transition: 'all 0.3s ease',

    '& fieldset': {
      borderColor: '#e2e8f0',
    },

    '&:hover fieldset': {
      borderColor: '#8B1D23',
    },

    '&.Mui-focused fieldset': {
      borderColor: '#8B1D23',
      boxShadow: '0 0 0 3px rgba(139, 29, 35, 0.1)',
    },
  },

  '& .MuiSelect-select': {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 14px',
  },
});
export const ProblemsGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
  gap: '24px',
  '@media (max-width: 768px)': {
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
});

export const ProblemCard = styled(Card)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  border: '1px solid #e2e8f0',
  backgroundColor: '#ffffff',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #8B1D23 0%, #d32f2f 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
    '&:before': {
      opacity: 1,
    },
  },
});

export const CardHeader = styled(Box)({
  padding: '24px',
  paddingBottom: '16px',
});

export const CardTitle = styled(Typography)({
  fontSize: '18px',
  fontWeight: 700,
  color: '#1e293b',
  lineHeight: 1.4,
  marginBottom: '12px',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

export const DifficultyChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'difficulty',
})<{ difficulty: string }>(({ difficulty }) => {
  const colorMap: Record<string, any> = {
    Easy: {
      bg: '#dcfce7',
      text: '#166534',
      border: '#86efac',
    },
    Medium: {
      bg: '#fef3c7',
      text: '#92400e',
      border: '#fde047',
    },
    Hard: {
      bg: '#fee2e2',
      text: '#991b1b',
      border: '#fca5a5',
    },
  };
  const diffColor = colorMap[difficulty] || colorMap.Medium;
  return {
    backgroundColor: diffColor.bg,
    color: diffColor.text,
    border: `1px solid ${diffColor.border}`,
    fontWeight: 600,
    fontSize: '12px',
    height: '28px',
    marginBottom: '12px',
  };
});

export const TagChip = styled(Chip)({
  backgroundColor: '#f1f5f9',
  color: '#475569',
  border: '1px solid #e2e8f0',
  fontSize: '12px',
  height: '28px',
  fontWeight: 500,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#e2e8f0',
    borderColor: '#cbd5e1',
  },
});

export const StatsBox = styled(Box)({
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  padding: '16px 24px',
  backgroundColor: '#f8fafc',
  borderTop: '1px solid #e2e8f0',
  borderBottom: '1px solid #e2e8f0',
});

export const StatItem = styled(Box)({
  textAlign: 'center',
  flex: 1,
});

export const StatNumber = styled(Typography)({
  fontSize: '18px',
  fontWeight: 700,
  color: '#8B1D23',
  marginBottom: '2px',
});

export const StatLabel = styled(Typography)({
  fontSize: '11px',
  color: '#94a3b8',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

export const ActionButtons = styled(Box)({
  padding: '20px 24px',
  display: 'flex',
  gap: '12px',
  marginTop: 'auto',
});

export const ActionButton = styled(Button)(({ variant }: { variant?: 'contained' | 'outlined' }) => ({
  flex: 1,
  borderRadius: '10px',
  fontWeight: 600,
  fontSize: '13px',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  padding: '10px 16px',
  ...(variant === 'contained' && {
    backgroundColor: '#8B1D23',
    color: '#ffffff',
    boxShadow: '0 2px 8px rgba(139, 29, 35, 0.2)',
    '&:hover': {
      backgroundColor: '#6d1620',
      boxShadow: '0 4px 12px rgba(139, 29, 35, 0.3)',
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

export const EmptyState = styled(Box)({
  textAlign: 'center',
  padding: '60px 24px',
  gridColumn: '1 / -1',
});

export interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  submissions: number;
  acceptance: number;
}

export const difficultyColorMap = {
  Easy: 'success',
  Medium: 'warning',
  Hard: 'error',
} as const;

export const problemsData: Problem[] = [
  {
    id: 1,
    title: 'Two Sum Problem',
    difficulty: 'Easy',
    tags: ['Hash Table', 'Arrays'],
    submissions: 1234,
    acceptance: 85,
  },
  {
    id: 2,
    title: 'Binary Tree Traversal',
    difficulty: 'Medium',
    tags: ['Trees', 'DFS', 'BFS'],
    submissions: 856,
    acceptance: 72,
  },
  {
    id: 3,
    title: 'Dynamic Programming - Knapsack',
    difficulty: 'Hard',
    tags: ['DP', 'Optimization'],
    submissions: 421,
    acceptance: 58,
  },
  {
    id: 4,
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    tags: ['Linked List', 'Recursion'],
    submissions: 2100,
    acceptance: 78,
  },
  {
    id: 5,
    title: 'Longest Palindrome Substring',
    difficulty: 'Medium',
    tags: ['String', 'DP'],
    submissions: 980,
    acceptance: 64,
  },
  {
    id: 6,
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    tags: ['Arrays', 'Binary Search'],
    submissions: 612,
    acceptance: 48,
  },
];