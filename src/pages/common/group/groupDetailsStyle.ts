import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/material';
import { brand, neutral } from '../../../theme';

export const StyledContainer = styled(Container)(({ theme }) => ({
  padding: '0',
  [theme.breakpoints.up('sm')]: {
    padding: '0 16px',
  },
}));

export const HeaderSection = styled(Box)({
  padding: '24px',
  backgroundColor: neutral[50],
  borderRadius: '12px',
  border: `1px solid ${neutral[200]}`,
  marginBottom: '24px',
});

export const TabContentWrapper = styled(Box)({
  padding: '0 24px 24px 24px',
});

export const StatsCard = styled(Box)({
  padding: '16px',
  backgroundColor: neutral[100],
  borderRadius: '8px',
  border: `1px solid ${neutral[200]}`,
  textAlign: 'center',
  '& .stat-value': {
    fontSize: '24px',
    fontWeight: 700,
    color: brand[500],
    marginBottom: '4px',
  },
  '& .stat-label': {
    fontSize: '12px',
    fontWeight: 600,
    color: neutral[500],
    textTransform: 'uppercase',
  },
});
export const StudentCardStyled = styled(Box)({
  padding: '16px',
  border: `1px solid ${neutral[200]}`,
  borderRadius: '12px',
  backgroundColor: neutral[0],

  minHeight: '220px',
  height: '220px',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',

  transition: 'all 0.3s ease',

  '&:hover': {
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
    borderColor: brand[500],
    transform: 'translateY(-2px)',
  },
});

export const SearchInput = styled('input')(() => ({
  width: '100%',
  maxWidth: '420px',
  height: '48px',
  padding: '0 16px',
  border: `1px solid ${neutral[300]}`,
  borderRadius: '12px',
  outline: 'none',
  fontSize: '15px',
  marginBottom: '32px',
  transition: 'all 0.2s ease',
  '&:focus': {
    borderColor: brand[500],
    boxShadow: '0 0 0 3px rgba(139, 29, 35, 0.1)',
  },
  '&::placeholder': {
    color: neutral[400],
    fontSize: '14px',
  },
}));