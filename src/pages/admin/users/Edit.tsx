import { useEffect, useState } from "react";
import { Box, Alert, Switch } from "@mui/material";
import { ModalWrapper } from "../../../components/common/modal/ModalWrapper";
import { Button } from "../../../components/ui/button/Button";
import { FormField } from "../../../components/ui/Forms/FormField";
import { Label } from "../../../components/ui/label/Label";
import { useTranslation } from "react-i18next";
import { updateUser, roleNameToId } from "../../../services/userService";
import { getApiErrorMessage } from "../../../utils/apiError";
import { brand } from '../../../theme';

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

// Password fields live outside UserFormData: they start blank and are only
// sent when the admin wants to reset the password.
interface PasswordFields {
  password: string;
  confirmPassword: string;
}

type FormKey = keyof UserFormData | keyof PasswordFields;

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  userData: UserFormData | null;
  onSuccess?: () => void;
}

type FieldConfig = {
  name: FormKey;
  label: string;
  type: "text" | "email" | "password" | "select" | "switch";
  required?: boolean;
  placeholder?: string;
  helperText?: string;
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

const emptyPasswords: PasswordFields = { password: "", confirmPassword: "" };

type FieldErrors = Partial<Record<FormKey, string>>;

const Edit = ({ open, onClose, userData, onSuccess }: EditUserModalProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<UserFormData>(userData || emptyForm);
  const [passwords, setPasswords] = useState<PasswordFields>(emptyPasswords);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (userData) setFormData(userData);
    setPasswords(emptyPasswords);
    setErrors({});
    setError(null);
  }, [userData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "password" || name === "confirmPassword") {
      setPasswords((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
    setPasswords(emptyPasswords);
    setError(null);
    setErrors({});
    onClose();
  };

  // Per-field validation (mirrors the backend AdminUpdateUserDTO rules).
  const validate = (): FieldErrors => {
    const e: FieldErrors = {};
    const v = (s: string | undefined) => (s ?? "").trim();

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

    // Password is optional here; only validate when the admin is resetting it.
    if (passwords.password || passwords.confirmPassword) {
      if (passwords.password.length < 8) e.password = t("admin.users.form.validation.passwordShort");
      if (!passwords.confirmPassword) e.confirmPassword = t("admin.users.form.validation.confirmPasswordRequired");
      else if (passwords.confirmPassword !== passwords.password)
        e.confirmPassword = t("admin.users.form.passwordMismatch");
    }

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
      await updateUser(formData.id, {
        firstName: formData.firstName,
        middleName: formData.middleName || "",
        lastName: formData.lastName,
        userName: formData.userName,
        email: formData.email,
        phoneNumber: formData.phone || undefined,
        gender: formData.gender || undefined,
        profileImageUrl: formData.profileImageUrl || "",
        // Only send the role when it changed, so roles the dropdown can't
        // represent (e.g. SuperUser) aren't overwritten.
        roleID: formData.role !== userData?.role ? roleNameToId(formData.role) : undefined,
        isActive: formData.isActive,
        newPassword: passwords.password || undefined,
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
      options: [
        { label: t("admin.users.form.genders.male"), value: "male" },
        { label: t("admin.users.form.genders.female"), value: "female" },
      ],
    },
    {
      name: "password",
      label: t("form.labels.password"),
      type: "password",
      helperText: t("admin.users.form.passwordKeepHint"),
    },
    { name: "confirmPassword", label: t("form.labels.confirmPassword"), type: "password" },
    { name: "isActive", label: t("admin.users.form.activeAccount"), type: "switch" },
  ];

  const valueOf = (name: FormKey) =>
    name === "password" || name === "confirmPassword"
      ? passwords[name]
      : (formData[name as keyof UserFormData] ?? "");

  return (
    <ModalWrapper open={open} onClose={handleClose} title={t("admin.users.form.editTitle")} maxWidth="md">
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
                        color: brand[500],
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: brand[500],
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
                value={valueOf(field.name) as string}
                onChange={handleChange}
                required={field.required}
                placeholder={field.placeholder}
                options={field.options}
                error={!!errors[field.name]}
                autoComplete={field.type === "password" ? "new-password" : undefined}
                helperText={errors[field.name] ?? field.helperText}
              />
            ),
          )}
        </Box>
        <Button sx={{ mt: 3 }} variantType="default" type="submit" disabled={submitting}>
          {submitting ? t("common.loading") : t("buttons.edit")}
        </Button>
      </form>
    </ModalWrapper>
  );
};

export default Edit;
