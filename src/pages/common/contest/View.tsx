import { useTranslation } from "react-i18next";
import { Stack, Typography, Box, Divider, Chip } from "@mui/material";
import { ModalWrapper } from "../../../components/common/modal/ModalWrapper";
import { Button } from "../../../components/ui/button/Button";
import { Calendar, Users, Trophy, Clock } from "lucide-react";
import type { ReactNode } from "react";
import type { ContestData } from "../../../types";
import { formatDateTime } from "../../../utils/datetime";
import { brand, neutral, statusTone } from '../../../theme';

interface ViewContestProps {
  open: boolean;
  onClose: () => void;
  contest: ContestData | null;
}

const DetailItem = ({
  icon,
  label,
  value,
  ltr = false,
}: {
  icon: ReactNode;
  label: string;
  value?: string | number;
  ltr?: boolean;
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
    <Box
      sx={{ p: 1, bgcolor: neutral[50], borderRadius: "8px", color: brand[500] }}
    >
      {icon}
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography
        sx={{
          fontSize: "11px",
          fontWeight: 600,
          color: neutral[400],
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Typography>
      <Typography
        dir={ltr ? "ltr" : undefined}
        sx={{
          color: neutral[800],
          fontWeight: 700,
          fontSize: "14px",
          ...(ltr && { unicodeBidi: "isolate" }),
        }}
      >
        {value}
      </Typography>
    </Box>
  </Box>
);

const ViewContest = ({ open, onClose, contest }: ViewContestProps) => {
  const { t } = useTranslation();
  if (!contest) return null;

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={t("contest.view.title")}
      maxWidth="sm"
    >
      <Stack spacing={3} sx={{ mt: 1 }}>
        <Box>
          <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
            <Chip
              label={t(
                `contest.status.${contest.status.toLowerCase()}`,
                contest.status,
              )}
              size="small"
              sx={{
                bgcolor:
                  contest.status === "Ended"
                    ? statusTone.danger.bg
                    : contest.status === "Ongoing"
                      ? statusTone.success.bg
                      : statusTone.warning.bg,
                color:
                  contest.status === "Ended"
                    ? statusTone.danger.fg
                    : contest.status === "Ongoing"
                      ? statusTone.success.fg
                      : statusTone.warning.fg,
                fontWeight: 700,
              }}
            />
            <Chip
              label={t(
                `contest.difficulty.${contest.difficulty.toLowerCase()}`,
                contest.difficulty,
              )}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          </Stack>
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, color: neutral[800], mb: 1 }}
          >
            {contest.title}
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
          <DetailItem
            icon={<Users size={18} />}
            label={t("contest.view.participants")}
            value={contest.participants}
          />
          <DetailItem
            icon={<Trophy size={18} />}
            label={t("contest.view.totalProblems")}
            value={contest.problemsCount}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <DetailItem
            icon={<Calendar size={18} />}
            label={t("contest.view.startDate")}
            value={formatDateTime(contest.startDate)}
            ltr
          />
          <DetailItem
            icon={<Clock size={18} />}
            label={t("contest.view.endDate")}
            value={formatDateTime(contest.endDate)}
            ltr
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button variantType="outline" onClick={onClose}>
            {t("buttons.close")}
          </Button>
        </Box>
      </Stack>
    </ModalWrapper>
  );
};

export default ViewContest;
