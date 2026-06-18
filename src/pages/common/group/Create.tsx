import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Stack,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
  OutlinedInput,
  InputLabel,
  FormControl,
  Chip,
  Box,
} from '@mui/material';
import { ModalWrapper } from '../../../components/common/modal/ModalWrapper';
import { FormField } from '../../../components/ui/Forms/FormField';
import { Button } from '../../../components/ui/button/Button';
import { studentService } from '../../../services/studentService';
import type { StudentOption } from '../../../services/studentService';
import { trainerService } from '../../../services/trainerService';
import type { TrainerOption } from '../../../services/trainerService';

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

const CreateGroups = ({ open, onClose, onSave }: CreateGroupProps) => {
  const { t } = useTranslation();
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
    trainerService.getAll().then(setTrainers).catch(() => setTrainers([]));
    studentService.getAccepted().then(setStudents).catch(() => setStudents([]));
  }, [open]);

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

          <FormControl fullWidth size="small">
            <InputLabel>{t('group.create.assignTrainer')}</InputLabel>
            <Select
              label={t('group.create.assignTrainer')}
              value={trainerId === '' ? '' : String(trainerId)}
              onChange={(e) => setTrainerId(Number(e.target.value))}
            >
              {trainers.map((tr) => (
                <MenuItem key={tr.id} value={String(tr.id)}>
                  {tr.name}
                  {tr.specialization ? ` — ${tr.specialization}` : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>{t('group.create.members', 'Members')}</InputLabel>
            <Select
              multiple
              value={studentIds}
              onChange={(e) =>
                setStudentIds(
                  typeof e.target.value === 'string'
                    ? []
                    : (e.target.value as number[]),
                )
              }
              input={<OutlinedInput label={t('group.create.members', 'Members')} />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as number[]).map((id) => {
                    const s = students.find((x) => x.id === id);
                    return <Chip key={id} size="small" label={s ? s.name : id} />;
                  })}
                </Box>
              )}
            >
              {students.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  <Checkbox checked={studentIds.includes(s.id)} />
                  <ListItemText primary={s.name} secondary={s.email} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Button sx={{ mt: 3 }} variantType="default" type="submit">
          {t('group.list.createGroup')}
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default CreateGroups;
