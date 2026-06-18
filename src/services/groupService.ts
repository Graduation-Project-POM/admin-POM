import { api } from "./authService";
import { contestService } from "./contestService";
import type {
  Group,
  CreateGroupInput,
  UpdateGroupInput,
  GroupStudent,
  GroupContest,
} from "../types/group";


const BASE = "/Group";

export const groupService = {
  
  getAll: async (): Promise<Group[]> => {
    const { data } = await api.get<Group[]>(BASE);
    return data;
  },

  getMyGroups: async (): Promise<Group[]> => {
    const { data } = await api.get<Group[]>(`${BASE}/my`);
    return data;
  },


  getById: async (id: number): Promise<Group> => {
    const { data } = await api.get<Group>(`${BASE}/${id}`);
    return data;
  },

  create: async (input: CreateGroupInput) => {
    const { data } = await api.post<{ message: string; groupId: number }>(
      BASE,
      input,
    );
    return data;
  },


  update: async (id: number, input: UpdateGroupInput): Promise<void> => {
    await api.put(`${BASE}/${id}`, input);
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`${BASE}/${id}`);
  },


  getStudents: async (id: number): Promise<GroupStudent[]> => {
    const { data } = await api.get<GroupStudent[]>(`${BASE}/${id}/students`);
    return data;
  },

  addStudents: async (id: number, studentIds: number[]): Promise<void> => {
    await api.post(`${BASE}/${id}/students`, { studentIds });
  },


  getContests: async (id: number): Promise<GroupContest[]> => {
    const { data } = await api.get<GroupContest[]>(`${BASE}/${id}/contests`);
    return data;
  },

  addContest: async (id: number, contestId: number): Promise<void> => {
    await api.post(`${BASE}/${id}/contests`, { contestId });
  },


  removeContest: async (id: number, contestId: number): Promise<void> => {
    await api.delete(`${BASE}/${id}/contests/${contestId}`);
  },
  removeStudent: async (id: number, studentId: number): Promise<void> => {
    await api.delete(`${BASE}/${id}/students/${studentId}`);
  },

  getProgress: async (id: number): Promise<number> => {
    const contests = await groupService.getContests(id);
    if (contests.length === 0) return 0;
    const results = await Promise.all(
      contests.map((c) => contestService.getMyProblems(c.contestId).catch(() => [])),
    );
    let total = 0;
    let submitted = 0;
    for (const problems of results) {
      total += problems.length;
      submitted += problems.filter((p) => p.submitted).length;
    }
    return total > 0 ? Math.round((submitted / total) * 100) : 0;
  },
};
