import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Typography, InputAdornment, Paper, Stack } from "@mui/material";
import { ArrowLeft, Plus } from "lucide-react";

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

const mockContests: ContestData[] = [
  {
    id: "1",
    title: "Spring Programming 2026",
    status: "Upcoming",
    difficulty: "Medium",
    participants: 156,
    problemsCount: 8,
    startDate: "Apr 15, 2026 at 09:00 AM",
    endDate: "Apr 22, 2026 at 09:00 PM",
  },
  {
    id: "2",
    title: "Code Rush 2026",
    status: "Ended",
    difficulty: "Hard",
    participants: 189,
    problemsCount: 6,
    startDate: "Mar 20, 2026 at 10:00 AM",
    endDate: "Mar 20, 2026 at 06:00 PM",
  },
  {
    id: "3",
    title: "Beginner's Challenge",
    status: "Upcoming",
    difficulty: "Easy",
    participants: 67,
    problemsCount: 5,
    startDate: "May 1, 2026 at 02:00 PM",
    endDate: "May 3, 2026 at 02:00 PM",
  },
];

const contestProblemsMap: Record<string, Problem[]> = {
  1: [
    {
      id: "101",
      name: "Two Sum",
      difficulty: "Easy",
      studentsSolved: 120,
      totalSubmissions: 350,
      acceptanceRate: 78,
    },
    {
      id: "102",
      name: "Reverse Linked List",
      difficulty: "Medium",
      studentsSolved: 95,
      totalSubmissions: 210,
      acceptanceRate: 65,
    },
  ],
  2: [
    {
      id: "201",
      name: "Maximum Subarray",
      difficulty: "Medium",
      studentsSolved: 80,
      totalSubmissions: 180,
      acceptanceRate: 55,
    },
  ],
  3: [
    {
      id: "301",
      name: "FizzBuzz",
      difficulty: "Easy",
      studentsSolved: 200,
      totalSubmissions: 250,
      acceptanceRate: 92,
    },
  ],
};

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
  const [contests, setContests] = useState<ContestData[]>(mockContests);
  const [problemsMap, setProblemsMap] =
    useState<Record<string, Problem[]>>(contestProblemsMap);
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

  const handleCreateContest = (newContest: ContestData) => {
    setContests([newContest, ...contests]);
  };

  const handleUpdateContest = (updatedContest: ContestData) => {
    setContests(
      contests.map((c) => (c.id === updatedContest.id ? updatedContest : c)),
    );
  };

  const handleDeleteContest = (id: string) => {
    setConfirmConfig({
      open: true,
      title: t("contest.confirm.deleteContestTitle"),
      message: t("contest.confirm.deleteContestMessage"),
      onConfirm: () => {
        setContests(contests.filter((c) => c.id !== id));
      },
    });
  };

  const handleAddProblem = (newProblem: Problem) => {
    if (selectedContestId === null) return;
    const currentProblems = problemsMap[selectedContestId] || [];
    setProblemsMap({
      ...problemsMap,
      [selectedContestId]: [newProblem, ...currentProblems],
    });
    setContests(
      contests.map((c) =>
        c.id === selectedContestId
          ? { ...c, problemsCount: c.problemsCount + 1 }
          : c,
      ),
    );
  };

  const handleUpdateProblem = (updatedProblem: Problem) => {
    if (selectedContestId === null) return;
    const currentProblems = problemsMap[selectedContestId] || [];
    setProblemsMap({
      ...problemsMap,
      [selectedContestId]: currentProblems.map((p) =>
        p.id === updatedProblem.id ? updatedProblem : p,
      ),
    });
  };

  const handleDeleteProblem = (id: string) => {
    setConfirmConfig({
      open: true,
      title: t("contest.confirm.removeProblemTitle"),
      message: t("contest.confirm.removeProblemMessage"),
      onConfirm: () => {
        if (selectedContestId === null) return;
        const currentProblems = problemsMap[selectedContestId] || [];
        setProblemsMap({
          ...problemsMap,
          [selectedContestId]: currentProblems.filter((p) => p.id !== id),
        });
        setContests(
          contests.map((c) =>
            c.id === selectedContestId
              ? { ...c, problemsCount: Math.max(0, c.problemsCount - 1) }
              : c,
          ),
        );
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
      onConfirm: () => {
        if (selectedContestId === null) return;
        const currentProblems = problemsMap[selectedContestId] || [];
        setProblemsMap({
          ...problemsMap,
          [selectedContestId]: currentProblems.filter(
            (p) => !ids.includes(p.id),
          ),
        });
        setContests(
          contests.map((c) =>
            c.id === selectedContestId
              ? {
                  ...c,
                  problemsCount: Math.max(0, c.problemsCount - ids.length),
                }
              : c,
          ),
        );
      },
    });
  };

  const filteredContests = mockContests.filter((contest) =>
    contest.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (selectedContestId !== null) {
    const problems = contestProblemsMap[selectedContestId] || [];

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
          problem={selectedProblem}
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
      {filteredContests.length === 0 ? (
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
