import { api } from "./authService";

export interface MyStudentProfile {
  id: number;
  gradeLevel: string;
  city: string;
  schoolName: string;
  nationalId: string;
  problemSolved: number;
  score: number;
  joinYear: string;
  isAccepted: boolean;
  basicUser?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    phoneNumber?: string | null;
  } | null;
}

export interface UpdateMyStudentPayload {
  gradeLevel: string;
  city: string;
  schoolName: string;
  nationalId: string;
}

export const getMyStudentProfile = async (): Promise<MyStudentProfile> => {
  const response = await api.get<MyStudentProfile>("/Student/me");
  return response.data;
};

export const updateMyStudentProfile = async (data: UpdateMyStudentPayload) => {
  const response = await api.put("/Student/me", data);
  return response.data;
};

export interface StudentOption {
  id: number;
  name: string;
  email: string;
}

const toStudentOption = (s: Record<string, any>): StudentOption => {
  const u = s.basicUser ?? {};
  const name = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
  return {
    id: Number(s.id ?? s.iD ?? s.ID),
    name: name || `Student #${s.id ?? s.iD ?? s.ID}`,
    email: u.email ?? "",
  };
};

export const studentService = {
  getAll: async (): Promise<StudentOption[]> => {
    const { data } = await api.get<Record<string, any>[]>("/Student");
    return data.map(toStudentOption);
  },

  getAccepted: async (): Promise<StudentOption[]> => {
    const { data } = await api.get<Record<string, any>[]>("/Student/accepted");
    return data.map(toStudentOption);
  },
};
