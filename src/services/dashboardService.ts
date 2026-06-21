import { api } from "./authService";
import { studentService, type StudentOption } from "./studentService";
import { trainerService } from "./trainerService";
import { groupService } from "./groupService";
import { contestService } from "./contestService";
import { getProblems, getMySubmissions, type Submission } from "./problemService";
import type { Group } from "./../types/group";
import type { Contest } from "./../types/contest";

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
  students: number; 
}

export interface StudentDashboardData {
  groups: Group[];
  totalProblems: number;
  problemsSolved: number; 
  gradedCount: number;
  averageGrade: number;
  submissions: Submission[];
}

export interface StudentContestAlert {
  contestId: number;
  title: string;
  endAt: string; 
  totalProblems: number;
  unsolvedCount: number;
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
    const [groups, contests, problems] = await Promise.all([
      groupService.getAll().catch(() => [] as Group[]),
      contestService.getAll().catch(() => []),
      getProblems().catch(() => []),
    ]);
    return {
      groups,
      contests,
      totalProblems: problems.length,
      myProblems: problems.filter((p) => p.canModify).length,
      students: groups.reduce<number>((sum, g) => sum + (g.studentCount ?? 0), 0),
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

  getStudentContestAlerts: async (): Promise<StudentContestAlert[]> => {
    const groups = await groupService.getMyGroups().catch(() => []);
    const contestLists = await Promise.all(
      groups.map((g) => groupService.getContests(g.id).catch(() => [])),
    );

    const byId = new Map<
      number,
      { contestId: number; title: string; startAt: string; endAt: string }
    >();
    for (const c of contestLists.flat()) byId.set(c.contestId, c);

    const now = Date.now();
    const running = [...byId.values()].filter((c) => {
      const start = new Date(c.startAt).getTime();
      const end = new Date(c.endAt).getTime();
      return (
        !Number.isNaN(start) &&
        !Number.isNaN(end) &&
        now >= start &&
        now < end
      );
    });

    const alerts = await Promise.all(
      running.map(async (c) => {
        const problems = await contestService
          .getMyProblems(c.contestId)
          .catch(() => [] as Record<string, any>[]);
        const unsolvedCount = problems.filter((p) => !p.submitted).length;
        return {
          contestId: c.contestId,
          title: c.title,
          endAt: c.endAt,
          totalProblems: problems.length,
          unsolvedCount,
        };
      }),
    );

    return alerts.filter((a) => a.unsolvedCount > 0);
  },
};
