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

// A student row for the admin list/approvals views.
export interface StudentListItem extends StudentOption {
  gradeLevel: string;
  joinYear: string;
  isAccepted: boolean;
}

// Full student profile (GET /Student/{id}) — every stored field, for the
// View Profile screen.
export interface StudentProfile {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  userName: string;
  phoneNumber: string | null;
  gradeLevel: string;
  city: string;
  schoolName: string;
  nationalId: string;
  problemSolved: number;
  score: number;
  joinYear: string;
  isAccepted: boolean;
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

  // GET /Student — full list including acceptance status + a few profile fields
  // (Admin), for the dashboard and the approvals page.
  getAllDetailed: async (): Promise<StudentListItem[]> => {
    const { data } = await api.get<Record<string, any>[]>("/Student");
    return data.map((s) => ({
      ...toStudentOption(s),
      gradeLevel: s.gradeLevel ?? "",
      joinYear: s.joinYear ?? "",
      isAccepted: Boolean(s.isAccepted),
    }));
  },

  // PATCH /Student/{id}/accept — admin approves a pending student.
  accept: async (id: number): Promise<void> => {
    await api.patch(`/Student/${id}/accept`);
  },

  // DELETE /Student/{id} — admin removes a student (used to reject a pending one).
  remove: async (id: number): Promise<void> => {
    await api.delete(`/Student/${id}`);
  },

  // GET /Student/{id} — full profile by id. Backend authorizes via the
  // StudentOwnerOrAdminOrTrainer policy (Admin, any Trainer, or the student
  // themselves); other callers get 403.
  getById: async (id: number): Promise<StudentProfile> => {
    const { data } = await api.get<Record<string, any>>(`/Student/${id}`);
    const u = data.basicUser ?? {};
    return {
      id: Number(data.id ?? data.iD ?? data.ID),
      firstName: u.firstName ?? "",
      lastName: u.lastName ?? "",
      fullName: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(),
      email: u.email ?? "",
      userName: u.userName ?? "",
      phoneNumber: u.phoneNumber ?? null,
      gradeLevel: data.gradeLevel ?? "",
      city: data.city ?? "",
      schoolName: data.schoolName ?? "",
      nationalId: data.nationalId ?? "",
      problemSolved: Number(data.problemSolved ?? 0),
      score: Number(data.score ?? 0),
      joinYear: data.joinYear ?? "",
      isAccepted: Boolean(data.isAccepted),
    };
  },
};
