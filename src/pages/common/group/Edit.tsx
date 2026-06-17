import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, MenuItem } from '@mui/material';
import { ModalWrapper } from '../../../components/common/modal/ModalWrapper';
import { FormField } from '../../../components/ui/Forms/FormField';
import { Button } from '../../../components/ui/button/Button';
import type { GroupData } from '../../../types';

interface EditGroupProps {
  open: boolean;
  onClose: () => void;
  group: GroupData | null;
  onSave: (group: GroupData) => void;
}

const EditGroups = ({ open, onClose, group, onSave }: EditGroupProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    trainerName: '',
  });

  useEffect(() => {
    if (group) {
      setFormData({
        title: group.title,
        description: group.description,
        trainerName: group.trainerName,
      });
    }
  }, [group]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (group) {
      onSave({
        ...group,
        ...formData,
      });
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
            value={formData.title}
            onChange={handleChange}
            required
          />
          <FormField
            label={t('form.labels.description')}
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            required
          />
          <FormField
            select
            label={t('group.edit.assignTrainer')}
            name="trainerName"
            value={formData.trainerName}
            onChange={handleChange}
            required
          >
            <MenuItem value="Jane Smith">Jane Smith</MenuItem>
            <MenuItem value="Emily Davis">Emily Davis</MenuItem>
            <MenuItem value="Ahmad Omar">Ahmad Omar</MenuItem>
          </FormField>
        </Stack>
        <Button sx={{ mt: 3 }} variantType="default" type="submit">
            {t('buttons.save')}
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default EditGroups;
