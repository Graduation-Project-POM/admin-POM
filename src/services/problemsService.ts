import { api } from "./authService";
import type { CreateProblemInput, UpdateProblemInput } from "../types/problem";

const BASE = "/api/Problems";

export const problemsService = {
  create: async (input: CreateProblemInput): Promise<number> => {
    const { data } = await api.post<{ problemId: number }>(BASE, input);
    return Number(data.problemId);
  },

  update: async (id: number, input: UpdateProblemInput): Promise<void> => {
    await api.put(`${BASE}/${id}`, input);
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`${BASE}/${id}`);
  },
};
