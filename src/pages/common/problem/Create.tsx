import { useState } from 'react';
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
  title: string;
  description: string;
  imageUrl: string; 
  category: string;
  difficulty: string;
  visibility: string;
  tags: string; 
}

interface CreateProblemProps {
  open: boolean;
  onClose: () => void;
  onSave: (problem: any) => void;
}

const CreateProblem = ({ open, onClose, onSave }: CreateProblemProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ProblemFormData>({
    title: '',
    description: '',
    imageUrl: '',
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
      description: '',
      imageUrl: '',
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
      title={t("problem.form.createTitle")}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <FormField
            label={t("problem.form.problemTitle")}
            name="title"
            placeholder={t("problem.form.problemTitlePlaceholder")}
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
              placeholder={t("problem.form.categoryPlaceholder")}
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
              placeholder={t("problem.form.tagsPlaceholder")}
              value={formData.tags}
              onChange={handleChange}
            />
          </Box>
        </Stack>
        <Button sx={{ mt: 3 }} variantType="default" type="submit">
            {t("problem.form.createSubmit")}
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default CreateProblem;
