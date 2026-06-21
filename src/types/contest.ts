export const ContestStatus = {
  Upcoming: 1,
  Running: 2,
  Ended: 3,
  Cancelled: 4,
} as const;

export type ContestStatus = (typeof ContestStatus)[keyof typeof ContestStatus];

export const CONTEST_STATUS_LABEL: Record<number, string> = {
  1: "Upcoming",
  2: "Ongoing",
  3: "Ended",
  4: "Cancelled",
};

export interface Contest {
  id: number;
  title: string;
  description: string;
  status: ContestStatus;
  startAt: string; 
  endAt: string; 
  trainerId: number;
  problemCount: number;
  studentCount: number;
}

export interface CreateContestInput {
  title: string;
  description?: string;
  status: ContestStatus;
  startAt: string; 
  endAt: string; 
  problemIds?: number[];
  groupId: number; 
}
export type UpdateContestInput = Partial<CreateContestInput>;

export interface CreateContestResult {
  message: string;
  contestID: number;
}
