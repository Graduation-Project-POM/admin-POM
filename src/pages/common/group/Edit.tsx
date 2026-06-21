import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack } from '@mui/material';
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
  onSave: (group: GroupData & { studentIds: number[] }) => void;
}

const EditGroups = ({ open, onClose, group, onSave }: EditGroupProps) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [studentIds, setStudentIds] = useState<number[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);

  useEffect(() => {
    if (!open || !group) return;
    setTitle(group.title);
    setDescription(group.description);
    studentService.getAccepted().then(setStudents).catch(() => setStudents([]));
    groupService
      .getStudents(Number(group.id))
      .then((m) => setStudentIds(m.map((x) => x.studentId)))
      .catch(() => setStudentIds([]));
  }, [open, group]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (group) {
      onSave({ ...group, title, description, studentIds });
    }
    onClose();
  };

  return (
    <ModalWrapper open={open} onClose={onClose} title={t('group.edit.title')} maxWidth="sm">
      <form onSubmit={handleSubmit}>
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
        <Button sx={{ mt: 3 }} variantType="default" type="submit">
          {t('buttons.save')}
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default EditGroups;
