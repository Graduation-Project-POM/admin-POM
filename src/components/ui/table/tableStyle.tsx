import { styled, TableCell, TableHead, TableRow } from "@mui/material";
import { brand, neutral } from '../../../theme';

/**
 * Table chrome.
 *
 * This file used to export its own `createTheme()` which SharedTable wrapped
 * around every table. That nested theme carried no `direction`, so tables lost
 * RTL when the app was in Arabic. The styles now sit on the shared app theme
 * and the rogue theme is gone.
 */

export const StyledTableHead = styled(TableHead)({
  backgroundColor: neutral[50],
  "& th": {
    fontWeight: 700,
    color: neutral[600],
    fontSize: "11.5px",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    padding: "14px",
    borderBottom: `1px solid ${neutral[200]}`,
    whiteSpace: "nowrap",
  },
});

export const StyledTableRow = styled(TableRow)({
  transition: "background-color .15s ease",
  "& td": { borderBottom: `1px solid ${neutral[100]}` },
  "&:last-of-type td": { borderBottom: "none" },
  "&:hover": {
    backgroundColor: brand[50],
  },
});

export const StyledTableCell = styled(TableCell)({
  padding: "14px",
  color: neutral[800],
  fontSize: "14px",
  verticalAlign: "middle",
});
