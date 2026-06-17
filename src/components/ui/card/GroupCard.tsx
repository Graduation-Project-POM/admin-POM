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
import { Users, User, Calendar, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { GroupData } from '../../../types';

const StyledCard = styled(Card)({
  borderRadius: '16px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  '&:hover': {
    boxShadow: '0 12px 20px -12px rgba(0, 0, 0, 0.15)',
  },
});

const CardHeader = styled(Box)({
  padding: '16px 20px 8px 20px',
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
  '& button': {
    flex: 1,
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '13px',
  },
});

interface GroupCardProps {
  group: GroupData;
  onView?: (id: string) => void;
  onEdit?: (group: GroupData) => void;
  onMembers?: (group: GroupData) => void;
  onDelete?: (id: string) => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  onView,
  onEdit,
  onMembers,
  onDelete,
}) => {
  const { t } = useTranslation();
  return (
    <StyledCard>
      <IconButton 
        size="small" 
        onClick={() => onDelete?.(group.id)}
        sx={{ 
          position: 'absolute', 
          top: 12, 
          right: 12, 
          color: '#94a3b8',
          '&:hover': { color: '#ef4444', bgcolor: '#fef2f2' }
        }}
      >
        <Trash2 size={16} />
      </IconButton>

      <CardHeader>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1, pr: 3 }}>
          {group.title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 2, minHeight: '40px' }}>
          {group.description}
        </Typography>
      </CardHeader>

      <CardContent sx={{ pt: 0, flex: 1 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <StatBox>
            <Users size={16} color="#8B1D23" />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {t('ui.groupCard.students', { count: group.studentsCount })}
            </Typography>
          </StatBox>
          <StatBox>
            <User size={16} color="#8B1D23" />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {t('ui.groupCard.trainer', { count: group.trainerCount })}
            </Typography>
          </StatBox>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <User size={14} color="#94a3b8" />
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              {t('ui.groupCard.trainerLabel', { name: group.trainerName })}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Calendar size={14} color="#94a3b8" />
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              {t('ui.groupCard.created', { date: group.createdDate })}
            </Typography>
          </Box>
        </Box>

        <ActionButtons>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onView?.(group.id)}
            sx={{ borderColor: '#cbd5e1', color: '#475569' }}
          >
            {t('buttons.view')}
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onEdit?.(group)}
            sx={{ borderColor: '#cbd5e1', color: '#475569' }}
          >
            {t('buttons.edit')}
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => onMembers?.(group)}
            sx={{ bgcolor: '#8B1D23', '&:hover': { bgcolor: '#6d1620' }, boxShadow: 'none' }}
          >
            {t('ui.groupCard.members')}
          </Button>
        </ActionButtons>
      </CardContent>
    </StyledCard>
  );
};
