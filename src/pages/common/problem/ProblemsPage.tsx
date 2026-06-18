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
import { useLocation, useNavigate } from "react-router-dom";
import { createProblem, deleteProblem, difficultyIdToLabel, difficultyLabelToId, getProblems, updateProblem, type BackendProblem, type DifficultyLabel } from "../../../services/problemService";
import type { ProblemFormValues } from "./Create";
import { ConfirmationModal } from "../../../components/common/modal/ConfirmationModal";
import CreateProblem from "./Create";
import EditProblem, { type ProblemEditValues } from "./Edit";
import { SharedTable } from "../../../components/ui/table/tables";

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
};

const toTableRow = (p: BackendProblem): Problem => ({
  id: String(p.id),
  title: p.title,
  category: p.topic,
  difficulty: difficultyIdToLabel(p.difficulty),
  publisher: p.publisherName || "—",
  status: p.isPublished ? "published" : "draft",
  canModify: p.canModify ?? false,
});

export const ProblemsPage = () => {
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
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load problems.");
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
    });
    await loadProblems();
  };

  const removeProblems = async (ids: string[]) => {
    try {
      await Promise.all(ids.map((id) => deleteProblem(Number(id))));
      await loadProblems();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete problem.");
    }
  };

  const handleDelete = (id: string) => {
    setConfirmConfig({
      open: true,
      title: "Delete Problem",
      message: "Are you sure you want to delete this problem?",
      onConfirm: () => removeProblems([id]),
    });
  };

  const handleBulkDelete = (ids: string[]) => {
    if (ids.length === 0) return;
    setConfirmConfig({
      open: true,
      title: "Delete Problems",
      message: `Are you sure you want to delete ${ids.length} selected problems?`,
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
      label: "Title",
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
    { id: "category", label: "Category" },
    {
      id: "difficulty",
      label: "Difficulty",
      render: (row: Problem) => (
        <DifficultyChip
          label={row.difficulty}
          difficulty={row.difficulty}
        />
      ),
    },
    { id: "publisher", label: "Publisher" },
    {
      id: "status",
      label: "Status",
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
          Problem Bank
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
          Manage your collection of math problems
        </Typography>

        <SearchFilterBox>
          <StyledFormControl>
            <Select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              displayEmpty
              size="small"
            >
              <MenuItem value="all">All Levels</MenuItem>
              <MenuItem value="Easy">Easy</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Hard">Hard</MenuItem>
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
          addButtonLabel="Create Problem"
          searchPlaceholder="Search problems..."
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
