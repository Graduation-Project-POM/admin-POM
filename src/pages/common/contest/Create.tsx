import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Stack, MenuItem, Box } from "@mui/material";
import { ModalWrapper } from "../../../components/common/modal/ModalWrapper";
import { FormField } from "../../../components/ui/Forms/FormField";
import { Button } from "../../../components/ui/button/Button";
import { groupService } from "../../../services/groupService";
import type { Group } from "../../../types/group";

interface CreateContestProps {
  open: boolean;
  onClose: () => void;
  onSave: (contest: any) => void;
  /**
   * When the contest is created from within a group, the group is fixed and the
   * selector is hidden. Otherwise a (role-filtered) group selector is shown.
   */
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
  const [groupId, setGroupId] = useState<number | "">("");
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    if (!open) return;
    setFormData({ title: "", difficulty: "Medium", startDate: "", endDate: "" });
    setGroupId("");
    // Only load selectable groups when the group isn't fixed by context.
    // getAll() is already role-scoped by the backend: admins see every group,
    // trainers see only the groups they own.
    if (fixedGroupId == null) {
      groupService.getAll().then(setGroups).catch(() => setGroups([]));
    }
  }, [open, fixedGroupId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalGroupId = fixedGroupId ?? (groupId === "" ? 0 : groupId);
    // Group is required — guard even though the field is marked required.
    if (!finalGroupId) return;
    onSave({
      ...formData,
      groupId: finalGroupId,
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
