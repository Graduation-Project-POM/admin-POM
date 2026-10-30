import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { brand, neutral } from '../../../theme';

export const StyledContainer = styled(Box)(() => ({
  padding: '0',
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

export const StudentCardStyled = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',

  padding: '20px',
  borderRadius: '16px',

  minHeight: '220px',
  height: '100%',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',

  backgroundColor: neutral[0],

  border: '1px solid rgba(226,232,240,0.9)',

  boxShadow: `
    0 4px 10px rgba(15, 23, 42, 0.04),
    0 1px 2px rgba(15, 23, 42, 0.06)
  `,

  backdropFilter: 'blur(10px)',

  transition: 'all 0.35s ease',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    backgroundColor: brand[500],
  },

  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-40px',
    right: '-40px',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'rgba(139, 29, 35, 0.05)',
    transition: 'all 0.4s ease',
  },

  '&:hover': {
    transform: 'translateY(-6px) scale(1.01)',

    borderColor: 'rgba(139, 29, 35, 0.25)',

    boxShadow: `
      0 20px 30px rgba(15, 23, 42, 0.08),
      0 8px 12px rgba(15, 23, 42, 0.05)
    `,

    '&::after': {
      transform: 'scale(1.2)',
      background: 'rgba(139, 29, 35, 0.08)',
    },
  },

  [theme.breakpoints.down('sm')]: {
    padding: '16px',
    borderRadius: '16px',
    minHeight: '200px',
  },
}));

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

export const ProgressCard = styled(Box)({
  padding: '20px',
  border: `1px solid ${neutral[200]}`,
  borderRadius: '12px',
  backgroundColor: neutral[0],
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  },
});
