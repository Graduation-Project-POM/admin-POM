import { api } from "./authService";

export interface StudentOption {
  id: number;
  name: string;
  email: string;
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
