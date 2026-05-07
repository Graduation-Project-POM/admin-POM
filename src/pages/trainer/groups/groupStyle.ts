import { styled } from '@mui/material/styles';
import {
  Typography,
  Container,
  Box,
  LinearProgress,
  Card,
  Button,
  Chip,
} from '@mui/material';

export const PageContainer = styled(Container)({
  padding: '40px 24px',
  minHeight: '100vh',
  marginLeft: 0,
  marginRight: 0,
  maxWidth: '100%',
  paddingLeft: 'max(24px, env(safe-area-inset-left))',
  paddingRight: 'max(24px, env(safe-area-inset-right))',
});

export const HeaderSection = styled(Box)({
  marginBottom: '48px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  gap: '24px',
  '@media (max-width: 768px)': {
    flexDirection: 'column',
  },
});

export const TitleBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  flex: 1,
});

export const IconBadge = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 64,
  height: 64,
  borderRadius: '16px',
  background: 'linear-gradient(135deg, rgba(139, 29, 35, 0.15) 0%, rgba(139, 29, 35, 0.05) 100%)',
  color: '#8B1D23',
  fontSize: '32px',
  flexShrink: 0,
});

export const HeaderStats = styled(Box)({
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
  flexWrap: 'wrap',
});

export const StatCard = styled(Card)({
  padding: '12px 20px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    transform: 'translateY(-2px)',
  },
});

export const StatValue = styled(Typography)({
  fontSize: '20px',
  fontWeight: 700,
  color: '#8B1D23',
  lineHeight: 1,
});

export const StatLabel = styled(Typography)({
  fontSize: '11px',
  color: '#94a3b8',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

export const CoursesGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
  gap: '28px',
  '@media (max-width: 900px)': {
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  '@media (max-width: 640px)': {
    gridTemplateColumns: '1fr',
    gap: '16px',
  },
});

export const CourseCardStyled = styled(Card)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '14px',
  border: '1px solid #e2e8f0',
  backgroundColor: '#fff',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  transition: '0.2s ease',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.10)',
  },
});

export const CardHeaderStyled = styled(Box)({
  padding: '28px 24px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '12px',
});

export const CourseIcon = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
  borderRadius: '12px',
  backgroundColor: '#f1f5f9',
  color: '#8B1D23',
  fontSize: '24px',
  flexShrink: 0,
});

export const CourseTitle = styled(Typography)({
  fontSize: '16px',
  fontWeight: 700,
  color: '#1e293b',
  lineHeight: 1.4,
  marginBottom: '4px',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

export const CourseSubtitle = styled(Typography)({
  fontSize: '12px',
  color: '#94a3b8',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});

export const CardBody = styled(Box)({
  padding: '16px 24px',
  flex: 1,
});

export const ProgressSection = styled(Box)({
  marginBottom: '20px',
});

export const ProgressLabel = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
});

export const ProgressLabelText = styled(Typography)({
  fontSize: '12px',
  fontWeight: 600,
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

export const ProgressPercentage = styled(Typography)({
  fontSize: '14px',
  fontWeight: 700,
  color: '#8B1D23',
});

export const StyledLinearProgress = styled(LinearProgress)({
  height: '8px',
  borderRadius: '4px',
  backgroundColor: '#e2e8f0',
  '& .MuiLinearProgress-bar': {
    borderRadius: '4px',
    background: 'linear-gradient(90deg, #8B1D23 0%, #d32f2f 100%)',
    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  },
});

export const StatsRow = styled(Box)({
  display: 'flex',
  gap: '16px',
  padding: '16px',
  backgroundColor: '#f8fafc',
  borderRadius: '12px',
  marginBottom: '16px',
});

export const StatBox = styled(Box)({
  flex: 1,
  textAlign: 'center',
});

export const StatBoxValue = styled(Typography)({
  fontSize: '18px',
  fontWeight: 700,
  color: '#8B1D23',
  marginBottom: '2px',
});

export const StatBoxLabel = styled(Typography)({
  fontSize: '11px',
  color: '#94a3b8',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

export const CardFooter = styled(Box)({
  padding: '20px 24px',
  borderTop: '1px solid #f1f5f9',
  display: 'flex',
  gap: '12px',
  paddingTop: 'auto',
});

export const ActionButton = styled(Button)<{ variant?: 'contained' | 'outlined' }>(
  ({ variant }) => ({
    flex: 1,
    borderRadius: '10px',
    fontWeight: 600,
    fontSize: '13px',
    textTransform: 'none',
    transition: 'all 0.3s ease',
    padding: '10px 16px',
    border: 'none',
    ...(variant === 'contained' && {
      backgroundColor: '#8B1D23',
      color: '#ffffff',
      boxShadow: '0 4px 12px rgba(139, 29, 35, 0.2)',
      '&:hover': {
        backgroundColor: '#6d1620',
        boxShadow: '0 6px 20px rgba(139, 29, 35, 0.3)',
        transform: 'translateY(-1px)',
      },
    }),
    ...(variant === 'outlined' && {
      borderColor: '#e2e8f0',
      color: '#64748b',
      '&:hover': {
        borderColor: '#8B1D23',
        color: '#8B1D23',
        backgroundColor: 'rgba(139, 29, 35, 0.04)',
      },
    }),
  })
);

export const DifficultyBadge = styled(Chip)({
  position: 'absolute',
  top: 12,
  right: 12,
  height: '28px',
  fontSize: '12px',
  fontWeight: 600,
  backgroundColor: 'rgba(139, 29, 35, 0.1)',
  color: '#8B1D23',
  border: '1px solid rgba(139, 29, 35, 0.2)',
});

export interface CourseData {
  id: string;
  title: string;
  studentsCount: number;
  progressPercent: number;
}

export const mockCourses: CourseData[] = [
  { id: '1', title: 'Advanced Programming', studentsCount: 45, progressPercent: 78 },
  { id: '2', title: 'Data Structures', studentsCount: 52, progressPercent: 65 },
  { id: '3', title: 'Algorithms', studentsCount: 38, progressPercent: 82 },
  { id: '4', title: 'Web Development', studentsCount: 29, progressPercent: 71 },
  { id: '5', title: 'Machine Learning', studentsCount: 24, progressPercent: 58 },
  { id: '6', title: 'Database Systems', studentsCount: 33, progressPercent: 69 },
];

export const getProgressColor = (progress: number) => {
  if (progress >= 80) return { color: '#16a34a', label: 'Excellent' };
  if (progress >= 60) return { color: '#ea580c', label: 'Good' };
  return { color: '#dc2626', label: 'In Progress' };
};

export const getCourseIcon = (index: number) => {
  const icons = ['📚', '💾', '⚙️', '🌐', '🤖', '🗄️'];
  return icons[index % icons.length];
};