import { useState } from 'react';
import { Stack, MenuItem } from '@mui/material';
import { ModalWrapper } from '../../../components/common/modal/ModalWrapper';
import { FormField } from '../../../components/ui/Forms/FormField';
import { Button } from '../../../components/ui/button/Button';

interface CreateGroupProps {
  open: boolean;
  onClose: () => void;
  onSave: (group: any) => void;
}

const CreateGroups = ({ open, onClose, onSave }: CreateGroupProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    trainerName: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      studentsCount: 0,
      trainerCount: 1,
      createdDate: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <ModalWrapper open={open} onClose={onClose} title="Create Training Group" maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <FormField
            label="Group Title"
            name="title"
            placeholder="e.g., Geometry Masters"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <FormField
            label="Description"
            name="description"
            placeholder="Enter group purpose and goals..."
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
            Create Group
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default Create;
