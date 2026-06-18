import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ArrowLeft, Mail, Phone, User, GraduationCap, MapPin, School, IdCard, Award, Target, Calendar } from "lucide-react";
import { Button } from "../../../components/ui/button/Button";
import { studentService, type StudentProfile } from "../../../services/studentService";
import { trainerService, type TrainerProfile } from "../../../services/trainerService";
import { getApiErrorMessage } from "../../../utils/apiError";

export type ProfileType = "student" | "trainer";

const DetailRow: React.FC<{ icon: React.ReactNode; label: string; value?: React.ReactNode }> = ({
  icon,
  label,
  value,
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1.25 }}>
    <Box sx={{ p: 1, bgcolor: "#f8fafc", borderRadius: "8px", color: "#8B1D23", display: "flex" }}>
      {icon}
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{ color: "#1e293b", fontWeight: 700, fontSize: "14px", wordBreak: "break-word" }}>
        {value === undefined || value === null || value === "" ? "—" : value}
      </Typography>
    </Box>
  </Box>
);

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?";

/**
 * Shared profile view. Fetches and renders a student's or trainer's full
 * profile BY ID (never the logged-in user). Reused by the route page and
 * embedded contexts (e.g. the Group → Trainer tab) so there is one profile UI.
 */
export const UserProfile: React.FC<{ type: ProfileType; id?: number }> = ({ type, id }) => {
  const { t } = useTranslation();

  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [trainer, setTrainer] = useState<TrainerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === undefined || id === null || Number.isNaN(id) || id <= 0 || (type !== "student" && type !== "trainer")) {
      setError(t("profile.view.invalid", "Invalid profile"));
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    setStudent(null);
    setTrainer(null);

    const request =
      type === "student"
        ? studentService.getById(id).then((p) => !cancelled && setStudent(p))
        : trainerService.getById(id).then((p) => !cancelled && setTrainer(p));

    request
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err, t("profile.view.loadFailed", "Failed to load profile")));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, type, t]);

  const fullName = student?.fullName || trainer?.fullName || "";

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress sx={{ color: "#8B1D23" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ maxWidth: 600 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: 4, maxWidth: 720, borderRadius: "16px", border: "1px solid #e5e7eb", bgcolor: "#fff" }}>
      {/* Header */}
      <Box sx={{ display: "flex", gap: 3, mb: 3, alignItems: "center", flexWrap: "wrap" }}>
        <Avatar sx={{ width: 80, height: 80, bgcolor: "#8B1D23", fontSize: 28, fontWeight: 700, borderRadius: "16px" }}>
          {initials(fullName)}
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b" }}>
            {fullName || "—"}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
            <Chip
              label={
                type === "student"
                  ? t("profile.view.roleStudent", "Student")
                  : t("profile.view.roleTrainer", "Trainer")
              }
              size="small"
              sx={{ fontWeight: 700, bgcolor: "#fef2f2", color: "#8B1D23", border: "1px solid #fecaca" }}
            />
           
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 1 }} />

      {/* Shared account fields */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, columnGap: 3 }}>
        <DetailRow icon={<User size={18} />} label={t("profile.view.username", "Username")} value={student?.userName ?? trainer?.userName} />
        <DetailRow icon={<Mail size={18} />} label={t("profile.view.email", "Email")} value={student?.email ?? trainer?.email} />
        <DetailRow icon={<Phone size={18} />} label={t("profile.view.phone", "Phone")} value={student?.phoneNumber ?? trainer?.phoneNumber ?? ""} />

        {/* Trainer-specific */}
        {trainer && (
          <DetailRow icon={<Award size={18} />} label={t("profile.view.specialization", "Specialization")} value={trainer.specialization} />
        )}

        {/* Student-specific */}
        {student && (
          <>
            <DetailRow icon={<GraduationCap size={18} />} label={t("profile.view.gradeLevel", "Grade level")} value={student.gradeLevel} />
            <DetailRow icon={<School size={18} />} label={t("profile.view.school", "School")} value={student.schoolName} />
            <DetailRow icon={<MapPin size={18} />} label={t("profile.view.city", "City")} value={student.city} />
            <DetailRow icon={<IdCard size={18} />} label={t("profile.view.nationalId", "National ID")} value={student.nationalId} />
            <DetailRow icon={<Target size={18} />} label={t("profile.view.problemsSolved", "Problems solved")} value={student.problemSolved} />
            <DetailRow icon={<Award size={18} />} label={t("profile.view.score", "Score")} value={student.score} />
            <DetailRow icon={<Calendar size={18} />} label={t("profile.view.joinYear", "Join year")} value={student.joinYear} />
          </>
        )}
      </Box>
    </Paper>
  );
};

/** Route page (/profile/:type/:id): reads the params and wraps the shared view. */
export const UserProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { type, id } = useParams<{ type: string; id: string }>();

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Button variantType="outline" startIcon={<ArrowLeft size={18} />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        {t("buttons.back", "Back")}
      </Button>
      <UserProfile type={type as ProfileType} id={Number(id)} />
    </Box>
  );
};

export default UserProfilePage;
