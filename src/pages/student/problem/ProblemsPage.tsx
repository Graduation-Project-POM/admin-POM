// StudentProblemsPage.tsx
import React, { useState, useMemo } from 'react';
import {
  Box, Chip, Stack, Button, Typography, Paper, Grid, styled,
} from '@mui/material';
import {
  Calendar, Globe, Tag, RotateCcw, BookOpen, TrendingUp,
} from 'lucide-react';
import { SharedTable } from '../../../components/ui/tables';

// ========== Styled Components ==========
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

const FilterCard = styled(Paper)({
  padding: '24px',
  marginBottom: '28px',
  border: '1px solid #e2e8f0',
  borderRadius: '16px',
  backgroundColor: '#ffffff',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
});

const FilterGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

const FilterLabel = styled(Typography)({
  fontWeight: 700,
  fontSize: '13px',
  color: '#1e293b',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const FilterChipsStack = styled(Stack)({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: '8px',
});

const StyledChip = styled(Chip)<{ color?: 'default' | 'primary' }>(({ color }) => ({
  borderRadius: '8px',
  fontWeight: 500,
  fontSize: '12px',
  height: '32px',
  cursor: 'pointer',
  backgroundColor: color === 'default' ? '#f1f5f9' : '#8B1D23',
  color: color === 'default' ? '#64748b' : '#ffffff',
  border: color === 'default' ? '1px solid #e2e8f0' : 'none',
  '&:hover': {
    backgroundColor: color === 'default' ? '#e2e8f0' : '#6d1620',
    transform: 'translateY(-2px)',
  },
}));

const ResetButton = styled(Button)({
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '14px',
  padding: '10px 20px',
  borderColor: '#e2e8f0',
  color: '#64748b',
  '&:hover': {
    borderColor: '#8B1D23',
    color: '#8B1D23',
    backgroundColor: 'rgba(139, 29, 35, 0.04)',
  },
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

// ========== Types & Data ==========
interface Problem {
  id: string;
  name: string;
  year: string;
  country: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  solutionsCount: number;
  userSubmitted: boolean;
}

const problemsData: Problem[] = [
  { id: "P001", name: "Divisibility Chain", year: "2026", country: "Palestine", difficulty: "Easy", topic: "Number Theory", solutionsCount: 1, userSubmitted: true },
  { id: "P002", name: "Infinite GCD Pairs", year: "2025", country: "International", difficulty: "Medium", topic: "Number Theory", solutionsCount: 0, userSubmitted: false },
  { id: "P003", name: "Triangle Inequality", year: "2024", country: "Egypt", difficulty: "Easy", topic: "Geometry", solutionsCount: 0, userSubmitted: false },
  { id: "P004", name: "Sequence Limit", year: "2025", country: "Jordan", difficulty: "Medium", topic: "Algebra", solutionsCount: 0, userSubmitted: false },
  { id: "P005", name: "Counting Paths", year: "2026", country: "Palestine", difficulty: "Hard", topic: "Combinatorics", solutionsCount: 1, userSubmitted: true },
  { id: "P006", name: "Circle Inversion", year: "2023", country: "International", difficulty: "Hard", topic: "Geometry", solutionsCount: 1, userSubmitted: false },
  { id: "P007", name: "Functional Equation", year: "2024", country: "Egypt", difficulty: "Hard", topic: "Algebra", solutionsCount: 0, userSubmitted: false },
  { id: "P008", name: "Pigeonhole Principle", year: "2025", country: "Palestine", difficulty: "Easy", topic: "Combinatorics", solutionsCount: 0, userSubmitted: false },
  { id: "P009", name: "Quadratic Residues", year: "2026", country: "Jordan", difficulty: "Medium", topic: "Number Theory", solutionsCount: 0, userSubmitted: true },
];

const getUniqueValues = <K extends keyof Problem>(key: K): string[] => {
  const values = problemsData.map(p => p[key]).filter(v => v !== undefined && v !== null);
  return [...new Set(values.map(v => String(v)))].sort();
};

const allYears = getUniqueValues('year');
const allCountries = getUniqueValues('country');
const allTopics = getUniqueValues('topic');

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy': return { bg: '#dcfce7', text: '#166534' };
    case 'Medium': return { bg: '#fef3c7', text: '#92400e' };
    case 'Hard': return { bg: '#fee2e2', text: '#991b1b' };
    default: return { bg: '#f1f5f9', text: '#475569' };
  }
};

const columns = [
  { id: 'id', label: 'ID' },
  { id: 'name', label: 'Problem Name' },
  { id: 'year', label: 'Year' },
  { id: 'country', label: 'Country' },
  {
    id: 'difficulty',
    label: 'Difficulty',
    render: (row: Problem) => {
      const diffColor = getDifficultyColor(row.difficulty);
      return (
        <Box sx={{ display: 'inline-block', padding: '4px 10px', borderRadius: '6px', backgroundColor: diffColor.bg, color: diffColor.text, fontSize: '12px', fontWeight: 600 }}>
          {row.difficulty}
        </Box>
      );
    },
  },
  { id: 'topic', label: 'Topic' },
  {
    id: 'solutionsCount',
    label: 'Solutions',
    render: (row: Problem) => (
      <Box sx={{ color: row.solutionsCount > 0 ? '#8B1D23' : '#94a3b8', fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
        {row.solutionsCount > 0 ? `🔗 ${row.solutionsCount}` : '—'}
      </Box>
    ),
  },
];

// ========== Component ==========
export const StudentProblemsPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');

  const filteredData = useMemo(() => {
    let filtered = [...problemsData];
    if (selectedYear !== 'All') filtered = filtered.filter(p => p.year === selectedYear);
    if (selectedCountry !== 'All') filtered = filtered.filter(p => p.country === selectedCountry);
    if (selectedTopic !== 'All') filtered = filtered.filter(p => p.topic === selectedTopic);
    return filtered;
  }, [selectedYear, selectedCountry, selectedTopic]);

  const resetFilters = () => {
    setSelectedYear('All');
    setSelectedCountry('All');
    setSelectedTopic('All');
  };

  const stats = {
    totalProblems: filteredData.length,
    easyCount: filteredData.filter(p => p.difficulty === 'Easy').length,
    mediumCount: filteredData.filter(p => p.difficulty === 'Medium').length,
    hardCount: filteredData.filter(p => p.difficulty === 'Hard').length,
  };

  return (
    <PageContainer>
      <HeaderSection>
        <TitleBox>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: '12px', backgroundColor: 'rgba(139, 29, 35, 0.1)' }}>
            <BookOpen size={24} color="#8B1D23" />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>
              Problem Archive
            </Typography>
            <Typography sx={{ fontSize: '13px', color: '#64748b', fontWeight: 500, marginTop: '4px' }}>
              Browse all olympiad problems
            </Typography>
          </Box>
        </TitleBox>
      </HeaderSection>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <StatsCard>
            <Box sx={{ fontSize: '24px' }}>📊</Box>
            <Box>
              <Typography sx={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Total</Typography>
              <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>{stats.totalProblems}</Typography>
            </Box>
          </StatsCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatsCard sx={{ borderLeft: '4px solid #16a34a' }}>
            <Box sx={{ fontSize: '24px' }}>✅</Box>
            <Box>
              <Typography sx={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Easy</Typography>
              <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#16a34a' }}>{stats.easyCount}</Typography>
            </Box>
          </StatsCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatsCard sx={{ borderLeft: '4px solid #ea580c' }}>
            <Box sx={{ fontSize: '24px' }}>⚡</Box>
            <Box>
              <Typography sx={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Medium</Typography>
              <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#ea580c' }}>{stats.mediumCount}</Typography>
            </Box>
          </StatsCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatsCard sx={{ borderLeft: '4px solid #dc2626' }}>
            <Box sx={{ fontSize: '24px' }}>🔥</Box>
            <Box>
              <Typography sx={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Hard</Typography>
              <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#dc2626' }}>{stats.hardCount}</Typography>
            </Box>
          </StatsCard>
        </Grid>
      </Grid>

      <FilterCard>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <FilterGroup>
              <FilterLabel><Calendar size={16} color="#8B1D23" /> Year</FilterLabel>
              <FilterChipsStack>
                <StyledChip label="All" onClick={() => setSelectedYear('All')} color={selectedYear === 'All' ? 'primary' : 'default'} size="small" />
                {allYears.map(year => <StyledChip key={year} label={year} onClick={() => setSelectedYear(year)} color={selectedYear === year ? 'primary' : 'default'} size="small" />)}
              </FilterChipsStack>
            </FilterGroup>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FilterGroup>
              <FilterLabel><Globe size={16} color="#8B1D23" /> Country</FilterLabel>
              <FilterChipsStack>
                <StyledChip label="All" onClick={() => setSelectedCountry('All')} color={selectedCountry === 'All' ? 'primary' : 'default'} size="small" />
                {allCountries.map(country => <StyledChip key={country} label={country} onClick={() => setSelectedCountry(country)} color={selectedCountry === country ? 'primary' : 'default'} size="small" />)}
              </FilterChipsStack>
            </FilterGroup>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FilterGroup>
              <FilterLabel><Tag size={16} color="#8B1D23" /> Topic</FilterLabel>
              <FilterChipsStack>
                <StyledChip label="All" onClick={() => setSelectedTopic('All')} color={selectedTopic === 'All' ? 'primary' : 'default'} size="small" />
                {allTopics.map(topic => <StyledChip key={topic} label={topic} onClick={() => setSelectedTopic(topic)} color={selectedTopic === topic ? 'primary' : 'default'} size="small" />)}
              </FilterChipsStack>
            </FilterGroup>
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <ResetButton variant="outlined" onClick={resetFilters} startIcon={<RotateCcw size={16} />} fullWidth>Reset Filters</ResetButton>
          </Grid>
        </Grid>
      </FilterCard>

      <SharedTable
        title="All Problems"
        data={filteredData}
        columns={columns}
        searchPlaceholder="Search by problem name or ID..."
        onRowSelect={(selectedIds) => console.log('Selected rows:', selectedIds)}
      />
    </PageContainer>
  );
};

export default StudentProblemsPage;