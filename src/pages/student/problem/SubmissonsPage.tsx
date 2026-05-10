import React, { useState, useMemo } from 'react';
import {
  Box, Chip, Stack, Typography, Paper, Grid, TextField, InputAdornment,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Calendar, Globe, Tag, RotateCcw, BookOpen, TrendingUp,
  Search, Filter, Trophy, Target, Flame, CheckCircle2, Clock,
  ChevronDown, BarChart3, Award, Zap, ArrowUpRight, Eye,
} from 'lucide-react';
import { SharedTable } from '../../../components/ui/table/studentTable';
import { Button } from '../../../components/ui/button/Button';

// Animations
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Styled Components
const PageContainer = styled(Box)({
  padding: '0',
  animation: `${fadeIn} 0.5s ease-out`,
});

const WelcomeBanner = styled(Box)({
  background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
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
    background: 'radial-gradient(circle, rgba(139,29,35,0.3) 0%, transparent 70%)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-40%',
    left: '20%',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
  },
});

const StatsCard = styled(Box)<{ delay?: number }>(({ delay = 0 }) => ({
  padding: '20px',
  backgroundColor: '#fff',
  borderRadius: '16px',
  border: '1px solid #e5e7eb',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  animation: `${fadeInUp} 0.5s ease-out ${delay}ms both`,
  '&:hover': {
    boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
    transform: 'translateY(-4px)',
  },
}));

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

const StatusBadge = styled(Box)<{ submitted: boolean }>(({ submitted }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 14px',
  borderRadius: '10px',
  fontSize: '12px',
  fontWeight: 700,
  ...(submitted ? {
    backgroundColor: '#ecfdf5',
    color: '#059669',
    border: '1px solid #a7f3d0',
  } : {
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
  { id: "P002", name: "Infinite GCD Pairs", year: "2025", country: "International", difficulty: "Medium", topic: "Number Theory", solutionsCount: 0, userSubmitted: false },
  { id: "P003", name: "Triangle Inequality", year: "2024", country: "Egypt", difficulty: "Easy", topic: "Geometry", solutionsCount: 0, userSubmitted: false },
  { id: "P004", name: "Sequence Limit", year: "2025", country: "Jordan", difficulty: "Medium", topic: "Algebra", solutionsCount: 0, userSubmitted: false },
  { id: "P005", name: "Counting Paths", year: "2026", country: "Palestine", difficulty: "Hard", topic: "Combinatorics", solutionsCount: 1, userSubmitted: true, grade: 78, maxGrade: 100, submittedDate: "2026-02-05" },
  { id: "P006", name: "Circle Inversion", year: "2023", country: "International", difficulty: "Hard", topic: "Geometry", solutionsCount: 1, userSubmitted: false },
  { id: "P007", name: "Functional Equation", year: "2024", country: "Egypt", difficulty: "Hard", topic: "Algebra", solutionsCount: 0, userSubmitted: false },
  { id: "P008", name: "Pigeonhole Principle", year: "2025", country: "Palestine", difficulty: "Easy", topic: "Combinatorics", solutionsCount: 0, userSubmitted: false },
  { id: "P009", name: "Quadratic Residues", year: "2026", country: "Jordan", difficulty: "Medium", topic: "Number Theory", solutionsCount: 1, userSubmitted: true, grade: 88, maxGrade: 100, submittedDate: "2026-02-10" },
  { id: "P010", name: "Modular Arithmetic", year: "2026", country: "Palestine", difficulty: "Easy", topic: "Number Theory", solutionsCount: 1, userSubmitted: true, grade: 100, maxGrade: 100, submittedDate: "2026-02-12" },
  { id: "P011", name: "Graph Coloring", year: "2025", country: "Jordan", difficulty: "Hard", topic: "Graph Theory", solutionsCount: 1, userSubmitted: true, grade: 65, maxGrade: 100, submittedDate: "2026-01-28" },
];

const submissionsData = allProblemsData.filter(p => p.userSubmitted === true);

const getUniqueValues = <K extends keyof Problem>(key: K): string[] => {
  const values = submissionsData.map(p => p[key]).filter(v => v !== undefined && v !== null);
  return [...new Set(values.map(v => String(v)))].sort();
};

const allYears = getUniqueValues('year');
const allCountries = getUniqueValues('country');
const allTopics = getUniqueValues('topic');

const getGradeColor = (grade: number) => {
  if (grade >= 90) return '#059669';
  if (grade >= 70) return '#d97706';
  return '#dc2626';
};

export const StudentSubmissionsPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const hasActiveFilters = selectedYear !== 'All' || selectedCountry !== 'All' || selectedTopic !== 'All';

  const filteredData = useMemo(() => {
    let filtered = [...submissionsData];
    if (selectedYear !== 'All') filtered = filtered.filter(p => p.year === selectedYear);
    if (selectedCountry !== 'All') filtered = filtered.filter(p => p.country === selectedCountry);
    if (selectedTopic !== 'All') filtered = filtered.filter(p => p.topic === selectedTopic);
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [selectedYear, selectedCountry, selectedTopic, searchQuery]);

  const resetFilters = () => {
    setSelectedYear('All');
    setSelectedCountry('All');
    setSelectedTopic('All');
    setSearchQuery('');
  };

  const stats = {
    totalSubmitted: submissionsData.length,
    totalGraded: submissionsData.filter(p => p.grade !== undefined).length,
    averageGrade: Math.round(submissionsData.reduce((sum, p) => sum + (p.grade || 0), 0) / submissionsData.filter(p => p.grade).length),
    easyCount: submissionsData.filter(p => p.difficulty === 'Easy').length,
    mediumCount: submissionsData.filter(p => p.difficulty === 'Medium').length,
    hardCount: submissionsData.filter(p => p.difficulty === 'Hard').length,
    perfectScores: submissionsData.filter(p => p.grade === 100).length,
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
        <Box>
          <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '14px' }}>
            {row.name}
          </Typography>
          {row.submittedDate && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
              <Clock size={11} color="#94a3b8" />
              <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '11px' }}>
                {new Date(row.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Typography>
            </Box>
          )}
        </Box>
      ),
    },
    {
      id: 'year',
      label: 'Year',
      render: (row: Problem) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Calendar size={13} color="#94a3b8" />
          <Typography sx={{ fontWeight: 600, color: '#475569', fontSize: '13px' }}>{row.year}</Typography>
        </Box>
      ),
    },
    {
      id: 'country',
      label: 'Country',
      render: (row: Problem) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Globe size={13} color="#94a3b8" />
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
      id: 'grade',
      label: 'Grade',
      render: (row: Problem) => (
        row.grade !== undefined ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontWeight: 800, color: getGradeColor(row.grade), fontSize: '16px' }}>
              {row.grade}
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '12px' }}>
              / {row.maxGrade}
            </Typography>
            {row.grade === 100 && <Award size={14} color="#059669" fill="#059669" />}
          </Box>
        ) : (
          <Typography sx={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>
            Pending
          </Typography>
        )
      ),
    },
    {
      id: 'status',
      label: 'Status',
      render: (row: Problem) => (
        <StatusBadge submitted={row.solutionsCount > 0}>
          {row.solutionsCount > 0 ? <CheckCircle2 size={12} /> : <Clock size={12} />}
          {row.solutionsCount > 0 ? 'Submitted' : 'Draft'}
        </StatusBadge>
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
                  background: 'linear-gradient(135deg, rgba(139,29,35,0.8), rgba(220,38,38,0.8))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                }}
              >
                <BookOpen size={28} color="#fff" />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.5px' }}>
                  My Submissions
                </Typography>
                <Typography sx={{ opacity: 0.8, fontWeight: 500, fontSize: '14px' }}>
                  Track your problem solutions and grades across all contests
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ textAlign: 'center', p: 1.5, px: 2.5, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '24px', lineHeight: 1 }}>
                  {stats.totalSubmitted}
                </Typography>
                <Typography sx={{ fontSize: '11px', opacity: 0.8, fontWeight: 600, textTransform: 'uppercase' }}>
                  Submitted
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', p: 1.5, px: 2.5, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '24px', lineHeight: 1 }}>
                  {stats.averageGrade}%
                </Typography>
                <Typography sx={{ fontSize: '11px', opacity: 0.8, fontWeight: 600, textTransform: 'uppercase' }}>
                  Avg Grade
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', p: 1.5, px: 2.5, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '24px', lineHeight: 1 }}>
                  {stats.perfectScores}
                </Typography>
                <Typography sx={{ fontSize: '11px', opacity: 0.8, fontWeight: 600, textTransform: 'uppercase' }}>
                  Perfect
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </WelcomeBanner>

      {/* Stats Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={4} md={2}>
          <StatsCard delay={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
              <BarChart3 size={22} color="#8B1D23" />
            </Box>
            <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>
              {stats.totalSubmitted}
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, mt: 0.5 }}>
              Total Submitted
            </Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatsCard delay={50}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
              <CheckCircle2 size={22} color="#059669" />
            </Box>
            <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>
              {stats.totalGraded}
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, mt: 0.5 }}>
              Graded
            </Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatsCard delay={100}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
              <Zap size={22} color="#059669" />
            </Box>
            <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#059669', lineHeight: 1 }}>
              {stats.easyCount}
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, mt: 0.5 }}>
              Easy
            </Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatsCard delay={150}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
              <Target size={22} color="#d97706" />
            </Box>
            <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#d97706', lineHeight: 1 }}>
              {stats.mediumCount}
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, mt: 0.5 }}>
              Medium
            </Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatsCard delay={200}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
              <Flame size={22} color="#dc2626" />
            </Box>
            <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#dc2626', lineHeight: 1 }}>
              {stats.hardCount}
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, mt: 0.5 }}>
              Hard
            </Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatsCard delay={250}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
              <Award size={22} color="#7c3aed" />
            </Box>
            <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#7c3aed', lineHeight: 1 }}>
              {stats.perfectScores}
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, mt: 0.5 }}>
              Perfect
            </Typography>
          </StatsCard>
        </Grid>
      </Grid>

      {/* Filter Section */}
      <FilterCard elevation={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Filter size={18} color="#64748b" />
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
            >
              Reset All
            </Button>
          )}
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
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
          <Grid item xs={12} sm={6} md={4}>
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
          <Grid item xs={12} sm={6} md={4}>
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
                sx={{ bgcolor: '#fff', fontWeight: 600, fontSize: '11px' }}
              />
            )}
            {selectedCountry !== 'All' && (
              <Chip
                label={`Country: ${selectedCountry}`}
                size="small"
                onDelete={() => setSelectedCountry('All')}
                sx={{ bgcolor: '#fff', fontWeight: 600, fontSize: '11px' }}
              />
            )}
            {selectedTopic !== 'All' && (
              <Chip
                label={`Topic: ${selectedTopic}`}
                size="small"
                onDelete={() => setSelectedTopic('All')}
                sx={{ bgcolor: '#fff', fontWeight: 600, fontSize: '11px' }}
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

export default StudentSubmissionsPage;
