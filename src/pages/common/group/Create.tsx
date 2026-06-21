import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Stack,
  Box,
  Typography,
  Avatar,
  Checkbox,
  InputAdornment,
  TextField,
  Autocomplete,
} from '@mui/material';
import { Search, Users, ShieldCheck } from 'lucide-react';
import { ModalWrapper } from '../../../components/common/modal/ModalWrapper';
import { FormField } from '../../../components/ui/Forms/FormField';
import { Button } from '../../../components/ui/button/Button';
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
  const [memberSearch, setMemberSearch] = useState('');

  useEffect(() => {
    if (!open) return;
    setTitle('');
    setDescription('');
    setTrainerId('');
    setStudentIds([]);
    setMemberSearch('');
    if (isAdmin) {
      trainerService.getAll().then(setTrainers).catch(() => setTrainers([]));
    }
    studentService.getAccepted().then(setStudents).catch(() => setStudents([]));
  }, [open, isAdmin]);

  const filteredStudents = useMemo(() => {
    const q = memberSearch.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q),
    );
  }, [students, memberSearch]);

  const allFilteredSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((s) => studentIds.includes(s.id));

  const toggleStudent = (id: number) => {
    setStudentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    const filteredIds = filteredStudents.map((s) => s.id);
    if (allFilteredSelected) {
      setStudentIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setStudentIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

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

          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Users size={16} color={BRAND} />
                <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#1e293b' }}>
                  {t('group.create.members', 'Members')}
                </Typography>
                {studentIds.length > 0 && (
                  <Box
                    sx={{
                      px: 1,
                      py: '1px',
                      borderRadius: '999px',
                      bgcolor: BRAND,
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    {t('group.create.membersSelected', {
                      count: studentIds.length,
                      defaultValue: '{{count}} selected',
                    })}
                  </Box>
                )}
              </Box>
              {filteredStudents.length > 0 && (
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
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              sx={{ mb: 1.5 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={16} color="#9ca3af" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Box
              sx={{
                maxHeight: 280,
                overflowY: 'auto',
                border: '1px solid #f1f5f9',
                borderRadius: '12px',
                p: 1,
                bgcolor: '#fafafa',
              }}
            >
              {filteredStudents.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '13px' }}>
                    {students.length === 0
                      ? t('group.create.noMembersAvailable', 'No students available')
                      : t('group.create.noSearchResults', 'No students match your search')}
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={0.75}>
                  {filteredStudents.map((s) => {
                    const selected = studentIds.includes(s.id);
                    return (
                      <Box
                        key={s.id}
                        onClick={() => toggleStudent(s.id)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          p: 1,
                          borderRadius: '10px',
                          cursor: 'pointer',
                          bgcolor: selected ? '#fef2f2' : '#fff',
                          border: selected
                            ? `1px solid ${BRAND}`
                            : '1px solid #eef2f7',
                          transition: 'all 0.15s ease',
                          '&:hover': {
                            borderColor: selected ? BRAND : '#cbd5e1',
                            bgcolor: selected ? '#fef2f2' : '#f8fafc',
                          },
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: selected ? BRAND : '#fef2f2',
                            color: selected ? '#fff' : BRAND,
                            fontSize: '13px',
                            fontWeight: 700,
                          }}
                        >
                          {initials(s.name)}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            noWrap
                            sx={{ fontWeight: 700, fontSize: '14px', color: '#1e293b' }}
                          >
                            {s.name}
                          </Typography>
                          {s.email && (
                            <Typography
                              noWrap
                              sx={{ fontSize: '12px', color: '#94a3b8' }}
                            >
                              {s.email}
                            </Typography>
                          )}
                        </Box>
                        <Checkbox
                          checked={selected}
                          tabIndex={-1}
                          sx={{ color: '#cbd5e1', '&.Mui-checked': { color: BRAND } }}
                        />
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </Box>
          </Box>
        </Stack>

        <Button sx={{ mt: 3 }} variantType="default" type="submit">
          {t('group.list.createGroup')}
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default CreateGroups;
