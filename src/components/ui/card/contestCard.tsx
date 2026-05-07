import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Divider,
  Chip,
  styled,
} from '@mui/material';
import { Calendar, Users, Trophy, Clock } from 'lucide-react';
import type { ContestData } from '../../../types';

const StyledCard = styled(Card)({
  borderRadius: '16px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
});

const CardHeader = styled(Box)({
  padding: '16px 20px 8px 20px',
});

const BadgeWrapper = styled(Box)({
  display: 'flex',
  gap: '8px',
  marginBottom: '12px',
});

const StatBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: '#f8fafc',
  padding: '6px 12px',
  borderRadius: '20px',
});

const ActionButtons = styled(Box)({
  display: 'flex',
  gap: '8px',
  marginTop: '16px',
  flexWrap: 'wrap',
  '& button': {
    flex: 1,
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '13px',
  },
});

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Upcoming': return { bg: '#dcfce7', text: '#166534', label: 'Upcoming' };
    case 'Ended': return { bg: '#fee2e2', text: '#991b1b', label: 'Ended' };
    case 'Ongoing': return { bg: '#fef3c7', text: '#92400e', label: 'Ongoing' };
    default: return { bg: '#f1f5f9', text: '#475569', label: status };
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy': return { bg: '#dcfce7', text: '#166534' };
    case 'Medium': return { bg: '#fef3c7', text: '#92400e' };
    case 'Hard': return { bg: '#fee2e2', text: '#991b1b' };
    default: return { bg: '#f1f5f9', text: '#475569' };
  }
};

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
    if (!contest) {
    return (
      <StyledCard>
        <CardHeader>
          <Typography variant="body2" sx={{ color: '#64748b', p: 2 }}>
            No contest data available
          </Typography>
        </CardHeader>
      </StyledCard>
    );
  }

  const status = contest.status ?? 'Upcoming';
  const difficulty = contest.difficulty ?? 'Medium';
  const participants = contest.participants ?? 0;      
  const problemsCount = contest.problemsCount ?? 0;
  const startDate = contest.startDate ?? '';
  const endDate = contest.endDate ?? '';
  const title = contest.title ?? 'Untitled Contest';

  const statusColor = getStatusColor(status);
  const diffColor = getDifficultyColor(difficulty);

  return (
    <StyledCard>
      <CardHeader>
        <BadgeWrapper>
          <Chip
            label={statusColor.label}
            size="small"
            sx={{ bgcolor: statusColor.bg, color: statusColor.text, fontWeight: 600 }}
          />
          <Chip
            label={difficulty}
            size="small"
            sx={{ bgcolor: diffColor.bg, color: diffColor.text, fontWeight: 600 }}
          />
        </BadgeWrapper>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          {title}
        </Typography>
      </CardHeader>

      <CardContent sx={{ pt: 0, flex: 1 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <StatBox>
            <Users size={16} color="#8B1D23" />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {participants} Participants
            </Typography>
          </StatBox>
          <StatBox>
            <Trophy size={16} color="#8B1D23" />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {problemsCount} Problems
            </Typography>
          </StatBox>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Calendar size={14} color="#94a3b8" />
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Start: {startDate}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Clock size={14} color="#94a3b8" />
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              End: {endDate}
            </Typography>
          </Box>
        </Box>

        <ActionButtons>
          <Button variant="outlined" size="small" onClick={() => onView?.(contest.id)}>
            View
          </Button>
          <Button variant="outlined" size="small" onClick={() => onEdit?.(contest.id)}>
            Edit
          </Button>
          <Button variant="contained" size="small" onClick={() => onProblems?.(contest.id)} sx={{ bgcolor: '#8B1D23', '&:hover': { bgcolor: '#6d1620' } }}>
            Problems
          </Button>
          <Button variant="outlined" size="small" color="error" onClick={() => onDelete?.(contest.id)}>
            Delete
          </Button>
        </ActionButtons>
      </CardContent>
    </StyledCard>
  );
};