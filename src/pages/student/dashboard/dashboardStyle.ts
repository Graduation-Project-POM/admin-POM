// studentDashboardStyle.ts
import type { SxProps, Theme } from '@mui/material';
import { brand, neutral, radius, statusTone } from '../../../theme';

export const welcomeBanner: SxProps<Theme> = {
  // The old value stopped at 60% with the same colour at both ends, so it
  // rendered as a flat fill. A real depth ramp toward the darker brand step
  // gives the banner the dimension it was reaching for.
  background: `linear-gradient(135deg, ${brand[500]} 0%, ${brand[700]} 100%)`,
  borderRadius: `${radius['2xl']}px`,
  p: { xs: 2.5, sm: 3.5 },
  mb: 4,
  color: neutral[0],
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-30%',
    // insetInlineEnd so the highlight mirrors to the correct corner in Arabic.
    insetInlineEnd: '-10%',
    width: '250px',
    height: '250px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 70%)',
    pointerEvents: 'none',
  },
};

export const quickActionButton: SxProps<Theme> = {
  justifyContent: 'flex-start',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.75rem',
  borderRadius: '40px',
  borderColor: neutral[200],
  color: neutral[800],
  py: 0.8,
  '&:hover': { borderColor: brand[500], color: brand[500] },
};

export const activityItem: SxProps<Theme> = {
  p: 1.5,
  borderRadius: '16px',
  border: `1px solid ${neutral[100]}`,
  transition: 'all 0.2s',
  '&:hover': { backgroundColor: '#fef9f9', borderColor: statusTone.danger.border },
};

export const contestCard: SxProps<Theme> = {
  p: 2,
  borderRadius: '18px',
  border: `1px solid ${neutral[200]}`,
  transition: 'all 0.2s',
  cursor: 'pointer',
  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 20px rgba(0,0,0,0.08)', borderColor: '#f97316' },
};

export const streakCard: SxProps<Theme> = {
  background: 'linear-gradient(145deg, #FFF7ED 0%, #FFEDD5 100%)',
  borderRadius: '24px',
  p: 2.5,
  border: '1px solid #FED7AA',
};

export const badgeItem = (colorBg: string, borderColor: string) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  p: 1.5,
  borderRadius: '20px',
  bgcolor: colorBg,
  border: `1px solid ${borderColor}`,
});
export const tableContainer: SxProps<Theme> = {
  borderRadius: '16px',
  border: `1px solid ${neutral[200]}`,
  overflowX: 'auto',
};

export const tableHeadCell: SxProps<Theme> = {
  fontWeight: 700,
  color: neutral[800],
};

export const tableBodyCell: SxProps<Theme> = {
  fontWeight: 500,
  color: neutral[900],
};

export const gradeChip = (grade: number): SxProps<Theme> => ({
  bgcolor: grade >= 90 ? statusTone.success.bg : grade >= 70 ? statusTone.warning.bg : statusTone.danger.bg,
  color: grade >= 90 ? statusTone.success.fg : grade >= 70 ? statusTone.warning.fg : statusTone.danger.fg,
  fontWeight: 700,
  borderRadius: '30px',
});