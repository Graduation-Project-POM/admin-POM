
export type UserRole = 'Admin' | 'Trainer' | 'Student';

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
  trainerEmail?: string;
  trainerSpecialization?: string;
  // Id of the group's assigned trainer (Trainer.Id); 0/undefined when none.
  trainerId?: number;
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

export interface TableRowBase {
  id: string | number;
}

export interface Column<TRow extends TableRowBase = TableRowBase> {
  id: string;
  label: string;
  render?: (row: TRow) => React.ReactNode;
}

export interface SharedTableProps<TRow extends TableRowBase = TableRowBase> {
  title?: string;
  data: TRow[];
  columns: Column<TRow>[];
  onRowSelect?: (selectedIds: string[]) => void;
  onAdd?: () => void;
  onDelete?: (selectedIds: string[]) => void;
  onEdit?: (row: TRow) => void;
  onSingleDelete?: (id: string) => void;
  addButtonLabel?: string;
  searchPlaceholder?: string;
  canEditRow?: (row: TRow) => boolean;
  canDeleteRow?: (row: TRow) => boolean;
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
