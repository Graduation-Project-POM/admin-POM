import { api } from "./authService";

export interface TrainerOption {
  id: number;
  name: string;
  specialization: string;
}

// Full trainer profile (GET /Trainer/{id}) for the View Profile screen.
export interface TrainerProfile {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  userName: string;
  phoneNumber: string | null;
  specialization: string;
}

export const trainerService = {
  getAll: async (): Promise<TrainerOption[]> => {
    const { data } = await api.get<Record<string, any>[]>("/Trainer");
    return data.map((tr) => {
      const u = tr.basicUser ?? {};
      const name = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
      return {
        id: Number(tr.id ?? tr.iD ?? tr.ID),
        name: name || `Trainer #${tr.id ?? tr.iD ?? tr.ID}`,
        specialization: tr.specialization ?? "",
      };
    });
  },

  // GET /Trainer/{id} — full profile by id. Backend restricts this to Admin;
  // other callers get 403.
  getById: async (id: number): Promise<TrainerProfile> => {
    const { data } = await api.get<Record<string, any>>(`/Trainer/${id}`);
    const u = data.basicUser ?? {};
    return {
      id: Number(data.id ?? data.iD ?? data.ID),
      firstName: u.firstName ?? "",
      lastName: u.lastName ?? "",
      fullName: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(),
      email: u.email ?? "",
      userName: u.userName ?? "",
      phoneNumber: u.phoneNumber ?? null,
      specialization: data.specialization ?? "",
    };
  },
};
