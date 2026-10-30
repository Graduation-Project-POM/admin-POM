import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  styled,
  LinearProgress,
  linearProgressClasses,
} from '@mui/material';
import { Users, TrendingUp, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { brand, cardSurface, neutral } from '../../../theme';

const StyledCard = styled(Card)({
  ...cardSurface,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
});

const TopAccent = styled(Box)({
  height: '4px',
  width: '100%',
});

const CardHeader = styled(Box)({
  padding: '20px 20px 0 20px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const IconWrapper = styled(Box)({
  width: '44px',
  height: '44px',
  borderRadius: '14px',
  backgroundColor: 'rgba(139, 29, 35, 0.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const StyledLinearProgress = styled(LinearProgress)(() => ({
  height: 8,
  borderRadius: 4,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: neutral[200],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 4,
    backgroundColor: brand[500],
  },
}));

const StatChip = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: neutral[50],
  padding: '6px 12px',
  borderRadius: '40px',
  flex: '1 0 auto',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: neutral[100],
  },
});

const StatLabel = styled(Typography)({
  fontSize: '12px',
  fontWeight: 500,
  color: neutral[500],
});

const StatValue = styled(Typography)({
  fontSize: '14px',
  fontWeight: 700,
  color: neutral[800],
});

interface CourseData {
  id: string;
  title: string;
  studentsCount: number;
  progressPercent: number;
}

interface CourseCardProps {
  course: CourseData;
  onViewDetails?: (id: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onViewDetails }) => {
  const { t } = useTranslation();
  const { id, title, studentsCount, progressPercent } = course;

  return (
    <StyledCard>
      <TopAccent />
      <CardHeader>
        <IconWrapper>
          <BookOpen size={22} color={brand[500]} strokeWidth={1.8} />
        </IconWrapper>
        <Typography variant="h6" sx={{ fontWeight: 700, color: neutral[900], letterSpacing: '-0.3px', flex: 1 }}>
          {title}
        </Typography>
      </CardHeader>

      <CardContent sx={{ pt: 1, pb: 2, px: 3, flex: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <StatChip>
            <Users size={16} color={brand[500]} strokeWidth={1.8} />
            <StatLabel>{t('ui.courseCard.students')}</StatLabel>
            <StatValue>{studentsCount}</StatValue>
          </StatChip>
          <StatChip>
            <TrendingUp size={16} color={brand[500]} strokeWidth={1.8} />
            <StatLabel>{t('ui.courseCard.progress')}</StatLabel>
            <StatValue>{progressPercent}%</StatValue>
          </StatChip>
        </Box>

        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 500, color: neutral[600] }}>
              {t('ui.courseCard.averageCompletion')}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: brand[500] }}>
              {progressPercent}%
            </Typography>
          </Box>
          <StyledLinearProgress variant="determinate" value={progressPercent} />
        </Box>

        <Button
          variant="text"
          fullWidth
          onClick={() => onViewDetails?.(id)}
          sx={{
            mt: 1,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '14px',
            color: neutral[600],
            backgroundColor: 'transparent',
            borderRadius: '14px',
            py: 1,
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(139, 29, 35, 0.04)',
              color: brand[500],
            },
          }}
        >
          {t('ui.courseCard.viewDetails')}
        </Button>
      </CardContent>
    </StyledCard>
  );
};