import { styled } from "@mui/material/styles";
import {
  Container,
  Box,
  TextField,
  Card,
} from "@mui/material";
import { brand, neutral } from '../../../theme';

export const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: "0",
  paddingBottom: theme.spacing(4),
}));

export const HeaderWrapper = styled(Box)({
  marginBottom: 8,
});

export const SubtitleWrapper = styled(Box)({
  marginBottom: 16,
  color: "text.secondary",
});

export const SearchWrapper = styled(Box)({
  marginBottom: 32,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
});

export const StyledSearchField = styled(TextField)({
  flex: "1 1 260px",
  maxWidth: 400,
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: neutral[0],
    "& fieldset": {
      borderColor: neutral[200],
    },
    "&.Mui-focused fieldset": {
      borderColor: brand[500],
      borderWidth: "1.5px",
    },
  },
});

export const ContestsGrid = styled(Box)({
  display: "grid",
  gap: 24,
  gridTemplateColumns: "1fr",
  "@media (min-width: 600px)": {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
  "@media (min-width: 900px)": {
    gridTemplateColumns: "repeat(3, 1fr)",
  },
});

export const EmptyStateWrapper = styled(Box)({
  textAlign: "center",
  paddingTop: 64,
  paddingBottom: 64,
  backgroundColor: neutral[50],
  borderRadius: "16px",
  border: `2px dashed ${neutral[200]}`,
});

export const StyledCard = styled(Card)({
  borderRadius: 16,
  border: `1px solid ${neutral[200]}`,
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  padding: 20,
});
