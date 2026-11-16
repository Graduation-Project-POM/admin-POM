import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Stack, MenuItem, Box, Alert } from "@mui/material";
import { getApiErrorMessage } from "../../../utils/apiError";
import { ModalWrapper } from "../../../components/common/modal/ModalWrapper";
import { FormField } from "../../../components/ui/Forms/FormField";
import { Button } from "../../../components/ui/button/Button";
import type { ContestData } from "../../../types";

interface EditContestProps {
  open: boolean;
  onClose: () => void;
  contest: ContestData | null;
  onSave: (contest: ContestData) => void | Promise<unknown>;
}

const EditContest = ({ open, onClose, contest, onSave }: EditContestProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: "",
    difficulty: "Medium",
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) setError(null);
  }, [open]);

  // Shown as soon as both dates are filled in, not after pressing save.
  const dateError =
    formData.startDate &&
    formData.endDate &&
    new Date(formData.endDate).getTime() <= new Date(formData.startDate).getTime()
      ? t("common.endBeforeStart", "End date must be after the start date.")
      : null;

  useEffect(() => {
    if (contest) {
      const toLocal = (v: string) => (v ? v.slice(0, 16) : "");
      setFormData({
        title: contest.title,
        difficulty: contest.difficulty,
        startDate: toLocal(contest.startDate),
        endDate: toLocal(contest.endDate),
      });
    }
  }, [contest]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contest || dateError) return;
    setError(null);
    setSubmitting(true);
    try {
      await onSave({ ...contest, ...formData });
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, t("contest.errors.updateFailed", "Failed to update contest")));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={t("contest.edit.title")}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        <Stack spacing={3} sx={{ mt: 1 }}>
          <FormField
            label={t("contest.fields.contestTitle")}
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <FormField
            select
            label={t("contest.fields.difficulty")}
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            required
          >
            <MenuItem value="Easy">{t("contest.difficulty.easy")}</MenuItem>
            <MenuItem value="Medium">{t("contest.difficulty.medium")}</MenuItem>
            <MenuItem value="Hard">{t("contest.difficulty.hard")}</MenuItem>
          </FormField>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <FormField
              label={t("contest.fields.startDateTime")}
              name="startDate"
              type="datetime-local"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
            <FormField
              label={t("contest.fields.endDateTime")}
              name="endDate"
              type="datetime-local"
              value={formData.endDate}
              onChange={handleChange}
              required
              error={!!dateError}
              helperText={dateError ?? undefined}
            />
          </Box>
        </Stack>

        <Button sx={{ mt: 3 }} variantType="default" type="submit" disabled={submitting || !!dateError}>
          {t("contest.edit.submitButton")}
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default EditContest;
