import { SharedTable } from "../../../components/ui/table/tables";
import {
  Box,
  Chip,
  Typography,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmationModal } from "../../../components/common/modal/ConfirmationModal";
import EditProblem from "./Edit";
import CreateProblem from "./Create";

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

const TagsContainer = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
});

const SmallChip = styled(Chip)({
  fontSize: "11px",
  height: "22px",
  fontWeight: 500,
  backgroundColor: "#f3f4f6",
  color: "#374151",
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
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  visibility: "general" | "group-specific";
  submissions: number;
  successRate: number;
};

const mockProblems: Problem[] = [
  {
    id: "1",
    title: "Two Sum",
    category: "Array",
    difficulty: "Easy",
    tags: ["Hash Table", "Array"],
    visibility: "general",
    submissions: 245,
    successRate: 78,
  },
  {
    id: "2",
    title: "Binary Tree Maximum Path Sum",
    category: "Tree",
    difficulty: "Hard",
    tags: ["Dynamic Programming", "Tree"],
    visibility: "group-specific",
    submissions: 87,
    successRate: 42,
  },
  {
    id: "3",
    title: "Merge Intervals",
    category: "Array",
    difficulty: "Medium",
    tags: ["Array", "Sorting"],
    visibility: "general",
    submissions: 156,
    successRate: 65,
  },
];

export const ProblemsPage = () => {
  const { t } = useTranslation();
  const [problems, setProblems] = useState<Problem[]>(mockProblems);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

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

  const filteredProblems = useMemo(() => {
    if (difficultyFilter === "all") return problems;
    return problems.filter((p) => p.difficulty === difficultyFilter);
  }, [problems, difficultyFilter]);

  const handleCreate = (newProblem: Problem) => {
    setProblems([newProblem, ...problems]);
  };

  const handleEdit = (updatedProblem: Problem) => {
    setProblems(
      problems.map((p) => (p.id === updatedProblem.id ? updatedProblem : p)),
    );
  };

  const handleDelete = (id: string) => {
    setConfirmConfig({
      open: true,
      title: t("problem.delete.singleTitle"),
      message: t("problem.delete.singleMessage"),
      onConfirm: () => {
        setProblems(problems.filter((p) => p.id !== id));
      },
    });
  };

  const handleBulkDelete = (ids: string[]) => {
    setConfirmConfig({
      open: true,
      title: t("problem.delete.bulkTitle"),
      message: t("problem.delete.bulkMessage", { count: ids.length }),
      onConfirm: () => {
        setProblems(problems.filter((p) => !ids.includes(p.id)));
      },
    });
  };

  const columns = [
    {
      id: "title",
      label: t("problem.list.columns.title"),
      render: (row: Problem) => (
        <Typography sx={{ fontWeight: 600, color: primaryColor }}>
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
          label={t(`problem.difficulty.${row.difficulty}`)}
          difficulty={row.difficulty}
        />
      ),
    },
    {
      id: "tags",
      label: t("problem.list.columns.tags"),
      render: (row: Problem) => (
        <TagsContainer>
          {row.tags.map((tag, idx) => (
            <SmallChip key={idx} label={tag} />
          ))}
        </TagsContainer>
      ),
    },
    {
      id: "visibility",
      label: t("problem.list.columns.visibility"),
      render: (row: Problem) => (
        <Chip
          label={
            row.visibility === "general"
              ? t("problem.visibility.general")
              : t("problem.visibility.groupSpecific")
          }
          sx={{
            fontSize: "11px",
            height: "22px",
            bgcolor: row.visibility === "general" ? "#e7f7ec" : "#ffe0e0",
            color: row.visibility === "general" ? "#166534" : "#991b1b",
          }}
        />
      ),
    },
    {
      id: "stats",
      label: t("problem.list.columns.stats"),
      render: (row: Problem) => (
        <Box>
          <Typography variant="caption" sx={{ display: "block" }}>
            {t("problem.list.stats.submissions", { count: row.submissions })}
          </Typography>
          <Typography variant="caption" sx={{ display: "block" }}>
            {t("problem.list.stats.success", { rate: row.successRate })}
          </Typography>
        </Box>
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
            >
              <MenuItem value="all">{t("problem.list.filter.allLevels")}</MenuItem>
              <MenuItem value="Easy">{t("problem.difficulty.Easy")}</MenuItem>
              <MenuItem value="Medium">{t("problem.difficulty.Medium")}</MenuItem>
              <MenuItem value="Hard">{t("problem.difficulty.Hard")}</MenuItem>
            </Select>
          </StyledFormControl>
        </SearchFilterBox>
      </Box>

      <SharedTable
        data={filteredProblems}
        columns={columns}
        onAdd={() => setIsCreateModalOpen(true)}
        onEdit={(row) => {
          setSelectedProblem(row);
          setIsEditModalOpen(true);
        }}
        onSingleDelete={handleDelete}
        onDelete={handleBulkDelete}
        addButtonLabel={t("problem.list.addButton")}
        searchPlaceholder={t("problem.list.searchPlaceholder")}
      />

      <CreateProblem
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreate}
      />

      <EditProblem
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProblem(null);
        }}
        problem={selectedProblem}
        onSave={handleEdit}
      />

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
