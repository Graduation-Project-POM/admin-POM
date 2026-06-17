// Types mirroring the backend Contest API (route: /Contest).
// The backend serializes enums as NUMBERS and properties as camelCase.

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

/** Shape returned by GET /Contest and GET /Contest/{id} (ContestDTO). */
export interface Contest {
  id: number;
  title: string;
  description: string;
  status: ContestStatus;
  startAt: string; // ISO date string
  endAt: string; // ISO date string
  trainerId: number;
  problemCount: number;
  studentCount: number;
}

/** Body for POST /Contest (createContestDTO). */
export interface CreateContestInput {
  title: string;
  description?: string;
  status: ContestStatus;
  startAt: string; // ISO date string
  endAt: string; // ISO date string
  problemIds?: number[];
}

/** Body for PUT /Contest/{id} (UpdateContestDTO) — all fields optional. */
export type UpdateContestInput = Partial<CreateContestInput>;

/** Shape returned by POST /Contest. */
export interface CreateContestResult {
  message: string;
  contestID: number;
}
