import { useEffect, useState } from "react";
import { Box, Alert } from "@mui/material";
import { ModalWrapper } from "../../../components/common/modal/ModalWrapper";
import { Button } from "../../../components/ui/button/Button";
import { FormField } from "../../../components/ui/Forms/FormField";
import { useTranslation } from "react-i18next";
import { updateUser } from "../../../services/userService";
import { getApiErrorMessage } from "../../../utils/apiError";

interface UserFormData {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  userName: string;
  email: string;
  phone: string;
  gender: string;
  role: string;
  profileImageUrl?: string;
  isActive: boolean;
}

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  userData: UserFormData | null;
  onSuccess?: () => void;
}

type FieldConfig = {
  name: keyof UserFormData;
  label: string;
  type: "text" | "email" | "select";
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
};

const emptyForm: UserFormData = {
  id: 0,
  firstName: "",
  middleName: "",
  lastName: "",
  userName: "",
  email: "",
  phone: "",
  gender: "",
  role: "",
  profileImageUrl: "",
  isActive: true,
};

const Edit = ({ open, onClose, userData, onSuccess }: EditUserModalProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<UserFormData>(userData || emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userData) setFormData(userData);
  }, [userData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await updateUser(formData.id, {
        firstName: formData.firstName,
        middleName: formData.middleName || "",
        lastName: formData.lastName,
        userName: formData.userName,
        email: formData.email,
        phoneNumber: formData.phone || undefined,
        gender: formData.gender || undefined,
        profileImageUrl: formData.profileImageUrl || "",
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, t("admin.users.form.saveError")));
    } finally {
      setSubmitting(false);
    }
  };

  const fields: FieldConfig[] = [
    {
      name: "firstName",
      label: t("admin.users.form.firstName"),
      type: "text",
      required: true,
      placeholder: t("admin.users.form.firstNamePlaceholder"),
    },
    { name: "middleName", label: t("admin.users.form.middleName"), type: "text" },
    { name: "lastName", label: t("admin.users.form.lastName"), type: "text", required: true },
    { name: "userName", label: t("admin.users.form.userName"), type: "text", required: true },
    { name: "email", label: t("admin.users.form.emailAddress"), type: "email", required: true },
    { name: "phone", label: t("form.labels.phone"), type: "text" },
    {
      name: "gender",
      label: t("admin.users.form.gender"),
      type: "select",
      options: [
        { label: t("admin.users.form.genders.male"), value: "male" },
        { label: t("admin.users.form.genders.female"), value: "female" },
      ],
    },
    {
      name: "role",
      label: t("admin.users.form.userRole"),
      type: "select",
      required: true,
      options: [
        { label: t("admin.users.form.roles.student"), value: "STUDENT" },
        { label: t("admin.users.form.roles.trainer"), value: "TRAINER" },
        { label: t("admin.users.form.roles.administrator"), value: "ADMIN" },
      ],
    },
  ];

  return (
    <ModalWrapper open={open} onClose={onClose} title={t("admin.users.form.editTitle")} maxWidth="md">
      <form onSubmit={handleSubmit}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 3,
          }}
        >
          {fields.map((field) => (
            <FormField
              key={field.name}
              type={field.type}
              label={field.label}
              name={field.name}
              value={formData[field.name] ?? ""}
              onChange={handleChange}
              required={field.required}
              placeholder={field.placeholder}
              options={field.options}
            />
          ))}
        </Box>
        <Button sx={{ mt: 3 }} variantType="default" type="submit" disabled={submitting}>
          {submitting ? t("common.loading") : t("buttons.edit")}
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default Edit;
