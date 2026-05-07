import { Typography, Box, Stack } from "@mui/material";
import { ModalWrapper } from "../../../components/common/modal/ModalWrapper";
import { FormField } from "../../../components/ui/Forms/FormField";

interface TrainerRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  submitted: string;
  specialization: string;
  bio: string;
}

interface TrainerDetailsProps {
  open: boolean;
  onClose: () => void;
  trainer: TrainerRequest | null;
}

const DetailItem = ({ label, value }: { label: string; value?: string }) => (
  <Box>
    <Typography
      sx={{
        fontSize: "12px",
        fontWeight: 600,
        color: "#94a3b8",
        mb: 0.5,
        textTransform: "uppercase",
      }}
    >
      {label}
    </Typography>
    <Typography sx={{ color: "#1e293b", fontWeight: 500 }}>
      {value || "—"}
    </Typography>
  </Box>
);

export const ViewTrainerDetails = ({
  open,
  onClose,
  trainer,
}: TrainerDetailsProps) => {
  if (!trainer) return null;

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Trainer Request Details"
      maxWidth="sm"
    >
      <Stack spacing={3} sx={{ mt: 1 }}>
        <Stack direction="row" spacing={3}>
          <FormField
            type="text"
            label="Full Name"
            name="name"
            value={trainer.name}
            onChange={() => {}}
          />
          <FormField
            type="email"
            label="Email"
            name="email"
            value={trainer.email}
            onChange={() => {}}
          />
        </Stack>

        <Stack direction="row" spacing={3}>
          <FormField
            type="text"
            label="Phone"
            name="phone"
            value={trainer.phone}
            onChange={() => {}}
          />
          <FormField
            type="text"
            label="Submitted Date"
            name="submitted"
            value={trainer.submitted}
            onChange={() => {}}
          />
        </Stack>

        <FormField
          type="text"
          label="Specialization"
          name="specialization"
          value={trainer.specialization}
          onChange={() => {}}
        />

        <FormField
          type="text"
          label="Biography"
          name="bio"
          value={trainer.bio}
          onChange={() => {}}
        />
      </Stack>
    </ModalWrapper>
  );
};
