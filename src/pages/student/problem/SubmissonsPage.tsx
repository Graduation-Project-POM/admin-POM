import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
  RotateCcw,
  BookOpen,
  Filter,
  Target,
  Flame,
  Clock,
  Tag,
  Zap,
  Layers,
  Trophy,
} from 'lucide-react';
import { SharedTable } from '../../../components/ui/table/studentTable';
import { Button } from '../../../components/ui/button/Button';
import { getApiErrorMessage } from '../../../utils/apiError';
import {
  getMySolvedProblems,
  difficultyIdToLabel,
  type MySolvedProblemSummary,
  type DifficultyLabel,
} from '../../../services/problemService';
import { brand, neutral, statusTone } from '../../../theme';
import { ErrorState, LoadingState } from '../../../components/common/states';

interface Row {
  id: string;
  problemId: number;
  name: string;
  difficulty: DifficultyLabel;
  topic: string;
  hasBank: boolean;
  hasContest: boolean;
  contestScore: number | null;
  latestAt: string;
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
  background: `linear-gradient(135deg, ${brand[500]} 0%, ${brand[700]} 50%, ${brand[800]} 100%)`,
  borderRadius: '20px',
  padding: '32px',
  color: neutral[0],
  position: 'relative',
  overflow: 'hidden',
  marginBottom: '32px',
  '&::before': {
    content: '""', position: 'absolute', top: '-50%', right: '-10%',
    width: '300px', height: '300px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,29,35,0.4) 0%, transparent 70%)',
  },
});

const FilterCard = styled(Paper)({
  padding: '18px',
  marginBottom: '28px',
  border: `1px solid ${neutral[200]}`,
  borderRadius: '20px',
  backgroundColor: neutral[0],
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  animation: `${fadeInUp} 0.5s ease-out 200ms both`,
});

const FilterGroup = styled(Box)({ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' });
const FilterLabel = styled(Typography)({
  fontWeight: 700, fontSize: '12px', color: neutral[500], textTransform: 'uppercase',
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
  backgroundColor: active ? brand[500] : neutral[50],
  color: active ? neutral[0] : neutral[500],
  border: active ? 'none' : `1px solid ${neutral[200]}`,
  '&:hover': { backgroundColor: active ? brand[600] : neutral[100] },
}));

const DifficultyBadge = styled(Box)<{ difficulty: string }>(({ difficulty }) => ({
  display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px',
  borderRadius: '10px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.3px',
  ...(difficulty === 'Easy' && { backgroundColor: statusTone.success.bg, color: statusTone.success.solid, border: `1px solid ${statusTone.success.border}` }),
  ...(difficulty === 'Medium' && { backgroundColor: statusTone.warning.bg, color: statusTone.warning.solid, border: `1px solid ${statusTone.warning.border}` }),
  ...(difficulty === 'Hard' && { backgroundColor: '#fef2f2', color: statusTone.danger.solid, border: `1px solid ${statusTone.danger.border}` }),
}));

const TableSection = styled(Box)({ animation: `${fadeInUp} 0.5s ease-out 300ms both` });

const DIFFICULTIES: DifficultyLabel[] = ['Easy', 'Medium', 'Hard'];
const SOURCES = ['All', 'Bank', 'Contest'] as const;
type SourceFilter = (typeof SOURCES)[number];

export const MySubmissions: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [items, setItems] = useState<MySolvedProblemSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedSource, setSelectedSource] = useState<SourceFilter>('All');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await getMySolvedProblems());
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, t('student.mySolutions.loadError')));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const allTopics = useMemo(
    () => [...new Set(items.map((s) => s.topic).filter(Boolean))].sort(),
    [items],
  );

  const rows: Row[] = useMemo(
    () =>
      items
        .filter((s) => (selectedTopic === 'All' ? true : s.topic === selectedTopic))
        .filter((s) =>
          selectedDifficulty === 'All' ? true : difficultyIdToLabel(s.difficulty) === selectedDifficulty,
        )
        .filter((s) =>
          selectedSource === 'All'
            ? true
            : selectedSource === 'Bank'
              ? s.hasBankSubmission
              : s.hasContestSubmission,
        )
        .map((s) => ({
          id: String(s.problemId),
          problemId: s.problemId,
          name: s.title,
          difficulty: difficultyIdToLabel(s.difficulty),
          topic: s.topic || '—',
          hasBank: s.hasBankSubmission,
          hasContest: s.hasContestSubmission,
          contestScore: s.latestContestScore ?? null,
          latestAt: s.latestSubmittedAt,
        })),
    [items, selectedTopic, selectedDifficulty, selectedSource],
  );

  const hasActiveFilters = selectedTopic !== 'All' || selectedDifficulty !== 'All' || selectedSource !== 'All';
  const resetFilters = () => {
    setSelectedTopic('All');
    setSelectedDifficulty('All');
    setSelectedSource('All');
  };

  const columns = [
    {
      id: 'name',
      label: t('student.mySolutions.columns.problemName'),
      render: (row: Row) => (
        <Box>
          <Typography
            onClick={() => navigate(`/student/my-solutions/${row.problemId}`)}
            sx={{ fontWeight: 700, color: brand[500], fontSize: '14px', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          >
            {row.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
            <Clock size={11} color={neutral[400]} />
            <Typography variant="body2" sx={{ color: neutral[400], fontSize: '11px' }}>
              {new Date(row.latestAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'difficulty',
      label: t('student.mySolutions.columns.difficulty'),
      render: (row: Row) => (
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
      label: t('student.mySolutions.columns.topic'),
      render: (row: Row) => (
        <Chip label={row.topic} size="small" sx={{ bgcolor: neutral[100], color: neutral[600], fontWeight: 600, fontSize: '11px', borderRadius: '8px' }} />
      ),
    },
    {
      id: 'source',
      label: t('student.mySolutions.columns.source'),
      render: (row: Row) => (
        <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
          {row.hasBank && (
            <Chip
              icon={<Layers size={12} />}
              label={t('student.mySolutions.sources.bank')}
              size="small"
              sx={{ bgcolor: '#eef2ff', color: '#4338ca', fontWeight: 700, fontSize: '11px' }}
            />
          )}
          {row.hasContest && (
            <Chip
              icon={<Trophy size={12} />}
              label={t('student.mySolutions.sources.contest')}
              size="small"
              sx={{ bgcolor: statusTone.warning.bg, color: statusTone.warning.fg, fontWeight: 700, fontSize: '11px' }}
            />
          )}
        </Stack>
      ),
    },
    {
      id: 'points',
      label: t('student.mySolutions.columns.points'),
      render: (row: Row) => {
        // Bank submissions never carry a score — the column is intentionally blank
        // unless the student also has a contest submission with points.
        if (!row.hasContest) {
          return (
            <Typography variant="body2" sx={{ color: neutral[300], fontStyle: 'italic', fontSize: '12px' }}>
              {t('student.mySolutions.noPoints')}
            </Typography>
          );
        }
        if (row.contestScore == null) {
          return (
            <Typography variant="body2" sx={{ color: neutral[400], fontSize: '12px' }}>
              {t('student.mySolutions.pending')}
            </Typography>
          );
        }
        return (
          <Typography sx={{ fontWeight: 800, color: brand[500], fontSize: '15px' }}>
            {row.contestScore}
            <Typography component="span" variant="body2" sx={{ color: neutral[400], fontSize: '12px', ml: 0.5 }}>
              / 100
            </Typography>
          </Typography>
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
              <Box sx={{ width: 56, height: 56, borderRadius: '16px', background: `linear-gradient(135deg, ${brand[500]}, ${brand[700]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(139,29,35,0.3)' }}>
                <BookOpen size={28} color={neutral[0]} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.5px' }}>
                  {t('student.mySolutions.title')}
                </Typography>
                <Typography sx={{ opacity: 0.9, fontWeight: 500, fontSize: '14px' }}>
                  {t('student.mySolutions.subtitle')}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: 'center', p: 1.5, px: 2.5, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '24px', lineHeight: 1 }}>{items.length}</Typography>
              <Typography sx={{ fontSize: '11px', opacity: 0.9, fontWeight: 600, textTransform: 'uppercase' }}>
                {t('student.mySolutions.totalSolved')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </WelcomeBanner>

      <FilterCard elevation={0}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 5, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: neutral[100], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Filter size={18} color={brand[500]} />
            </Box>
            <Typography sx={{ fontWeight: 800, color: neutral[800], fontSize: '16px' }}>{t('student.mySolutions.filters')}</Typography>
          </Box>
          {hasActiveFilters && (
            <Button variantType="ghost" size="small" startIcon={<RotateCcw size={14} />} onClick={resetFilters} sx={{ color: brand[500] }}>
              {t('student.mySolutions.resetAll')}
            </Button>
          )}
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <FilterGroup>
              <FilterLabel><Target size={14} color={brand[500]} />{t('student.mySolutions.columns.difficulty')}</FilterLabel>
              <FilterChipsStack>
                <StyledChip label={t('common.all')} onClick={() => setSelectedDifficulty('All')} active={selectedDifficulty === 'All'} size="small" />
                {DIFFICULTIES.map((d) => (
                  <StyledChip key={d} label={d} onClick={() => setSelectedDifficulty(d)} active={selectedDifficulty === d} size="small" />
                ))}
              </FilterChipsStack>
            </FilterGroup>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FilterGroup>
              <FilterLabel><Tag size={14} color={brand[500]} />{t('student.mySolutions.topic')}</FilterLabel>
              <FilterChipsStack>
                <StyledChip label={t('common.all')} onClick={() => setSelectedTopic('All')} active={selectedTopic === 'All'} size="small" />
                {allTopics.map((topic) => (
                  <StyledChip key={topic} label={topic} onClick={() => setSelectedTopic(topic)} active={selectedTopic === topic} size="small" />
                ))}
              </FilterChipsStack>
            </FilterGroup>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FilterGroup>
              <FilterLabel><Layers size={14} color={brand[500]} />{t('student.mySolutions.columns.source')}</FilterLabel>
              <FilterChipsStack>
                {SOURCES.map((src) => (
                  <StyledChip
                    key={src}
                    label={src === 'All' ? t('common.all') : t(`student.mySolutions.sources.${src.toLowerCase()}`)}
                    onClick={() => setSelectedSource(src)}
                    active={selectedSource === src}
                    size="small"
                  />
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
      ) : rows.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, borderRadius: '16px', border: `1px dashed ${neutral[200]}`, textAlign: 'center', color: neutral[500] }}>
          <Typography sx={{ fontWeight: 700, color: neutral[800], mb: 0.5 }}>
            {t('student.mySolutions.empty')}
          </Typography>
          <Typography variant="body2">{t('student.mySolutions.emptyHint')}</Typography>
        </Paper>
      ) : (
        <TableSection>
          <SharedTable data={rows} columns={columns} searchPlaceholder={t('student.mySolutions.searchPlaceholder')} />
        </TableSection>
      )}
    </PageContainer>
  );
};

export default MySubmissions;
