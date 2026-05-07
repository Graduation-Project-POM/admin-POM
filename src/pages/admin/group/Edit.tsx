import { useState, useEffect } from 'react';
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

const Edit = ({ open, onClose, group, onSave }: EditGroupProps) => {
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
    <ModalWrapper open={open} onClose={onClose} title="Edit Training Group" maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <FormField
            label="Group Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <FormField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            required
          />
          <FormField
            select
            label="Assign Trainer"
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
            Save Changes
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default Edit;
