import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Stack,
  Typography,
  Avatar,
  Checkbox,
  InputAdornment,
  TextField,
} from '@mui/material';
import { Search, Users } from 'lucide-react';
import { Button } from '../button/Button';
import { brand, neutral } from '../../../theme';

export interface MemberPickerOption {
  id: number;
  name: string;
  email?: string;
}

interface MemberPickerProps {
  options: MemberPickerOption[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  label?: string;
  maxHeight?: number;
}

const BRAND = brand[500];

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

export const MemberPicker = ({
  options,
  selectedIds,
  onChange,
  label,
  maxHeight = 280,
}: MemberPickerProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        (o.email ?? '').toLowerCase().includes(q),
    );
  }, [options, search]);

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((o) => selectedIds.includes(o.id));

  const toggle = (id: number) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id],
    );
  };

  const toggleSelectAll = () => {
    const ids = filtered.map((o) => o.id);
    if (allFilteredSelected) {
      onChange(selectedIds.filter((id) => !ids.includes(id)));
    } else {
      onChange(Array.from(new Set([...selectedIds, ...ids])));
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
          mb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Users size={16} color={BRAND} />
          <Typography sx={{ fontWeight: 700, fontSize: '14px', color: neutral[800] }}>
            {label ?? t('group.create.members', 'Members')}
          </Typography>
          {selectedIds.length > 0 && (
            <Box
              sx={{
                px: 1,
                py: '1px',
                borderRadius: '999px',
                bgcolor: BRAND,
                color: neutral[0],
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              {t('group.create.membersSelected', {
                count: selectedIds.length,
                defaultValue: '{{count}} selected',
              })}
            </Box>
          )}
        </Box>
        {filtered.length > 0 && (
          <Button
            variantType="outline"
            size="small"
            type="button"
            onClick={toggleSelectAll}
            sx={{ fontSize: '12px', px: 1.5, py: 0.25, height: '28px' }}
          >
            {allFilteredSelected
              ? t('group.create.clearAll', 'Clear')
              : t('group.create.selectAll', 'Select all')}
          </Button>
        )}
      </Box>

      <TextField
        fullWidth
        size="small"
        placeholder={t(
          'group.create.searchMembers',
          'Search students by name or email...',
        )}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 1.5 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search size={16} color={neutral[400]} />
              </InputAdornment>
            ),
          },
        }}
      />

      <Box
        sx={{
          maxHeight,
          overflowY: 'auto',
          border: `1px solid ${neutral[100]}`,
          borderRadius: '12px',
          p: 1,
          bgcolor: neutral[50],
        }}
      >
        {filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography sx={{ color: neutral[400], fontWeight: 600, fontSize: '13px' }}>
              {options.length === 0
                ? t('group.create.noMembersAvailable', 'No students available')
                : t('group.create.noSearchResults', 'No students match your search')}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={0.75}>
            {filtered.map((o) => {
              const selected = selectedIds.includes(o.id);
              return (
                <Box
                  key={o.id}
                  onClick={() => toggle(o.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    bgcolor: selected ? '#fef2f2' : neutral[0],
                    border: selected ? `1px solid ${BRAND}` : '1px solid #eef2f7',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      borderColor: selected ? BRAND : neutral[300],
                      bgcolor: selected ? '#fef2f2' : neutral[50],
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: selected ? BRAND : '#fef2f2',
                      color: selected ? neutral[0] : BRAND,
                      fontSize: '13px',
                      fontWeight: 700,
                    }}
                  >
                    {initials(o.name)}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      noWrap
                      sx={{ fontWeight: 700, fontSize: '14px', color: neutral[800] }}
                    >
                      {o.name}
                    </Typography>
                    {o.email && (
                      <Typography noWrap sx={{ fontSize: '12px', color: neutral[400] }}>
                        {o.email}
                      </Typography>
                    )}
                  </Box>
                  <Checkbox
                    checked={selected}
                    tabIndex={-1}
                    sx={{ color: neutral[300], '&.Mui-checked': { color: BRAND } }}
                  />
                </Box>
              );
            })}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default MemberPicker;
