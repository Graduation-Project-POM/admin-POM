import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Stack,
  Box,
  Typography,
  Avatar,
  InputAdornment,
  TextField,
  Autocomplete,
} from '@mui/material';
import { ShieldCheck } from 'lucide-react';
import { ModalWrapper } from '../../../components/common/modal/ModalWrapper';
import { FormField } from '../../../components/ui/Forms/FormField';
import { Button } from '../../../components/ui/button/Button';
import { MemberPicker } from '../../../components/ui/MemberPicker/MemberPicker';
import { studentService } from '../../../services/studentService';
import type { StudentOption } from '../../../services/studentService';
import { trainerService } from '../../../services/trainerService';
import type { TrainerOption } from '../../../services/trainerService';
import { useAuth } from '../../../services/AuthContext';

interface CreateGroupProps {
  open: boolean;
  onClose: () => void;
  onSave: (group: {
    title: string;
    description: string;
    trainerId: number;
    studentIds: number[];
  }) => void;
}

const BRAND = '#8B1D23';

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

const CreateGroups = ({ open, onClose, onSave }: CreateGroupProps) => {
  const { t } = useTranslation();
  const { role } = useAuth();
  const isAdmin = role === 'Admin';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [trainerId, setTrainerId] = useState<number | ''>('');
  const [studentIds, setStudentIds] = useState<number[]>([]);
  const [trainers, setTrainers] = useState<TrainerOption[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);

  useEffect(() => {
    if (!open) return;
    setTitle('');
    setDescription('');
    setTrainerId('');
    setStudentIds([]);
    if (isAdmin) {
      trainerService.getAll().then(setTrainers).catch(() => setTrainers([]));
    }
    studentService.getAccepted().then(setStudents).catch(() => setStudents([]));
  }, [open, isAdmin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      trainerId: trainerId === '' ? 0 : trainerId,
      studentIds,
    });
    onClose();
  };

  return (
    <ModalWrapper open={open} onClose={onClose} title={t('group.create.title')} maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <FormField
            label={t('group.create.groupTitle')}
            name="title"
            placeholder={t('group.create.groupTitlePlaceholder')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <FormField
            label={t('form.labels.description')}
            name="description"
            placeholder={t('group.create.descriptionPlaceholder')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            required
          />

          {isAdmin ? (
            <Autocomplete
              size="small"
              options={trainers}
              value={trainers.find((tr) => tr.id === trainerId) ?? null}
              onChange={(_, value) => setTrainerId(value ? value.id : '')}
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
                        sx={{ fontWeight: 700, fontSize: '14px', color: '#1e293b' }}
                      >
                        {tr.name}
                      </Typography>
                      {tr.specialization && (
                        <Typography noWrap sx={{ fontSize: '12px', color: '#94a3b8' }}>
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
                                color: '#fff',
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
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                bgcolor: '#fef2f2',
                border: '1px solid #fde2e2',
                borderRadius: '12px',
              }}
            >
              <ShieldCheck size={20} color={BRAND} />
              <Typography sx={{ fontSize: '13px', color: '#7f1d1d', fontWeight: 600 }}>
                {t(
                  'group.create.autoCoachNote',
                  "You'll be assigned as this group's coach.",
                )}
              </Typography>
            </Box>
          )}

          <MemberPicker
            options={students}
            selectedIds={studentIds}
            onChange={setStudentIds}
          />
        </Stack>

        <Button sx={{ mt: 3 }} variantType="default" type="submit">
          {t('group.list.createGroup')}
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default CreateGroups;
