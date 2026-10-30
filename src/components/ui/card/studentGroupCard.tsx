import React from 'react';
import { Box, Typography, Avatar, LinearProgress, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Users, Calendar, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { GroupData } from '../../../types';
import { Button } from '../button/Button';
import { brand, cardSurface, neutral, statusTone } from '../../../theme';

const CardWrapper = styled(Box)({
  ...cardSurface,
  padding: '24px',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: '260px',
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
    border: `1px solid ${statusTone.success.border}`,
  }),
  ...(status === 'completed' && {
    backgroundColor: '#f0f9ff',
    color: '#0284c7',
    border: '1px solid #bae6fd',
  }),
  ...(status === 'upcoming' && {
    backgroundColor: '#fffbeb',
    color: '#d97706',
    border: `1px solid ${statusTone.warning.border}`,
  }),
}));

interface GroupCardProps {
  group: GroupData;
  onView: (id: string) => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, onView }) => {
  const { t } = useTranslation();
  const status = group.status || 'active';

  return (
    <CardWrapper onClick={() => onView(group.id)}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: '#fef2f2',
                color: brand[500],
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
              <Typography sx={{ fontWeight: 800, color: neutral[800], fontSize: '16px', lineHeight: 1.3 }}>
                {group.title}
              </Typography>
              <Typography variant="body2" sx={{ color: neutral[400], fontWeight: 500, fontSize: '12px' }}>
                {t('ui.studentGroupCard.trainerLabel', { name: group.trainerName })}
              </Typography>
            </Box>
          </Box>
          <StatusBadge status={status}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }} />
            {status}
          </StatusBadge>
        </Box>

        <Typography variant="body2" sx={{ color: neutral[500], mb: 2, lineHeight: 1.6, fontSize: '13px' }}>
          {group.description.length > 100 ? group.description.substring(0, 100) + '...' : group.description}
        </Typography>

        {group.progress !== undefined && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" sx={{ color: neutral[500], fontWeight: 600, fontSize: '12px' }}>
                {t('ui.studentGroupCard.courseProgress')}
              </Typography>
              <Typography variant="body2" sx={{ color: brand[500], fontWeight: 800, fontSize: '12px' }}>
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
                  bgcolor: brand[500],
                  borderRadius: '999px',
                },
              }}
            />
          </Box>
        )}
      </Box>

      <Box>
        <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Users size={14} color={neutral[400]} />
              <Typography variant="body2" sx={{ color: neutral[500], fontWeight: 600, fontSize: '12px' }}>
                {group.studentsCount}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Calendar size={14} color={neutral[400]} />
              <Typography variant="body2" sx={{ color: neutral[500], fontWeight: 600, fontSize: '12px' }}>
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
            {t('ui.studentGroupCard.viewDetails')}
          </Button>
        </Box>
      </Box>
    </CardWrapper>
  );
};
