import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Stack, MenuItem, Box } from "@mui/material";
import { ModalWrapper } from "../../../components/common/modal/ModalWrapper";
import { FormField } from "../../../components/ui/Forms/FormField";
import { Button } from "../../../components/ui/button/Button";

interface CreateContestProps {
  open: boolean;
  onClose: () => void;
  onSave: (contest: any) => void;
}

const CreateContest = ({ open, onClose, onSave }: CreateContestProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: "",
    status: "Upcoming",
    difficulty: "Medium",
    startDate: "",
    endDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: Math.floor(Math.random() * 10000),
      participants: 0,
      problemsCount: 0,
    });
    onClose();
  };

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={t("contest.create.title")}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <FormField
            label={t("contest.fields.contestTitle")}
            name="title"
            placeholder={t("contest.fields.contestTitlePlaceholder")}
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
              type="text"
              placeholder={t("contest.fields.startDatePlaceholder")}
              value={formData.startDate}
              onChange={handleChange}
              required
            />
            <FormField
              label={t("contest.fields.endDateTime")}
              name="endDate"
              type="text"
              placeholder={t("contest.fields.endDatePlaceholder")}
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </Box>
        </Stack>

        <Button sx={{ mt: 3 }} variantType="default" type="submit">
          {t("contest.create.submitButton")}
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default CreateContest;
