import {
  Box,
  Typography,
  Avatar,
  InputAdornment,
  TextField,
  Autocomplete,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { TrainerOption } from '../../../services/trainerService';
import { brand, neutral } from '../../../theme';

const BRAND = brand[500];

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

interface TrainerPickerProps {
  trainers: TrainerOption[];
  trainerId: number | '';
  onChange: (trainerId: number | '') => void;
}

// Searchable trainer picker shared by the create and edit group forms.
export const TrainerPicker = ({ trainers, trainerId, onChange }: TrainerPickerProps) => {
  const { t } = useTranslation();
  return (
    <Autocomplete
      size="small"
      options={trainers}
      value={trainers.find((tr) => tr.id === trainerId) ?? null}
      onChange={(_, value) => onChange(value ? value.id : '')}
      getOptionLabel={(tr) => tr.name}
      isOptionEqualToValue={(opt, val) => opt.id === val.id}
      noOptionsText={t('group.create.noTrainers', 'No trainers available')}
      renderOption={(props, tr) => {
        const { key, ...rest } = props as typeof props & { key: string };
        return (
          <Box
            component="li"
            key={key}
            {...rest}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1 }}
          >
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: '#fef2f2',
                color: BRAND,
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              {initials(tr.name)}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                noWrap
                sx={{ fontWeight: 700, fontSize: '14px', color: neutral[800] }}
              >
                {tr.name}
              </Typography>
              {tr.specialization && (
                <Typography noWrap sx={{ fontSize: '12px', color: neutral[400] }}>
                  {tr.specialization}
                </Typography>
              )}
            </Box>
          </Box>
        );
      }}
      renderInput={(params) => {
        const selected = trainers.find((tr) => tr.id === trainerId) ?? null;
        return (
          <TextField
            {...params}
            label={t('group.create.assignTrainer')}
            placeholder={t('group.create.selectTrainer', 'Select a trainer...')}
            slotProps={{
              ...params.slotProps,
              input: {
                ...params.slotProps.input,
                startAdornment: selected ? (
                  <InputAdornment position="start">
                    <Avatar
                      sx={{
                        width: 26,
                        height: 26,
                        bgcolor: BRAND,
                        color: neutral[0],
                        fontSize: '11px',
                        fontWeight: 700,
                      }}
                    >
                      {initials(selected.name)}
                    </Avatar>
                  </InputAdornment>
                ) : (
                  params.slotProps.input.startAdornment
                ),
              },
            }}
          />
        );
      }}
    />
  );
};
