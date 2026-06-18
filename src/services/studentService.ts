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
