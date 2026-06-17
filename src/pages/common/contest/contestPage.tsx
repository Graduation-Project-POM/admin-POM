import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  InputAdornment,
  Paper,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import { ArrowLeft, Plus } from "lucide-react";
import { useCompetitions } from "../../../hooks/useCompetitions";
import type {
  Competition,
  ContestStatus,
  CreateCompetitionInput,
} from "../../../types/competition";
import { problemsService } from "../../../services/problemsService";
import { DIFFICULTY_FROM_LABEL } from "../../../types/problem";

import {
  StyledContainer,
  HeaderWrapper,
  SubtitleWrapper,
  SearchWrapper,
  StyledSearchField,
  ContestsGrid,
  EmptyStateWrapper,
} from "./constentStyle";
import { Button } from "../../../components/ui/button/Button";
import { ContestCard } from "../../../components/ui/card/contestCard";
import { SharedTable } from "../../../components/ui/table/tables";
import type { ContestData } from "../../../types";
import { Search } from "lucide-react";
import { ConfirmationModal } from "../../../components/common/modal/ConfirmationModal";
import EditContest from "./Edit";
import CreateContest from "./Create";
import ViewContest from "./View";
import CreateProblem from "../problem/Create";
import EditProblem from "../problem/Edit";
import { StudentProgressModal } from "../../trainer/problems-solution/StudentProgressModeal";
import { SolutionDetailModal } from "../../trainer/problems-solution/SolutionDetailsModal";

interface Problem {
  id: string;
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  studentsSolved: number;
  totalSubmissions: number;
  acceptanceRate: number;
}

// ---- Map between the API (Competition) and the card/modal UI shape (ContestData) ----
// The UI uses the label "Ongoing"; the API enum calls it "Running" (status 2).
const STATUS_LABEL_TO_NUMBER: Record<string, ContestStatus> = {
  Upcoming: 1,
  Ongoing: 2,
  Running: 2,
  Ended: 3,
  Cancelled: 4,
};
const STATUS_NUMBER_TO_LABEL: Record<number, string> = {
  1: "Upcoming",
  2: "Ongoing",
  3: "Ended",
  4: "Cancelled",
};

const competitionToContestData = (c: Competition): ContestData => ({
  id: String(c.id),
  title: c.title,
  status: STATUS_NUMBER_TO_LABEL[c.status] ?? "Upcoming",
  difficulty: "Medium", // the API doesn't track difficulty
  participants: c.studentCount,
  problemsCount: c.problemCount,
  startDate: c.startAt,
  endDate: c.endAt,
});

// Turn a date input value (datetime-local or text) into an ISO string for the API.
const toIso = (value: string): string => {
  const d = new Date(value);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
};

// A newly created contest has no problems. There's no contest-scoped problems
// endpoint yet, so start every contest empty (problems can be added in-session).
const contestProblemsMap: Record<string, Problem[]> = {};

const DifficultyBadge: React.FC<{ difficulty: string }> = ({ difficulty }) => {
  const { t } = useTranslation();
  const difficultyStyles = {
    Easy: { bgcolor: "#16a34a15", color: "#16a34a" },
    Medium: { bgcolor: "#eab30815", color: "#eab308" },
    Hard: { bgcolor: "#dc262615", color: "#dc2626" },
  };

  const style =
    difficultyStyles[difficulty as keyof typeof difficultyStyles] ||
    difficultyStyles.Medium;

  return (
    <Box
      sx={{
        display: "inline-block",
        px: 1.5,
        py: 0.3,
        borderRadius: 4,
        bgcolor: style.bgcolor,
        color: style.color,
        fontSize: "0.75rem",
        fontWeight: 600,
      }}
    >
      {t(`contest.difficulty.${difficulty.toLowerCase()}`, difficulty)}
    </Box>
  );
};

const AcceptanceRateDisplay: React.FC<{ rate: number }> = ({ rate }) => (
  <Typography sx={{ fontWeight: 700, color: "#8B1D23" }}>{rate}%</Typography>
);

export const ContestsPage: React.FC = () => {
  const { t } = useTranslation();

  // Contests come from the backend (GET /Contest) via the hook.
  const { competitions, loading, error, create, update, remove } =
    useCompetitions();
  const [actionError, setActionError] = useState<string | null>(null);
  const contests = competitions.map(competitionToContestData);

  const [problemsMap, setProblemsMap] =
    useState<Record<string, Problem[]>>(contestProblemsMap);
  // Problem ids currently attached to the open contest (persisted via PUT /Contest/{id}).
  const [contestProblemIds, setContestProblemIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedContestId, setSelectedContestId] = useState<string | null>(
    null,
  );
  const [selectedContestTitle, setSelectedContestTitle] = useState<string>("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedContest, setSelectedContest] = useState<ContestData | null>(
    null,
  );

  const [isAddProblemOpen, setIsAddProblemOpen] = useState(false);
  const [isEditProblemOpen, setIsEditProblemOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState<any>(null);

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

  const handleCreateContest = async (newContest: ContestData) => {
    setActionError(null);
    const input: CreateCompetitionInput = {
      title: newContest.title,
      description: "",
      status: STATUS_LABEL_TO_NUMBER[newContest.status] ?? 1,
      startAt: toIso(newContest.startDate),
      endAt: toIso(newContest.endDate),
      problemIds: [],
    };
    try {
      await create(input);
    } catch {
      setActionError(
        t("contest.errors.createFailed", "Failed to create competition"),
      );
    }
  };

  const handleUpdateContest = async (updatedContest: ContestData) => {
    setActionError(null);
    try {
      await update(Number(updatedContest.id), {
        title: updatedContest.title,
        status: STATUS_LABEL_TO_NUMBER[updatedContest.status] ?? 1,
        startAt: toIso(updatedContest.startDate),
        endAt: toIso(updatedContest.endDate),
      });
    } catch {
      setActionError(
        t("contest.errors.updateFailed", "Failed to update competition"),
      );
    }
  };

  const handleDeleteContest = (id: string) => {
    setConfirmConfig({
      open: true,
      title: t("contest.confirm.deleteContestTitle"),
      message: t("contest.confirm.deleteContestMessage"),
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, open: false }));
        setActionError(null);
        try {
          await remove(Number(id));
        } catch {
          setActionError(
            t("contest.errors.deleteFailed", "Failed to delete competition"),
          );
        }
      },
    });
  };

  // Add: create the problem in the bank (POST /api/Problems) to get an id,
  // then attach it to the contest by persisting the full id set via PUT /Contest/{id}.
  const handleAddProblem = async (form: any) => {
    if (selectedContestId === null) return;
    setActionError(null);
    try {
      const newId = await problemsService.create({
        title: form.title,
        statement: form.title, // backend requires a non-empty statement
        solution: form.title, // and a non-empty solution
        difficulty: DIFFICULTY_FROM_LABEL[form.difficulty] ?? 1,
        topic: form.category || "General",
        isPublished: form.visibility !== "group-specific",
      });
      const ids = [...contestProblemIds, newId];
      await update(Number(selectedContestId), { problemIds: ids });
      setContestProblemIds(ids);

      const newProblem: Problem = {
        id: String(newId),
        name: form.title,
        difficulty: (form.difficulty as Problem["difficulty"]) ?? "Medium",
        studentsSolved: 0,
        totalSubmissions: 0,
        acceptanceRate: 0,
      };
      setProblemsMap((m) => ({
        ...m,
        [selectedContestId]: [newProblem, ...(m[selectedContestId] || [])],
      }));
    } catch {
      setActionError(
        t("contest.errors.addProblemFailed", "Failed to add problem to the contest"),
      );
    }
  };

  // Edit updates the displayed row locally. (The bank's UpdateProblemDto
  // requires a valid PhotoFileKey URL the modal doesn't collect, so we don't
  // round-trip edits to /api/Problems here.)
  const handleUpdateProblem = (form: any) => {
    if (selectedContestId === null) return;
    setProblemsMap((m) => ({
      ...m,
      [selectedContestId]: (m[selectedContestId] || []).map((p) =>
        p.id === String(form.id)
          ? {
              ...p,
              name: form.title ?? p.name,
              difficulty:
                (form.difficulty as Problem["difficulty"]) ?? p.difficulty,
            }
          : p,
      ),
    }));
  };

  // Remove: detach from the contest by persisting the reduced id set via PUT /Contest/{id}.
  const handleDeleteProblem = (id: string) => {
    setConfirmConfig({
      open: true,
      title: t("contest.confirm.removeProblemTitle"),
      message: t("contest.confirm.removeProblemMessage"),
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, open: false }));
        if (selectedContestId === null) return;
        setActionError(null);
        try {
          const ids = contestProblemIds.filter((x) => x !== Number(id));
          await update(Number(selectedContestId), { problemIds: ids });
          setContestProblemIds(ids);
          setProblemsMap((m) => ({
            ...m,
            [selectedContestId]: (m[selectedContestId] || []).filter(
              (p) => p.id !== id,
            ),
          }));
        } catch {
          setActionError(
            t("contest.errors.removeProblemFailed", "Failed to remove problem"),
          );
        }
      },
    });
  };

  const handleBulkDeleteProblems = (ids: string[]) => {
    setConfirmConfig({
      open: true,
      title: t("contest.confirm.removeProblemsTitle"),
      message: t("contest.confirm.removeProblemsMessage", {
        count: ids.length,
      }),
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, open: false }));
        if (selectedContestId === null) return;
        setActionError(null);
        try {
          const numIds = ids.map(Number);
          const remaining = contestProblemIds.filter(
            (x) => !numIds.includes(x),
          );
          await update(Number(selectedContestId), { problemIds: remaining });
          setContestProblemIds(remaining);
          setProblemsMap((m) => ({
            ...m,
            [selectedContestId]: (m[selectedContestId] || []).filter(
              (p) => !ids.includes(p.id),
            ),
          }));
        } catch {
          setActionError(
            t("contest.errors.removeProblemFailed", "Failed to remove problems"),
          );
        }
      },
    });
  };

  const filteredContests = contests.filter((contest) =>
    contest.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (selectedContestId !== null) {
    const problems = problemsMap[selectedContestId] || [];

    const problemColumns = [
      {
        id: "name",
        label: t("contest.problems.columns.name"),
        render: (row: Problem) => (
          <Typography
            onClick={() => {
              setSelectedProblem(row);
              setIsProgressModalOpen(true);
            }}
            sx={{
              fontWeight: 700,
              color: "#8B1D23",
              fontSize: "14px",
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            {row.name}
          </Typography>
        ),
      },
      {
        id: "difficulty",
        label: t("contest.problems.columns.difficulty"),
        render: (row: Problem) => (
          <DifficultyBadge difficulty={row.difficulty} />
        ),
      },
      {
        id: "studentsSolved",
        label: t("contest.problems.columns.studentsSolved"),
      },
      {
        id: "totalSubmissions",
        label: t("contest.problems.columns.totalSubmissions"),
      },
      {
        id: "acceptanceRate",
        label: t("contest.problems.columns.acceptanceRate"),
        render: (row: Problem) => (
          <AcceptanceRateDisplay rate={row.acceptanceRate} />
        ),
      },
    ];

    return (
      <StyledContainer maxWidth="xl">
        <Button
          variantType="outline"
          startIcon={<ArrowLeft size={18} />}
          onClick={() => setSelectedContestId(null)}
          sx={{ mb: 3 }}
        >
          {t("contest.problems.backButton")}
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            mb: 4,
            bgcolor: "#f8fafc",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b" }}>
            {t("contest.problems.heading", { title: selectedContestTitle })}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#64748b", mt: 1, fontWeight: 500 }}
          >
            {t("contest.problems.description")}
          </Typography>
        </Paper>

        <SharedTable
          data={problems}
          columns={problemColumns}
          onEdit={(row) => {
            setSelectedProblem(row);
            setIsEditProblemOpen(true);
          }}
          onSingleDelete={handleDeleteProblem}
          onDelete={handleBulkDeleteProblems}
          onAdd={() => setIsAddProblemOpen(true)}
          addButtonLabel={t("contest.problems.addButton")}
          searchPlaceholder={t("contest.problems.searchPlaceholder")}
        />

        <CreateProblem
          open={isAddProblemOpen}
          onClose={() => setIsAddProblemOpen(false)}
          onSave={handleAddProblem}
        />

        <EditProblem
          open={isEditProblemOpen}
          onClose={() => {
            setIsEditProblemOpen(false);
            setSelectedProblem(null);
          }}
          problem={
            selectedProblem
              ? {
                  id: selectedProblem.id,
                  title: selectedProblem.name,
                  category: "",
                  difficulty: selectedProblem.difficulty,
                  visibility: "general",
                  tags: [],
                }
              : null
          }
          onSave={handleUpdateProblem}
        />

        <ConfirmationModal
          open={confirmConfig.open}
          onClose={() => setConfirmConfig((prev) => ({ ...prev, open: false }))}
          onConfirm={confirmConfig.onConfirm}
          title={confirmConfig.title}
          message={confirmConfig.message}
        />

        <StudentProgressModal
          open={isProgressModalOpen}
          onClose={() => setIsProgressModalOpen(false)}
          problemTitle={selectedProblem?.name || ""}
          onViewSolution={(submission) => {
            setCurrentSubmission(submission);
            setIsSolutionModalOpen(true);
          }}
        />

        <SolutionDetailModal
          open={isSolutionModalOpen}
          onClose={() => setIsSolutionModalOpen(false)}
          submission={currentSubmission}
          problemTitle={selectedProblem?.name || ""}
          onSaveMark={(id, score) => {
            console.log(`Saved score ${score} for submission ${id}`);
            setIsSolutionModalOpen(false);
          }}
        />
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="xl">
      <HeaderWrapper>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          {t("contest.list.title")}
        </Typography>
      </HeaderWrapper>
      <SubtitleWrapper>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {t("contest.list.subtitle")}
        </Typography>
      </SubtitleWrapper>
      <SearchWrapper>
        <StyledSearchField
          fullWidth
          size="small"
          placeholder={t("contest.list.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} color="#9ca3af" />
                </InputAdornment>
              ),
            },
          }}
        />
        <Stack direction="row" spacing={2}>
          <Button
            variantType="default"
            onClick={() => setIsCreateOpen(true)}
            startIcon={<Plus size={18} />}
          >
            {t("contest.list.createButton")}
          </Button>
        </Stack>
      </SearchWrapper>
      {actionError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setActionError(null)}>
          {actionError}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "#8B1D23" }} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : filteredContests.length === 0 ? (
        <EmptyStateWrapper>
          <Typography variant="body1" color="text.secondary">
            {t("contest.list.noResults")}
          </Typography>
        </EmptyStateWrapper>
      ) : (
        <ContestsGrid>
          {filteredContests.map((contest) => (
            <ContestCard
              key={contest.id}
              contest={contest}
              onView={() => {
                setSelectedContest(contest);
                setIsViewOpen(true);
              }}
              onEdit={() => {
                setSelectedContest(contest);
                setIsEditOpen(true);
              }}
              onProblems={() => {
                setSelectedContestId(contest.id);
                setSelectedContestTitle(contest.title);
                // No endpoint returns a contest's problems, so start the
                // attached-id set empty for this session.
                setContestProblemIds([]);
                setProblemsMap((m) => ({ ...m, [contest.id]: [] }));
              }}
              onDelete={() => handleDeleteContest(contest.id)}
            />
          ))}
        </ContestsGrid>
      )}

      <CreateContest
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleCreateContest}
      />

      <EditContest
        open={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedContest(null);
        }}
        contest={selectedContest}
        onSave={handleUpdateContest}
      />

      <ViewContest
        open={isViewOpen}
        onClose={() => {
          setIsViewOpen(false);
          setSelectedContest(null);
        }}
        contest={selectedContest}
      />

      <ConfirmationModal
        open={confirmConfig.open}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, open: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
      />
    </StyledContainer>
  );
};

export default ContestsPage;
