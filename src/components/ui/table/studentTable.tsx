import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Column, TableRowBase } from '../../../types/index';

interface StudentTableProps<TRow extends TableRowBase = TableRowBase> {
  data: TRow[];
  columns: Column<TRow>[];
  searchPlaceholder?: string;
  onRowClick?: (row: TRow) => void;
}

const TableWrapper = styled(Box)({
  border: '1px solid #e5e7eb',
  borderRadius: '16px',
  overflow: 'hidden',
  backgroundColor: '#fff',
});

const TableHeader = styled(Box)({
  display: 'grid',
  padding: '14px 20px',
  backgroundColor: '#f8fafc',
  borderBottom: '1px solid #e5e7eb',
});

const TableRow = styled(Box)<{ clickable?: boolean }>(({ clickable }) => ({
  display: 'grid',
  padding: '14px 20px',
  borderBottom: '1px solid #f1f5f9',
  transition: 'all 0.2s ease',
  cursor: clickable ? 'pointer' : 'default',
  '&:last-child': {
    borderBottom: 'none',
  },
  '&:hover': {
    backgroundColor: '#fafafa',
  },
}));

export function SharedTable<TRow extends TableRowBase>({
  data,
  columns,
  searchPlaceholder,
  onRowClick,
}: StudentTableProps<TRow>) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = data.filter((row) =>
    columns.some((col) => {
      const value = (row as Record<string, unknown>)[col.id];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return false;
    })
  );

  const gridCols = `repeat(${columns.length}, 1fr)`;

  return (
    <Box>
      <TextField
        size="small"
        placeholder={searchPlaceholder ?? t('ui.table.searchPlaceholder')}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          mb: 3,
          width: '100%',
          maxWidth: 400,
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            backgroundColor: '#fff',
            '& fieldset': { borderColor: '#e5e7eb' },
            '&.Mui-focused fieldset': { borderColor: '#8B1D23', borderWidth: '1.5px' },
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} color="#9ca3af" />
              </InputAdornment>
            ),
          },
        }}
      />

      <TableWrapper>
       <Box sx={{ overflowX: 'auto' }}>
        <TableHeader sx={{ gridTemplateColumns: gridCols, minWidth: 640 }}>
          {columns.map((col) => (
            <Typography
              key={col.id}
              sx={{
                fontWeight: 700,
                color: '#64748b',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {col.label}
            </Typography>
          ))}
        </TableHeader>

        {filtered.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography sx={{ color: '#94a3b8', fontWeight: 600 }}>{t('ui.table.noDataFound')}</Typography>
          </Box>
        ) : (
          filtered.map((row) => (
            <TableRow
              key={row.id}
              sx={{ gridTemplateColumns: gridCols, minWidth: 640 }}
              clickable={!!onRowClick}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <Box key={col.id}>
                  {col.render ? (
                    col.render(row)
                  ) : (
                    <Typography sx={{ fontSize: '14px', color: '#1e293b', fontWeight: 500 }}>
                      {(row as Record<string, unknown>)[col.id] as React.ReactNode}
                    </Typography>
                  )}
                </Box>
              ))}
            </TableRow>
          ))
        )}
       </Box>
      </TableWrapper>

      {filtered.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 500 }}>
            {t('ui.table.showingItems', { shown: filtered.length, total: data.length })}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
