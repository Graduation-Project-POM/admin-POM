import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Alert } from '@mui/material';
import { ModalWrapper } from '../../../components/common/modal/ModalWrapper';
import { FormField } from '../../../components/ui/Forms/FormField';
import { ImageUploadField } from '../../../components/ui/Forms/ImageUploadField';
import { Button } from '../../../components/ui/button/Button';
import { getApiErrorMessage } from '../../../utils/apiError';
import { ProblemExamplesEditor } from './ProblemExamplesEditor';
import type { ProblemExample } from '../../../types/problem';

export interface ProblemEditValues {
  id: number | string;
  title: string;
  category: string;
  description: string;
  constraints: string;
  examples: ProblemExample[];
  difficulty: string;
  isPublished: boolean;
  imageUrl: string;
  points: number;   
}

type StatusChoice = '' | 'draft' | 'published';

export interface EditProblemSource {
  id?: number | string;
  title?: string;
  category?: string;
  topic?: string;
  description?: string;
  statement?: string | null;
  constraints?: string | null;
  examples?: ProblemExample[] | null;
  difficulty?: string;
  isPublished?: boolean;
  photoUrl?: string | null;
  imageUrl?: string;
  points?: number;
}

interface EditProblemProps {
  open: boolean;
  onClose: () => void;
  problem: EditProblemSource | null;
  onSave: (data: ProblemEditValues) => void | Promise<void>;
  requireStatus?: boolean;
}

type FieldConfig = {
  name: keyof ProblemEditValues;
  label: string;
  type: "text" | "select" | "textarea";
  required?: boolean;
  placeholder?: string;
  rows?: number;
  options?: { label: string; value: string }[];
};

const emptyForm: Omit<ProblemEditValues, 'isPublished'> = {
  id: 0,
  title: '',
  category: '',
  description: '',
  constraints: '',
  examples: [],
  difficulty: 'Easy',
  imageUrl: '',
  points: 100,
};

const EditProblem = ({
  open,
  onClose,
  problem,
  onSave,
  requireStatus = true,
}: EditProblemProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Omit<ProblemEditValues, 'isPublished'>>(emptyForm);
  const [status, setStatus] = useState<StatusChoice>('');
  const [statusTouched, setStatusTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (problem) {
      setFormData({
        id: problem.id ?? 0,
        title: problem.title ?? '',
        category: problem.category ?? problem.topic ?? '',
        description: problem.description ?? problem.statement ?? '',
        constraints: problem.constraints ?? '',
        examples: Array.isArray(problem.examples) ? problem.examples : [],
        difficulty: problem.difficulty ?? 'Easy',
        imageUrl: problem.photoUrl ?? problem.imageUrl ?? '',
        points: problem.points ?? 100,
      });
      if (problem.isPublished === true) setStatus('published');
      else if (problem.isPublished === false) setStatus('draft');
      else setStatus('');
      setStatusTouched(false);
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

  const handleStatusChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setStatus(e.target.value as StatusChoice);
    setStatusTouched(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requireStatus && status === '') {
      setStatusTouched(true);
      setError(t('problem.form.statusRequired'));
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await onSave({ ...formData, isPublished: status === 'published' });
      onClose();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, t('problem.form.saveError')));
    } finally {
      setSubmitting(false);
    }
  };

  const fields: FieldConfig[] = [
    { name: "title", label: t("problem.form.problemTitle"), type: "text", required: true },
    { name: "category", label: t("problem.form.category"), type: "text", required: true },
    { name: "description", label: t("problem.form.description"), type: "textarea", rows: 4, placeholder: t("problem.form.descriptionPlaceholder") },
    { name: "constraints", label: t("problem.form.constraints"), type: "textarea", rows: 3, placeholder: t("problem.form.constraintsPlaceholder") },
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
  ];

  const statusInvalid = requireStatus && statusTouched && status === '';

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
          {fields.map((field) => (
            <FormField
              key={field.name}
              type={field.type === "select" ? "select" : "text"}
              label={field.label}
              name={field.name}
              value={formData[field.name as keyof typeof formData] as string}
              onChange={handleChange}
              required={field.required}
              placeholder={field.placeholder}
              options={field.options}
              multiline={field.type === "textarea"}
              rows={field.rows}
            />
          ))}
          <ProblemExamplesEditor
            value={formData.examples}
            onChange={(examples) => setFormData((prev) => ({ ...prev, examples }))}
          />
          {requireStatus && (
            <FormField
              type="select"
              label={t("problem.form.statusLabel")}
              name="status"
              value={status}
              onChange={handleStatusChange}
              required
              error={statusInvalid}
              helperText={statusInvalid ? t('problem.form.statusRequired') : undefined}
              options={[
                { label: t("problem.form.statusPlaceholder"), value: '' },
                { label: t("problem.form.statusDraft"), value: 'draft' },
                { label: t("problem.form.statusPublish"), value: 'published' },
              ]}
            />
          )}
          <FormField
            type="number"
            label={t("problem.form.points", "Points")}
            name="points"
            value={formData.points}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, points: Number(e.target.value) }))
            }
            required
            placeholder="100"
            helperText={t("problem.form.pointsHelp", "Between 1 and 1000")}
          />
          <ImageUploadField
            label={t("problem.form.image", "Problem image (optional)")}
            value={formData.imageUrl}
            onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
          />
        </Stack>
        <Button sx={{ mt: 3 }} variantType="default" type="submit" disabled={submitting}>
          {submitting ? t("common.loading") : t("problem.form.saveChanges")}
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default EditProblem;
