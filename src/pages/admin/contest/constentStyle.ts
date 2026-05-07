import { styled } from '@mui/material/styles';
import { Container, Box, TextField, Card, Chip, Button, Typography } from '@mui/material';

export const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

export const HeaderWrapper = styled(Box)({
  marginBottom: 8,
});

export const SubtitleWrapper = styled(Box)({
  marginBottom: 16,
  color: 'text.secondary',
});

export const SearchWrapper = styled(Box)({
  marginBottom: 32,
  maxWidth: 500,
});

export const StyledSearchField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    backgroundColor: '#fff',
    '& fieldset': {
      borderColor: '#e5e7eb',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#8B1D23',
      borderWidth: '1.5px',
    },
  },
});

export const ContestsGrid = styled(Box)({
  display: 'grid',
  gap: 24,
  gridTemplateColumns: '1fr',
  '@media (min-width: 600px)': {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  '@media (min-width: 900px)': {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
});

export const EmptyStateWrapper = styled(Box)({
  textAlign: 'center',
  paddingTop: 64,
  paddingBottom: 64,
});

export const StyledCard = styled(Card)({
  borderRadius: 16,
  border: '1px solid #e5e7eb',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  padding: 20,
});

export const CardHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: 16,
});

export const Title = styled(Typography)({
  fontSize: '1.25rem',
  fontWeight: 700,
  color: '#1e293b',
  lineHeight: 1.3,
});

export const StatusChip = styled(Chip)<{ status: string }>(({ status }) => {
  const statusStyles: Record<string, any> = {
    Upcoming: { bg: '#fef3c7', text: '#92400e' },
    Ended: { bg: '#fee2e2', text: '#991b1b' },
    Ongoing: { bg: '#dcfce7', text: '#166534' },
  };
  const { bg, text } = statusStyles[status] || statusStyles.Upcoming;
  return {
    height: 26,
    fontSize: '0.7rem',
    fontWeight: 700,
    borderRadius: 20,
    backgroundColor: bg,
    color: text,
    border: 'none',
  };
});

export const DifficultyChip = styled(Chip)<{ difficulty: string }>(({ difficulty }) => {
  const diffStyles: Record<string, any> = {
    Easy: { bg: '#e0f2fe', text: '#0369a1' },
    Medium: { bg: '#fef9c3', text: '#854d0e' },
    Hard: { bg: '#fee2e2', text: '#b91c1c' },
  };
  const { bg, text } = diffStyles[difficulty] || diffStyles.Medium;
  return {
    height: 26,
    fontSize: '0.7rem',
    fontWeight: 600,
    borderRadius: 20,
    backgroundColor: bg,
    color: text,
  };
});

export const StatsRow = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 16,
  marginTop: 12,
  marginBottom: 12,
  paddingBottom: 12,
  borderBottom: '1px solid #f1f5f9',
});

export const StatItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: '0.8rem',
  color: '#475569',
});

export const DateRow = styled(Box)({
  marginTop: 8,
  marginBottom: 8,
  fontSize: '0.8rem',
  color: '#475569',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

export const Description = styled(Typography)({
  marginTop: 8,
  marginBottom: 16,
  fontSize: '0.8rem',
  color: '#64748b',
  lineHeight: 1.4,
});

export const ActionButtons = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: 8,
});

export const ActionButton = styled(Button)({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.7rem',
  borderRadius: 8,
  padding: '4px 12px',
  minWidth: 'auto',
  '&:hover': {
    transform: 'none',
  },
});