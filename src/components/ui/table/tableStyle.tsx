import { createTheme, styled, TableCell, TableHead, TableRow } from "@mui/material";

export const theme = createTheme({
  typography: {
    fontFamily: "Lenos, sans-serif",
  },
});

export const StyledTableHead = styled(TableHead)({
  backgroundColor: "#f9fafb",
  borderBottom: "2px solid #e5e7eb",
  "& th": {
    fontWeight: 700,
    color: "#374151",
    fontSize: "12px",
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    padding: "14px",
  },
});

export const StyledTableRow = styled(TableRow)({
  borderBottom: "1px solid #f3f4f6",
  "&:hover": {
    backgroundColor: "#fafafa",
  },
});

export const StyledTableCell = styled(TableCell)({
  padding: "12px 14px",
  color: "#1f2937",
  fontSize: "14px",
});
