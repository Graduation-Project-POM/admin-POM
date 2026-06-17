import { api } from "./authService";
import type {
  Competition,
  CreateCompetitionInput,
  UpdateCompetitionInput,
  CreateCompetitionResult,
} from "../types/competition";

// The "Contest" page maps to the backend's Contest controller.
// Base URL (https://localhost:7205) and the JWT Authorization header are
// handled by the shared axios instance `api` in authService.ts.
const BASE = "/Contest";

export const competitionsService = {
  /** GET /Contest — list all contests. */
  getAll: async (): Promise<Competition[]> => {
    const { data } = await api.get<Competition[]>(BASE);
    return data;
  },

  /** GET /Contest/{id} — a single contest. */
  getById: async (id: number): Promise<Competition> => {
    const { data } = await api.get<Competition>(`${BASE}/${id}`);
    return data;
  },

  /** POST /Contest — create a contest. */
  create: async (
    input: CreateCompetitionInput,
  ): Promise<CreateCompetitionResult> => {
    const { data } = await api.post<CreateCompetitionResult>(BASE, input);
    return data;
  },

  /** PUT /Contest/{id} — update a contest. */
  update: async (id: number, input: UpdateCompetitionInput): Promise<void> => {
    await api.put(`${BASE}/${id}`, input);
  },

  /** DELETE /Contest/{id} — remove a contest (204). */
  remove: async (id: number): Promise<void> => {
    await api.delete(`${BASE}/${id}`);
  },
};
