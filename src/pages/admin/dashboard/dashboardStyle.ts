import type { SxProps, Theme } from '@mui/material';
import { brand, neutral, statusTone } from '../../../theme';

export const quickActionButton: SxProps<Theme> = {
  justifyContent: 'flex-start',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.8rem',
  borderRadius: '40px',
  borderColor: neutral[200],
  color: neutral[800],
  py: 0.8,
  '&:hover': { borderColor: brand[500], color: brand[500] },
};

export const pendingTrainerPaper: SxProps<Theme> = {
  p: 2,
  borderRadius: '16px',
  border: `1px solid ${neutral[200]}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: 2,
};

export const trainerAvatar: SxProps<Theme> = {
  bgcolor: brand[500],
  width: 40,
  height: 40,
  fontSize: '1rem',
  fontWeight: 600,
};

export const approveButton: SxProps<Theme> = {
  borderRadius: '30px',
  textTransform: 'none',
  bgcolor: statusTone.success.fg,
  '&:hover': { bgcolor: '#165a34' },
  fontSize: '12px',
};

export const tableContainer: SxProps<Theme> = {
  borderRadius: '16px',
  border: `1px solid ${neutral[200]}`,
};

export const tableHeadCell: SxProps<Theme> = {
  fontWeight: 700,
  color: neutral[800],
};

export const tableBodyCell: SxProps<Theme> = {
  fontWeight: 500,
  color: neutral[900],
};

export const tableDateCell: SxProps<Theme> = {
  color: neutral[500],
};

export const addAnnouncementButton: SxProps<Theme> = {
  borderRadius: '40px',
  textTransform: 'none',
  fontWeight: 600,
  bgcolor: brand[500],
  '&:hover': { bgcolor: brand[600] },
};

export const addUserButton: SxProps<Theme> = {
  borderRadius: '40px',
  textTransform: 'none',
  fontWeight: 600,
  borderColor: neutral[300],
  color: neutral[800],
};

export const publishedChip = {
  bgcolor: statusTone.success.bg,
  color: statusTone.success.fg,
  fontWeight: 600,
  borderRadius: '30px',
  fontSize: '12px',
};

export const draftChip = {
  bgcolor: neutral[100],
  color: neutral[500],
  fontWeight: 600,
  borderRadius: '30px',
  fontSize: '12px',
};

