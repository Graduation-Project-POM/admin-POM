import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Stack, MenuItem, Box } from "@mui/material";
import { ModalWrapper } from "../../../components/common/modal/ModalWrapper";
import { FormField } from "../../../components/ui/Forms/FormField";
import { Button } from "../../../components/ui/button/Button";
import type { ContestData } from "../../../types";

interface EditContestProps {
  open: boolean;
  onClose: () => void;
  contest: ContestData | null;
  onSave: (contest: ContestData) => void;
}

const EditContest = ({ open, onClose, contest, onSave }: EditContestProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: "",
    status: "Upcoming",
    difficulty: "Medium",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (contest) {
      setFormData({
        title: contest.title,
        status: contest.status,
        difficulty: contest.difficulty,
        startDate: contest.startDate,
        endDate: contest.endDate,
      });
    }
  }, [contest]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contest) {
      onSave({
        ...contest,
        ...(formData as any),
      });
    }
    onClose();
  };

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={t("contest.edit.title")}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <FormField
            label={t("contest.fields.contestTitle")}
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <FormField
              select
              label={t("contest.fields.status")}
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <MenuItem value="Upcoming">{t("contest.status.upcoming")}</MenuItem>
              <MenuItem value="Ongoing">{t("contest.status.ongoing")}</MenuItem>
              <MenuItem value="Ended">{t("contest.status.ended")}</MenuItem>
            </FormField>
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
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <FormField
              label={t("contest.fields.startDateTime")}
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
            <FormField
              label={t("contest.fields.endDateTime")}
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </Box>
        </Stack>

        <Button sx={{ mt: 3 }} variantType="default" type="submit">
          {t("contest.edit.submitButton")}
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default EditContest;
