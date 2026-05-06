import React, { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  Card,
  Typography,
  Chip,
  Button,
  Stack,
  styled,
  InputAdornment,
} from '@mui/material';
import { Search, Edit2, Eye, Zap, TrendingUp } from 'lucide-react';

const PageContainer = styled(Box)({
  padding: '32px 24px',
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
  minHeight: '100vh',
});

const HeaderSection = styled(Box)({
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

const TitleBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const IconBadge = styled(Box)({
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

const SearchFilterBox = styled(Box)({
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
  '@media (max-width: 768px)': {
    width: '100%',
    flexDirection: 'column',
  },
});

const StyledSearchField = styled(TextField)({
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

const StyledFormControl = styled(FormControl)({
  minWidth: '180px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    },
    '&.Mui-focused': {
      boxShadow: '0 4px 20px rgba(139, 29, 35, 0.15)',
    },
  },
});

const ProblemsGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
  gap: '24px',
  '@media (max-width: 768px)': {
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
});

const ProblemCard = styled(Card)(() => ({
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
}));

const CardHeader = styled(Box)({
  padding: '24px',
  paddingBottom: '16px',
});

const CardTitle = styled(Typography)({
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

const DifficultyChip = styled(Chip)(({ color }: any) => {
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

  const diffColor = colorMap[color as string];
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

const TagChip = styled(Chip)({
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

const StatsBox = styled(Box)({
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  padding: '16px 24px',
  backgroundColor: '#f8fafc',
  borderTop: '1px solid #e2e8f0',
  borderBottom: '1px solid #e2e8f0',
});

const StatItem = styled(Box)({
  textAlign: 'center',
  flex: 1,
});

const StatNumber = styled(Typography)({
  fontSize: '18px',
  fontWeight: 700,
  color: '#8B1D23',
  marginBottom: '2px',
});

const StatLabel = styled(Typography)({
  fontSize: '11px',
  color: '#94a3b8',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

const ActionButtons = styled(Box)({
  padding: '20px 24px',
  display: 'flex',
  gap: '12px',
  marginTop: 'auto',
});

const ActionButton = styled(Button)(({ variant }: any) => ({
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

const EmptyState = styled(Box)({
  textAlign: 'center',
  padding: '60px 24px',
  gridColumn: '1 / -1',
});

interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  submissions: number;
  acceptance: number;
}
const difficultyColorMap = {
  Easy: 'success',
  Medium: 'warning',
  Hard: 'error',
} as const;

const problemsData: Problem[] = [
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

export const ProblemBank: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const filteredProblems = problemsData.filter((problem) => {
    const matchesSearch = problem.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === 'all' || problem.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const stats = {
    total: problemsData.length,
    easy: problemsData.filter((p) => p.difficulty === 'Easy').length,
    medium: problemsData.filter((p) => p.difficulty === 'Medium').length,
    hard: problemsData.filter((p) => p.difficulty === 'Hard').length,
  };

  return (
    <PageContainer>
      <HeaderSection>
        <TitleBox>
          <IconBadge>📚</IconBadge>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: '#1e293b',
                letterSpacing: '-0.5px',
              }}
            >
              Problem Bank
            </Typography>
            <Typography
              sx={{
                fontSize: '13px',
                color: '#64748b',
                fontWeight: 500,
                marginTop: '4px',
              }}
            >
              Master algorithms with our curated problem collection
            </Typography>
          </Box>
        </TitleBox>

        <Box sx={{ display: 'flex', gap: '16px' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              px: 2,
              py: 1.5,
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
            }}
          >
            <TrendingUp size={18} color="#8B1D23" />
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
              {stats.total} Problems
            </Typography>
          </Box>
        </Box>
      </HeaderSection>

      <SearchFilterBox sx={{ mb: 4 }}>
        <StyledSearchField
          placeholder="Search problems by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} color="#94a3b8" />
                </InputAdornment>
              ),
            },
          }}
          fullWidth
          sx={{
            flex: 1,
            minWidth: '300px',
            '@media (max-width: 768px)': {
              width: '100%',
            },
          }}
        />

        <StyledFormControl>
          <Select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            displayEmpty
          >
            <MenuItem value="all">All Levels</MenuItem>
            <MenuItem value="Easy">Easy</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Hard">Hard</MenuItem>
          </Select>
        </StyledFormControl>
      </SearchFilterBox>

      {filteredProblems.length > 0 ? (
        <ProblemsGrid>
          {filteredProblems.map((problem) => (
            <ProblemCard key={problem.id}>
              <CardHeader>
                <CardTitle>{problem.title}</CardTitle>
                <Chip
                  label={problem.difficulty}
                  color={difficultyColorMap[problem.difficulty]}
                />
                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  sx={{ flexWrap: 'wrap' }}
                > 
                  {problem.tags.map((tag) => (
                    <TagChip key={tag} label={tag} size="small" />
                  ))}
                </Stack>
              </CardHeader>

              <StatsBox>
                <StatItem>
                  <StatNumber>{problem.submissions.toLocaleString()}</StatNumber>
                  <StatLabel>Submissions</StatLabel>
                </StatItem>
                <Box sx={{ height: '30px', width: '1px', backgroundColor: '#e2e8f0' }} />
                <StatItem>
                  <StatNumber>{problem.acceptance}%</StatNumber>
                  <StatLabel>Acceptance</StatLabel>
                </StatItem>
              </StatsBox>

              <ActionButtons>
                <ActionButton
                  variant="outlined"
                  size="small"
                  startIcon={<Eye size={16} />}
                >
                  View
                </ActionButton>
                <ActionButton
                  variant="contained"
                  size="small"
                  startIcon={<Edit2 size={16} />}
                >
                  Solve
                </ActionButton>
              </ActionButtons>
            </ProblemCard>
          ))}
        </ProblemsGrid>
      ) : (
        <EmptyState>
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1e293b',
              marginBottom: '8px',
            }}
          >
            No problems found
          </Typography>
          <Typography sx={{ color: '#94a3b8', fontSize: '14px' }}>
            Try adjusting your search or filters
          </Typography>
        </EmptyState>
      )}
    </PageContainer>
  );
};

export default ProblemBank;