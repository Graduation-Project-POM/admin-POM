import {
  Typography,
  Box,
  Stack,
  Chip,
  Divider,
  Avatar,
  Paper,
  Grid,
} from "@mui/material";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  FileText,
  Star,
} from "lucide-react";
import { ModalWrapper } from "../../../components/common/modal/ModalWrapper";

interface TrainerRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  submitted: string;
  specialization: string;
  bio: string;
}

interface TrainerDetailsProps {
  open: boolean;
  onClose: () => void;
  trainer: TrainerRequest | null;
}

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
}) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
    <Box
      sx={{
        color: "#8B1D23",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 32,
        pt: 0.5,
      }}
    >
      <Icon size={18} strokeWidth={1.8} />
    </Box>
    <Box>
      <Typography
        sx={{
          fontSize: "0.7rem",
          fontWeight: 600,
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ color: "#1e293b", fontWeight: 500, fontSize: "0.9rem" }}>
        {value || "—"}
      </Typography>
    </Box>
  </Box>
);

export const ViewTrainerDetails = ({
  open,
  onClose,
  trainer,
}: TrainerDetailsProps) => {
  if (!trainer) return null;

  const formattedDate = trainer.submitted
    ? new Date(trainer.submitted).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : trainer.submitted;

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Trainer Profile"
      maxWidth="md"
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: "20px",
          backgroundColor: "#ffffff",
          border: "1px solid #eef2f6",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: "#8B1D23",
              width: 64,
              height: 64,
              fontSize: "1.5rem",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(139, 29, 35, 0.2)",
            }}
          >
            {getInitials(trainer.name)}
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#0f172a", mb: 0.5 }}
            >
              {trainer.name}
            </Typography>
            <Chip
              label={trainer.specialization}
              size="small"
              sx={{
                bgcolor: "#f1f5f9",
                color: "#1e293b",
                fontWeight: 600,
                fontSize: "0.7rem",
                borderRadius: "30px",
              }}
              icon={<Star size={14} />}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2, borderColor: "#eef2f6" }} />

        {/* Contact & personal info */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2.5}>
              <InfoRow icon={User} label="Full Name" value={trainer.name} />
              <InfoRow icon={Mail} label="Email Address" value={trainer.email} />
              <InfoRow icon={Phone} label="Phone Number" value={trainer.phone} />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2.5}>
              <InfoRow
                icon={Calendar}
                label="Submitted On"
                value={formattedDate}
              />
              <InfoRow
                icon={Briefcase}
                label="Specialization"
                value={trainer.specialization}
              />
              <Box sx={{ opacity: 0.6 }}>
                <InfoRow icon={FileText} label="Status" value="Pending Review" />
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2, borderColor: "#eef2f6" }} />

        <Box sx={{ mt: 1 }}>
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 600,
              color: "#94a3b8",
              textTransform: "uppercase",
              mb: 1,
              letterSpacing: "0.5px",
            }}
          >
            Biography
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: "16px",
              backgroundColor: "#fafcff",
              borderColor: "#eef2f6",
            }}
          >
            <Typography
              sx={{
                color: "#334155",
                fontSize: "0.85rem",
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
              }}
            >
              {trainer.bio || "No biography provided."}
            </Typography>
          </Paper>
        </Box>
      </Paper>
    </ModalWrapper>
  );
};