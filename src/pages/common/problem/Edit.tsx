import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  MenuItem,
  Stack,
} from '@mui/material';
import { ModalWrapper } from '../../../components/common/modal/ModalWrapper';
import { FormField } from '../../../components/ui/Forms/FormField';
import { ImageUploadField } from '../../../components/ui/Forms/ImageUploadField';
import { Button } from '../../../components/ui/button/Button';

interface ProblemFormData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
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
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ProblemFormData>({
    id: '',
    title: '',
    description: '',
    imageUrl: '',
    category: '',
    difficulty: 'Easy',
    visibility: 'general',
    tags: '',
  });

  useEffect(() => {
    if (problem) {
      setFormData({
        ...problem,
        description: problem.description ?? '',
        imageUrl: problem.imageUrl ?? '',
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
      title={t("problem.form.editTitle")}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <FormField
            label={t("problem.form.problemTitle")}
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <FormField
            label={t("problem.form.description", "Description")}
            name="description"
            placeholder={t("problem.form.descriptionPlaceholder", "Describe the problem...")}
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            required
          />

          <ImageUploadField
            label={t("problem.form.image", "Image (optional)")}
            value={formData.imageUrl}
            onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <FormField
              label={t("problem.form.category")}
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
            <FormField
              select
              label={t("problem.form.difficulty")}
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
            >
              <MenuItem value="Easy">{t("problem.difficulty.Easy")}</MenuItem>
              <MenuItem value="Medium">{t("problem.difficulty.Medium")}</MenuItem>
              <MenuItem value="Hard">{t("problem.difficulty.Hard")}</MenuItem>
            </FormField>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <FormField
              select
              label={t("problem.form.visibility")}
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              required
            >
              <MenuItem value="general">{t("problem.visibility.general")}</MenuItem>
              <MenuItem value="group-specific">{t("problem.visibility.groupSpecific")}</MenuItem>
            </FormField>
            <FormField
              label={t("problem.form.tags")}
              name="tags"
              value={formData.tags}
              onChange={handleChange}
            />
          </Box>
        </Stack>
        <Button sx={{ mt: 3 }} variantType="default" type="submit">
            {t("problem.form.saveChanges")}
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default EditProblem;
