import type { SxProps, Theme } from '@mui/material';

export const dashboardContainer: SxProps<Theme> = {
  p: { xs: 2, sm: 3, md: 4 },
  backgroundColor: '#f8fafc',
  minHeight: '100vh',
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
};

export const sectionTitle: SxProps<Theme> = {
  fontWeight: 700,
  color: '#0f172a',
  mb: 2,
};

export const quickActionButton: SxProps<Theme> = {
  justifyContent: 'flex-start',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.8rem',
  borderRadius: '40px',
  borderColor: '#e2e8f0',
  color: '#1e293b',
  py: 0.8,
  '&:hover': { borderColor: '#8B1D23', color: '#8B1D23' },
};

export const pendingTrainerPaper: SxProps<Theme> = {
  p: 2,
  borderRadius: '16px',
  border: '1px solid #eef2f6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: 2,
};

export const trainerAvatar: SxProps<Theme> = {
  bgcolor: '#8B1D23',
  width: 40,
  height: 40,
  fontSize: '1rem',
  fontWeight: 600,
};

export const approveButton: SxProps<Theme> = {
  borderRadius: '30px',
  textTransform: 'none',
  bgcolor: '#1f6e43',
  '&:hover': { bgcolor: '#165a34' },
  fontSize: '0.7rem',
};

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

export const tableDateCell: SxProps<Theme> = {
  color: '#64748b',
};

export const addAnnouncementButton: SxProps<Theme> = {
  borderRadius: '40px',
  textTransform: 'none',
  fontWeight: 600,
  bgcolor: '#8B1D23',
  '&:hover': { bgcolor: '#6d1620' },
};

export const addUserButton: SxProps<Theme> = {
  borderRadius: '40px',
  textTransform: 'none',
  fontWeight: 600,
  borderColor: '#cbd5e1',
  color: '#1e293b',
};

export const publishedChip = {
  bgcolor: '#e0f2e9',
  color: '#1f6e43',
  fontWeight: 600,
  borderRadius: '30px',
  fontSize: '0.7rem',
};

export const draftChip = {
  bgcolor: '#f1f5f9',
  color: '#64748b',
  fontWeight: 600,
  borderRadius: '30px',
  fontSize: '0.7rem',
};

