import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box, Chip, Stack, Typography, Paper, Grid,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Calendar, RotateCcw, BookOpen,
  Filter, Target, Flame, CheckCircle2, Clock,
  BarChart3, Award, Zap, Tag,
} from 'lucide-react';
import { SharedTable } from '../../../components/ui/table/studentTable';
import { Button } from '../../../components/ui/button/Button';

interface Problem {
  id: string;
  name: string;
  year: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  solutionsCount: number;
  userSubmitted: boolean;
  grade?: number;
  maxGrade?: number;
  submittedDate?: string;
}

const allProblemsData: Problem[] = [
  { id: "P001", name: "Divisibility Chain", year: "2026", difficulty: "Easy", topic: "Number Theory", solutionsCount: 1, userSubmitted: true, grade: 95, maxGrade: 100, submittedDate: "2026-02-01" },
  { id: "P002", name: "Infinite GCD Pairs", year: "2025", difficulty: "Medium", topic: "Number Theory", solutionsCount: 0, userSubmitted: false },
  { id: "P003", name: "Triangle Inequality", year: "2024", difficulty: "Easy", topic: "Geometry", solutionsCount: 0, userSubmitted: false },
  { id: "P004", name: "Sequence Limit", year: "2025", difficulty: "Medium", topic: "Algebra", solutionsCount: 0, userSubmitted: false },
  { id: "P005", name: "Counting Paths", year: "2022", difficulty: "Hard", topic: "Combinatorics", solutionsCount: 1, userSubmitted: true, grade: 78, maxGrade: 100, submittedDate: "2026-02-05" },
  { id: "P006", name: "Circle Inversion", year: "2023", difficulty: "Hard", topic: "Geometry", solutionsCount: 1, userSubmitted: false },
  { id: "P007", name: "Functional Equation", year: "2024", difficulty: "Hard", topic: "Algebra", solutionsCount: 0, userSubmitted: false },
  { id: "P008", name: "Pigeonhole Principle", year: "2025", difficulty: "Easy", topic: "Combinatorics", solutionsCount: 0, userSubmitted: false },
  { id: "P009", name: "Quadratic Residues", year: "2026", difficulty: "Medium", topic: "Number Theory", solutionsCount: 1, userSubmitted: true, grade: 88, maxGrade: 100, submittedDate: "2026-02-10" },
  { id: "P010", name: "Modular Arithmetic", year: "2024", difficulty: "Easy", topic: "Number Theory", solutionsCount: 1, userSubmitted: true, grade: 100, maxGrade: 100, submittedDate: "2026-02-12" },
  { id: "P011", name: "Graph Coloring", year: "2025", difficulty: "Hard", topic: "Graph Theory", solutionsCount: 1, userSubmitted: true, grade: 65, maxGrade: 100, submittedDate: "2026-01-28" },
];

// Animations
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Styled Components
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

const StatsCard = styled(Box)<{ delay?: number }>(({ delay = 0 }) => ({
  padding: '20px',
  backgroundColor: '#fff',
  borderRadius: '16px',
  border: '1px solid #e5e7eb',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  animation: `${fadeInUp} 0.5s ease-out ${delay}ms both`,
  '&:hover': {
    boxShadow: '0 12px 28px rgba(139,29,35,0.15)',
    transform: 'translateY(-4px)',
    borderColor: '#8B1D23',
  },
}));

const FilterCard = styled(Paper)({
  padding: '18px',
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
  alignItems: 'flex-start',
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

const submissionsData = allProblemsData.filter(p => p.userSubmitted === true);

const getUniqueYears = (): string[] => {
  const years = submissionsData.map(p => p.year).filter(v => v !== undefined && v !== null);
  return [...new Set(years)].sort();
};

const getUniqueTopics = (): string[] => {
  const topics = submissionsData.map(p => p.topic).filter(v => v !== undefined && v !== null);
  return [...new Set(topics)].sort();
};

const allYears = getUniqueYears();
const allTopics = getUniqueTopics();

const getGradeColor = (grade: number) => {
  if (grade >= 90) return '#059669';
  if (grade >= 70) return '#d97706';
  return '#dc2626';
};

export const MySubmissions: React.FC = () => {
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');

  const hasActiveFilters = selectedYear !== 'All' || selectedTopic !== 'All';

  const filteredData = useMemo(() => {
    let filtered = [...submissionsData];
    if (selectedYear !== 'All') filtered = filtered.filter(p => p.year === selectedYear);
    if (selectedTopic !== 'All') filtered = filtered.filter(p => p.topic === selectedTopic);
    return filtered;
  }, [selectedYear, selectedTopic]);

  const resetFilters = () => {
    setSelectedYear('All');
    setSelectedTopic('All');
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
      label: t('student.submissions.columns.id'),
      render: (row: Problem) => (
        <Typography sx={{ fontWeight: 700, color: '#8B1D23', fontSize: '13px', fontFamily: 'monospace' }}>
          {row.id}
        </Typography>
      ),
    },
    {
      id: 'name',
      label: t('student.submissions.columns.problemName'),
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
      label: t('student.submissions.columns.year'),
      render: (row: Problem) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Calendar size={13} color="#8B1D23" />
          <Typography sx={{ fontWeight: 600, color: '#475569', fontSize: '13px' }}>{row.year}</Typography>
        </Box>
      ),
    },
    {
      id: 'difficulty',
      label: t('student.submissions.columns.difficulty'),
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
      label: t('student.submissions.columns.topic'),
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
      label: t('student.submissions.columns.grade'),
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
            {t('student.submissions.pending')}
          </Typography>
        )
      ),
    },
    {
      id: 'status',
      label: t('student.submissions.columns.status'),
      render: (row: Problem) => (
        <StatusBadge submitted={row.solutionsCount > 0}>
          {row.solutionsCount > 0 ? <CheckCircle2 size={12} /> : <Clock size={12} />}
          {row.solutionsCount > 0 ? t('student.submissions.statusSubmitted') : t('student.submissions.statusDraft')}
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
                  background: 'linear-gradient(135deg, #8B1D23, #6B141A)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(139,29,35,0.3)',
                }}
              >
                <BookOpen size={28} color="#fff" />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.5px' }}>
                  {t('student.submissions.title')}
                </Typography>
                <Typography sx={{ opacity: 0.9, fontWeight: 500, fontSize: '14px' }}>
                  {t('student.submissions.subtitle')}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ textAlign: 'center', p: 1.5, px: 2.5, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '24px', lineHeight: 1 }}>
                  {stats.totalSubmitted}
                </Typography>
                <Typography sx={{ fontSize: '11px', opacity: 0.9, fontWeight: 600, textTransform: 'uppercase' }}>
                  {t('student.submissions.submitted')}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', p: 1.5, px: 2.5, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '24px', lineHeight: 1 }}>
                  {stats.averageGrade}%
                </Typography>
                <Typography sx={{ fontSize: '11px', opacity: 0.9, fontWeight: 600, textTransform: 'uppercase' }}>
                  {t('student.submissions.avgGrade')}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', p: 1.5, px: 2.5, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '24px', lineHeight: 1 }}>
                  {stats.perfectScores}
                </Typography>
                <Typography sx={{ fontSize: '11px', opacity: 0.9, fontWeight: 600, textTransform: 'uppercase' }}>
                  {t('student.submissions.perfect')}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </WelcomeBanner>

      {/* Stats Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatsCard delay={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
              <BarChart3 size={22} color="#8B1D23" />
            </Box>
            <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>
              {stats.totalSubmitted}
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, mt: 0.5 }}>
              {t('student.submissions.totalSubmitted')}
            </Typography>
          </StatsCard>
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatsCard delay={50}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
              <CheckCircle2 size={22} color="#059669" />
            </Box>
            <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>
              {stats.totalGraded}
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, mt: 0.5 }}>
              {t('student.submissions.graded')}
            </Typography>
          </StatsCard>
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatsCard delay={100}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
              <Zap size={22} color="#059669" />
            </Box>
            <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#059669', lineHeight: 1 }}>
              {stats.easyCount}
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, mt: 0.5 }}>
              {t('student.submissions.easy')}
            </Typography>
          </StatsCard>
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatsCard delay={150}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
              <Target size={22} color="#d97706" />
            </Box>
            <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#d97706', lineHeight: 1 }}>
              {stats.mediumCount}
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, mt: 0.5 }}>
              {t('student.submissions.medium')}
            </Typography>
          </StatsCard>
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatsCard delay={200}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
              <Flame size={22} color="#dc2626" />
            </Box>
            <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#dc2626', lineHeight: 1 }}>
              {stats.hardCount}
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, mt: 0.5 }}>
              {t('student.submissions.hard')}
            </Typography>
          </StatsCard>
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatsCard delay={250}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
              <Award size={22} color="#7c3aed" />
            </Box>
            <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#7c3aed', lineHeight: 1 }}>
              {stats.perfectScores}
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, mt: 0.5 }}>
              {t('student.submissions.perfect')}
            </Typography>
          </StatsCard>
        </Grid>
      </Grid>

      {/* Filter Section - Year & Topic */}
      <FilterCard elevation={0}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Filter size={18} color="#8B1D23" />
            </Box>
            <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '16px' }}>
              {t('student.submissions.filters')}
            </Typography>
          </Box>
          {hasActiveFilters && (
            <Button
              variantType="ghost"
              size="small"
              startIcon={<RotateCcw size={14} />}
              onClick={resetFilters}
              sx={{ color: '#8B1D23', '&:hover': { color: '#6B141A' }, ml: 5}}
            >
              {t('student.submissions.resetAll')}
            </Button>
          )}
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FilterGroup>
              <FilterLabel>
                <Calendar size={14} color="#8B1D23" />
                {t('student.submissions.year')}
              </FilterLabel>
              <FilterChipsStack>
                <StyledChip
                  label={t('common.all')}
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
          <Grid size={{ xs: 12, md: 6 }}>
            <FilterGroup>
              <FilterLabel>
                <Tag size={14} color="#8B1D23" />
                {t('student.submissions.topic')}
              </FilterLabel>
              <FilterChipsStack>
                <StyledChip
                  label={t('common.all')}
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
            {t('student.submissions.activeFilters')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
            {selectedYear !== 'All' && (
              <Chip
                label={t('student.submissions.yearFilter', { value: selectedYear })}
                size="small"
                onDelete={() => setSelectedYear('All')}
                sx={{ bgcolor: '#fff', fontWeight: 600, fontSize: '11px', color: '#8B1D23' }}
              />
            )}
            {selectedTopic !== 'All' && (
              <Chip
                label={t('student.submissions.topicFilter', { value: selectedTopic })}
                size="small"
                onDelete={() => setSelectedTopic('All')}
                sx={{ bgcolor: '#fff', fontWeight: 600, fontSize: '11px', color: '#8B1D23' }}
              />
            )}
          </Box>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '12px', fontWeight: 600 }}>
            {t('student.submissions.results', { count: filteredData.length })}
          </Typography>
        </ActiveFiltersBar>
      )}

      {/* Table Section */}
      <TableSection>
        <SharedTable
          data={filteredData}
          columns={columns}
          searchPlaceholder={t('student.submissions.searchPlaceholder')}
        />
      </TableSection>
    </PageContainer>
  );
};

export default MySubmissions;