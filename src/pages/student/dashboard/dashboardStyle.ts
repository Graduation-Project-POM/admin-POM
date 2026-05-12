// studentDashboardStyle.ts
import type { SxProps, Theme } from '@mui/material';

export const dashboardContainer: SxProps<Theme> = {
  p: { xs: 2, sm: 3, md: 4 },
  backgroundColor: '#f8fafc',
  minHeight: '100vh',
};

export const welcomeBanner: SxProps<Theme> = {
  background: 'linear-gradient(135deg, #8B1D23 0%, #8B1D23 60%)',
  borderRadius: '28px',
  p: { xs: 2, sm: 3 },
  mb: 4,
  color: '#fff',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-30%',
    right: '-10%',
    width: '250px',
    height: '250px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
  },
};

export const pageTitle: SxProps<Theme> = {
  fontWeight: 800,
  color: '#0f172a',
  letterSpacing: '-0.02em',
  mb: 3,
};

export const statCard: SxProps<Theme> = {
  borderRadius: '20px',
  border: '1px solid #eef2f6',
  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
  transition: 'transform 0.2s',
  '&:hover': { transform: 'translateY(-4px)' },
};

export const statTitle: SxProps<Theme> = {
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#64748b',
  textTransform: 'uppercase',
  mb: 1,
};

export const statValue: SxProps<Theme> = {
  fontSize: '2rem',
  fontWeight: 800,
  color: '#0f172a',
  lineHeight: 1.2,
};

export const statTrendBox: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
  mt: 1,
};

export const statIconBox = (bgColor: string): SxProps<Theme> => ({
  bgcolor: bgColor,
  p: 1.5,
  borderRadius: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const sectionCard: SxProps<Theme> = {
  borderRadius: '20px',
  border: '1px solid #eef2f6',
  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
  height: 'auto',
};

export const sectionTitle: SxProps<Theme> = {
  fontWeight: 700,
  color: '#0f172a',
  mb: 2,
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};

export const quickActionButton: SxProps<Theme> = {
  justifyContent: 'flex-start',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.75rem',
  borderRadius: '40px',
  borderColor: '#e2e8f0',
  color: '#1e293b',
  py: 0.8,
  '&:hover': { borderColor: '#8B1D23', color: '#8B1D23' },
};

export const activityItem: SxProps<Theme> = {
  p: 1.5,
  borderRadius: '16px',
  border: '1px solid #f1f5f9',
  transition: 'all 0.2s',
  '&:hover': { backgroundColor: '#fef9f9', borderColor: '#fecaca' },
};

export const contestCard: SxProps<Theme> = {
  p: 2,
  borderRadius: '18px',
  border: '1px solid #eef2f6',
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
  border: '1px solid #eef2f6',
};

export const tableHeadCell: SxProps<Theme> = {
  fontWeight: 700,
  color: '#1e293b',
};

export const tableBodyCell: SxProps<Theme> = {
  fontWeight: 500,
  color: '#0f172a',
};

export const gradeChip = (grade: number): SxProps<Theme> => ({
  bgcolor: grade >= 90 ? '#e0f2e9' : grade >= 70 ? '#fffbeb' : '#fee2e2',
  color: grade >= 90 ? '#1f6e43' : grade >= 70 ? '#b45309' : '#b91c1c',
  fontWeight: 700,
  borderRadius: '30px',
});