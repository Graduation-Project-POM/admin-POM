import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  Avatar,
  Chip,
  Alert,
} from "@mui/material";
import { Edit, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../services/AuthContext";
import { StudentAcademicInfo } from "./StudentAcademicInfo";
import { getCurrentUser, updateCurrentUser, type BackendUser } from "../../../services/userService";
import { getMyTrainerProfile, updateMyTrainerProfile } from "../../../services/trainerService";

interface ProfileData {
  fullName: string;
  displayName: string;
  email: string;
  phone: string;
  specialization: string;
  bio: string;
}

type FieldErrors = Partial<Record<keyof ProfileData, string>>;

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { role } = useAuth();
  const isStudent = (role ?? "").toLowerCase() === "student";
  const isTrainer = (role ?? "").toLowerCase() === "trainer";

  const [profile, setProfile] = useState<ProfileData>({
    fullName: "",
    displayName: "",
    email: "",
    phone: "",
    specialization: "",
    bio: "",
  });
  const [loadedUser, setLoadedUser] = useState<BackendUser | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const applyUser = (u: BackendUser) => {
    setLoadedUser(u);
    // Merge (don't clobber the trainer's specialization, which is loaded separately).
    setProfile((prev) => ({
      ...prev,
      fullName: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(),
      displayName: u.userName ?? "",
      email: u.email ?? "",
      phone: u.phoneNumber ?? "",
      bio: u.bio ?? "",
    }));
  };

  useEffect(() => {
    getCurrentUser()
      .then(applyUser)
      .catch(() => setSaveError(t("profile.loadError")));
    // Trainers also have a Specialization (stored on the Trainer profile).
    if (isTrainer) {
      getMyTrainerProfile()
        .then((tr) => setProfile((prev) => ({ ...prev, specialization: tr.specialization ?? "" })))
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (field: keyof ProfileData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfile((prev) => ({ ...prev, [field]: event.target.value }));
    // Clear that field's error as the user corrects it.
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSaveSuccess(null);
  };

  // Per-field validation with clear, translated messages.
  const validate = (): FieldErrors => {
    const e: FieldErrors = {};

    const name = profile.fullName.trim();
    const parts = name.split(/\s+/).filter(Boolean);
    if (!name) e.fullName = t("profile.validation.fullNameRequired");
    else if (parts.length < 2 || parts.some((p) => p.length < 2))
      e.fullName = t("profile.validation.fullNameInvalid");

    const username = profile.displayName.trim();
    if (!username) e.displayName = t("profile.validation.usernameRequired");
    else if (username.length < 4) e.displayName = t("profile.validation.usernameShort");

    const email = profile.email.trim();
    if (!email) e.email = t("profile.validation.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = t("profile.validation.emailInvalid");

    const phone = profile.phone.trim();
    if (phone && !/^[+0-9][0-9\s\-()]{6,}$/.test(phone)) e.phone = t("profile.validation.phoneInvalid");

    if (isTrainer && !profile.specialization.trim())
      e.specialization = t("profile.trainer.validation.specializationRequired");

    return e;
  };

  const handleSave = async () => {
    if (!loadedUser) return;
    setSaveError(null);
    setSaveSuccess(null);

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSaving(true);
    const parts = profile.fullName.trim().split(/\s+/).filter(Boolean);
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ");
    try {
      await updateCurrentUser({
        firstName,
        middleName: loadedUser.middleName ?? "",
        lastName,
        email: profile.email.trim(),
        userName: profile.displayName.trim(),
        phoneNumber: profile.phone.trim() || undefined,
        gender: loadedUser.gender,
        profileImageUrl: loadedUser.profileImageUrl ?? "",
        bio: profile.bio,
      });
      // Trainers also persist their Specialization (separate Trainer profile).
      if (isTrainer) {
        await updateMyTrainerProfile(profile.specialization.trim());
      }
      const fresh = await getCurrentUser();
      applyUser(fresh);
      setIsEditing(false);
      setSaveSuccess(t("profile.saved"));
    } catch (err: any) {
      setSaveError(err?.response?.data?.message || t("profile.saveError"));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (loadedUser) applyUser(loadedUser);
    setErrors({});
    setSaveError(null);
    setSaveSuccess(null);
    setIsEditing(false);
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": { borderRadius: "12px", backgroundColor: "#fff" },
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", mb: 1 }}
        >
          {t("profile.title")}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Typography
            variant="body1"
            sx={{ color: "#64748b", borderLeft: "3px solid #8B1D23", pl: 2, fontWeight: 500 }}
          >
            {t("profile.subtitle")}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 10 }}>
          <Card
            sx={{
              borderRadius: "20px",
              border: "1px solid #eef2f6",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              overflow: "visible",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3, flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Avatar
                    sx={{
                      bgcolor: "#8B1D23",
                      width: 64,
                      height: 64,
                      fontSize: "1.5rem",
                      fontWeight: 600,
                      boxShadow: "0 4px 12px rgba(139,29,35,0.2)",
                    }}
                  >
                    {profile.fullName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
                      {profile.displayName}
                    </Typography>
                    {role && (
                      <Chip
                        label={role}
                        size="small"
                        sx={{
                          bgcolor: "#f1f5f9",
                          color: "#1e293b",
                          fontWeight: 500,
                          fontSize: "0.7rem",
                          borderRadius: "30px",
                          mt: 0.5,
                        }}
                      />
                    )}
                  </Box>
                </Box>
                {!isEditing ? (
                  <Button
                    variant="outlined"
                    startIcon={<Edit size={16} />}
                    onClick={() => {
                      setSaveSuccess(null);
                      setIsEditing(true);
                    }}
                    sx={{
                      borderRadius: "40px",
                      textTransform: "none",
                      fontWeight: 600,
                      borderColor: "#cbd5e1",
                      color: "#1e293b",
                    }}
                  >
                    {t("profile.editProfile")}
                  </Button>
                ) : (
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button
                      variant="contained"
                      startIcon={<Save size={16} />}
                      onClick={handleSave}
                      disabled={saving}
                      sx={{
                        borderRadius: "40px",
                        textTransform: "none",
                        fontWeight: 600,
                        bgcolor: "#8B1D23",
                        "&:hover": { bgcolor: "#6d1620" },
                      }}
                    >
                      {saving ? t("common.loading") : t("buttons.save")}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      sx={{
                        borderRadius: "40px",
                        textTransform: "none",
                        fontWeight: 600,
                        borderColor: "#cbd5e1",
                        color: "#64748b",
                      }}
                    >
                      {t("buttons.cancel")}
                    </Button>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 2, borderColor: "#eef2f6" }} />

              {saveError && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSaveError(null)}>
                  {saveError}
                </Alert>
              )}
              {saveSuccess && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSaveSuccess(null)}>
                  {saveSuccess}
                </Alert>
              )}

              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: "#0f172a", mb: 2, fontSize: "1.1rem" }}
              >
                {t("profile.personalInformation")}
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label={t("profile.fields.fullName")}
                    value={profile.fullName}
                    onChange={handleChange("fullName")}
                    disabled={!isEditing}
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                    variant="outlined"
                    size="small"
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label={t("profile.fields.displayName")}
                    value={profile.displayName}
                    onChange={handleChange("displayName")}
                    disabled={!isEditing}
                    error={!!errors.displayName}
                    helperText={errors.displayName}
                    variant="outlined"
                    size="small"
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label={t("profile.fields.emailAddress")}
                    type="email"
                    value={profile.email}
                    onChange={handleChange("email")}
                    disabled={!isEditing}
                    error={!!errors.email}
                    helperText={errors.email}
                    variant="outlined"
                    size="small"
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label={t("form.labels.phone")}
                    value={profile.phone}
                    onChange={handleChange("phone")}
                    disabled={!isEditing}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    variant="outlined"
                    size="small"
                    sx={fieldSx}
                  />
                </Grid>
                {isTrainer && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      required
                      label={t("profile.trainer.specialization")}
                      value={profile.specialization}
                      onChange={handleChange("specialization")}
                      disabled={!isEditing}
                      error={!!errors.specialization}
                      helperText={errors.specialization}
                      variant="outlined"
                      size="small"
                      sx={fieldSx}
                    />
                  </Grid>
                )}
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "#0f172a", mb: 1 }}
                >
                  {t('profile.fields.bio')}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={profile.bio}
                  onChange={handleChange("bio")}
                  disabled={!isEditing}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "16px" },
                  }}
                />
              </Box>

              {!isEditing && (
                <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    onClick={() => setIsEditing(true)}
                    sx={{
                      borderRadius: "40px",
                      textTransform: "none",
                      fontWeight: 600,
                      bgcolor: "#8B1D23",
                      "&:hover": { bgcolor: "#6d1620" },
                    }}
                  >
                    {t('profile.editProfile')}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {isStudent && <StudentAcademicInfo />}
    </Box>
  );
};

export default ProfilePage;
