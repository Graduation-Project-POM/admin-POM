import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Chip,
  Stack,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Tag,
  RotateCcw,
  Filter,
  Target,
  Flame,
  Zap,
  Library,
  Gauge,
} from 'lucide-react';
import { SharedTable } from '../../../components/ui/table/studentTable';
import { Button } from '../../../components/ui/button/Button';
import { getApiErrorMessage } from '../../../utils/apiError';
import {
  getProblems,
  getMySubmissions,
  difficultyIdToLabel,
  type BackendProblem,
  type DifficultyLabel,
} from '../../../services/problemService';
import { SubmitSolutionModal } from './SubmitSolutionModal';
import { brand, neutral, statusTone } from '../../../theme';
import { ErrorState, LoadingState } from '../../../components/common/states';

interface ProblemRow {
  id: string;
  name: string;
  topic: string;
  difficulty: DifficultyLabel;
  raw: BackendProblem;
}

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
  background: `linear-gradient(135deg, ${brand[500]} 0%, ${brand[700]} 50%, ${brand[800]} 100%)`,
  borderRadius: '20px',
  padding: '32px',
  color: neutral[0],
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
});

const FilterCard = styled(Paper)({
  padding: '28px',
  marginBottom: '28px',
  border: `1px solid ${neutral[200]}`,
  borderRadius: '20px',
  backgroundColor: neutral[0],
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
  color: neutral[500],
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
  backgroundColor: active ? brand[500] : neutral[50],
  color: active ? neutral[0] : neutral[500],
  border: active ? 'none' : `1px solid ${neutral[200]}`,
  boxShadow: active ? '0 4px 12px rgba(139, 29, 35, 0.25)' : 'none',
  '&:hover': {
    backgroundColor: active ? brand[600] : neutral[100],
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
    backgroundColor: statusTone.success.bg,
    color: statusTone.success.solid,
    border: `1px solid ${statusTone.success.border}`,
  }),
  ...(difficulty === 'Medium' && {
    backgroundColor: statusTone.warning.bg,
    color: statusTone.warning.solid,
    border: `1px solid ${statusTone.warning.border}`,
  }),
  ...(difficulty === 'Hard' && {
    backgroundColor: '#fef2f2',
    color: statusTone.danger.solid,
    border: `1px solid ${statusTone.danger.border}`,
  }),
}));

const TableSection = styled(Box)({
  animation: `${fadeInUp} 0.5s ease-out 300ms both`,
});

const DIFFICULTIES: DifficultyLabel[] = ['Easy', 'Medium', 'Hard'];

export const ProblemBank: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [problems, setProblems] = useState<BackendProblem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [gradeByProblem, setGradeByProblem] = useState<Map<number, number | null>>(new Map());
  const [modalProblem, setModalProblem] = useState<BackendProblem | null>(null);

  const loadProblems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, mine] = await Promise.all([getProblems(), getMySubmissions()]);
      setProblems(data);
      setGradeByProblem(new Map(mine.map((s) => [s.problemId, s.grade ?? null])));
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, t('student.problems.loadError')));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadProblems();
  }, [loadProblems]);

  const allTopics = useMemo(
    () => [...new Set(problems.map((p) => p.topic).filter(Boolean))].sort(),
    [problems],
  );

  const rows: ProblemRow[] = useMemo(
    () =>
      problems
        .filter((p) => (selectedTopic === 'All' ? true : p.topic === selectedTopic))
        .filter((p) =>
          selectedDifficulty === 'All' ? true : difficultyIdToLabel(p.difficulty) === selectedDifficulty,
        )
        .map((p) => ({
          id: String(p.id),
          name: p.title,
          topic: p.topic,
          difficulty: difficultyIdToLabel(p.difficulty),
          raw: p,
        })),
    [problems, selectedTopic, selectedDifficulty],
  );

  const hasActiveFilters = selectedTopic !== 'All' || selectedDifficulty !== 'All';
  const resetFilters = () => {
    setSelectedTopic('All');
    setSelectedDifficulty('All');
  };

  const handleSubmitted = (problemId: number) => {
    setGradeByProblem((prev) => new Map(prev).set(problemId, null));
  };

  const columns = [
    {
      id: 'name',
      label: t('student.problems.columns.problemName'),
      render: (row: ProblemRow) => (
        <Typography
          onClick={() => navigate(`/student/problems/${row.raw.id}`)}
          sx={{
            fontWeight: 700,
            color: brand[500],
            fontSize: '14px',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          {row.name}
        </Typography>
      ),
    },
    {
      id: 'topic',
      label: t('student.problems.columns.topic'),
      render: (row: ProblemRow) => (
        <Chip
          label={row.topic}
          size="small"
          sx={{ bgcolor: neutral[100], color: neutral[600], fontWeight: 600, fontSize: '11px', borderRadius: '8px' }}
        />
      ),
    },
    {
      id: 'difficulty',
      label: t('student.problems.columns.difficulty'),
      render: (row: ProblemRow) => (
        <DifficultyBadge difficulty={row.difficulty}>
          {row.difficulty === 'Easy' && <Zap size={12} />}
          {row.difficulty === 'Medium' && <Target size={12} />}
          {row.difficulty === 'Hard' && <Flame size={12} />}
          {row.difficulty}
        </DifficultyBadge>
      ),
    },
    {
      id: 'action',
      label: t('student.problems.columns.action'),
      render: (row: ProblemRow) => {
        // Practice allows multiple attempts, so the Solve action is always
        // available; a subtle marker shows when the student has submitted before.
        const submitted = gradeByProblem.has(row.raw.id);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variantType="default"
              size="small"
              onClick={() => setModalProblem(row.raw)}
              sx={{ py: 0.5, px: 2, fontSize: '12px', '&:hover': { color: 'white', backgroundColor: brand[500] } }}
            >
              {submitted ? t('student.problems.solveAgain') : t('student.problems.solve')}
            </Button>
            {submitted && (
              <Chip
                label={t('student.problems.submitted')}
                size="small"
                sx={{ bgcolor: statusTone.success.bg, color: statusTone.success.fg, fontWeight: 700, fontSize: '11px', borderRadius: '8px' }}
              />
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <WelcomeBanner>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '16px',
                  background: `linear-gradient(135deg, ${brand[500]}, ${brand[700]})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(139,29,35,0.3)',
                }}
              >
                <Library size={28} color={neutral[0]} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.5px' }}>
                  {t('student.problems.title')}
                </Typography>
                <Typography sx={{ opacity: 0.9, fontWeight: 500, fontSize: '14px' }}>
                  {t('student.problems.subtitle')}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: 'center', p: 1.5, px: 2.5, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '24px', lineHeight: 1 }}>{problems.length}</Typography>
              <Typography sx={{ fontSize: '11px', opacity: 0.9, fontWeight: 600, textTransform: 'uppercase' }}>
                {t('student.problems.totalProblems')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </WelcomeBanner>

      {/* Filters */}
      <FilterCard elevation={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: neutral[100], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Filter size={18} color={brand[500]} />
            </Box>
            <Typography sx={{ fontWeight: 800, color: neutral[800], fontSize: '16px' }}>
              {t('student.problems.filters')}
            </Typography>
          </Box>
          {hasActiveFilters && (
            <Button variantType="ghost" size="small" startIcon={<RotateCcw size={14} />} onClick={resetFilters} sx={{ color: brand[500] }}>
              {t('student.problems.resetAll')}
            </Button>
          )}
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FilterGroup>
              <FilterLabel>
                <Gauge size={14} color={brand[500]} />
                {t('student.problems.columns.difficulty')}
              </FilterLabel>
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
              <FilterLabel>
                <Tag size={14} color={brand[500]} />
                {t('student.problems.topic')}
              </FilterLabel>
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
        <ErrorState message={error} onClose={() => setError(null)} />
      )}

      {loading ? (
        <LoadingState />
      ) : (
        <TableSection>
          <SharedTable data={rows} columns={columns} searchPlaceholder={t('student.problems.searchPlaceholder')} />
        </TableSection>
      )}

      <SubmitSolutionModal
        open={!!modalProblem}
        onClose={() => setModalProblem(null)}
        problem={modalProblem}
        onSubmitted={handleSubmitted}
      />
    </PageContainer>
  );
};

export default ProblemBank;
