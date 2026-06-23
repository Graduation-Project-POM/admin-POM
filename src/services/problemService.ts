import { api } from "./authService";

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface BackendProblem {
  id: number;
  title: string;
  statement: string;
  constraints?: string | null;
  examples?: ProblemExample[] | null;
  difficulty: number;
  topic: string;
  photoUrl?: string | null;
  isPublished: boolean;
  publisherName?: string | null;
  canModify?: boolean;
}

export const Difficulty = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
} as const;

export type DifficultyLabel = "Easy" | "Medium" | "Hard";

export interface CreateProblemPayload {
  title: string;
  statement?: string;
  constraints?: string | null;
  examples?: ProblemExample[] | null;
  difficulty: number;
  topic: string;
  solution?: string;
  photoFileKey?: string;
  isPublished: boolean;
}

export interface UpdateProblemPayload {
  title: string;
  statement?: string;
  constraints?: string | null;
  examples?: ProblemExample[] | null;
  difficulty: number;
  topic: string;
  photoFileKey?: string;
  isPublished: boolean;
}

const BASE = "/api/Problems";

export const getProblems = async (): Promise<BackendProblem[]> => {
  const response = await api.get<BackendProblem[]>(BASE);
  return response.data;
};

export const getProblemById = async (id: number): Promise<BackendProblem> => {
  const response = await api.get<BackendProblem>(`${BASE}/${id}`);
  return response.data;
};

export const createProblem = async (data: CreateProblemPayload) => {
  const response = await api.post(BASE, data);
  return response.data;
};

export const updateProblem = async (id: number, data: UpdateProblemPayload) => {
  const response = await api.put(`${BASE}/${id}`, data);
  return response.data;
};

export const deleteProblem = async (id: number) => {
  const response = await api.delete(`${BASE}/${id}`);
  return response.data;
};

export interface SubmitSolutionPayload {
  solutionText?: string;
  photoFileKey?: string;
}

export const submitSolution = async (
  problemId: number,
  data: SubmitSolutionPayload,
) => {
  const response = await api.post(`${BASE}/${problemId}/bank-submit`, data);
  return response.data;
};

export interface Submission {
  id: number;
  problemId: number;
  studentName: string;
  studentEmail?: string | null;
  solutionText?: string | null;
  photoUrl?: string | null;
  grade?: number | null;
  submittedAt: string;
  isMine?: boolean;
  isPublished?: boolean;
  problemTitle?: string | null;
  problemTopic?: string | null;
  problemStatement?: string | null;
  problemDifficulty?: number;
}

export const getSubmissions = async (problemId: number): Promise<Submission[]> => {
  const response = await api.get<Submission[]>(`${BASE}/${problemId}/bank-submissions`);
  return response.data;
};

export const getMySubmissions = async (): Promise<Submission[]> => {
  const response = await api.get<Submission[]>(`${BASE}/bank/my-submissions`);
  return response.data;
};

export const getMyBankSubmissionsForProblem = async (
  problemId: number,
): Promise<Submission[]> => {
  const response = await api.get<Submission[]>(`${BASE}/${problemId}/bank/my-submissions`);
  return response.data;
};

export interface MySolvedProblemSummary {
  problemId: number;
  title: string;
  topic: string;
  difficulty: number;
  hasBankSubmission: boolean;
  hasContestSubmission: boolean;
  latestContestScore?: number | null;
  latestSubmittedAt: string;
}

export const getMySolvedProblems = async (): Promise<MySolvedProblemSummary[]> => {
  const response = await api.get<MySolvedProblemSummary[]>(`${BASE}/my-solutions`);
  return response.data;
};

export interface MyProblemSolutions {
  problemId: number;
  title: string;
  statement: string | null;
  topic: string;
  difficulty: number;
  bankSubmissions: Submission[];
  contestSubmissions: Submission[];
}

export const getMyProblemSolutions = async (
  problemId: number,
): Promise<MyProblemSolutions> => {
  const response = await api.get<MyProblemSolutions>(`${BASE}/${problemId}/my-solutions`);
  return response.data;
};

// Community details: published rows only for students; trainers/admins see all.
// Own drafts come through getMyDraftsForProblem so the community payload stays
// strictly public.
export const getAllProblemSolutions = async (
  problemId: number,
): Promise<MyProblemSolutions> => {
  const response = await api.get<MyProblemSolutions>(`${BASE}/${problemId}/all-solutions`);
  return response.data;
};

// Caller's own DRAFT submissions for a problem (bank + contest). Strict
// studentId scope on the backend — a draft never leaks to anyone else.
export const getMyDraftsForProblem = async (
  problemId: number,
): Promise<MyProblemSolutions> => {
  const response = await api.get<MyProblemSolutions>(`${BASE}/${problemId}/my-drafts`);
  return response.data;
};

export const difficultyIdToLabel = (difficulty: number): DifficultyLabel => {
  switch (difficulty) {
    case Difficulty.Medium:
      return "Medium";
    case Difficulty.Hard:
      return "Hard";
    case Difficulty.Easy:
    default:
      return "Easy";
  }
};

export const difficultyLabelToId = (label: string): number => {
  switch (label) {
    case "Medium":
      return Difficulty.Medium;
    case "Hard":
      return Difficulty.Hard;
    default:
      return Difficulty.Easy;
  }
};

// ── Submission management (own submissions only) ───────────────────────
// Backend enforces ownership via studentId; these calls are 403 if the
// submission belongs to someone else.

export const deleteBankSubmission = async (submissionId: number): Promise<void> => {
  await api.delete(`${BASE}/bank-submissions/${submissionId}`);
};

export const setBankSubmissionVisibility = async (
  submissionId: number,
  isPublished: boolean,
): Promise<void> => {
  await api.patch(`${BASE}/bank-submissions/${submissionId}/visibility`, { isPublished });
};

export const deleteContestSubmission = async (submissionId: number): Promise<void> => {
  await api.delete(`${BASE}/submissions/${submissionId}`);
};

export const setContestSubmissionVisibility = async (
  submissionId: number,
  isPublished: boolean,
): Promise<void> => {
  await api.patch(`${BASE}/submissions/${submissionId}/visibility`, { isPublished });
};
