import React, { useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, styled, createTheme, ThemeProvider, CssBaseline, IconButton, Checkbox
} from '@mui/material';
import { MoreVertical } from 'lucide-react';

export const theme = createTheme({
  typography: {
    fontFamily: "Lenos, sans-serif",
  },
});

// No longer need TableContainerStyled – use sx directly
// If you want to keep it, remove component={Paper} usage

const StyledTableHead = styled(TableHead)({
  backgroundColor: '#f9fafb',
  borderBottom: '2px solid #e5e7eb',
  '& th': {
    fontWeight: 700,
    color: '#374151',
    fontSize: '12px',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    padding: '14px',
  },
});

const StyledTableRow = styled(TableRow)({
  borderBottom: '1px solid #f3f4f6',
  '&:hover': {
    backgroundColor: '#fafafa',
  },
});

const StyledTableCell = styled(TableCell)({
  padding: '12px 14px',
  color: '#1f2937',
  fontSize: '14px',
});

interface Column {
  id: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface SharedTableProps {
  title?: string;
  data: any[];
  columns: Column[];
  onRowSelect?: (selectedIds: string[]) => void;
}

export const SharedTable: React.FC<SharedTableProps> = ({
  data,
  columns,
  onRowSelect,
}) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes("")
    )
  );

  const handleSelectAll = (checked: boolean) => {
    const newSelected = checked ? new Set(filteredData.map((row) => row.id)) : new Set();
    setSelectedRows(newSelected);
    onRowSelect?.(Array.from(newSelected));
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) newSelected.add(id);
    else newSelected.delete(id);
    setSelectedRows(newSelected);
    onRowSelect?.(Array.from(newSelected));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 3, bgcolor: '#f9fafb', minHeight: '100vh' }}>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: 1,
            border: '1px solid #e5e7eb',
            backgroundColor: '#fff',
          }}
        >
          <Table>
            <StyledTableHead>
              <TableRow>
                <StyledTableCell padding="checkbox">
                  <Checkbox
                    checked={selectedRows.size === filteredData.length && filteredData.length > 0}
                    indeterminate={selectedRows.size > 0 && selectedRows.size < filteredData.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </StyledTableCell>
                {columns.map((col) => (
                  <StyledTableCell key={col.id}>{col.label}</StyledTableCell>
                ))}
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {filteredData.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRows.has(row.id)}
                      onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                    />
                  </StyledTableCell>
                  {columns.map((col) => (
                    <StyledTableCell key={col.id}>
                      {col.render ? col.render(row) : row[col.id]}
                    </StyledTableCell>
                  ))}
                  <StyledTableCell align="center">
                    <IconButton><MoreVertical size={18} /></IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </ThemeProvider>
  );
};