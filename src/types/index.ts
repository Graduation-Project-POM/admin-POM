
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
export interface Contest {
  id: number;
  name: string;
  status: 'Upcoming' | 'Ongoing' | 'Ended';
  startDate: string;
  endDate: string;
  participants: number;
  problems: number;
  duration: string;
  timeProgress?: number; 
}

export interface TContestProblem {
  id: number;
  problem: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  studentsSolved: string;
  totalSubmissions: number;
  acceptanceRate: number;
}


export interface SContestProblem {
  id: string;
  title: string;
  type: 'NT' | 'Alg';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'V.Hard';
  submissions: number;
  solvedByUser: boolean;
  userSolutionId?: string;
}


export interface Column {
  id: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

export interface SharedTableProps {
  title?: string;
  data: any[];
  columns: Column[];
  onRowSelect?: (selectedIds: string[]) => void;
  onAdd?: () => void;
  onDelete?: (selectedIds: string[]) => void;
  onEdit?: (row: any) => void;
  onSingleDelete?: (id: string) => void;
  addButtonLabel?: string;
  searchPlaceholder?: string;
}