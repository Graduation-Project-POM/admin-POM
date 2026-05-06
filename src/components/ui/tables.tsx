// SharedTable.tsx
import React, { useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, styled, createTheme, ThemeProvider, CssBaseline, Typography,
  Avatar, Chip, IconButton, Checkbox
} from '@mui/material';
import { MoreVertical, Search } from 'lucide-react';

// ... الثيم والإعدادات السابقة كما هي ...
export const theme = createTheme({
  typography: {
    fontFamily: "Lenos, sans-serif",
  },
});


const primaryColor = '#7A1E1E';

const TableContainerStyled = styled(TableContainer)({
  borderRadius: '10px',
  border: '1px solid #e5e7eb',
  boxShadow: 'none',
  backgroundColor: '#fff',
});

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

const StatusChip = styled(Chip)<{ status: string }>(({ status }) => ({
  height: '22px',
  fontSize: '11px',
  fontWeight: 600,
  borderRadius: '6px',
  ...(status === 'active' && {
    backgroundColor: '#e7f7ec',
    color: '#166534',
  }),
  ...(status === 'inactive' && {
    backgroundColor: '#fdecec',
    color: '#991b1b',
  }),
  ...(status === 'pending' && {
    backgroundColor: '#fff7e0',
    color: '#92400e',
  }),
}));

const HeaderBox = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '18px',
  paddingBottom: '12px',
  borderBottom: '1px solid #e5e7eb',
});

const SearchBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 10px',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  backgroundColor: '#fff',
  '& input': {
    border: 'none',
    outline: 'none',
    fontSize: '13px',
    width: '180px',
  },
});

const UserCell = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
});


interface Column {
  id: string;
  label: string;
  render?: (row: any) => React.ReactNode; // دالة مخصصة لعرض الخلية
}

interface SharedTableProps {
  title?: string;
  data: any[];                // البيانات من الـ API
  columns: Column[];          // تعريف الأعمدة
  searchPlaceholder?: string;
  onRowSelect?: (selectedIds: string[]) => void;
}

export const SharedTable: React.FC<SharedTableProps> = ({
  title = 'Data',
  data,
  columns,
  searchPlaceholder = 'Search...',
  onRowSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // البحث عبر كل البيانات (قابل للتخصيص)
  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
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
        {/* header & search ... */}
        {/* نفس الكود السابق لكن مع dynamic placeholders */}
        <TableContainerStyled component={Paper}>
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
        </TableContainerStyled>
      </Box>
    </ThemeProvider>
  );
};