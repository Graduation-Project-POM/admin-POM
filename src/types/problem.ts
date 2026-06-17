// Types for the backend Problems API (route: /api/Problems).
// Difficulty serializes as a NUMBER: Easy=1, Medium=2, Hard=3.

export const Difficulty = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
} as const;

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

export const DIFFICULTY_LABEL: Record<number, string> = {
  1: "Easy",
  2: "Medium",
  3: "Hard",
};

export const DIFFICULTY_FROM_LABEL: Record<string, Difficulty> = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
};

/** Body for POST /api/Problems (CreateProblemDto). */
export interface CreateProblemInput {
  title: string;
  statement: string;
  difficulty: Difficulty;
  topic: string;
  solution?: string;
  photoFileKey?: string | null;
  trainerID?: number;
  isPublished?: boolean;
}

/** Body for PUT /api/Problems/{id} (UpdateProblemDto). */
export interface UpdateProblemInput {
  title: string;
  statement: string;
  difficulty: Difficulty;
  topic: string;
  photoFileKey?: string;
  isPublished: boolean;
}
