import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Stack, MenuItem, Box, Alert } from "@mui/material";
import { getApiErrorMessage } from "../../../utils/apiError";
import { ModalWrapper } from "../../../components/common/modal/ModalWrapper";
import { FormField } from "../../../components/ui/Forms/FormField";
import { Button } from "../../../components/ui/button/Button";
import { groupService } from "../../../services/groupService";
import type { ContestData } from "../../../types";
import type { Group } from "../../../types/group";

interface CreateContestProps {
  open: boolean;
  onClose: () => void;
  onSave: (contest: ContestData & { groupId: number }) => void | Promise<unknown>;

  fixedGroupId?: number;
}

const CreateContest = ({ open, onClose, onSave, fixedGroupId }: CreateContestProps) => {
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
  const [groupId, setGroupId] = useState<number | "">("");
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    if (!open || fixedGroupId != null) return;
    let ignore = false;
    groupService
      .getAll()
      .then((data) => { if (!ignore) setGroups(data); })
      .catch(() => { if (!ignore) setGroups([]); });
    return () => { ignore = true; };
  }, [open, fixedGroupId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dateError) return;
    const finalGroupId = fixedGroupId ?? (groupId === "" ? 0 : groupId);
    if (!finalGroupId) {
      setError(t("contest.fields.groupRequired", "Please choose a group."));
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await onSave({
        id: String(Math.floor(Math.random() * 10000)),
        title: formData.title,
        status: "Upcoming",
        difficulty: formData.difficulty,
        startDate: formData.startDate,
        endDate: formData.endDate,
        participants: 0,
        problemsCount: 0,
        groupId: finalGroupId,
      });
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, t("contest.errors.createFailed", "Failed to create contest")));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={t("contest.create.title")}
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
            placeholder={t("contest.fields.contestTitlePlaceholder")}
            value={formData.title}
            onChange={handleChange}
            required
          />

          {fixedGroupId == null && (
            <FormField
              select
              label={t("contest.fields.group", "Group")}
              name="groupId"
              value={groupId === "" ? "" : String(groupId)}
              onChange={(e) => setGroupId(Number(e.target.value))}
              required
            >
              {groups.length === 0 ? (
                <MenuItem disabled value="">
                  {t("contest.fields.noGroups", "No groups available")}
                </MenuItem>
              ) : (
                groups.map((g) => (
                  <MenuItem key={g.id} value={String(g.id)}>
                    {g.name}
                  </MenuItem>
                ))
              )}
            </FormField>
          )}

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
          {t("contest.create.submitButton")}
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default CreateContest;
