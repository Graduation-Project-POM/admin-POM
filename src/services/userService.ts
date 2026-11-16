import { api } from "./authService";

export interface BackendUser {
  id: number;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  email: string;
  userName: string;
  phoneNumber?: string | null;
  gender?: string | null;
  profileImageUrl?: string | null;
  bio?: string | null;
  isActive: boolean;
  createdAt: string;
  lastUpdatedAt: string;
  roleID: number;
}

export const RoleId = {
  Admin: 1,
  SuperUser: 2,
  Trainer: 3,
  Student: 4,
} as const;

export interface CreateUserPayload {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  // Omit to let the backend generate one from the user's name.
  userName?: string;
  phoneNumber?: string;
  gender?: string;
  profileImageUrl?: string;
  // Omit to have the backend generate a secure random password.
  password?: string;
  roleID: number;
  isActive?: boolean;
}

export interface CreateUserResponse {
  message: string;
  userId: number;
  // Set only when no password was sent; returned this once, never stored.
  generatedPassword?: string | null;
}

export interface UpdateUserPayload {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  userName: string;
  phoneNumber?: string;
  gender?: string;
  profileImageUrl?: string;
  bio?: string;
}

// Admin-only fields for PUT /User/{id}; omitted fields are left unchanged.
export interface AdminUpdateUserPayload extends UpdateUserPayload {
  newPassword?: string;
  roleID?: number;
  isActive?: boolean;
}

export const getUsers = async (): Promise<BackendUser[]> => {
  const response = await api.get<BackendUser[]>("/User");
  return response.data;
};

export const getUserById = async (id: number): Promise<BackendUser> => {
  const response = await api.get<BackendUser>(`/User/${id}`);
  return response.data;
};

export const getCurrentUser = async (): Promise<BackendUser> => {
  const response = await api.get<BackendUser>("/User/me");
  return response.data;
};

export const updateCurrentUser = async (data: UpdateUserPayload) => {
  const response = await api.put("/User/me", data);
  return response.data;
};

export const createUser = async (data: CreateUserPayload): Promise<CreateUserResponse> => {
  const response = await api.post<CreateUserResponse>("/User", data);
  return response.data;
};

export const updateUser = async (id: number, data: AdminUpdateUserPayload) => {
  const response = await api.put(`/User/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await api.delete(`/User/${id}`);
  return response.data;
};

export const roleIdToLabel = (roleId: number): string => {
  switch (roleId) {
    case RoleId.Admin:
      return "admin";
    case RoleId.SuperUser:
      return "superuser";
    case RoleId.Trainer:
      return "trainer";
    case RoleId.Student:
      return "student";
    default:
      return "student";
  }
};

export const roleNameToId = (roleName: string): number => {
  switch (roleName?.toUpperCase()) {
    case "ADMIN":
      return RoleId.Admin;
    case "TRAINER":
      return RoleId.Trainer;
    case "STUDENT":
      return RoleId.Student;
    default:
      return RoleId.Student;
  }
};

// One sign-up request on the admin Approvals page (GET /User/approvals),
// for any self-registering role.
export interface ApprovalRequest {
  userId: number;
  // Student.Id or Trainer.Id — what accept and the profile page are keyed by.
  profileId: number;
  role: "Student" | "Trainer";
  name: string;
  email: string;
  phoneNumber: string;
  isAccepted: boolean;
  createdAt: string;
  // Grade level for students, specialization for trainers.
  detail: string;
}

// Raw row from GET /User/approvals.
interface ApprovalResponse {
  userId: number;
  profileId: number;
  role: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string | null;
  isAccepted: boolean;
  createdAt?: string;
  gradeLevel?: string | null;
  specialization?: string | null;
}

export const approvalService = {
  getAll: async (): Promise<ApprovalRequest[]> => {
    const { data } = await api.get<ApprovalResponse[]>("/User/approvals");
    return data.map((a) => ({
      userId: Number(a.userId),
      profileId: Number(a.profileId),
      role: a.role === "Trainer" ? "Trainer" : "Student",
      name: `${a.firstName ?? ""} ${a.lastName ?? ""}`.trim(),
      email: a.email ?? "",
      phoneNumber: a.phoneNumber ?? "",
      isAccepted: Boolean(a.isAccepted),
      createdAt: a.createdAt ?? "",
      detail: (a.role === "Trainer" ? a.specialization : a.gradeLevel) ?? "",
    }));
  },

  // PATCH /Student/{id}/accept or /Trainer/{id}/accept.
  accept: async (request: ApprovalRequest): Promise<void> => {
    await api.patch(`/${request.role}/${request.profileId}/accept`);
  },

  // Rejecting (or deleting from history) removes the user account and its
  // role profile, whatever the role.
  remove: async (userId: number): Promise<void> => {
    await deleteUser(userId);
  },
};
