import { api } from "./authService";
import type {
  CreateProblemInput,
  UpdateProblemInput,
  ProblemDetail,
  Difficulty,
} from "../types/problem";

const BASE = "/api/Problems";

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

  update: async (id: number, input: UpdateProblemInput): Promise<void> => {
    await api.put(`${BASE}/${id}`, input);
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`${BASE}/${id}`);
  },
};
