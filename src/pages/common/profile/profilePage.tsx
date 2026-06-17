import React, { useState } from "react";
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
  Stack,
} from "@mui/material";
import { Edit, Save, BookOpen, Users, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";


interface ProfileData {
  fullName: string;
  displayName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  bio: string;
}

interface StatsData {
  contents: number;
  students: number;
  years: number;
}


const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<ProfileData>({
    fullName: "Admin User",
    displayName: "Admin User",
    email: "admin@pmo-platform.com",
    phone: "+1 (555) 123-4567",
    department: "Administration",
    position: "Super Administrator",
    bio: "Experienced administrator with over 5 years in educational technology. Passionate about competitive programming and student development.",
  });

  const [stats] = useState<StatsData>({
    contents: 67,
    students: 1024,
    years: 3,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field: keyof ProfileData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [field]: event.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Saved profile data:", profile);
  };

  const handleCancel = () => {
    setIsEditing(false);
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
          sx={{
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-0.02em",
            mb: 1,
          }}
        >
          {t('profile.title')}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Typography
            variant="body1"
            sx={{
              color: "#64748b",
              borderLeft: "3px solid #8B1D23",
              pl: 2,
              fontWeight: 500,
            }}
          >
            {t('profile.subtitle')}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            sx={{
              borderRadius: "20px",
              border: "1px solid #eef2f6",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              overflow: "visible",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
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
                    <Chip
                      label={profile.position}
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
                  </Box>
                </Box>
                {!isEditing ? (
                  <Button
                    variant="outlined"
                    startIcon={<Edit size={16} />}
                    onClick={() => setIsEditing(true)}
                    sx={{
                      borderRadius: "40px",
                      textTransform: "none",
                      fontWeight: 600,
                      borderColor: "#cbd5e1",
                      color: "#1e293b",
                    }}
                  >
                    {t('profile.editProfile')}
                  </Button>
                ) : (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<Save size={16} />}
                      onClick={handleSave}
                      sx={{
                        borderRadius: "40px",
                        textTransform: "none",
                        fontWeight: 600,
                        bgcolor: "#8B1D23",
                        "&:hover": { bgcolor: "#6d1620" },
                      }}
                    >
                      {t('buttons.save')}
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
                      {t('buttons.cancel')}
                    </Button>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 2, borderColor: "#eef2f6" }} />

              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color: "#0f172a",
                  mb: 2,
                  fontSize: "1.1rem",
                }}
              >
                {t('profile.personalInformation')}
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label={t('profile.fields.fullName')}
                    value={profile.fullName}
                    onChange={handleChange("fullName")}
                    disabled={!isEditing}
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "#fff",
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label={t('profile.fields.displayName')}
                    value={profile.displayName}
                    onChange={handleChange("displayName")}
                    disabled={!isEditing}
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label={t('profile.fields.emailAddress')}
                    type="email"
                    value={profile.email}
                    onChange={handleChange("email")}
                    disabled={!isEditing}
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label={t('form.labels.phone')}
                    value={profile.phone}
                    onChange={handleChange("phone")}
                    disabled={!isEditing}
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label={t('profile.fields.department')}
                    value={profile.department}
                    onChange={handleChange("department")}
                    disabled={!isEditing}
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label={t('profile.fields.position')}
                    value={profile.position}
                    onChange={handleChange("position")}
                    disabled={!isEditing}
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                </Grid>
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

        {/* Right Column: Stats Cards */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <Card
              sx={{
                borderRadius: "20px",
                border: "1px solid #eef2f6",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      bgcolor: "#fee2e2",
                      p: 1,
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <BookOpen size={24} color="#8B1D23" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
                    {stats.contents}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: "#64748b", fontWeight: 500 }}
                >
                  {t('profile.stats.totalContents')}
                </Typography>
              </CardContent>
            </Card>

            <Card
              sx={{
                borderRadius: "20px",
                border: "1px solid #eef2f6",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      bgcolor: "#e0f2e9",
                      p: 1,
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Users size={24} color="#1f6e43" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
                    {stats.students.toLocaleString()}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: "#64748b", fontWeight: 500 }}
                >
                  {t('profile.stats.enrolledStudents')}
                </Typography>
              </CardContent>
            </Card>

            <Card
              sx={{
                borderRadius: "20px",
                border: "1px solid #eef2f6",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      bgcolor: "#fff0db",
                      p: 1,
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TrendingUp size={24} color="#b45309" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>
                    {stats.years}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: "#64748b", fontWeight: 500 }}
                >
                  {t('profile.stats.yearsOfExperience')}
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;