import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Divider,
  styled,
  IconButton,
} from '@mui/material';
import { Calendar, Users, Trophy, Clock, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ContestData } from '../../../types';
import { formatDateTime } from '../../../utils/datetime';
import { brand, cardSurface, neutral, statPill } from '../../../theme';

const StyledCard = styled(Card)({
  ...cardSurface,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
});

const CardHeader = styled(Box)({
  padding: '16px 20px 8px 20px',
});

const StatBox = styled(Box)(statPill);

const ActionButtons = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginTop: '16px',
  '& button': {
    flex: '1 1 auto',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '13px',
  },
});

interface ContestCardProps {
  contest: ContestData;
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onProblems?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export const ContestCard: React.FC<ContestCardProps> = ({
  contest,
  onView,
  onEdit,
  onProblems,
  onDelete,
}) => {
  const { t } = useTranslation();
  if (!contest) {
    return (
      <StyledCard>
        <CardHeader>
          <Typography variant="body2" sx={{ color: neutral[500], p: 2 }}>
            {t('ui.contestCard.noData')}
          </Typography>
        </CardHeader>
      </StyledCard>
    );
  }

  const title = contest.title ?? t('ui.contestCard.untitled');
  const participants = contest.participants ?? 0;
  const problemsCount = contest.problemsCount ?? 0;
  const startDate = formatDateTime(contest.startDate);
  const endDate = formatDateTime(contest.endDate);

  return (
    <StyledCard>
      <IconButton
        size="small"
        aria-label={t('buttons.delete')}
        onClick={() => onDelete?.(Number(contest.id))}
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          color: neutral[400],
          '&:hover': { color: '#ef4444', bgcolor: '#fef2f2' }
        }}
      >
        <Trash2 size={16} />
      </IconButton>

      <CardHeader>
        <Typography variant="h6" sx={{ fontWeight: 700, color: neutral[800], mb: 1 }}>
          {title}
        </Typography>
      </CardHeader>

      <CardContent sx={{ pt: 0, flex: 1 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <StatBox>
            <Users size={16} color={brand[500]} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {t('ui.contestCard.participants', { count: participants })}
            </Typography>
          </StatBox>
          <StatBox>
            <Trophy size={16} color={brand[500]} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {t('ui.contestCard.problemsStat', { count: problemsCount })}
            </Typography>
          </StatBox>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Calendar size={14} color={neutral[400]} />
            <Typography variant="caption" sx={{ color: neutral[500], fontWeight: 600 }}>
              {t('ui.contestCard.startLabel', 'Start')}
            </Typography>
            <Typography variant="caption" dir="ltr" sx={{ color: neutral[500], unicodeBidi: 'isolate' }}>
              {startDate}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Clock size={14} color={neutral[400]} />
            <Typography variant="caption" sx={{ color: neutral[500], fontWeight: 600 }}>
              {t('ui.contestCard.endLabel', 'End')}
            </Typography>
            <Typography variant="caption" dir="ltr" sx={{ color: neutral[500], unicodeBidi: 'isolate' }}>
              {endDate}
            </Typography>
          </Box>
        </Box>

        <ActionButtons>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onView?.(Number(contest.id))}
            sx={{ borderColor: neutral[300], color: neutral[600] }}
          >
            {t('buttons.view')}
          </Button>
          {/* Ended contests are read-only — no edit action (backend enforces too). */}
          {contest.status !== 'Ended' && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => onEdit?.(Number(contest.id))}
              sx={{ borderColor: neutral[300], color: neutral[600] }}
            >
              {t('buttons.edit')}
            </Button>
          )}
          <Button
            variant="contained"
            size="small"
            onClick={() => onProblems?.(Number(contest.id))}
            sx={{ bgcolor: brand[500], '&:hover': { bgcolor: brand[600] }, boxShadow: 'none' }}
          >
            {t('ui.contestCard.problems')}
          </Button>
        </ActionButtons>
      </CardContent>
    </StyledCard>
  );
};