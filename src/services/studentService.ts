import { api } from "./authService";

export interface StudentOption {
  id: number;
  name: string;
  email: string;
}

export const studentService = {
  getAll: async (): Promise<StudentOption[]> => {
    const { data } = await api.get<Record<string, any>[]>("/Student");
    return data.map((s) => {
      const u = s.basicUser ?? {};
      const name = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
      return {
        id: Number(s.id ?? s.iD ?? s.ID),
        name: name || `Student #${s.id ?? s.iD ?? s.ID}`,
        email: u.email ?? "",
      };
    });
  },
};
