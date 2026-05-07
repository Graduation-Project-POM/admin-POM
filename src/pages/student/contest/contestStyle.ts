// StudentContestsPage.styles.ts
import { styled } from '@mui/material/styles';
import { Box, Paper } from '@mui/material';

export const PageContainer = styled(Box)({
  padding: '32px 24px',
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
  minHeight: '100vh',
});

export const HeaderSection = styled(Box)({
  marginBottom: '32px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '20px',
});

export const TitleBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

export const StatsCard = styled(Paper)({
  padding: '16px 20px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});
