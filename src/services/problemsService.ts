import { api } from "./authService";
import type { CreateProblemInput, UpdateProblemInput } from "../types/problem";

// Problems controller is mounted at /api/Problems. JWT + base URL come from
// the shared axios `api` instance.
const BASE = "/api/Problems";

export const problemsService = {
  /** POST /api/Problems — create a problem in the bank; returns its new id. */
  create: async (input: CreateProblemInput): Promise<number> => {
    const { data } = await api.post<{ problemId: number }>(BASE, input);
    return Number(data.problemId);
  },

  /** PUT /api/Problems/{id} — update a bank problem. */
  update: async (id: number, input: UpdateProblemInput): Promise<void> => {
    await api.put(`${BASE}/${id}`, input);
  },

  /** DELETE /api/Problems/{id} — remove a bank problem (Admin). */
  remove: async (id: number): Promise<void> => {
    await api.delete(`${BASE}/${id}`);
  },
};
