import { api } from "./authService";

// Mirrors the backend User entity returned by GET /User
export interface BackendUser {
  id: number;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  email: string;
  userName: string;
  phoneNumber?: string | null;
  gender: string;
  profileImageUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  lastUpdatedAt: string;
  roleID: number;
}

// Matches MIO.Core.Enums.Role on the backend
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
  userName: string;
  phoneNumber?: string;
  gender: string;
  profileImageUrl?: string;
  password: string;
  roleID: number;
}

export interface UpdateUserPayload {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  userName: string;
  phoneNumber?: string;
  gender: string;
  profileImageUrl?: string;
}

// Backend route is [Route("[Controller]")] -> /User
export const getUsers = async (): Promise<BackendUser[]> => {
  const response = await api.get<BackendUser[]>("/User");
  return response.data;
};

export const getUserById = async (id: number): Promise<BackendUser> => {
  const response = await api.get<BackendUser>(`/User/${id}`);
  return response.data;
};

// The logged-in user's own account (any authenticated role).
export const getCurrentUser = async (): Promise<BackendUser> => {
  const response = await api.get<BackendUser>("/User/me");
  return response.data;
};

export const updateCurrentUser = async (data: UpdateUserPayload) => {
  const response = await api.put("/User/me", data);
  return response.data;
};

export const createUser = async (data: CreateUserPayload) => {
  const response = await api.post("/User", data);
  return response.data;
};

export const updateUser = async (id: number, data: UpdateUserPayload) => {
  const response = await api.put(`/User/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await api.delete(`/User/${id}`);
  return response.data;
};

// Map the numeric backend role to the lowercase label used by the UI form/table.
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

// Map the form role string (STUDENT/TRAINER/ADMIN) to the numeric backend role.
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
