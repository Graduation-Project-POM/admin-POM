import React from 'react';
import { Box, Typography, Avatar, LinearProgress, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Users, Calendar, ChevronRight } from 'lucide-react';
import type { GroupData } from '../../../types';
import { Button } from '../button/Button';

const CardWrapper = styled(Box)({
  padding: '24px',
  border: '1px solid #e5e7eb',
  borderRadius: '16px',
  backgroundColor: '#fff',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: '260px',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    borderColor: '#8B1D23',
    transform: 'translateY(-3px)',
  },
});

const StatusBadge = styled(Box)<{ status?: string }>(({ status }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '4px 12px',
  borderRadius: '999px',
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  ...(status === 'active' && {
    backgroundColor: '#ecfdf5',
    color: '#059669',
    border: '1px solid #a7f3d0',
  }),
  ...(status === 'completed' && {
    backgroundColor: '#f0f9ff',
    color: '#0284c7',
    border: '1px solid #bae6fd',
  }),
  ...(status === 'upcoming' && {
    backgroundColor: '#fffbeb',
    color: '#d97706',
    border: '1px solid #fde68a',
  }),
}));

interface GroupCardProps {
  group: GroupData;
  onView: (id: string) => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, onView }) => {
  const status = group.status || 'active';

  return (
    <CardWrapper onClick={() => onView(group.id)}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: '#fef2f2',
                color: '#8B1D23',
                width: 48,
                height: 48,
                fontWeight: 800,
                fontSize: '18px',
                borderRadius: '12px',
              }}
            >
              {group.title.charAt(0)}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '16px', lineHeight: 1.3 }}>
                {group.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 500, fontSize: '12px' }}>
                Trainer: {group.trainerName}
              </Typography>
            </Box>
          </Box>
          <StatusBadge status={status}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }} />
            {status}
          </StatusBadge>
        </Box>

        <Typography variant="body2" sx={{ color: '#64748b', mb: 2, lineHeight: 1.6, fontSize: '13px' }}>
          {group.description.length > 100 ? group.description.substring(0, 100) + '...' : group.description}
        </Typography>

        {group.progress !== undefined && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, fontSize: '12px' }}>
                Course Progress
              </Typography>
              <Typography variant="body2" sx={{ color: '#8B1D23', fontWeight: 800, fontSize: '12px' }}>
                {group.progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={group.progress}
              sx={{
                height: 6,
                borderRadius: '999px',
                bgcolor: '#fee2e2',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#8B1D23',
                  borderRadius: '999px',
                },
              }}
            />
          </Box>
        )}
      </Box>

      <Box>
        <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Users size={14} color="#94a3b8" />
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, fontSize: '12px' }}>
                {group.studentsCount}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Calendar size={14} color="#94a3b8" />
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, fontSize: '12px' }}>
                {new Date(group.createdDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Typography>
            </Box>
          </Box>
          <Button
            variantType="outline"
            size="small"
            endIcon={<ChevronRight size={16} />}
            sx={{ py: 0.5, px: 1.5, fontSize: '12px' }}
          >
            View Details
          </Button>
        </Box>
      </Box>
    </CardWrapper>
  );
};
