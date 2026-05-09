import { useState } from "react";
import { Stack, MenuItem, Box } from "@mui/material";
import { ModalWrapper } from "../../components/common/modal/ModalWrapper";
import { FormField } from "../../components/ui/Forms/FormField";
import { Button } from "../../components/ui/button/Button";

interface CreateContestProps {
  open: boolean;
  onClose: () => void;
  onSave: (contest: any) => void;
}

const CreateContest = ({ open, onClose, onSave }: CreateContestProps) => {
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
      title="Create New Contest"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <FormField
            label="Contest Title"
            name="title"
            placeholder="e.g., Spring Programming 2026"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <FormField
              select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <MenuItem value="Upcoming">Upcoming</MenuItem>
              <MenuItem value="Ongoing">Ongoing</MenuItem>
              <MenuItem value="Ended">Ended</MenuItem>
            </FormField>
            <FormField
              select
              label="Difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
            >
              <MenuItem value="Easy">Easy</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Hard">Hard</MenuItem>
            </FormField>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <FormField
              label="Start Date & Time"
              name="startDate"
              type="text"
              placeholder="Apr 15, 2026 at 09:00 AM"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
            <FormField
              label="End Date & Time"
              name="endDate"
              type="text"
              placeholder="Apr 22, 2026 at 09:00 PM"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </Box>
        </Stack>

        <Button sx={{ mt: 3 }} variantType="default" type="submit">
          Create Contest
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default CreateContest;
