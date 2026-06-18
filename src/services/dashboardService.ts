import { api } from "./authService";
import { studentService, type StudentOption } from "./studentService";
import { trainerService } from "./trainerService";
import { groupService } from "./groupService";
import { contestService } from "./contestService";
import { getProblems, getMySubmissions, type Submission } from "./problemService";
import type { Group } from "./../types/group";
import type { Contest } from "./../types/contest";

/** Live admin metrics, all derived from real backend list endpoints. */
export interface AdminDashboardData {
  totalUsers: number;
  totalStudents: number;
  totalTrainers: number;
  groups: number;
  contests: number;
  problems: number;
  pendingStudents: (StudentOption & { isAccepted: boolean })[];
}

export interface TrainerDashboardData {
  groups: Group[];
  contests: Contest[];
  totalProblems: number;
  myProblems: number;
  students: number; // total students across the trainer's own groups
}

export interface StudentDashboardData {
  groups: Group[];
  totalProblems: number;
  problemsSolved: number; // problems the student has submitted a solution to
  gradedCount: number;
  averageGrade: number;
  submissions: Submission[];
}

export const dashboardService = {
  getAdminData: async (): Promise<AdminDashboardData> => {
    const [users, students, trainers, groups, contests, problems] = await Promise.all([
      api.get<unknown[]>("/User").then((r) => r.data).catch(() => []),
      studentService.getAllDetailed().catch(() => []),
      trainerService.getAll().catch(() => []),
      groupService.getAll().catch(() => []),
      contestService.getAll().catch(() => []),
      getProblems().catch(() => []),
    ]);
    return {
      totalUsers: users.length,
      totalStudents: students.length,
      totalTrainers: trainers.length,
      groups: groups.length,
      contests: contests.length,
      problems: problems.length,
      pendingStudents: students.filter((s) => !s.isAccepted),
    };
  },

  getTrainerData: async (): Promise<TrainerDashboardData> => {
    // The backend already scopes these to the trainer (own groups/contests,
    // published + own problems).
    const [groups, contests, problems] = await Promise.all([
      groupService.getAll().catch(() => []),
      contestService.getAll().catch(() => []),
      getProblems().catch(() => []),
    ]);
    return {
      groups,
      contests,
      totalProblems: problems.length,
      myProblems: problems.filter((p) => p.canModify).length,
      students: groups.reduce((sum, g) => sum + (g.studentCount ?? 0), 0),
    };
  },

  getStudentData: async (): Promise<StudentDashboardData> => {
    const [groups, problems, submissions] = await Promise.all([
      groupService.getMyGroups().catch(() => []),
      getProblems().catch(() => []),
      getMySubmissions().catch(() => []),
    ]);
    const graded = submissions.filter((s) => s.grade != null);
    const averageGrade = graded.length
      ? Math.round(graded.reduce((a, s) => a + (s.grade ?? 0), 0) / graded.length)
      : 0;
    return {
      groups,
      totalProblems: problems.length,
      problemsSolved: submissions.length,
      gradedCount: graded.length,
      averageGrade,
      submissions,
    };
  },
};
