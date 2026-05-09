import { Stack, Typography, Box, Divider, Chip } from "@mui/material";
import { ModalWrapper } from "../../components/common/modal/ModalWrapper";
import { Button } from "../../components/ui/button/Button";
import { Calendar, Users, Trophy, Clock } from "lucide-react";
import type { ContestData } from "../../types";

interface ViewContestProps {
  open: boolean;
  onClose: () => void;
  contest: ContestData | null;
}

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value?: string | number;
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
    <Box
      sx={{ p: 1, bgcolor: "#f8fafc", borderRadius: "8px", color: "#8B1D23" }}
    >
      {icon}
    </Box>
    <Box>
      <Typography
        sx={{
          fontSize: "11px",
          fontWeight: 600,
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ color: "#1e293b", fontWeight: 700, fontSize: "14px" }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

const ViewContest = ({ open, onClose, contest }: ViewContestProps) => {
  if (!contest) return null;

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title="Contest Overview"
      maxWidth="sm"
    >
      <Stack spacing={3} sx={{ mt: 1 }}>
        <Box>
          <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
            <Chip
              label={contest.status}
              size="small"
              sx={{
                bgcolor:
                  contest.status === "Ended"
                    ? "#fee2e2"
                    : contest.status === "Ongoing"
                      ? "#dcfce7"
                      : "#fef3c7",
                color:
                  contest.status === "Ended"
                    ? "#991b1b"
                    : contest.status === "Ongoing"
                      ? "#166534"
                      : "#92400e",
                fontWeight: 700,
              }}
            />
            <Chip
              label={contest.difficulty}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          </Stack>
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, color: "#1e293b", mb: 1 }}
          >
            {contest.title}
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
          <DetailItem
            icon={<Users size={18} />}
            label="Participants"
            value={contest.participants}
          />
          <DetailItem
            icon={<Trophy size={18} />}
            label="Total Problems"
            value={contest.problemsCount}
          />
          <DetailItem
            icon={<Calendar size={18} />}
            label="Start Date"
            value={contest.startDate}
          />
          <DetailItem
            icon={<Clock size={18} />}
            label="End Date"
            value={contest.endDate}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button variantType="outline" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Stack>
    </ModalWrapper>
  );
};

export default ViewContest;
