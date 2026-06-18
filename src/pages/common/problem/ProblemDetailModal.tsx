import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Chip,
  Stack,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ModalWrapper } from "../../../components/common/modal/ModalWrapper";
import { Button } from "../../../components/ui/button/Button";
import { problemsService } from "../../../services/problemsService";
import { getApiErrorMessage } from "../../../utils/apiError";
import { resolveMediaUrl } from "../../../utils/media";
import { DIFFICULTY_LABEL } from "../../../types/problem";
import type { ProblemDetail } from "../../../types/problem";

interface ProblemDetailModalProps {
  open: boolean;
  onClose: () => void;
  problemId: number | null;
}

const difficultyStyle = (label: string) => ({
  bgcolor:
    label === "Easy" ? "#e7f7ec" : label === "Medium" ? "#fff7e0" : "#fdecec",
  color:
    label === "Easy" ? "#166534" : label === "Medium" ? "#92400e" : "#991b1b",
});

const ProblemDetailModal: React.FC<ProblemDetailModalProps> = ({
  open,
  onClose,
  problemId,
}) => {
  const { t } = useTranslation();
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || problemId == null) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setProblem(null);
    problemsService
      .getById(problemId)
      .then((data) => {
        if (!cancelled) setProblem(data);
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            getApiErrorMessage(
              err,
              t("problem.detail.loadFailed", "Failed to load problem details"),
            ),
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, problemId, t]);

  const difficultyLabel = problem
    ? (DIFFICULTY_LABEL[problem.difficulty] ?? "Medium")
    : "";

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={t("problem.detail.title", "Problem Details")}
      maxWidth="md"
    >
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress sx={{ color: "#8B1D23" }} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : problem ? (
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Box>
            <Stack
              direction="row"
              spacing={1}
              sx={{ mb: 1.5, flexWrap: "wrap", gap: 1 }}
            >
              {problem.topic && (
                <Chip
                  label={problem.topic}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              )}
              <Chip
                label={t(
                  `contest.difficulty.${difficultyLabel.toLowerCase()}`,
                  difficultyLabel,
                )}
                size="small"
                sx={{ fontWeight: 600, ...difficultyStyle(difficultyLabel) }}
              />
            </Stack>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, color: "#1e293b" }}
            >
              {problem.title}
            </Typography>
          </Box>

          {problem.photoUrl && (
            <Box
              component="img"
              src={resolveMediaUrl(problem.photoUrl) ?? undefined}
              alt={problem.title}
              sx={{
                width: "100%",
                maxHeight: 360,
                objectFit: "contain",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                bgcolor: "#f8fafc",
              }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          )}

          <Divider />

          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                mb: 1,
                color: "#1e293b",
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {t("problem.detail.description", "Description")}
            </Typography>
            <Typography
              sx={{ color: "#475569", lineHeight: 1.8, whiteSpace: "pre-wrap" }}
            >
              {problem.statement && problem.statement.trim()
                ? problem.statement
                : t("problem.detail.noDescription", "No description provided.")}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <Button variantType="outline" onClick={onClose}>
              {t("buttons.close")}
            </Button>
          </Box>
        </Stack>
      ) : null}
    </ModalWrapper>
  );
};

export default ProblemDetailModal;
