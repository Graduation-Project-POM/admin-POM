import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box, Chip, Stack, Typography, Paper, Grid, CircularProgress, Alert,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  RotateCcw, BookOpen, Filter, Target, Flame, CheckCircle2, Clock,
  BarChart3, Award, Zap, Tag,
} from 'lucide-react';
import { SharedTable } from '../../../components/ui/table/studentTable';
import { Button } from '../../../components/ui/button/Button';
import { getApiErrorMessage } from '../../../utils/apiError';
import {
  getMySubmissions,
  difficultyIdToLabel,
  type Submission,
  type DifficultyLabel,
} from '../../../services/problemService';

interface SubmissionRow {
  id: string;
  problemId: number;
  name: string;
  difficulty: DifficultyLabel;
  topic: string;
  grade: number | null;
  submittedAt: string;
}

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const PageContainer = styled(Box)({ padding: '0', animation: `${fadeIn} 0.5s ease-out` });

const WelcomeBanner = styled(Box)({
  background: 'linear-gradient(135deg, #8B1D23 0%, #6B141A 50%, #4A0E12 100%)',
  borderRadius: '20px',
  padding: '32px',
  color: '#fff',
  position: 'relative',
  overflow: 'hidden',
  marginBottom: '32px',
  '&::before': {
    content: '""', position: 'absolute', top: '-50%', right: '-10%',
    width: '300px', height: '300px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,29,35,0.4) 0%, transparent 70%)',
  },
});

const StatsCard = styled(Box)<{ delay?: number }>(({ delay = 0 }) => ({
  padding: '20px',
  backgroundColor: '#fff',
  borderRadius: '16px',
  border: '1px solid #e5e7eb',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  animation: `${fadeInUp} 0.5s ease-out ${delay}ms both`,
  '&:hover': { boxShadow: '0 12px 28px rgba(139,29,35,0.15)', transform: 'translateY(-4px)', borderColor: '#8B1D23' },
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

const FilterGroup = styled(Box)({ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' });
const FilterLabel = styled(Typography)({
  fontWeight: 700, fontSize: '12px', color: '#64748b', textTransform: 'uppercase',
  letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px',
});
const FilterChipsStack = styled(Stack)({ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '8px' });

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
  '&:hover': { backgroundColor: active ? '#6d1620' : '#f1f5f9' },
}));

const DifficultyBadge = styled(Box)<{ difficulty: string }>(({ difficulty }) => ({
  display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px',
  borderRadius: '10px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.3px',
  ...(difficulty === 'Easy' && { backgroundColor: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }),
  ...(difficulty === 'Medium' && { backgroundColor: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }),
  ...(difficulty === 'Hard' && { backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }),
}));

const TableSection = styled(Box)({ animation: `${fadeInUp} 0.5s ease-out 300ms both` });

const DIFFICULTIES: DifficultyLabel[] = ['Easy', 'Medium', 'Hard'];

const getGradeColor = (grade: number) => {
  if (grade >= 90) return '#059669';
  if (grade >= 70) return '#d97706';
  return '#dc2626';
};

export const MySubmissions: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSubmissions(await getMySubmissions());
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, t('student.submissions.loadError')));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const allTopics = useMemo(
    () => [...new Set(submissions.map((s) => s.problemTopic).filter(Boolean) as string[])].sort(),
    [submissions],
  );

  const rows: SubmissionRow[] = useMemo(
    () =>
      submissions
        .filter((s) => (selectedTopic === 'All' ? true : s.problemTopic === selectedTopic))
        .filter((s) =>
          selectedDifficulty === 'All' ? true : difficultyIdToLabel(s.problemDifficulty ?? 1) === selectedDifficulty,
        )
        .map((s) => ({
          id: String(s.problemId),
          problemId: s.problemId,
          name: s.problemTitle ?? `#${s.problemId}`,
          difficulty: difficultyIdToLabel(s.problemDifficulty ?? 1),
          topic: s.problemTopic ?? '—',
          grade: s.grade ?? null,
          submittedAt: s.submittedAt,
        })),
    [submissions, selectedTopic, selectedDifficulty],
  );

  const hasActiveFilters = selectedTopic !== 'All' || selectedDifficulty !== 'All';
  const resetFilters = () => {
    setSelectedTopic('All');
    setSelectedDifficulty('All');
  };

  const stats = useMemo(() => {
    const graded = submissions.filter((s) => s.grade != null);
    const avg = graded.length
      ? Math.round(graded.reduce((sum, s) => sum + (s.grade ?? 0), 0) / graded.length)
      : 0;
    return {
      totalSubmitted: submissions.length,
      totalGraded: graded.length,
      averageGrade: avg,
      perfectScores: submissions.filter((s) => s.grade === 100).length,
    };
  }, [submissions]);

  const columns = [
    {
      id: 'name',
      label: t('student.submissions.columns.problemName'),
      render: (row: SubmissionRow) => (
        <Box>
          <Typography
            onClick={() => navigate(`/student/problems/${row.problemId}`)}
            sx={{ fontWeight: 700, color: '#8B1D23', fontSize: '14px', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          >
            {row.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
            <Clock size={11} color="#94a3b8" />
            <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '11px' }}>
              {new Date(row.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'difficulty',
      label: t('student.submissions.columns.difficulty'),
      render: (row: SubmissionRow) => (
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
      render: (row: SubmissionRow) => (
        <Chip label={row.topic} size="small" sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 600, fontSize: '11px', borderRadius: '8px' }} />
      ),
    },
    {
      id: 'grade',
      label: t('student.submissions.columns.grade'),
      render: (row: SubmissionRow) =>
        row.grade != null ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontWeight: 800, color: getGradeColor(row.grade), fontSize: '16px' }}>{row.grade}</Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '12px' }}>/ 100</Typography>
            {row.grade === 100 && <Award size={14} color="#059669" />}
          </Box>
        ) : (
          <Typography sx={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>
            {t('student.submissions.pending')}
          </Typography>
        ),
    },
    {
      id: 'status',
      label: t('student.submissions.columns.status'),
      render: (row: SubmissionRow) => (
        <Chip
          icon={row.grade != null ? <CheckCircle2 size={12} /> : <Clock size={12} />}
          label={row.grade != null ? t('student.submissions.graded') : t('student.submissions.statusSubmitted')}
          size="small"
          sx={{
            fontWeight: 700,
            fontSize: '11px',
            bgcolor: row.grade != null ? '#ecfdf5' : '#fff7e0',
            color: row.grade != null ? '#059669' : '#92400e',
          }}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <WelcomeBanner>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <Box sx={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #8B1D23, #6B141A)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(139,29,35,0.3)' }}>
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
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ textAlign: 'center', p: 1.5, px: 2.5, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '24px', lineHeight: 1 }}>{stats.totalSubmitted}</Typography>
                <Typography sx={{ fontSize: '11px', opacity: 0.9, fontWeight: 600, textTransform: 'uppercase' }}>{t('student.submissions.submitted')}</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', p: 1.5, px: 2.5, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '24px', lineHeight: 1 }}>{stats.averageGrade}%</Typography>
                <Typography sx={{ fontSize: '11px', opacity: 0.9, fontWeight: 600, textTransform: 'uppercase' }}>{t('student.submissions.avgGrade')}</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', p: 1.5, px: 2.5, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '24px', lineHeight: 1 }}>{stats.perfectScores}</Typography>
                <Typography sx={{ fontSize: '11px', opacity: 0.9, fontWeight: 600, textTransform: 'uppercase' }}>{t('student.submissions.perfect')}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </WelcomeBanner>

      {/* Stats Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard delay={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
              <BarChart3 size={22} color="#8B1D23" />
            </Box>
            <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>{stats.totalSubmitted}</Typography>
            <Typography sx={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, mt: 0.5 }}>{t('student.submissions.totalSubmitted')}</Typography>
          </StatsCard>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard delay={50}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
              <CheckCircle2 size={22} color="#059669" />
            </Box>
            <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>{stats.totalGraded}</Typography>
            <Typography sx={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, mt: 0.5 }}>{t('student.submissions.graded')}</Typography>
          </StatsCard>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard delay={100}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
              <Target size={22} color="#d97706" />
            </Box>
            <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#d97706', lineHeight: 1 }}>{stats.averageGrade}%</Typography>
            <Typography sx={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, mt: 0.5 }}>{t('student.submissions.avgGrade')}</Typography>
          </StatsCard>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard delay={150}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
              <Award size={22} color="#7c3aed" />
            </Box>
            <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#7c3aed', lineHeight: 1 }}>{stats.perfectScores}</Typography>
            <Typography sx={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, mt: 0.5 }}>{t('student.submissions.perfect')}</Typography>
          </StatsCard>
        </Grid>
      </Grid>

      {/* Filters */}
      <FilterCard elevation={0}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 5, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Filter size={18} color="#8B1D23" />
            </Box>
            <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '16px' }}>{t('student.submissions.filters')}</Typography>
          </Box>
          {hasActiveFilters && (
            <Button variantType="ghost" size="small" startIcon={<RotateCcw size={14} />} onClick={resetFilters} sx={{ color: '#8B1D23' }}>
              {t('student.submissions.resetAll')}
            </Button>
          )}
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FilterGroup>
              <FilterLabel><Target size={14} color="#8B1D23" />{t('student.submissions.columns.difficulty')}</FilterLabel>
              <FilterChipsStack>
                <StyledChip label={t('common.all')} onClick={() => setSelectedDifficulty('All')} active={selectedDifficulty === 'All'} size="small" />
                {DIFFICULTIES.map((d) => (
                  <StyledChip key={d} label={d} onClick={() => setSelectedDifficulty(d)} active={selectedDifficulty === d} size="small" />
                ))}
              </FilterChipsStack>
            </FilterGroup>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FilterGroup>
              <FilterLabel><Tag size={14} color="#8B1D23" />{t('student.submissions.topic')}</FilterLabel>
              <FilterChipsStack>
                <StyledChip label={t('common.all')} onClick={() => setSelectedTopic('All')} active={selectedTopic === 'All'} size="small" />
                {allTopics.map((topic) => (
                  <StyledChip key={topic} label={topic} onClick={() => setSelectedTopic(topic)} active={selectedTopic === topic} size="small" />
                ))}
              </FilterChipsStack>
            </FilterGroup>
          </Grid>
        </Grid>
      </FilterCard>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress sx={{ color: '#8B1D23' }} />
        </Box>
      ) : (
        <TableSection>
          <SharedTable data={rows} columns={columns} searchPlaceholder={t('student.submissions.searchPlaceholder')} />
        </TableSection>
      )}
    </PageContainer>
  );
};

export default MySubmissions;
