import { api } from "./authService";

// Mirrors the backend ProblemResponseDTO returned by GET /api/Problems
export interface BackendProblem {
  id: number;
  title: string;
  statement: string;
  difficulty: number; // 1 = Easy, 2 = Medium, 3 = Hard
  topic: string;
  photoUrl?: string | null;
  isPublished: boolean;
  publisherName?: string | null;
  canModify?: boolean;
}

// Matches MIO.Core.Enums.Difficulty on the backend
export const Difficulty = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
} as const;

export type DifficultyLabel = "Easy" | "Medium" | "Hard";

export interface CreateProblemPayload {
  title: string;
  statement?: string;
  difficulty: number;
  topic: string;
  solution?: string;
  photoFileKey?: string;
  isPublished: boolean;
}

export interface UpdateProblemPayload {
  title: string;
  statement?: string;
  difficulty: number;
  topic: string;
  photoFileKey?: string;
  isPublished: boolean;
}

// Controller route is [Route("api/[controller]")] on ProblemsController -> /api/Problems
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

// A student submits their own solution to a problem.
export const submitSolution = async (
  problemId: number,
  data: SubmitSolutionPayload,
) => {
  const response = await api.post(`${BASE}/${problemId}/submit`, data);
  return response.data;
};

// A student's submission for a problem (as seen by trainer/admin, or the student).
export interface Submission {
  id: number;
  problemId: number;
  studentId: number;
  studentName: string;
  studentEmail?: string | null;
  solutionText?: string | null;
  photoUrl?: string | null;
  grade?: number | null;
  submittedAt: string;
  // Problem details (populated for the student's own submissions).
  problemTitle?: string | null;
  problemTopic?: string | null;
  problemStatement?: string | null;
  problemDifficulty?: number;
}

export const getSubmissions = async (problemId: number): Promise<Submission[]> => {
  const response = await api.get<Submission[]>(`${BASE}/${problemId}/submissions`);
  return response.data;
};

export const gradeSubmission = async (
  submissionId: number,
  grade: number,
): Promise<Submission> => {
  const response = await api.put<Submission>(
    `${BASE}/submissions/${submissionId}/grade`,
    { grade },
  );
  return response.data;
};

// The current student's own submissions (used to know which problems they solved).
export const getMySubmissions = async (): Promise<Submission[]> => {
  const response = await api.get<Submission[]>(`${BASE}/my/submissions`);
  return response.data;
};

// Map the numeric backend difficulty to the label used by the UI.
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

// Map the UI difficulty label to the numeric backend difficulty.
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
