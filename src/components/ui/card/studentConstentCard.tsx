import React from 'react';
import { Box, Typography, Chip, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Calendar, Users, Target, ChevronRight, Clock } from 'lucide-react';
import type { ContestData } from '../../../types';
import { Button } from '../button/Button';

const CardWrapper = styled(Box)({
  padding: '24px',
  border: '1px solid #e5e7eb',
  borderRadius: '16px',
  backgroundColor: '#fff',
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: '220px',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    borderColor: '#8B1D23',
    transform: 'translateY(-3px)',
  },
});

const StatusChip = styled(Box)<{ status: string }>(({ status }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '4px 12px',
  borderRadius: '999px',
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  ...(status === 'Ongoing' && {
    backgroundColor: '#ecfdf5',
    color: '#059669',
    border: '1px solid #a7f3d0',
  }),
  ...(status === 'Upcoming' && {
    backgroundColor: '#fffbeb',
    color: '#d97706',
    border: '1px solid #fde68a',
  }),
  ...(status === 'Ended' && {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    border: '1px solid #e2e8f0',
  }),
}));

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy': return { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' };
    case 'Medium': return { bg: '#fffbeb', color: '#d97706', border: '#fde68a' };
    case 'Hard': return { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' };
    default: return { bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0' };
  }
};

interface ContestCardProps {
  contest: ContestData;
  onViewProblems: () => void;
}

export const ContestCard: React.FC<ContestCardProps> = ({ contest, onViewProblems }) => {
  const diffColor = getDifficultyColor(contest.difficulty);

  return (
    <CardWrapper>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '16px', mb: 0.5 }}>
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
                  fontSize: '11px',
                  bgcolor: diffColor.bg,
                  color: diffColor.color,
                  border: `1px solid ${diffColor.border}`,
                  height: '22px',
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Target size={14} color="#94a3b8" />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, fontSize: '12px' }}>
              {contest.problemsCount} Problems
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Users size={14} color="#94a3b8" />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, fontSize: '12px' }}>
              {contest.participants} Participants
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Calendar size={14} color="#94a3b8" />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, fontSize: '12px' }}>
              {new Date(contest.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Clock size={14} color="#94a3b8" />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, fontSize: '12px' }}>
              {new Date(contest.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
              Solve Problems
            </Button>
          ) : contest.status === 'Ended' ? (
            <Button
              variantType="outline"
              size="small"
              startIcon={<ChevronRight size={14} />}
              onClick={onViewProblems}
              sx={{ flex: 1, py: 0.5, fontSize: '12px' }}
            >
              View Problems & Grades
            </Button>
          ) : (
            <Button
              variantType="ghost"
              size="small"
              disabled
              sx={{ flex: 1, py: 0.5, fontSize: '12px' }}
            >
              Coming Soon
            </Button>
          )}
        </Box>
      </Box>
    </CardWrapper>
  );
};
