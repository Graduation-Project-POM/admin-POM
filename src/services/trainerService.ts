import { api } from "./authService";

export interface TrainerOption {
  id: number;
  name: string;
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
};
