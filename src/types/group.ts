export interface Group {
  id: number;
  name: string;
  description: string | null;
  startDate: string;
  trainerId: number;
  studentCount: number;
  trainerName: string | null;
  trainerEmail: string | null;
  trainerSpecialization: string | null;
}

export interface CreateGroupInput {
  name: string;
  description?: string;
  trainerId: number;
}

export interface UpdateGroupInput {
  name: string;
  description?: string;
}
export interface GroupStudent {
  studentId: number;
  fullName: string;
  joinDate: string;
}

export interface GroupContest {
  contestId: number;
  title: string;
  addDate: string;
  startAt: string;
  endAt: string;
}
