// ProblemBank.tsx
import React, { useState } from 'react';
import {
  Box,
  MenuItem,
  Select,
  Typography,
  Stack,
  InputAdornment,
} from '@mui/material';
import { Search, Edit2, Eye, TrendingUp } from 'lucide-react';
import {
  PageContainer,
  HeaderSection,
  TitleBox,
  IconBadge,
  SearchFilterBox,
  StyledSearchField,
  StyledFormControl,
  ProblemsGrid,
  ProblemCard,
  CardHeader,
  CardTitle,
  DifficultyChip,
  TagChip,
  StatsBox,
  StatItem,
  StatNumber,
  StatLabel,
  ActionButtons,
  ActionButton,
  EmptyState,
  problemsData,
} from './problemStyle';

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

      <SearchFilterBox>
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
                <DifficultyChip
                  label={problem.difficulty}
                  difficulty={problem.difficulty}
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
                <ActionButton variant="outlined" size="small" startIcon={<Eye size={16} />}>
                  View
                </ActionButton>
                <ActionButton variant="contained" size="small" startIcon={<Edit2 size={16} />}>
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