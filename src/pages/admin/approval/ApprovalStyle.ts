import { styled } from '@mui/material/styles';
import { Box, Card, Chip, Avatar, Typography, Button } from '@mui/material';
import { brand, neutral, statusTone } from '../../../theme';

export const PageContainer = styled(Box)({
  padding: 0, // page padding comes from the app layout
  minHeight: '100vh',
});

export const PendingCard = styled(Card)({
  borderRadius: '16px',
  border: `2px solid ${neutral[200]}`,
  backgroundColor: neutral[0],
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
    backgroundColor: brand[500],
  },
});

export const PendingBadge = styled(Chip)({
  position: 'absolute',
  top: 16,
  right: 16,
  backgroundColor: statusTone.warning.bg,
  color: statusTone.warning.fg,
  fontWeight: 700,
  fontSize: '12px',
  height: '32px',
  border: '1px solid #fde047',
});

export const UserAvatar = styled(Avatar)({
  width: 56,
  height: 56,
  backgroundColor: brand[500],
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
  backgroundColor: neutral[100],
  color: brand[500],
  flexShrink: 0,
});

export const InfoLabel = styled(Typography)({
  fontSize: '12px',
  color: neutral[400],
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

export const InfoValue = styled(Typography)({
  fontSize: '14px',
  color: neutral[800],
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
      backgroundColor: brand[500],
      color: neutral[0],
      boxShadow: '0 2px 8px rgba(139, 29, 35, 0.18)',
      '&:hover': {
        backgroundColor: brand[600],
        boxShadow: '0 4px 14px rgba(139, 29, 35, 0.22)',
        transform: 'translateY(-1px)',
      },
    }),
    ...(color === 'error' && {
      borderColor: statusTone.danger.bg,
      color: statusTone.danger.solid,
      border: `1px solid ${statusTone.danger.bg}`,
      '&:hover': {
        backgroundColor: statusTone.danger.bg,
        borderColor: '#fca5a5',
      },
    }),
  }),
);

export const StatusChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status: string }>(({ status }) => {
  const statusMap: Record<string, any> = {
    Approved: { bg: statusTone.success.bg, text: statusTone.success.fg },
    Rejected: { bg: statusTone.danger.bg, text: statusTone.danger.fg },
    Pending: { bg: statusTone.warning.bg, text: statusTone.warning.fg },
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