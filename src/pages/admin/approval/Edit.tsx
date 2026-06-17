import { useState, useEffect } from "react";
import { Stack } from "@mui/material";
import { ModalWrapper } from "../../../components/common/modal/ModalWrapper";
import { Button } from "../../../components/ui/button/Button";
import { FormField } from "../../../components/ui/Forms/FormField";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
      title={t("admin.approvals.edit.title")}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <FormField
            type="text"
            label={t("admin.approvals.edit.fullName")}
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Stack direction="row" spacing={2}>
            <FormField
              type="email"
              label={t("admin.approvals.edit.email")}
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <FormField
              type="text"
              label={t("admin.approvals.edit.phone")}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Stack>

          <FormField
            type="text"
            label={t("admin.approvals.edit.specialization")}
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
          />

          <FormField
            type="text"
            label={t("admin.approvals.edit.biography")}
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            required
          />
        </Stack>

        <Button sx={{ mt: 3 }} variantType="default" type="submit">
            {t("admin.approvals.edit.saveChanges")}
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default EditTrainerRequest;
