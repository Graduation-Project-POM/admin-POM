import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  InputAdornment,
  Paper,
  Stack,
  Alert,
} from "@mui/material";
import { ArrowLeft, Plus, Trophy } from "lucide-react";
import { useContests } from "../../../hooks/useContests";
import { contestService } from "../../../services/contestService";
import type {
  Contest,
  CreateContestInput,
} from "../../../types/contest";
import { problemsService } from "../../../services/problemsService";
import type { ProblemSubmission } from "../../../services/problemsService";
import { getApiErrorMessage } from "../../../utils/apiError";
import { getContestStatus, getContestStatusNumber } from "../../../utils/contestStatus";
import { DIFFICULTY_FROM_LABEL, DIFFICULTY_LABEL } from "../../../types/problem";

import {
  StyledContainer,
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
import Leaderboard from "./Leaderboard";
import CreateProblem, { type ProblemFormValues } from "../problem/Create";
import EditProblem, { type ProblemEditValues } from "../problem/Edit";
import { StudentProgressModal } from "../../trainer/problems-solution/StudentProgressModeal";
import { SolutionDetailModal } from "../../trainer/problems-solution/SolutionDetailsModal";
import { brand, neutral, statusTone } from '../../../theme';
import { ErrorState, LoadingState } from '../../../components/common/states';
import { PageHeader } from '../../../components/common/shell';

interface Problem {
  id: string;
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  studentsSolved: number;
  totalSubmissions: number;
  acceptanceRate: number;
}

const toContestData = (c: Contest): ContestData => ({
  id: String(c.id),
  title: c.title,
  status: getContestStatus(c.startAt, c.endAt),
  difficulty: "Medium",
  participants: c.studentCount,
  problemsCount: c.problemCount,
  startDate: c.startAt,
  endDate: c.endAt,
});

const toIso = (value: string): string => {
  const d = new Date(value);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
};

const contestProblemsMap: Record<string, Problem[]> = {};

const DifficultyBadge: React.FC<{ difficulty: string }> = ({ difficulty }) => {
  const { t } = useTranslation();
  const difficultyStyles = {
    Easy: { bgcolor: "#16a34a15", color: "#16a34a" },
    Medium: { bgcolor: "#eab30815", color: "#eab308" },
    Hard: { bgcolor: "#dc262615", color: statusTone.danger.solid },
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
  <Typography sx={{ fontWeight: 700, color: brand[500] }}>{rate}%</Typography>
);

export const ContestsPage: React.FC = () => {
  const { t } = useTranslation();

  const { contests: apiContests, loading, error, create, update, remove } =
    useContests();
  const [actionError, setActionError] = useState<string | null>(null);
  const contests = apiContests.map(toContestData);

  const [problemsMap, setProblemsMap] =
    useState<Record<string, Problem[]>>(contestProblemsMap);
  const [contestProblemIds, setContestProblemIds] = useState<number[]>([]);
  const [problemsLoading, setProblemsLoading] = useState(false);

  const loadContestProblems = async (contestId: string) => {
    setProblemsLoading(true);
    setActionError(null);
    setContestProblemIds([]);
    setProblemsMap((m) => ({ ...m, [contestId]: [] }));
    try {
      const data = await contestService.getProblems(Number(contestId));
      const ids: number[] = [];
      const mapped: Problem[] = data.map((p) => {
        const pid = Number(p.id ?? p.iD ?? p.ID);
        ids.push(pid);
        return {
          id: String(pid),
          name: String(p.title ?? ""),
          difficulty:
            (DIFFICULTY_LABEL[Number(p.difficulty)] as Problem["difficulty"]) ??
            "Medium",
          studentsSolved: 0,
          totalSubmissions: 0,
          acceptanceRate: 0,
        };
      });
      setContestProblemIds(ids);
      setProblemsMap((m) => ({ ...m, [contestId]: mapped }));

      void Promise.all(
        mapped.map(async (prob) => {
          try {
            const subs = await problemsService.getSubmissions(Number(prob.id));
            return { id: prob.id, ...submissionStats(subs) };
          } catch {
            return null;
          }
        }),
      ).then((results) => {
        const byId = new Map(
          results.filter((r): r is NonNullable<typeof r> => r != null).map((r) => [r.id, r]),
        );
        if (byId.size === 0) return;
        setProblemsMap((m) => ({
          ...m,
          [contestId]: (m[contestId] || []).map((p) =>
            byId.has(p.id) ? { ...p, ...byId.get(p.id)! } : p,
          ),
        }));
      });
    } catch (err) {
      setContestProblemIds([]);
      setProblemsMap((m) => ({ ...m, [contestId]: [] }));
      setActionError(
        getApiErrorMessage(
          err,
          t("contest.errors.loadProblemsFailed", "Failed to load contest problems"),
        ),
      );
    } finally {
      setProblemsLoading(false);
    }
  };
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
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState<ProblemSubmission | null>(null);

  const [submissions, setSubmissions] = useState<ProblemSubmission[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [gradingSaving, setGradingSaving] = useState(false);

  const loadSubmissions = async (problemId: number): Promise<ProblemSubmission[]> => {
    setSubmissionsLoading(true);
    try {
      const subs = await problemsService.getSubmissions(problemId);
      setSubmissions(subs);
      return subs;
    } catch (err) {
      setSubmissions([]);
      setActionError(
        getApiErrorMessage(err, t("contest.errors.loadSubmissionsFailed", "Failed to load submissions")),
      );
      return [];
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const submissionStats = (subs: ProblemSubmission[]) => {
    const total = subs.length;
    const graded = subs.filter((s) => s.gradedAt != null || s.score != null).length;
    return {
      totalSubmissions: total,
      studentsSolved: graded,
      acceptanceRate: total > 0 ? Math.round((graded / total) * 100) : 0,
    };
  };

  const handleGradeSubmission = async (submissionId: number, score: number, feedback: string) => {
    setGradingSaving(true);
    setActionError(null);
    try {
      await problemsService.gradeSubmission(submissionId, {
        score,
        feedback: feedback.trim() || undefined,
      });
      setIsSolutionModalOpen(false);
      if (selectedProblem && selectedContestId) {
        const subs = await loadSubmissions(Number(selectedProblem.id));
        const pid = selectedProblem.id;
        const stats = submissionStats(subs);
        setProblemsMap((m) => ({
          ...m,
          [selectedContestId]: (m[selectedContestId] || []).map((p) =>
            p.id === pid ? { ...p, ...stats } : p,
          ),
        }));
      }
    } catch (err) {
      setActionError(getApiErrorMessage(err, t("contest.errors.gradeFailed", "Failed to save mark")));
    } finally {
      setGradingSaving(false);
    }
  };

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

  const handleCreateContest = async (newContest: any) => {
    setActionError(null);
    const startAt = toIso(newContest.startDate);
    const endAt = toIso(newContest.endDate);
    const input: CreateContestInput = {
      title: newContest.title,
      description: "",
      status: getContestStatusNumber(startAt, endAt),
      startAt,
      endAt,
      problemIds: [],
      groupId: Number(newContest.groupId) || 0,
    };
    try {
      await create(input);
    } catch (err) {
      setActionError(
        getApiErrorMessage(err, t("contest.errors.createFailed", "Failed to create contest")),
      );
    }
  };

  const handleUpdateContest = async (updatedContest: ContestData) => {
    setActionError(null);
    try {
      const startAt = toIso(updatedContest.startDate);
      const endAt = toIso(updatedContest.endDate);
      await update(Number(updatedContest.id), {
        title: updatedContest.title,
        status: getContestStatusNumber(startAt, endAt),
        startAt,
        endAt,
      });
    } catch (err) {
      setActionError(
        getApiErrorMessage(err, t("contest.errors.updateFailed", "Failed to update contest")),
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
        } catch (err) {
          setActionError(
            getApiErrorMessage(err, t("contest.errors.deleteFailed", "Failed to delete contest")),
          );
        }
      },
    });
  };

  const handleAddProblem = async (form: ProblemFormValues) => {
    if (selectedContestId === null) return;
    setActionError(null);
    try {
      const newId = await problemsService.create({
        title: form.title,
        statement: form.description || "",
        constraints: form.constraints || null,
        examples: form.examples.length > 0 ? form.examples : null,
        solution: form.description || form.title,
        difficulty: DIFFICULTY_FROM_LABEL[form.difficulty] ?? 1,
        topic: form.category || "General",
        photoFileKey: form.imageUrl || null,
        isPublished: form.isPublished,
        points: form.points,         
        isBankVisible: false,        
        isBankProblem: false,
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
    } catch (err) {
      setActionError(
        getApiErrorMessage(err, t("contest.errors.addProblemFailed", "Failed to add problem to the contest")),
      );
    }
  };

  const handleUpdateProblem = (form: ProblemEditValues) => {
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
        } catch (err) {
          setActionError(
            getApiErrorMessage(err, t("contest.errors.removeProblemFailed", "Failed to remove problem")),
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
        } catch (err) {
          setActionError(
            getApiErrorMessage(err, t("contest.errors.removeProblemFailed", "Failed to remove problems")),
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
              setSubmissions([]);
              setIsProgressModalOpen(true);
              void loadSubmissions(Number(row.id));
            }}
            sx={{
              fontWeight: 700,
              color: brand[500],
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
      <StyledContainer maxWidth="xl" disableGutters>
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
            border: `1px solid ${neutral[200]}`,
            mb: 4,
            bgcolor: neutral[50],
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h5" component="h2" sx={{ color: neutral[800] }}>
                {t("contest.problems.heading", { title: selectedContestTitle })}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: neutral[500], mt: 1 }}
              >
                {t("contest.problems.description")}
              </Typography>
            </Box>
            <Button
              variantType="default"
              startIcon={<Trophy size={16} />}
              onClick={() => setIsLeaderboardOpen(true)}
            >
              {t("contest.view.viewLeaderboard")}
            </Button>
          </Box>
        </Paper>

        {actionError && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setActionError(null)}
          >
            {actionError}
          </Alert>
        )}

        {problemsLoading ? (
          <LoadingState />
        ) : (
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
        )}

        <CreateProblem
          open={isAddProblemOpen}
          onClose={() => setIsAddProblemOpen(false)}
          onSave={handleAddProblem}
          requireStatus={false}
        />

        <EditProblem
          open={isEditProblemOpen}
          onClose={() => {
            setIsEditProblemOpen(false);
            setSelectedProblem(null);
          }}
          requireStatus={false}
          problem={
            selectedProblem
              ? {
                  id: selectedProblem.id,
                  title: selectedProblem.name,
                  category: "",
                  difficulty: selectedProblem.difficulty,
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
          submissions={submissions}
          loading={submissionsLoading}
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
          saving={gradingSaving}
          onSaveMark={handleGradeSubmission}
        />

        <Leaderboard
          open={isLeaderboardOpen}
          onClose={() => setIsLeaderboardOpen(false)}
          contestId={selectedContestId != null ? Number(selectedContestId) : null}
          contestTitle={selectedContestTitle}
        />
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="xl" disableGutters>
      <PageHeader
        title={t("contest.list.title")}
        subtitle={t("contest.list.subtitle")}
      />
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
                  <Search size={18} color={neutral[400]} />
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
        <ErrorState message={actionError} onClose={() => setActionError(null)} />
      )}

      {loading ? (
        <LoadingState />
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
                void loadContestProblems(contest.id);
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
