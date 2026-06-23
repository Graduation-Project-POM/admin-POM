
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

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface CreateProblemInput {
  title: string;
  statement: string;
  constraints?: string | null;
  examples?: ProblemExample[] | null;
  difficulty: Difficulty;
  topic: string;
  solution?: string;
  photoFileKey?: string | null;
  trainerID?: number;
  isPublished?: boolean;
  points: number;               
  isBankVisible?: boolean;      
  // false ⇒ contest problem (kept out of the Problem Bank). Defaults to bank on the server.
  isBankProblem?: boolean;
}

export interface ProblemDetail {
  id: number;
  title: string;
  statement: string | null;
  constraints?: string | null;
  examples?: ProblemExample[] | null;
  difficulty: Difficulty;
  topic: string;
  photoUrl: string | null;
  isPublished: boolean;
  points: number;                
  solvedCount: number;         
}

export interface UpdateProblemInput {
  title: string;
  statement: string;
  constraints?: string | null;
  examples?: ProblemExample[] | null;
  difficulty: Difficulty;
  topic: string;
  photoFileKey?: string | null;
  isPublished: boolean;
  points: number;               
}
