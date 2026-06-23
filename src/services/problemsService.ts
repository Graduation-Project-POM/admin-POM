import { api } from "./authService";
import type {
  CreateProblemInput,
  UpdateProblemInput,
  ProblemDetail,
  Difficulty,
} from "../types/problem";

const BASE = "/api/Problems";
export interface ProblemSubmission {
  id: number;
  problemId: number;
  studentId: number;
  studentName: string;
  solutionText: string | null;
  solutionPhotoUrl: string | null;
  submittedAt: string;
  score: number | null;
  feedback: string | null;
  gradedAt: string | null;
  problemPoints: number;   
}

export const problemsService = {
  create: async (input: CreateProblemInput): Promise<number> => {
    const { data } = await api.post<{ problemId: number }>(BASE, input);
    return Number(data.problemId);
  },

  getById: async (id: number): Promise<ProblemDetail> => {
    const { data } = await api.get<Record<string, any>>(`${BASE}/${id}`);
    return {
      id: Number(data.id ?? data.iD ?? data.ID),
      title: String(data.title ?? ""),
      statement: data.statement ?? null,
      difficulty: Number(data.difficulty) as Difficulty,
      topic: String(data.topic ?? ""),
      photoUrl: data.photoUrl ?? data.photoURL ?? null,
      isPublished: Boolean(data.isPublished),
      points: Number(data.points ?? 100),
      solvedCount: Number(data.solvedCount ?? 0),
    };
  },

  uploadImage: async (file: File): Promise<string> => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post<{ url: string }>(
      `${BASE}/upload-image`,
      form,
    );
    return data.url;
  },

  submitSolution: async (
    problemId: number,
    body: { solutionText?: string; photoFileKey?: string },
  ): Promise<void> => {
    await api.post(`${BASE}/${problemId}/submit`, body);
  },

  getSubmissions: async (problemId: number): Promise<ProblemSubmission[]> => {
    const { data } = await api.get<Record<string, any>[]>(`${BASE}/${problemId}/submissions`);
    return data.map((s) => ({
      id: Number(s.id ?? s.iD ?? s.ID),
      problemId: Number(s.problemId),
      studentId: Number(s.studentId),
      studentName: String(s.studentName ?? ""),
      solutionText: s.solutionText ?? null,
      solutionPhotoUrl: s.photoUrl ?? s.solutionPhotoUrl ?? null,
      submittedAt: s.submittedAt ?? "",
      score: s.grade ?? s.score ?? null,
      feedback: s.feedback ?? null,
      gradedAt: s.gradedAt ?? null,
      problemPoints: Number(s.problemPoints ?? 100),
    }));
  },
  gradeSubmission: async (
    submissionId: number,
    body: { score: number; feedback?: string },
  ): Promise<void> => {
    await api.put(`${BASE}/submissions/${submissionId}/grade`, {
      grade: body.score,
      feedback: body.feedback,
    });
  },

  update: async (id: number, input: UpdateProblemInput): Promise<void> => {
    await api.put(`${BASE}/${id}`, input);
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`${BASE}/${id}`);
  },
};
