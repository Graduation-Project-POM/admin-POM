import { useState } from "react";
import {
  Box,
  MenuItem,
} from "@mui/material";
import { ModalWrapper } from "../../../components/common/modal/ModalWrapper";
import { Button } from "../../../components/ui/button/Button";
import { FormField } from "../../../components/ui/Forms/FormField";
import { useTranslation } from "react-i18next";

interface UserFormData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
}

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  userData: UserFormData | null;
}

const Edit = ({ open, onClose, userData }: EditUserModalProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<UserFormData>(
    userData || {
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "",
      isActive: true,
    },
  );

  // Update form if userData changes (when modal opens)
  useState(() => {
    if (userData) setFormData(userData);
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      role: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated User Data:", formData);
    onClose();
  };

  return (
    <ModalWrapper open={open} onClose={onClose} title={t("admin.users.form.editTitle")} maxWidth="md">
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 3,
          }}
        >
          <FormField
            label={t("admin.users.form.firstName")}
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder={t("admin.users.form.firstNamePlaceholder")}
          />

          <FormField
            label={t("admin.users.form.lastName")}
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <FormField
            label={t("admin.users.form.emailAddress")}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <FormField
            label={t("form.labels.phone")}
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <FormField
            label={t("admin.users.form.userRole")}
            name="role"
            value={formData.role}
            onChange={handleRoleChange}
            required
            select
          >
            <MenuItem value="STUDENT">{t("admin.users.form.roles.student")}</MenuItem>
            <MenuItem value="TRAINER">{t("admin.users.form.roles.trainer")}</MenuItem>
            <MenuItem value="ADMIN">{t("admin.users.form.roles.administrator")}</MenuItem>
          </FormField>
        </Box>
        <Button sx={{ mt: 3 }} variantType="default" type="submit">
          {" "}
          {t("buttons.edit")}{" "}
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default Edit;
