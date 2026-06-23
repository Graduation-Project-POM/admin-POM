import { api } from "./authService";

export interface BackendProblem {
  id: number;
  title: string;
  statement: string;
  difficulty: number;
  topic: string;
  photoUrl?: string | null;
  isPublished: boolean;
  publisherName?: string | null;
  canModify?: boolean;
  points: number;       
  solvedCount: number;  
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
  difficulty: number;
  topic: string;
  solution?: string;
  photoFileKey?: string;
  isPublished: boolean;
  points: number;               
  isBankVisible?: boolean;       
}

export interface UpdateProblemPayload {
  title: string;
  statement?: string;
  difficulty: number;
  topic: string;
  photoFileKey?: string;
  isPublished: boolean;
  points: number;                
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
  const response = await api.post(`${BASE}/${problemId}/submit`, data);
  return response.data;
};

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
  problemTitle?: string | null;
  problemTopic?: string | null;
  problemStatement?: string | null;
  problemDifficulty?: number;
  problemPoints?: number;   
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

export const getMySubmissions = async (): Promise<Submission[]> => {
  const response = await api.get<Submission[]>(`${BASE}/my/submissions`);
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
