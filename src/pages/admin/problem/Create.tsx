import { useState } from 'react';
import {
  Box,
  MenuItem,
  Stack,
} from '@mui/material';
import { ModalWrapper } from '../../../components/common/modal/ModalWrapper';
import { FormField } from '../../../components/ui/Forms/FormField';
import { Button } from '../../../components/ui/button/Button';

interface ProblemFormData {
  title: string;
  category: string;
  difficulty: string;
  visibility: string;
  tags: string; // We'll handle tags as a comma-separated string for simplicity in the form
}

interface CreateProblemProps {
  open: boolean;
  onClose: () => void;
  onSave: (problem: any) => void;
}

const Create = ({ open, onClose, onSave }: CreateProblemProps) => {
  const [formData, setFormData] = useState<ProblemFormData>({
    title: '',
    category: '',
    difficulty: 'Easy',
    visibility: 'general',
    tags: '',
  });

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
    
    // Process tags from string to array
    const problemData = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      submissions: 0,
      successRate: 0,
    };

    onSave(problemData);
    setFormData({
      title: '',
      category: '',
      difficulty: 'Easy',
      visibility: 'general',
      tags: '',
    });
    onClose();
  };

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Create New Problem"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <FormField
            label="Problem Title"
            name="title"
            placeholder="e.g., Two Sum"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <FormField
              label="Category"
              name="category"
              placeholder="e.g., Array"
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
              placeholder="e.g., Array, Hash Table"
              value={formData.tags}
              onChange={handleChange}
            />
          </Box>
        </Stack>
        <Button sx={{ mt: 3 }} variantType="default" type="submit">
            Create Problem
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default Create;
