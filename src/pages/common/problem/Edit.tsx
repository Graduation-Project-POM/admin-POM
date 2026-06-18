import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Stack, Alert, Switch } from '@mui/material';
import { ModalWrapper } from '../../../components/common/modal/ModalWrapper';
import { FormField } from '../../../components/ui/Forms/FormField';
import { Label } from '../../../components/ui/label/Label';
import { ImageUploadField } from '../../../components/ui/Forms/ImageUploadField';
import { Button } from '../../../components/ui/button/Button';

export interface ProblemEditValues {
  id: number | string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  description: string;
  difficulty: string;
  isPublished: boolean;
}

interface EditProblemProps {
  open: boolean;
  onClose: () => void;
  problem: any | null;
  onSave: (data: ProblemEditValues) => void | Promise<void>;
}

type FieldConfig = {
  name: keyof ProblemEditValues;
  label: string;
  type: "text" | "select" | "textarea" | "switch";
  required?: boolean;
  placeholder?: string;
  rows?: number;
  options?: { label: string; value: string }[];
};

const emptyForm: ProblemEditValues = {
  id: 0,
  title: '',
  category: '',
  description: '',
  difficulty: 'Easy',
  isPublished: false,
};

const EditProblem = ({ open, onClose, problem, onSave }: EditProblemProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ProblemEditValues>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (problem) {
      setFormData({
        id: problem.id ?? 0,
        title: problem.title ?? '',
        category: problem.category ?? problem.topic ?? '',
        description: problem.description ?? problem.statement ?? '',
        difficulty: problem.difficulty ?? 'Easy',
        isPublished: problem.isPublished ?? false,
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

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, isPublished: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || t('problem.form.saveError'));
    } finally {
      setSubmitting(false);
    }
  };

  const fields: FieldConfig[] = [
    { name: "title", label: t("problem.form.problemTitle"), type: "text", required: true },
    { name: "category", label: t("problem.form.category"), type: "text", required: true },
    { name: "description", label: t("problem.form.description"), type: "textarea", rows: 4, placeholder: t("problem.form.descriptionPlaceholder") },
    {
      name: "difficulty",
      label: t("problem.form.difficulty"),
      type: "select",
      required: true,
      options: [
        { label: t("problem.difficulty.Easy"), value: "Easy" },
        { label: t("problem.difficulty.Medium"), value: "Medium" },
        { label: t("problem.difficulty.Hard"), value: "Hard" },
      ],
    },
    { name: "isPublished", label: t("problem.form.published"), type: "switch" },
  ];

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={t("problem.form.editTitle")}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Stack spacing={3} sx={{ mt: 1 }}>
          {fields.map((field) =>
            field.type === "switch" ? (
              <Box key={field.name}>
                <Label>{field.label}</Label>
                <Box sx={{ display: 'flex', alignItems: 'center', minHeight: 40 }}>
                  <Switch
                    name={field.name}
                    checked={formData.isPublished}
                    onChange={handleSwitchChange}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#8B1D23",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: "#8B1D23",
                      },
                    }}
                  />
                </Box>
              </Box>
            ) : (
              <FormField
                key={field.name}
                type={field.type === "select" ? "select" : "text"}
                label={field.label}
                name={field.name}
                value={formData[field.name] as string}
                onChange={handleChange}
                required={field.required}
                placeholder={field.placeholder}
                options={field.options}
                multiline={field.type === "textarea"}
                rows={field.rows}
              />
            ),
          )}
        </Stack>
        <Button sx={{ mt: 3 }} variantType="default" type="submit" disabled={submitting}>
          {submitting ? t("common.loading") : t("problem.form.saveChanges")}
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default EditProblem;
