import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Trophy } from "lucide-react";
import { ModalWrapper } from "../../../components/common/modal/ModalWrapper";
import { Button } from "../../../components/ui/button/Button";
import { contestService } from "../../../services/contestService";
import { getApiErrorMessage } from "../../../utils/apiError";
import type { ContestLeaderboardEntry } from "../../../types/contest";

interface LeaderboardProps {
  open: boolean;
  onClose: () => void;
  contestId: number | null;
  contestTitle?: string;
  highlightStudentId?: number | null;
}

const medalBg = (rank: number) => {
  if (rank === 1) return "#fde68a";
  if (rank === 2) return "#e5e7eb";
  if (rank === 3) return "#fcd9b6";
  return "#f1f5f9";
};

const medalColor = (rank: number) => {
  if (rank === 1) return "#92400e";
  if (rank === 2) return "#475569";
  if (rank === 3) return "#9a3412";
  return "#475569";
};

const Leaderboard = ({
  open,
  onClose,
  contestId,
  contestTitle,
  highlightStudentId,
}: LeaderboardProps) => {
  const { t } = useTranslation();
  const [rows, setRows] = useState<ContestLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || contestId == null) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    contestService
      .getLeaderboard(contestId)
      .then((data) => {
        if (!cancelled) setRows(data);
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(getApiErrorMessage(err, t("contest.leaderboard.loadError")));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, contestId, t]);

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={t("contest.leaderboard.title")}
      maxWidth="sm"
    >
      <Stack spacing={2} sx={{ mt: 1 }}>
        {contestTitle && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Trophy size={20} color="#8B1D23" />
            <Typography sx={{ fontWeight: 700, color: "#1e293b" }}>
              {contestTitle}
            </Typography>
          </Box>
        )}

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#8B1D23" }} />
          </Box>
        )}

        {error && !loading && (
          <Typography sx={{ color: "#b91c1c", textAlign: "center", py: 2 }}>
            {error}
          </Typography>
        )}

        {!loading && !error && rows.length === 0 && (
          <Typography sx={{ color: "#64748b", textAlign: "center", py: 4 }}>
            {t("contest.leaderboard.empty")}
          </Typography>
        )}

        {!loading && !error && rows.length > 0 && (
          <TableContainer
            sx={{ border: "1px solid #e2e8f0", borderRadius: "12px" }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                  <TableCell
                    sx={{ fontWeight: 700, color: "#475569", width: 80 }}
                  >
                    {t("contest.leaderboard.rank")}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                    {t("contest.leaderboard.name")}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 700, color: "#475569", width: 120 }}
                  >
                    {t("contest.leaderboard.points")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => {
                  const isMe =
                    highlightStudentId != null &&
                    row.studentId === highlightStudentId;
                  return (
                    <TableRow
                      key={row.studentId}
                      sx={{
                        bgcolor: isMe ? "#fef2f2" : "transparent",
                        "&:hover": { bgcolor: isMe ? "#fee2e2" : "#f8fafc" },
                      }}
                    >
                      <TableCell>
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minWidth: 32,
                            height: 28,
                            px: 1.25,
                            borderRadius: "999px",
                            bgcolor: medalBg(row.rank),
                            color: medalColor(row.rank),
                            fontWeight: 800,
                            fontSize: "13px",
                          }}
                        >
                          {row.rank}
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          color: isMe ? "#8B1D23" : "#1e293b",
                          fontWeight: isMe ? 800 : 600,
                        }}
                      >
                        {row.studentName}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontWeight: 700, color: "#1e293b" }}
                      >
                        {row.score}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variantType="outline" onClick={onClose}>
            {t("buttons.close")}
          </Button>
        </Box>
      </Stack>
    </ModalWrapper>
  );
};

export default Leaderboard;
