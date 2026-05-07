import { styled } from "@mui/material/styles";
import {
  Container,
  Box,
  TextField,
  Card,
} from "@mui/material";

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
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
});

export const StyledSearchField = styled(TextField)({
  maxWidth: 400,
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#fff",
    "& fieldset": {
      borderColor: "#e5e7eb",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#8B1D23",
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
  backgroundColor: "#f8fafc",
  borderRadius: "16px",
  border: "2px dashed #e2e8f0",
});

export const StyledCard = styled(Card)({
  borderRadius: 16,
  border: "1px solid #e5e7eb",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  padding: 20,
});
