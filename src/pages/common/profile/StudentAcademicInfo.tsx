import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import { Edit, Save, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  getMyStudentProfile,
  updateMyStudentProfile,
  type MyStudentProfile,
} from "../../../services/studentService";

interface FormState {
  gradeLevel: string;
  city: string;
  schoolName: string;
  nationalId: string;
}

const emptyForm: FormState = { gradeLevel: "", city: "", schoolName: "", nationalId: "" };

export const StudentAcademicInfo = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<MyStudentProfile | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyStudentProfile();
      setProfile(data);
      setForm({
        gradeLevel: data.gradeLevel ?? "",
        city: data.city ?? "",
        schoolName: data.schoolName ?? "",
        nationalId: data.nationalId ?? "",
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || t("profile.student.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    if (!form.gradeLevel.trim() || !form.city.trim() || form.schoolName.trim().length < 2) {
      setError(t("profile.student.validation"));
      return;
    }
    if (form.nationalId.trim().length !== 9) {
      setError(t("profile.student.nationalIdLength"));
      return;
    }
    setSaving(true);
    try {
      await updateMyStudentProfile(form);
      setSuccess(t("profile.student.saved"));
      setIsEditing(false);
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message || t("profile.student.saveError"));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setForm({
        gradeLevel: profile.gradeLevel ?? "",
        city: profile.city ?? "",
        schoolName: profile.schoolName ?? "",
        nationalId: profile.nationalId ?? "",
      });
    }
    setIsEditing(false);
    setError(null);
  };

  const fieldSx = { "& .MuiOutlinedInput-root": { borderRadius: "12px", backgroundColor: "#fff" } };

  return (
    <Card sx={{ borderRadius: "20px", border: "1px solid #eef2f6", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", mt: 4 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ bgcolor: "#fee2e2", p: 1, borderRadius: "12px", display: "flex" }}>
              <GraduationCap size={22} color="#8B1D23" />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a", fontSize: "1.1rem" }}>
                {t("profile.student.title")}
              </Typography>
              {profile && (
                <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                  <Chip label={t("profile.student.score", { score: profile.score })} size="small" sx={{ bgcolor: "#f1f5f9", color: "#475569", fontWeight: 600, fontSize: "0.7rem" }} />
                  <Chip label={t("profile.student.solved", { count: profile.problemSolved })} size="small" sx={{ bgcolor: "#f1f5f9", color: "#475569", fontWeight: 600, fontSize: "0.7rem" }} />
                </Box>
              )}
            </Box>
          </Box>
          {!loading && (
            isEditing ? (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button variant="contained" startIcon={<Save size={16} />} onClick={handleSave} disabled={saving}
                  sx={{ borderRadius: "40px", textTransform: "none", fontWeight: 600, bgcolor: "#8B1D23", "&:hover": { bgcolor: "#6d1620" } }}>
                  {saving ? t("common.loading") : t("buttons.save")}
                </Button>
                <Button variant="outlined" onClick={handleCancel}
                  sx={{ borderRadius: "40px", textTransform: "none", fontWeight: 600, borderColor: "#cbd5e1", color: "#64748b" }}>
                  {t("buttons.cancel")}
                </Button>
              </Box>
            ) : (
              <Button variant="outlined" startIcon={<Edit size={16} />} onClick={() => setIsEditing(true)}
                sx={{ borderRadius: "40px", textTransform: "none", fontWeight: 600, borderColor: "#cbd5e1", color: "#1e293b" }}>
                {t("profile.editProfile")}
              </Button>
            )
          )}
        </Box>

        <Divider sx={{ my: 2, borderColor: "#eef2f6" }} />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#8B1D23" }} />
          </Box>
        ) : (
          <>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth size="small" label={t("profile.student.gradeLevel")} value={form.gradeLevel}
                  onChange={handleChange("gradeLevel")} disabled={!isEditing} sx={fieldSx} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth size="small" label={t("profile.student.city")} value={form.city}
                  onChange={handleChange("city")} disabled={!isEditing} sx={fieldSx} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth size="small" label={t("profile.student.schoolName")} value={form.schoolName}
                  onChange={handleChange("schoolName")} disabled={!isEditing} sx={fieldSx} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth size="small" label={t("profile.student.nationalId")} value={form.nationalId}
                  onChange={handleChange("nationalId")} disabled={!isEditing} sx={fieldSx} />
              </Grid>
            </Grid>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentAcademicInfo;
