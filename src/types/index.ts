
export type UserRole = 'ADMIN' | 'TRAINER' | 'STUDENT';

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
  status: string;
  progress: number;
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
  id: string;
  title: string;
  status: string;
  difficulty: string;
  participants: number;
  problemsCount: number;
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


export interface StatCardData {
  title: string;
  value: number;
  trend?: {
    value: number;
    label: string;
    direction: "up" | "down";
  };
  subtitle?: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

export interface PendingTrainer {
  id: number;
  name: string;
  title: string;
  university: string;
}

export interface Announcement {
  id: number;
  title: string;
  date: string;
  status: "Published" | "Draft";
}

export interface StudentStats {
  name: string,
  avatar: string,
  totalProblemsSolved: number,
  totalProblems: number,
  completedContests: number,
  totalContests: number,
  averageGrade: number,
  globalRank: number,
  totalStudents: number,
  currentStreak: number,
  longestStreak: number,
}


export interface RecentActivity {
  id: string;
  title: string;
  group: string;
  time: string;
  icon: React.ReactNode;
  bgColor: string;
}

export interface UpcomingContest {
  id: string;
  title: string;
  group: string;
  startDate: string;
  problemsCount: number;
  difficulty: string;
  daysLeft: number;
}

export interface TopGroup {
  id: string;
  name: string;
  progress: number;
  rank: number;
  students: number;
}
