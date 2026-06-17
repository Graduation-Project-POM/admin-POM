import type { UserRole } from "../types";

export interface NavItem {
  title: string;
  /** i18n key (e.g. "navbar.dashboard") resolved with t() in the Sidebar. */
  titleKey?: string;
  path: string;
  icon: string;
  roles?: UserRole[];
  items?: NavItem[];
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
        titleKey: "navbar.dashboard",
        path: "/admin/dashboard",
        icon: "Dashboard",
        roles: ["Admin"],
      },
      {
        title: "Users",
        titleKey: "navbar.users",
        path: "/admin/users",
        icon: "Users",
        roles: ["Admin"],
      },
      {
        title: "Approvals",
        titleKey: "navbar.approvals",
        path: "/admin/approvals",
        icon: "CheckCircle",
        roles: ["Admin"],
      },
      // {
      //   title: "Announcements",
      //   path: "/admin/announcements",
      //   icon: "Megaphone",
      //   roles: ["Admin"],
      // },
      {
        title: "Groups",
        titleKey: "navbar.groups",
        path: "/admin/groups",
        icon: "Groups",
        roles: ["Admin"],
      },
      {
        title: "Contests",
        titleKey: "navbar.contests",
        path: "/admin/contests",
        icon: "Trophy",
        roles: ["Admin"],
      },
      {
        title: "Problem Bank",
        titleKey: "navbar.problems",
        path: "/admin/problems",
        icon: "BookOpen",
        roles: ["Admin"],
      },
      // {
      //   title: "Reports",
      //   path: "/admin/reports",
      //   icon: "BarChart3",
      //   roles: ["Admin"],
      // },
      {
        title: "Profile",
        titleKey: "navbar.profile",
        path: "/admin/profile",
        icon: "UserCircle",
        roles: ["Admin"],
      },

      // ================= TRAINER =================
      {
        title: "Dashboard",
        titleKey: "navbar.dashboard",
        path: "/trainer/dashboard",
        icon: "Dashboard",
        roles: ["Trainer"],
      },
      {
        title: "My Groups",
        titleKey: "navbar.myGroups",
        path: "/trainer/groups",
        icon: "Groups",
        roles: ["Trainer"],
      },
      {
        title: "Contests",
        titleKey: "navbar.contests",
        path: "/trainer/contests",
        icon: "Trophy",
        roles: ["Trainer"],
      },
      {
        title: "Problem Bank",
        titleKey: "navbar.problems",
        path: "/trainer/problems",
        icon: "BookOpen",
        roles: ["Trainer"],
      },
      {
        title: "Profile",
        titleKey: "navbar.profile",
        path: "/trainer/profile",
        icon: "UserCircle",
        roles: ["Trainer"],
      },

      // ================= STUDENT =================
      {
        title: "Dashboard",
        titleKey: "navbar.dashboard",
        path: "/student/dashboard",
        icon: "Dashboard",
        roles: ["Student"],
      },
      {
        title: "My Groups",
        titleKey: "navbar.myGroups",
        path: "/student/groups",
        icon: "Groups",
        roles: ["Student"],
      },
      {
        title: "Problems",
        titleKey: "navbar.problemsShort",
        path: "/student/problems",
        icon: "BookOpen",
        roles: ["Student"],
        items: [
          { title: "All Problems", titleKey: "navbar.allProblems", path: "/student/problems", icon: "FileText" },
          { title: "My Submissions", titleKey: "navbar.mySubmissions", path: "/student/problems/submissions", icon: "CheckCircle" },
        ],
      },
      {
        title: "Profile",
        titleKey: "navbar.profile",
        path: "/student/profile",
        icon: "UserCircle",
        roles: ["Student"],
      },
      {
        title: "Logout",
        titleKey: "navbar.logout",
        path: "/logout",
        icon: "LogOut",
        roles: ["Admin", "Trainer", "Student"],
      }
    ],
  },

  // {
  //   items: [
  //     {
  //       title: "Settings",
  //       path: "/settings",
  //       icon: "Settings",
  //     }
  //   ],
  // },
];

export const getVisibleNavigation = (role: UserRole) => {
  return navigationConfig
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (item.roles && !item.roles.includes(role)) return false;
        if (item.items) {
          const filteredChildren = item.items.filter((subItem) => {
            if (subItem.roles && !subItem.roles.includes(role)) return false;
            return true;
          });
          if (filteredChildren.length === 0) return false;
          item.items = filteredChildren;
        }
        return true;
      }),
    }))
    .filter((section) => section.items.length > 0);
};