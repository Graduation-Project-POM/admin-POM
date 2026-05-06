
export type UserRole  = 'ADMIN' | 'TRAINER' | 'STUDENT';

export interface NavItem {
  title: string;
  path: string;
  icon: string;
  roles: UserRole[];
}

export interface NavSection {
  items: NavItem[];
}

export interface GroupData {
  id: string;
  title: string;
  description: string;
  studentsCount: number;
  trainerCount: number;
  trainerName: string;
  createdDate: string;
}

export interface CourseData {
  id: string;
  title: string;
  studentsCount: number;
  progressPercent: number;
  trainerName: string;
  nextSession: string;
}

export interface CourseCardProps {
  course: CourseData;
  onViewDetails?: (id: string) => void;
}


export interface ContestData {
  id: number;
  title: string;
  description: string;
  status: 'Upcoming' | 'Ongoing' | 'Ended';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  participants: number;
  problemsCount: number;
  maxSlots?: number;
  startDate: string;
  endDate: string;
}

export interface ContestProblem {
  id: string;
  problem: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  studentsSolved: string;
  totalSubmissions: number;
  acceptanceRate: number;
}
