import { styled } from '@mui/material/styles';
import { Box, TextField } from '@mui/material';

export const StyledContainer = styled(Box)(() => ({
  padding: '0',
}));

export const TitleWrapper = styled(Box)({
  marginBottom: 8,
});

export const SubtitleWrapper = styled(Box)({
  marginBottom: 32,
});

export const SearchWrapper = styled(Box)({
  marginBottom: 32,
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '16px',
});

export const StyledSearchField = styled(TextField)({
  flex: '1 1 260px',
  maxWidth: 400,
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

export const GroupsGrid = styled(Box)({
  display: 'grid',
  gap: 24,
  gridTemplateColumns: '1fr',
  '@media (min-width: 600px)': {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  '@media (min-width: 1200px)': {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
});

export const EmptyStateWrapper = styled(Box)({
  textAlign: 'center',
  padding: '64px 0',
  backgroundColor: '#f8fafc',
  borderRadius: '16px',
  border: '2px dashed #e2e8f0',
});
