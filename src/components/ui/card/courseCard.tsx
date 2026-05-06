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

const StyledCard = styled(Card)({
  borderRadius: '20px',
  border: '1px solid #eef2f6',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '0 20px 28px -12px rgba(0, 0, 0, 0.12)',
    borderColor: '#e2e8f0',
  },
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
    backgroundColor: '#e2e8f0',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 4,
    backgroundColor: '#8B1D23',
  },
}));

const StatChip = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: '#f8fafc',
  padding: '6px 12px',
  borderRadius: '40px',
  flex: '1 0 auto',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#f1f5f9',
  },
});

const StatLabel = styled(Typography)({
  fontSize: '12px',
  fontWeight: 500,
  color: '#64748b',
});

const StatValue = styled(Typography)({
  fontSize: '14px',
  fontWeight: 700,
  color: '#1e293b',
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
  const { id, title, studentsCount, progressPercent } = course;

  return (
    <StyledCard>
      <TopAccent />
      <CardHeader>
        <IconWrapper>
          <BookOpen size={22} color="#8B1D23" strokeWidth={1.8} />
        </IconWrapper>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', letterSpacing: '-0.3px', flex: 1 }}>
          {title}
        </Typography>
      </CardHeader>

      <CardContent sx={{ pt: 1, pb: 2, px: 3, flex: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <StatChip>
            <Users size={16} color="#8B1D23" strokeWidth={1.8} />
            <StatLabel>Students</StatLabel>
            <StatValue>{studentsCount}</StatValue>
          </StatChip>
          <StatChip>
            <TrendingUp size={16} color="#8B1D23" strokeWidth={1.8} />
            <StatLabel>Progress</StatLabel>
            <StatValue>{progressPercent}%</StatValue>
          </StatChip>
        </Box>

        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 500, color: '#475569' }}>
              Average completion
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#8B1D23' }}>
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
            color: '#475569',
            backgroundColor: 'transparent',
            borderRadius: '14px',
            py: 1,
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(139, 29, 35, 0.04)',
              color: '#8B1D23',
            },
          }}
        >
          View Details →
        </Button>
      </CardContent>
    </StyledCard>
  );
};