import { useState, useEffect } from "react";
import { Stack } from "@mui/material";
import { ModalWrapper } from "../../../components/common/modal/ModalWrapper";
import { Button } from "../../../components/ui/button/Button";
import { FormField } from "../../../components/ui/Forms/FormField";

interface TrainerRequestData {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  bio: string;
}

interface EditTrainerRequestProps {
  open: boolean;
  onClose: () => void;
  trainer: TrainerRequestData | null;
  onSave: (updatedTrainer: TrainerRequestData) => void;
}

const EditTrainerRequest = ({
  open,
  onClose,
  trainer,
  onSave,
}: EditTrainerRequestProps) => {
  const [formData, setFormData] = useState<TrainerRequestData>({
    id: "",
    name: "",
    email: "",
    phone: "",
    specialization: "",
    bio: "",
  });

  useEffect(() => {
    if (trainer) {
      setFormData(trainer);
    }
  }, [trainer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Edit Trainer Request"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <FormField
            type="text"
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Stack direction="row" spacing={2}>
            <FormField
              type="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <FormField
              type="text"
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Stack>

          <FormField
            type="text"
            label="Specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
          />

          <FormField
            type="text"
            label="Biography"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            required
          />
        </Stack>

        <Button sx={{ mt: 3 }} variantType="default" type="submit">
            Save Changes
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default EditTrainerRequest;
