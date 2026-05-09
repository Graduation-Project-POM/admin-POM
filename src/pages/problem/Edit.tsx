import { useState, useEffect } from 'react';
import {
  Box,
  MenuItem,
  Stack,
} from '@mui/material';
import { ModalWrapper } from '../../components/common/modal/ModalWrapper';
import { FormField } from '../../components/ui/Forms/FormField';
import { Button } from '../../components/ui/button/Button';

interface ProblemFormData {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  visibility: string;
  tags: string;
}

interface EditProblemProps {
  open: boolean;
  onClose: () => void;
  problem: any | null;
  onSave: (problem: any) => void;
}

const EditProblem = ({ open, onClose, problem, onSave }: EditProblemProps) => {
  const [formData, setFormData] = useState<ProblemFormData>({
    id: '',
    title: '',
    category: '',
    difficulty: 'Easy',
    visibility: 'general',
    tags: '',
  });

  useEffect(() => {
    if (problem) {
      setFormData({
        ...problem,
        tags: Array.isArray(problem.tags) ? problem.tags.join(', ') : '',
      });
    }
  }, [problem]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedData = {
      ...problem,
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
    };

    onSave(updatedData);
    onClose();
  };

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Edit Problem"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <FormField
            label="Problem Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <FormField
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
            <FormField
              select
              label="Difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
            >
              <MenuItem value="Easy">Easy</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Hard">Hard</MenuItem>
            </FormField>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <FormField
              select
              label="Visibility"
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              required
            >
              <MenuItem value="general">General</MenuItem>
              <MenuItem value="group-specific">Group-specific</MenuItem>
            </FormField>
            <FormField
              label="Tags (Comma separated)"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
            />
          </Box>
        </Stack>
        <Button sx={{ mt: 3 }} variantType="default" type="submit">
            Save Changes
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default EditProblem;
