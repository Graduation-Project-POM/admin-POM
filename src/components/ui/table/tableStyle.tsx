import {
  TableCell,
  TableHead,
  TableRow,
  type TableCellProps,
  type TableHeadProps,
  type TableRowProps,
} from "@mui/material";

/**
 * Table chrome.
 *
 * This file used to export its own `createTheme()` which SharedTable wrapped
 * around every table. That nested theme carried no `direction`, so tables lost
 * RTL when the app was in Arabic. The styles now sit on the shared app theme
 * and the rogue theme is gone.
 *
 * Header/body typography, padding, borders and the row hover live on the
 * theme (MuiTableCell / MuiTableRow in src/theme/index.ts), so SharedTable and
 * the hand-built tables on the dashboards and leaderboard look identical. These
 * wrappers only keep the names SharedTable already imports.
 */
export const StyledTableHead = (props: TableHeadProps) => <TableHead {...props} />;

// `hover` opts the row into the theme's neutral hover tint.
export const StyledTableRow = (props: TableRowProps) => <TableRow hover {...props} />;

export const StyledTableCell = (props: TableCellProps) => <TableCell {...props} />;
