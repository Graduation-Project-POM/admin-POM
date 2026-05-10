import React, { useState, useMemo } from 'react';
import {
  Box, Chip, Stack, Typography, Paper, Grid,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Calendar, Globe, Tag, RotateCcw,
  Filter, Target, Flame, Zap, Library,
} from 'lucide-react';
import { SharedTable } from '../../../components/ui/table/studentTable';
import { Button } from '../../../components/ui/button/Button';

interface Problem {
  id: string;
  name: string;
  year: string;
  country: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  solutionsCount: number;
  userSubmitted: boolean;
  grade?: number;
  maxGrade?: number;
  submittedDate?: string;
}

const allProblemsData: Problem[] = [
  { id: "P001", name: "Divisibility Chain", year: "2026", country: "Palestine", difficulty: "Easy", topic: "Number Theory", solutionsCount: 1, userSubmitted: true, grade: 95, maxGrade: 100, submittedDate: "2026-02-01" },
  { id: "P002", name: "Infinite GCD Pairs", year: "2025", country: "Palestine", difficulty: "Medium", topic: "Number Theory", solutionsCount: 0, userSubmitted: false },
  { id: "P003", name: "Triangle Inequality", year: "2024", country: "Egypt", difficulty: "Easy", topic: "Geometry", solutionsCount: 0, userSubmitted: false },
  { id: "P004", name: "Sequence Limit", year: "2025", country: "Jordan", difficulty: "Medium", topic: "Algebra", solutionsCount: 0, userSubmitted: false },
  { id: "P005", name: "Counting Paths", year: "2026", country: "Palestine", difficulty: "Hard", topic: "Combinatorics", solutionsCount: 1, userSubmitted: true, grade: 78, maxGrade: 100, submittedDate: "2026-02-05" },
  { id: "P006", name: "Circle Inversion", year: "2023", country: "Palestine", difficulty: "Hard", topic: "Geometry", solutionsCount: 1, userSubmitted: false },
  { id: "P007", name: "Functional Equation", year: "2024", country: "Egypt", difficulty: "Hard", topic: "Algebra", solutionsCount: 0, userSubmitted: false },
  { id: "P008", name: "Pigeonhole Principle", year: "2025", country: "Palestine", difficulty: "Easy", topic: "Combinatorics", solutionsCount: 0, userSubmitted: false },
  { id: "P009", name: "Quadratic Residues", year: "2026", country: "Jordan", difficulty: "Medium", topic: "Number Theory", solutionsCount: 1, userSubmitted: true, grade: 88, maxGrade: 100, submittedDate: "2026-02-10" },
  { id: "P010", name: "Modular Arithmetic", year: "2026", country: "Palestine", difficulty: "Easy", topic: "Number Theory", solutionsCount: 1, userSubmitted: true, grade: 100, maxGrade: 100, submittedDate: "2026-02-12" },
  { id: "P011", name: "Graph Coloring", year: "2025", country: "Jordan", difficulty: "Hard", topic: "Graph Theory", solutionsCount: 1, userSubmitted: true, grade: 65, maxGrade: 100, submittedDate: "2026-01-28" },
];

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const PageContainer = styled(Box)({
  padding: '0',
  animation: `${fadeIn} 0.5s ease-out`,
});

const WelcomeBanner = styled(Box)({
  background: 'linear-gradient(135deg, #8B1D23 0%, #6B141A 50%, #4A0E12 100%)',
  borderRadius: '20px',
  padding: '32px',
  color: '#fff',
  position: 'relative',
  overflow: 'hidden',
  marginBottom: '32px',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-10%',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,29,35,0.4) 0%, transparent 70%)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-40%',
    left: '20%',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
  },
});

const FilterCard = styled(Paper)({
  padding: '28px',
  marginBottom: '28px',
  border: '1px solid #e5e7eb',
  borderRadius: '20px',
  backgroundColor: '#ffffff',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  animation: `${fadeInUp} 0.5s ease-out 200ms both`,
});

const FilterGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

const FilterLabel = styled(Typography)({
  fontWeight: 700,
  fontSize: '12px',
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '1px',
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

const StyledChip = styled(Chip)<{ active?: boolean }>(({ active }) => ({
  borderRadius: '10px',
  fontWeight: active ? 700 : 500,
  fontSize: '13px',
  height: '36px',
  cursor: 'pointer',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundColor: active ? '#8B1D23' : '#f8fafc',
  color: active ? '#ffffff' : '#64748b',
  border: active ? 'none' : '1px solid #e2e8f0',
  boxShadow: active ? '0 4px 12px rgba(139, 29, 35, 0.25)' : 'none',
  '&:hover': {
    backgroundColor: active ? '#6d1620' : '#f1f5f9',
    transform: 'translateY(-2px)',
    boxShadow: active ? '0 6px 16px rgba(139, 29, 35, 0.35)' : '0 4px 12px rgba(0,0,0,0.06)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}));

const DifficultyBadge = styled(Box)<{ difficulty: string }>(({ difficulty }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 14px',
  borderRadius: '10px',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.3px',
  ...(difficulty === 'Easy' && {
    backgroundColor: '#ecfdf5',
    color: '#059669',
    border: '1px solid #a7f3d0',
  }),
  ...(difficulty === 'Medium' && {
    backgroundColor: '#fffbeb',
    color: '#d97706',
    border: '1px solid #fde68a',
  }),
  ...(difficulty === 'Hard' && {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
  }),
}));

const ActiveFiltersBar = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 20px',
  backgroundColor: '#fef2f2',
  borderRadius: '12px',
  border: '1px solid #fecaca',
  marginBottom: '20px',
  animation: `${fadeIn} 0.3s ease-out`,
});

const TableSection = styled(Box)({
  animation: `${fadeInUp} 0.5s ease-out 300ms both`,
});

const getUniqueValues = <K extends keyof Problem>(key: K): string[] => {
  const values = allProblemsData.map(p => p[key]).filter(v => v !== undefined && v !== null);
  return [...new Set(values.map(v => String(v)))].sort();
};

const allYears = getUniqueValues('year');
const allCountries = getUniqueValues('country');
const allTopics = getUniqueValues('topic');

export const ProblemBank: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');

  const hasActiveFilters = selectedYear !== 'All' || selectedCountry !== 'All' || selectedTopic !== 'All';

  const filteredData = useMemo(() => {
    let filtered = [...allProblemsData];
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

  const columns = [
    {
      id: 'id',
      label: 'ID',
      render: (row: Problem) => (
        <Typography sx={{ fontWeight: 700, color: '#8B1D23', fontSize: '13px', fontFamily: 'monospace' }}>
          {row.id}
        </Typography>
      ),
    },
    {
      id: 'name',
      label: 'Problem Name',
      render: (row: Problem) => (
        <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '14px' }}>
          {row.name}
        </Typography>
      ),
    },
    {
      id: 'year',
      label: 'Year',
      render: (row: Problem) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Calendar size={13} color="#8B1D23" />
          <Typography sx={{ fontWeight: 600, color: '#475569', fontSize: '13px' }}>{row.year}</Typography>
        </Box>
      ),
    },
    {
      id: 'country',
      label: 'Country',
      render: (row: Problem) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Globe size={13} color="#8B1D23" />
          <Typography sx={{ fontWeight: 600, color: '#475569', fontSize: '13px' }}>{row.country}</Typography>
        </Box>
      ),
    },
    {
      id: 'difficulty',
      label: 'Difficulty',
      render: (row: Problem) => (
        <DifficultyBadge difficulty={row.difficulty}>
          {row.difficulty === 'Easy' && <Zap size={12} />}
          {row.difficulty === 'Medium' && <Target size={12} />}
          {row.difficulty === 'Hard' && <Flame size={12} />}
          {row.difficulty}
        </DifficultyBadge>
      ),
    },
    {
      id: 'topic',
      label: 'Topic',
      render: (row: Problem) => (
        <Chip
          label={row.topic}
          size="small"
          sx={{
            bgcolor: '#f1f5f9',
            color: '#475569',
            fontWeight: 600,
            fontSize: '11px',
            borderRadius: '8px',
          }}
        />
      ),
    },
    {
      id: 'action',
      label: 'Action',
      render: (row: Problem) => (
        <Button
          variantType={row.userSubmitted ? 'outline' : 'default'}
          size="small"
          sx={{ py: 0.5, px: 2, fontSize: '12px', '&:hover': {  color: 'white',backgroundColor: '#8B1D23'} }}
        >
          {row.userSubmitted ? 'Review Solution' : 'Solve'}
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      {/* Welcome Banner */}
      <WelcomeBanner>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #8B1D23, #6B141A)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(139,29,35,0.3)',
                }}
              >
                <Library size={28} color="#fff" />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.5px' }}>
                  Problem Bank
                </Typography>
                <Typography sx={{ opacity: 0.9, fontWeight: 500, fontSize: '14px' }}>
                  Explore and solve challenges to improve your skills
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ textAlign: 'center', p: 1.5, px: 2.5, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '24px', lineHeight: 1 }}>
                  {allProblemsData.length}
                </Typography>
                <Typography sx={{ fontSize: '11px', opacity: 0.9, fontWeight: 600, textTransform: 'uppercase' }}>
                  Total Problems
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </WelcomeBanner>

      {/* Filter Section */}
      <FilterCard elevation={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Filter size={18} color="#8B1D23" />
            </Box>
            <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '16px' }}>
              Filters
            </Typography>
          </Box>
          {hasActiveFilters && (
            <Button
              variantType="ghost"
              size="small"
              startIcon={<RotateCcw size={14} />}
              onClick={resetFilters}
              sx={{ color: '#8B1D23', '&:hover': { color: '#6B141A' } }}
            >
              Reset All
            </Button>
          )}
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FilterGroup>
              <FilterLabel>
                <Calendar size={14} color="#8B1D23" />
                Year
              </FilterLabel>
              <FilterChipsStack>
                <StyledChip
                  label="All"
                  onClick={() => setSelectedYear('All')}
                  active={selectedYear === 'All'}
                  size="small"
                />
                {allYears.map(year => (
                  <StyledChip
                    key={year}
                    label={year}
                    onClick={() => setSelectedYear(year)}
                    active={selectedYear === year}
                    size="small"
                  />
                ))}
              </FilterChipsStack>
            </FilterGroup>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FilterGroup>
              <FilterLabel>
                <Globe size={14} color="#8B1D23" />
                Country
              </FilterLabel>
              <FilterChipsStack>
                <StyledChip
                  label="All"
                  onClick={() => setSelectedCountry('All')}
                  active={selectedCountry === 'All'}
                  size="small"
                />
                {allCountries.map(country => (
                  <StyledChip
                    key={country}
                    label={country}
                    onClick={() => setSelectedCountry(country)}
                    active={selectedCountry === country}
                    size="small"
                  />
                ))}
              </FilterChipsStack>
            </FilterGroup>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FilterGroup>
              <FilterLabel>
                <Tag size={14} color="#8B1D23" />
                Topic
              </FilterLabel>
              <FilterChipsStack>
                <StyledChip
                  label="All"
                  onClick={() => setSelectedTopic('All')}
                  active={selectedTopic === 'All'}
                  size="small"
                />
                {allTopics.map(topic => (
                  <StyledChip
                    key={topic}
                    label={topic}
                    onClick={() => setSelectedTopic(topic)}
                    active={selectedTopic === topic}
                    size="small"
                  />
                ))}
              </FilterChipsStack>
            </FilterGroup>
          </Grid>
        </Grid>
      </FilterCard>

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <ActiveFiltersBar>
          <Filter size={16} color="#8B1D23" />
          <Typography sx={{ fontWeight: 600, color: '#8B1D23', fontSize: '13px' }}>
            Active filters:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
            {selectedYear !== 'All' && (
              <Chip
                label={`Year: ${selectedYear}`}
                size="small"
                onDelete={() => setSelectedYear('All')}
                sx={{ bgcolor: '#fff', fontWeight: 600, fontSize: '11px', color: '#8B1D23' }}
              />
            )}
            {selectedCountry !== 'All' && (
              <Chip
                label={`Country: ${selectedCountry}`}
                size="small"
                onDelete={() => setSelectedCountry('All')}
                sx={{ bgcolor: '#fff', fontWeight: 600, fontSize: '11px', color: '#8B1D23' }}
              />
            )}
            {selectedTopic !== 'All' && (
              <Chip
                label={`Topic: ${selectedTopic}`}
                size="small"
                onDelete={() => setSelectedTopic('All')}
                sx={{ bgcolor: '#fff', fontWeight: 600, fontSize: '11px', color: '#8B1D23' }}
              />
            )}
          </Box>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '12px', fontWeight: 600 }}>
            {filteredData.length} results
          </Typography>
        </ActiveFiltersBar>
      )}

      {/* Table Section */}
      <TableSection>
        <SharedTable
          data={filteredData}
          columns={columns}
          searchPlaceholder="Search by problem name or ID..."
        />
      </TableSection>
    </PageContainer>
  );
};

export default ProblemBank;