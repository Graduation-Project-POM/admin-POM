import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Alert } from '@mui/material';
import { ModalWrapper } from '../../../components/common/modal/ModalWrapper';
import { FormField } from '../../../components/ui/Forms/FormField';
import { ImageUploadField } from '../../../components/ui/Forms/ImageUploadField';
import { Button } from '../../../components/ui/button/Button';
import { getApiErrorMessage } from '../../../utils/apiError';
import { ProblemExamplesEditor } from './ProblemExamplesEditor';
import { DIFFICULTY_LABEL } from '../../../types/problem';
import type { ProblemExample } from '../../../types/problem';
import { problemsService } from '../../../services/problemsService';

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
  // Bumped on every open so the image field remounts and drops its own upload error.
  const [openCount, setOpenCount] = useState(0);
  // Pages only pass part of the problem, so the full record is loaded from the
  // server on open. Saving waits for it so blank fields can't overwrite real data.
  const [loading, setLoading] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  // The form is long and the submit button sits at the bottom; bring a new error into view.
  useEffect(() => {
    if (error) errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [error]);

  // Refill from the problem every time the form opens, so changes that were
  // cancelled last time don't show up again when the same problem is reopened.
  useEffect(() => {
    if (open && problem) {
      setError(null);
      setOpenCount((n) => n + 1);
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
  }, [open, problem]);

  const problemId = problem?.id != null ? Number(problem.id) : NaN;
  useEffect(() => {
    if (!open || !Number.isFinite(problemId) || problemId <= 0) return;
    let ignore = false;
    setLoading(true);
    setLoadFailed(false);
    problemsService
      .getById(problemId)
      .then((detail) => {
        if (ignore) return;
        setFormData({
          id: detail.id,
          title: detail.title,
          category: detail.topic,
          description: detail.statement ?? '',
          constraints: detail.constraints ?? '',
          examples: Array.isArray(detail.examples) ? detail.examples : [],
          difficulty: DIFFICULTY_LABEL[detail.difficulty] ?? 'Easy',
          imageUrl: detail.photoUrl ?? '',
          points: detail.points,
        });
        setStatus(detail.isPublished ? 'published' : 'draft');
      })
      .catch((err: unknown) => {
        if (ignore) return;
        setLoadFailed(true);
        setError(getApiErrorMessage(err, t('problem.form.loadError', 'Failed to load the problem. Close the form and try again.')));
      })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [open, problemId, t]);

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
          <Alert severity="error" sx={{ mb: 2 }} ref={errorRef}>
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
              nativeRequired={false}
              displayEmpty
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
            key={openCount}
            label={t("problem.form.image", "Problem image (optional)")}
            value={formData.imageUrl}
            onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
          />
        </Stack>
        <Button sx={{ mt: 3 }} variantType="default" type="submit" disabled={submitting || loading || loadFailed}>
          {submitting || loading ? t("common.loading") : t("problem.form.saveChanges")}
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default EditProblem;
