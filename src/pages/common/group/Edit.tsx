import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Alert } from '@mui/material';
import { getApiErrorMessage } from '../../../utils/apiError';
import { ModalWrapper } from '../../../components/common/modal/ModalWrapper';
import { FormField } from '../../../components/ui/Forms/FormField';
import { Button } from '../../../components/ui/button/Button';
import { MemberPicker } from '../../../components/ui/MemberPicker/MemberPicker';
import type { GroupData } from '../../../types';
import { studentService } from '../../../services/studentService';
import type { StudentOption } from '../../../services/studentService';
import { groupService } from '../../../services/groupService';

interface EditGroupProps {
  open: boolean;
  onClose: () => void;
  group: GroupData | null;
  onSave: (group: GroupData & { studentIds: number[] }) => void | Promise<unknown>;
}

const EditGroups = ({ open, onClose, group, onSave }: EditGroupProps) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [studentIds, setStudentIds] = useState<number[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !group) return;
    setTitle(group.title);
    setDescription(group.description);
    setError(null);
    studentService.getAccepted().then(setStudents).catch(() => setStudents([]));
    groupService
      .getStudents(Number(group.id))
      .then((m) => setStudentIds(m.map((x) => x.studentId)))
      .catch(() => setStudentIds([]));
  }, [open, group]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!group) return;
    setError(null);
    setSubmitting(true);
    try {
      await onSave({ ...group, title, description, studentIds });
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, t('group.errors.updateFailed', 'Failed to update group')));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalWrapper open={open} onClose={onClose} title={t('group.edit.title')} maxWidth="sm">
      <form onSubmit={handleSubmit}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        <Stack spacing={3} sx={{ mt: 1 }}>
          <FormField
            label={t('group.edit.groupTitle')}
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <FormField
            label={t('form.labels.description')}
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            required
          />

          <MemberPicker
            options={students}
            selectedIds={studentIds}
            onChange={setStudentIds}
          />
        </Stack>
        <Button sx={{ mt: 3 }} variantType="default" type="submit" disabled={submitting}>
          {t('buttons.save')}
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default EditGroups;
