import { styled } from '@mui/material/styles';
import { Container, Box, TextField } from '@mui/material';

export const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

export const TitleWrapper = styled(Box)({
  marginBottom: 8,
});

export const SubtitleWrapper = styled(Box)({
  marginBottom: 32,
  color: 'text.secondary',
});

export const SearchWrapper = styled(Box)({
  marginBottom: 32,
  maxWidth: 400,
});

export const StyledSearchField = styled(TextField)({
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
  '@media (min-width: 900px)': {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
});

export const EmptyStateWrapper = styled(Box)({
  textAlign: 'center',
  paddingTop: 64,
  paddingBottom: 64,
});