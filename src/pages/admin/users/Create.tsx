import { useState } from "react";
import { Box, Alert, Switch } from "@mui/material";
import { ModalWrapper } from "../../../components/common/modal/ModalWrapper";
import { Button } from "../../../components/ui/button/Button";
import { FormField } from "../../../components/ui/Forms/FormField";
import { Label } from "../../../components/ui/label/Label";
import { useTranslation } from "react-i18next";
import { createUser, roleNameToId } from "../../../services/userService";
import { getApiErrorMessage } from "../../../utils/apiError";

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

type FieldErrors = Partial<Record<keyof UserFormData, string>>;

const Create = ({ open, onClose, onSuccess }: CreateUserModalProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear that field's error as the user corrects it.
    setErrors((prev) => ({ ...prev, [name]: undefined }));
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
    setErrors({});
    onClose();
  };

  // Per-field validation (mirrors the backend CreateUserDTO rules).
  const validate = (): FieldErrors => {
    const e: FieldErrors = {};
    const v = (s: string) => s.trim();

    if (!v(formData.firstName)) e.firstName = t("admin.users.form.validation.firstNameRequired");
    else if (v(formData.firstName).length < 2) e.firstName = t("admin.users.form.validation.firstNameShort");

    if (!v(formData.lastName)) e.lastName = t("admin.users.form.validation.lastNameRequired");
    else if (v(formData.lastName).length < 2) e.lastName = t("admin.users.form.validation.lastNameShort");

    if (!v(formData.userName)) e.userName = t("admin.users.form.validation.userNameRequired");
    else if (v(formData.userName).length < 4) e.userName = t("admin.users.form.validation.userNameShort");

    if (!v(formData.email)) e.email = t("admin.users.form.validation.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v(formData.email)))
      e.email = t("admin.users.form.validation.emailInvalid");

    if (v(formData.phone) && !/^[+0-9][0-9\s\-()]{6,}$/.test(v(formData.phone)))
      e.phone = t("admin.users.form.validation.phoneInvalid");

    if (!formData.role) e.role = t("admin.users.form.validation.roleRequired");
    if (!formData.gender) e.gender = t("admin.users.form.validation.genderRequired");

    if (!formData.password) e.password = t("admin.users.form.validation.passwordRequired");
    else if (formData.password.length < 8) e.password = t("admin.users.form.validation.passwordShort");

    if (!formData.confirmPassword) e.confirmPassword = t("admin.users.form.validation.confirmPasswordRequired");
    else if (formData.confirmPassword !== formData.password)
      e.confirmPassword = t("admin.users.form.passwordMismatch");

    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

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
    } catch (err) {
      setError(getApiErrorMessage(err, t("admin.users.form.saveError")));
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
      <form onSubmit={handleSubmit} noValidate>
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
                error={!!errors[field.name]}
                helperText={errors[field.name]}
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
