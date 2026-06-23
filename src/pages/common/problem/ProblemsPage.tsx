import {
  Box,
  Chip,
  Typography,
  MenuItem,
  Select,
  FormControl,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { createProblem, deleteProblem, difficultyIdToLabel, difficultyLabelToId, getProblems, updateProblem, type BackendProblem, type DifficultyLabel } from "../../../services/problemService";
import type { ProblemFormValues } from "./Create";
import { ConfirmationModal } from "../../../components/common/modal/ConfirmationModal";
import CreateProblem from "./Create";
import EditProblem, { type ProblemEditValues } from "./Edit";
import { SharedTable } from "../../../components/ui/table/tables";
import { getApiErrorMessage } from "../../../utils/apiError";

const primaryColor = "#7A1E1E";

const StyledFormControl = styled(FormControl)({
  minWidth: "180px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "40px",
    backgroundColor: "#ffffff",
    height: "44px",
    transition: "all 0.2s",
    "& fieldset": {
      borderColor: "#e2e8f0",
      borderWidth: "1px",
    },
    "&:hover fieldset": {
      borderColor: "#8B1D23",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#8B1D23",
      borderWidth: "1.5px",
    },
  },
  "& .MuiSelect-select": {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "0 14px",
  },
});
const SearchFilterBox = styled(Box)({
  display: "flex",
  gap: "16px",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "20px",
  marginBottom: "24px",
  padding: "0 4px",
  "@media (max-width: 768px)": {
    flexDirection: "column",
    alignItems: "stretch",
    gap: "12px",
  },
});

const DifficultyChip = styled(Chip)<{ difficulty: string }>(
  ({ difficulty }) => ({
    fontSize: "11px",
    height: "22px",
    fontWeight: 600,
    ...(difficulty === "Easy" && {
      backgroundColor: "#e7f7ec",
      color: "#166534",
    }),
    ...(difficulty === "Medium" && {
      backgroundColor: "#fff7e0",
      color: "#92400e",
    }),
    ...(difficulty === "Hard" && {
      backgroundColor: "#fdecec",
      color: "#991b1b",
    }),
  }),
);

type Problem = {
  id: string;
  title: string;
  category: string;
  difficulty: DifficultyLabel;
  publisher: string;
  status: "published" | "draft";
  canModify: boolean;
  points: number;   
  solved: number;   
};

const toTableRow = (p: BackendProblem): Problem => ({
  id: String(p.id),
  title: p.title,
  category: p.topic,
  difficulty: difficultyIdToLabel(p.difficulty),
  publisher: p.publisherName || "—",
  status: p.isPublished ? "published" : "draft",
  canModify: p.canModify ?? false,
  points: p.points,
  solved: p.solvedCount,
});

export const ProblemsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [rawProblems, setRawProblems] = useState<BackendProblem[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<BackendProblem | null>(
    null,
  );

  const [confirmConfig, setConfirmConfig] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const loadProblems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProblems();
      setRawProblems(data);
      setProblems(data.map(toTableRow));
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to load problems."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProblems();
  }, [loadProblems]);

  const filteredProblems = useMemo(() => {
    if (difficultyFilter === "all") return problems;
    return problems.filter((p) => p.difficulty === difficultyFilter);
  }, [problems, difficultyFilter]);

  const handleCreate = async (data: ProblemFormValues) => {
    await createProblem({
      title: data.title,
      statement: data.description || undefined,
      difficulty: difficultyLabelToId(data.difficulty),
      topic: data.category,
      isPublished: data.isPublished,
      photoFileKey: data.imageUrl || undefined,
      points: data.points,
    });
    await loadProblems();
  };

  const handleUpdate = async (data: ProblemEditValues) => {
    await updateProblem(Number(data.id), {
      title: data.title,
      statement: data.description || undefined,
      difficulty: difficultyLabelToId(data.difficulty),
      topic: data.category,
      isPublished: data.isPublished,
      photoFileKey: data.imageUrl || undefined,
      points: data.points,
    });
    await loadProblems();
  };

  const removeProblems = async (ids: string[]) => {
    try {
      await Promise.all(ids.map((id) => deleteProblem(Number(id))));
      await loadProblems();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, t("problem.list.loadError")));
    }
  };

  const handleDelete = (id: string) => {
    setConfirmConfig({
      open: true,
      title: t("problem.delete.singleTitle"),
      message: t("problem.delete.singleMessage"),
      onConfirm: () => removeProblems([id]),
    });
  };

  const handleBulkDelete = (ids: string[]) => {
    if (ids.length === 0) return;
    setConfirmConfig({
      open: true,
      title: t("problem.delete.bulkTitle"),
      message: t("problem.delete.bulkMessage", { count: ids.length }),
      onConfirm: () => removeProblems(ids),
    });
  };

  const handleEditClick = (row: Problem) => {
    const raw = rawProblems.find((p) => String(p.id) === row.id);
    if (!raw) return;
    setSelectedProblem(raw);
    setIsEditModalOpen(true);
  };

  const columns = [
    {
      id: "title",
      label: t("problem.list.columns.title"),
      render: (row: Problem) => (
        <Typography 
          onClick={() => navigate(`${location.pathname.replace(/\/$/, "")}/${row.id}`)}
          sx={{ 
            fontWeight: 600, 
            color: primaryColor, 
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          {row.title}
        </Typography>
      ),
    },
    { id: "category", label: t("problem.list.columns.category") },
    {
      id: "difficulty",
      label: t("problem.list.columns.difficulty"),
      render: (row: Problem) => (
        <DifficultyChip
          label={row.difficulty}
          difficulty={row.difficulty}
        />
      ),
    },
    {
      id: "points",
      label: t("problem.list.columns.points", "Points"),
      render: (row: Problem) => (
        <Typography sx={{ fontWeight: 700, color: "#8B1D23", fontSize: "13px" }}>{row.points}</Typography>
      ),
    },
    {
      id: "solved",
      label: t("problem.list.columns.solved", "Solved"),
      render: (row: Problem) => (
        <Typography sx={{ fontWeight: 600, color: "#166534", fontSize: "13px" }}>
          {row.solved} {t("problem.list.solvedSuffix", "solved")}
        </Typography>
      ),
    },
    { id: "publisher", label: t("problem.list.columns.publisher") },
    {
      id: "status",
      label: t("problem.list.columns.status"),
      render: (row: Problem) => (
        <Chip
          label={row.status}
          sx={{
            fontSize: "11px",
            height: "22px",
            bgcolor: row.status === "published" ? "#e7f7ec" : "#f3f4f6",
            color: row.status === "published" ? "#166534" : "#374151",
          }}
        />
      ),
    },
  ];

  return (
    <Box sx={{ p: 0 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b" }}>
          {t("problem.list.title")}
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
          {t("problem.list.subtitle")}
        </Typography>

        <SearchFilterBox>
          <StyledFormControl>
            <Select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              displayEmpty
              size="small"
            >
              <MenuItem value="all">{t("problem.list.filter.allLevels")}</MenuItem>
              <MenuItem value="Easy">{t("problem.difficulty.Easy")}</MenuItem>
              <MenuItem value="Medium">{t("problem.difficulty.Medium")}</MenuItem>
              <MenuItem value="Hard">{t("problem.difficulty.Hard")}</MenuItem>
            </Select>
          </StyledFormControl>
        </SearchFilterBox>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress sx={{ color: "#8B1D23" }} />
        </Box>
      ) : (
        <SharedTable
          data={filteredProblems}
          columns={columns}
          onAdd={() => setIsCreateModalOpen(true)}
          onEdit={handleEditClick}
          onSingleDelete={handleDelete}
          onDelete={handleBulkDelete}
          canEditRow={(row: Problem) => row.canModify}
          canDeleteRow={(row: Problem) => row.canModify}
          addButtonLabel={t("problem.list.addButton")}
          searchPlaceholder={t("problem.list.searchPlaceholder")}
        />
      )}

      <CreateProblem
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreate}
      />

      {selectedProblem && (
        <EditProblem
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProblem(null);
          }}
          problem={{
            id: selectedProblem.id,
            title: selectedProblem.title,
            category: selectedProblem.topic,
            description: selectedProblem.statement,
            difficulty: difficultyIdToLabel(selectedProblem.difficulty),
            isPublished: selectedProblem.isPublished,
          }}
          onSave={handleUpdate}
        />
      )}

      <ConfirmationModal
        open={confirmConfig.open}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, open: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
      />
    </Box>
  );
};

export default ProblemsPage;
