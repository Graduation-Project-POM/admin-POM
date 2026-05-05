import type { UserRole } from "../types";

export interface NavItem {
  title: string;
  path: string;
  icon: string;
  roles?: UserRole[];
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export const navigationConfig: NavSection[] = [
  {
    items: [
      // ================= ADMIN =================
      {
        title: "Dashboard",
        path: "/admin/dashboard",
        icon: "Dashboard",
        roles: ["ADMIN"],
      },
      {
        title: "Users",
        path: "/admin/users",
        icon: "Users",
        roles: ["ADMIN"],
      },
      {
        title: "Approvals",
        path: "/admin/approvals",
        icon: "CheckCircle",
        roles: ["ADMIN"],
      },
      {
        title: "Announcements",
        path: "/admin/announcements",
        icon: "Megaphone",
        roles: ["ADMIN"],
      },
      {
        title: "Groups",
        path: "/admin/groups",
        icon: "Groups",
        roles: ["ADMIN"],
      },
      {
        title: "Contests",
        path: "/admin/contests",
        icon: "Trophy",
        roles: ["ADMIN"],
      },
      {
        title: "Problem Bank",
        path: "/admin/problems",
        icon: "BookOpen",
        roles: ["ADMIN"],
      },
      {
        title: "Reports",
        path: "/admin/reports",
        icon: "BarChart3",
        roles: ["ADMIN"],
      },

      // ================= TRAINER =================
      {
        title: "Dashboard",
        path: "/trainer/dashboard",
        icon: "Dashboard",
        roles: ["TRAINER"],
      },
      {
        title: "My Groups",
        path: "/trainer/groups",
        icon: "Groups",
        roles: ["TRAINER"],
      },
      {
        title: "Contests",
        path: "/trainer/contests",
        icon: "Trophy",
        roles: ["TRAINER"],
      },
      {
        title: "Problem Bank",
        path: "/trainer/problems",
        icon: "BookOpen",
        roles: ["TRAINER"],
      },

      // ================= STUDENT =================
      {
        title: "Dashboard",
        path: "/student/dashboard",
        icon: "Dashboard",
        roles: ["STUDENT"],
      },
      {
        title: "My Groups",
        path: "/student/groups",
        icon: "Groups",
        roles: ["STUDENT"],
      },
      {
        title: "Contests",
        path: "/student/contests",
        icon: "Trophy",
        roles: ["STUDENT"],
      },
      {
        title: "Problems",
        path: "/student/problems",
        icon: "BookOpen",
        roles: ["STUDENT"],
        items: [
          { title: "All Problems", path: "/student/problems", icon: "FileText" },
          { title: "My Submissions", path: "/student/problems/submissions", icon: "CheckCircle" },
        ],
      },
    ],
  },

  {
    items: [
      {
        title: "Settings",
        path: "/settings",
        icon: "Settings",
      },
      {
        title: "Profile",
        path: "/profile",
        icon: "UserCircle",
      },
    ],
  },
];
export const getVisibleNavigation = (role: UserRole) => {
  return navigationConfig
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (item.roles && !item.roles.includes(role)) return false;
        if (item.items) {
          item.items = item.items.filter((subItem) => {
            if (!subItem.roles) return true;
            return subItem.roles.includes(role);
          });
          if (item.items.length === 0) return false;
        }
        return true;
      }),
    }))
    .filter((section) => section.items.length > 0);
};