import React from 'react';
import { Box, Typography, Chip, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Calendar, Users, Target, ChevronRight, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ContestData } from '../../../types';
import { Button } from '../button/Button';
import { formatDateTime } from '../../../utils/datetime';
import { cardSurface, neutral, statusTone } from '../../../theme';

const CardWrapper = styled(Box)({
  ...cardSurface,
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: '220px',
});

const StatusChip = styled(Box)<{ status: string }>(({ status }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '4px 12px',
  borderRadius: '999px',
  fontSize: '12px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  ...(status === 'Ongoing' && {
    backgroundColor: '#ecfdf5',
    color: '#059669',
    border: `1px solid ${statusTone.success.border}`,
  }),
  ...(status === 'Upcoming' && {
    backgroundColor: '#fffbeb',
    color: '#d97706',
    border: `1px solid ${statusTone.warning.border}`,
  }),
  ...(status === 'Ended' && {
    backgroundColor: neutral[100],
    color: neutral[500],
    border: `1px solid ${neutral[200]}`,
  }),
}));

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy': return { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' };
    case 'Medium': return { bg: '#fffbeb', color: '#d97706', border: '#fde68a' };
    case 'Hard': return { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' };
    default: return { bg: neutral[100], color: neutral[500], border: neutral[200] };
  }
};

interface ContestCardProps {
  contest: ContestData;
  onViewProblems: () => void;
}

export const ContestCard: React.FC<ContestCardProps> = ({ contest, onViewProblems }) => {
  const { t } = useTranslation();
  const diffColor = getDifficultyColor(contest.difficulty);

  return (
    <CardWrapper>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: neutral[800], fontSize: '16px', mb: 0.5 }}>
              {contest.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <StatusChip status={contest.status}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }} />
                {contest.status}
              </StatusChip>
              <Chip
                label={contest.difficulty}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: '12px',
                  bgcolor: diffColor.bg,
                  color: diffColor.color,
                  border: `1px solid ${diffColor.border}`,
                  height: '22px',
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Target size={14} color={neutral[400]} />
            <Typography variant="body2" sx={{ color: neutral[500], fontWeight: 500, fontSize: '12px' }}>
              {t('ui.studentContestCard.problems', { count: contest.problemsCount })}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Users size={14} color={neutral[400]} />
            <Typography variant="body2" sx={{ color: neutral[500], fontWeight: 500, fontSize: '12px' }}>
              {t('ui.studentContestCard.participants', { count: contest.participants })}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Calendar size={14} color={neutral[400]} />
            <Typography variant="body2" sx={{ color: neutral[400], fontWeight: 600, fontSize: '12px', minWidth: 34 }}>
              {t('ui.studentContestCard.startShort', 'Start')}
            </Typography>
            <Typography variant="body2" dir="ltr" sx={{ color: neutral[600], fontWeight: 600, fontSize: '12px', unicodeBidi: 'isolate' }}>
              {formatDateTime(contest.startDate)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Clock size={14} color={neutral[400]} />
            <Typography variant="body2" sx={{ color: neutral[400], fontWeight: 600, fontSize: '12px', minWidth: 34 }}>
              {t('ui.studentContestCard.endShort', 'End')}
            </Typography>
            <Typography variant="body2" dir="ltr" sx={{ color: neutral[600], fontWeight: 600, fontSize: '12px', unicodeBidi: 'isolate' }}>
              {formatDateTime(contest.endDate)}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box>
        <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {contest.status === 'Ongoing' ? (
            <Button
              variantType="default"
              size="small"
              startIcon={<ChevronRight size={14} />}
              onClick={onViewProblems}
              sx={{ flex: 1, py: 0.5, fontSize: '12px' }}
            >
              {t('ui.studentContestCard.solveProblems')}
            </Button>
          ) : contest.status === 'Ended' ? (
            <Button
              variantType="outline"
              size="small"
              startIcon={<ChevronRight size={14} />}
              onClick={onViewProblems}
              sx={{ flex: 1, py: 0.5, fontSize: '12px' }}
            >
              {t('ui.studentContestCard.viewProblemsGrades')}
            </Button>
          ) : (
            <Button
              variantType="ghost"
              size="small"
              disabled
              sx={{ flex: 1, py: 0.5, fontSize: '12px' }}
            >
              {t('ui.studentContestCard.comingSoon')}
            </Button>
          )}
        </Box>
      </Box>
    </CardWrapper>
  );
};
