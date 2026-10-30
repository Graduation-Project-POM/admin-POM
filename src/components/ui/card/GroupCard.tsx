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
          color: neutral[400],
          '&:hover': { color: '#ef4444', bgcolor: '#fef2f2' }
        }}
      >
        <Trash2 size={16} />
      </IconButton>

      <CardHeader>
        <Typography variant="h6" sx={{ fontWeight: 700, color: neutral[800], mb: 1, pr: 3 }}>
          {group.title}
        </Typography>
        <Typography variant="body2" sx={{ color: neutral[500], mb: 2, minHeight: '40px' }}>
          {group.description}
        </Typography>
      </CardHeader>

      <CardContent sx={{ pt: 0, flex: 1 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <StatBox>
            <Users size={16} color={brand[500]} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {t('ui.groupCard.students', { count: group.studentsCount })}
            </Typography>
          </StatBox>
          <StatBox>
            <User size={16} color={brand[500]} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {t('ui.groupCard.trainer', { count: group.trainerCount })}
            </Typography>
          </StatBox>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <User size={14} color={neutral[400]} />
            <Typography variant="caption" sx={{ color: neutral[500] }}>
              {t('ui.groupCard.trainerLabel', { name: group.trainerName })}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Calendar size={14} color={neutral[400]} />
            <Typography variant="caption" sx={{ color: neutral[500] }}>
              {t('ui.groupCard.created', { date: group.createdDate })}
            </Typography>
          </Box>
        </Box>

        <ActionButtons>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onView?.(group.id)}
            sx={{ borderColor: neutral[300], color: neutral[600] }}
          >
            {t('buttons.view')}
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onEdit?.(group)}
            sx={{ borderColor: neutral[300], color: neutral[600] }}
          >
            {t('buttons.edit')}
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => onMembers?.(group)}
            sx={{ bgcolor: brand[500], '&:hover': { bgcolor: brand[600] }, boxShadow: 'none' }}
          >
            {t('ui.groupCard.members')}
          </Button>
        </ActionButtons>
      </CardContent>
    </StyledCard>
  );
};
