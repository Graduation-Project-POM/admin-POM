import { api } from "./authService";
import type {
  Contest,
  CreateContestInput,
  UpdateContestInput,
  CreateContestResult,
} from "../types/contest";

const BASE = "/Contest";

export const contestService = {
  getAll: async (): Promise<Contest[]> => {
    const { data } = await api.get<Contest[]>(BASE);
    return data;
  },
  getById: async (id: number): Promise<Contest> => {
    const { data } = await api.get<Contest>(`${BASE}/${id}`);
    return data;
  },

  getProblems: async (id: number): Promise<Record<string, unknown>[]> => {
    const { data } = await api.get<Record<string, unknown>[]>(
      `${BASE}/${id}/problems`,
    );
    return data;
  },

  create: async (input: CreateContestInput): Promise<CreateContestResult> => {
    const { data } = await api.post<CreateContestResult>(BASE, input);
    return data;
  },

  update: async (id: number, input: UpdateContestInput): Promise<void> => {
    await api.put(`${BASE}/${id}`, input);
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`${BASE}/${id}`);
  },
};
