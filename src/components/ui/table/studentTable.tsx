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
import { EmptyState } from '../../common/states';
import { brand, neutral, radius } from '../../../theme';

interface StudentTableProps<TRow extends TableRowBase = TableRowBase> {
  data: TRow[];
  columns: Column<TRow>[];
  searchPlaceholder?: string;
  onRowClick?: (row: TRow) => void;
}

const TableWrapper = styled(Box)({
  border: `1px solid ${neutral[200]}`,
  borderRadius: `${radius['2xl']}px`,
  overflow: 'hidden',
  backgroundColor: neutral[0],
});

const TableHeader = styled(Box)({
  display: 'grid',
  padding: '14px 20px',
  backgroundColor: neutral[50],
  borderBottom: `1px solid ${neutral[200]}`,
});

const TableRow = styled(Box)<{ clickable?: boolean }>(({ clickable }) => ({
  display: 'grid',
  alignItems: 'center',
  padding: '14px 20px',
  borderBottom: `1px solid ${neutral[100]}`,
  transition: 'background-color .15s ease',
  cursor: clickable ? 'pointer' : 'default',
  '&:last-child': {
    borderBottom: 'none',
  },
  '&:hover': {
    backgroundColor: clickable ? brand[50] : neutral[50],
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
        sx={{ mb: 3, width: '100%', maxWidth: 400 }}
        slotProps={{
          htmlInput: { 'aria-label': searchPlaceholder ?? t('ui.table.searchPlaceholder') },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} color={neutral[400]} />
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
                color: neutral[600],
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {col.label}
            </Typography>
          ))}
        </TableHeader>

        {filtered.length === 0 ? (
          <EmptyState
            variant="bare"
            icon={<Search size={24} />}
            title={searchQuery ? t('ui.table.noMatches') : t('ui.table.noRows')}
            description={
              searchQuery
                ? t('ui.table.noMatchesHint', { query: searchQuery })
                : t('ui.table.noRowsHint')
            }
          />
        ) : (
          filtered.map((row) => (
            <TableRow
              key={row.id}
              sx={{ gridTemplateColumns: gridCols, minWidth: 640 }}
              clickable={!!onRowClick}
              onClick={() => onRowClick?.(row)}
              {...(onRowClick
                ? {
                    role: 'button',
                    tabIndex: 0,
                    onKeyDown: (e: React.KeyboardEvent) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onRowClick(row);
                      }
                    },
                  }
                : {})}
            >
              {columns.map((col) => (
                <Box key={col.id}>
                  {col.render ? (
                    col.render(row)
                  ) : (
                    <Typography sx={{ fontSize: '14px', color: neutral[800], fontWeight: 500 }}>
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
          <Typography variant="body2" sx={{ color: neutral[400], fontWeight: 500 }}>
            {t('ui.table.showingItems', { shown: filtered.length, total: data.length })}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
