import { useState } from "react";
import { Box } from "@mui/material";
import { ModalWrapper } from "../../../components/common/modal/ModalWrapper";
import { Button } from "../../../components/ui/button/Button";
import { FormField } from "../../../components/ui/Forms/FormField";
import { useTranslation } from "react-i18next";

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  confirmPassword: string;
  isActive: boolean;
}

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
}

const Create = ({ open, onClose }: CreateUserModalProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
    isActive: true,
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

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      isActive: e.target.checked,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    onClose();
  };

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={t("admin.users.form.createTitle")}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 3,
          }}
        >
          <FormField
            type="text"
            label={t("admin.users.form.firstName")}
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <FormField
            type="text"
            label={t("admin.users.form.lastName")}
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <FormField
            type="email"
            label={t("admin.users.form.emailAddress")}
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <FormField
            type="text"
            label={t("form.labels.phone")}
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <FormField
            type="select"
            label={t("admin.users.form.userRole")}
            name="role"
            value={formData.role}
            onChange={handleRoleChange}
            required
            options={[
              { label: t("admin.users.form.roles.student"), value: "STUDENT" },
              { label: t("admin.users.form.roles.trainer"), value: "TRAINER" },
              { label: t("admin.users.form.roles.administrator"), value: "ADMIN" },
            ]}
          />

          <FormField
            type="switch"
            label={t("admin.users.form.activeAccount")}
            name="isActive"
            value={formData.isActive}
            onChange={handleSwitchChange}
          />

          <FormField
            type="password"
            label={t("form.labels.password")}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <FormField
            type="password"
            label={t("form.labels.confirmPassword")}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </Box>
        <Button sx={{ mt: 3 }} variantType="default" type="submit">
          {t("admin.users.createButton")}
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default Create;
