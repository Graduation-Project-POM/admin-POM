import { api } from "./authService";
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
};
