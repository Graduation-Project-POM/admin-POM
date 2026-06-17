import { useState } from "react";
import { Box, Alert, Switch } from "@mui/material";
import { ModalWrapper } from "../../../components/common/modal/ModalWrapper";
import { Button } from "../../../components/ui/button/Button";
import { FormField } from "../../../components/ui/Forms/FormField";
import { Label } from "../../../components/ui/label/Label";
import { useTranslation } from "react-i18next";
import { createUser, roleNameToId } from "../../../services/userService";

interface UserFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  userName: string;
  email: string;
  phone: string;
  role: string;
  gender: string;
  password: string;
  confirmPassword: string;
  isActive: boolean;
}

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type FieldConfig = {
  name: keyof UserFormData;
  label: string;
  type: "text" | "email" | "password" | "select" | "switch";
  required?: boolean;
  options?: { label: string; value: string }[];
};

const initialFormData: UserFormData = {
  firstName: "",
  middleName: "",
  lastName: "",
  userName: "",
  email: "",
  phone: "",
  role: "",
  gender: "",
  password: "",
  confirmPassword: "",
  isActive: true,
};

const Create = ({ open, onClose, onSuccess }: CreateUserModalProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      isActive: e.target.checked,
    }));
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError(t("admin.users.form.passwordMismatch"));
      return;
    }

    setSubmitting(true);
    try {
      await createUser({
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        userName: formData.userName,
        email: formData.email,
        phoneNumber: formData.phone || undefined,
        gender: formData.gender,
        roleID: roleNameToId(formData.role),
        password: formData.password,
        profileImageUrl: "",
      });
      onSuccess?.();
      handleClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || t("admin.users.form.saveError"));
    } finally {
      setSubmitting(false);
    }
  };

  const fields: FieldConfig[] = [
    { name: "firstName", label: t("admin.users.form.firstName"), type: "text", required: true },
    { name: "middleName", label: t("admin.users.form.middleName"), type: "text" },
    { name: "lastName", label: t("admin.users.form.lastName"), type: "text", required: true },
    { name: "userName", label: t("admin.users.form.userName"), type: "text", required: true },
    { name: "email", label: t("admin.users.form.emailAddress"), type: "email", required: true },
    { name: "phone", label: t("form.labels.phone"), type: "text" },
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
    {
      name: "gender",
      label: t("admin.users.form.gender"),
      type: "select",
      required: true,
      options: [
        { label: t("admin.users.form.genders.male"), value: "male" },
        { label: t("admin.users.form.genders.female"), value: "female" },
      ],
    },
    { name: "password", label: t("form.labels.password"), type: "password", required: true },
    { name: "confirmPassword", label: t("form.labels.confirmPassword"), type: "password", required: true },
    { name: "isActive", label: t("admin.users.form.activeAccount"), type: "switch" },
  ];

  return (
    <ModalWrapper
      open={open}
      onClose={handleClose}
      title={t("admin.users.form.createTitle")}
      maxWidth="md"
    >
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
          {fields.map((field) =>
            field.type === "switch" ? (
              <Box key={field.name} sx={{ width: "100%" }}>
                <Label>{field.label}</Label>
                <Box sx={{ display: "flex", alignItems: "center", minHeight: 40 }}>
                  <Switch
                    name={field.name}
                    checked={formData.isActive}
                    onChange={handleSwitchChange}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#8B1D23",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: "#8B1D23",
                      },
                    }}
                  />
                </Box>
              </Box>
            ) : (
              <FormField
                key={field.name}
                type={field.type}
                label={field.label}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
                options={field.options}
              />
            ),
          )}
        </Box>
        <Button sx={{ mt: 3 }} variantType="default" type="submit" disabled={submitting}>
          {submitting ? t("common.loading") : t("admin.users.createButton")}
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default Create;
