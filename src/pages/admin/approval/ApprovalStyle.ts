import { styled } from '@mui/material/styles';
import { Box, Card, Chip, Avatar, Typography, Button } from '@mui/material';

export const PageContainer = styled(Box)({
  padding: '40px 24px',
  minHeight: '100vh',
});

export const HeaderSection = styled(Box)({
  marginBottom: '40px',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px',
});

export const IconBadge = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 56,
  height: 56,
  borderRadius: '16px',
  background: 'linear-gradient(135deg, rgba(139, 29, 35, 0.15) 0%, rgba(139, 29, 35, 0.05) 100%)',
  color: '#8B1D23',
  fontSize: '28px',
  flexShrink: 0,
});

export const PendingCard = styled(Card)({
  borderRadius: '16px',
  border: '2px solid #e2e8f0',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  marginBottom: '40px',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #8B1D23 0%, #b68083ff 100%)',
  },
});

export const PendingBadge = styled(Chip)({
  position: 'absolute',
  top: 16,
  right: 16,
  backgroundColor: '#fef3c7',
  color: '#92400e',
  fontWeight: 700,
  fontSize: '12px',
  height: '32px',
  border: '1px solid #fde047',
});

export const UserAvatar = styled(Avatar)({
  width: 56,
  height: 56,
  backgroundColor: '#8B1D23',
  fontSize: '24px',
  fontWeight: 700,
  boxShadow: '0 4px 12px rgba(139, 29, 35, 0.2)',
});

export const InfoItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '12px',
});

export const InfoIcon = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  backgroundColor: '#f1f5f9',
  color: '#8B1D23',
  flexShrink: 0,
});

export const InfoLabel = styled(Typography)({
  fontSize: '12px',
  color: '#94a3b8',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

export const InfoValue = styled(Typography)({
  fontSize: '14px',
  color: '#1e293b',
  fontWeight: 600,
});

export const ActionButton = styled(Button)<{ component?: string; variant?: string; color?: string }>(
  ({ variant, color }) => ({
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '12px',
    borderRadius: '8px',
    transition: 'all 0.25s ease',
    minWidth: 'unset',
    height: '34px',
    padding: '6px 12px',
    '& .MuiButton-startIcon': {
      marginRight: '4px',
    },
    ...(variant === 'contained' && {
      backgroundColor: '#8B1D23',
      color: '#ffffff',
      boxShadow: '0 2px 8px rgba(139, 29, 35, 0.18)',
      '&:hover': {
        backgroundColor: '#6d1620',
        boxShadow: '0 4px 14px rgba(139, 29, 35, 0.22)',
        transform: 'translateY(-1px)',
      },
    }),
    ...(color === 'error' && {
      borderColor: '#fee2e2',
      color: '#dc2626',
      border: '1px solid #fee2e2',
      '&:hover': {
        backgroundColor: '#fee2e2',
        borderColor: '#fca5a5',
      },
    }),
  }),
);

export const StatusChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status: string }>(({ status }) => {
  const statusMap: Record<string, any> = {
    Approved: { bg: '#dcfce7', text: '#166534' },
    Rejected: { bg: '#fee2e2', text: '#991b1b' },
    Pending: { bg: '#fef3c7', text: '#92400e' },
  };
  const { bg, text } = statusMap[status] || statusMap.Pending;
  return {
    height: '28px',
    fontSize: '12px',
    fontWeight: 600,
    borderRadius: '8px',
    backgroundColor: bg,
    color: text,
    border: 'none',
  };
});

export const UserCell = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});