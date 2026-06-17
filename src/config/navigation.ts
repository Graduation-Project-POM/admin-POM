import type { UserRole } from "../types";

export interface NavItem {
  title: string;
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
        path: "/admin/dashboard",
        icon: "Dashboard",
        roles: ["Admin"],
      },
      {
        title: "Users",
        path: "/admin/users",
        icon: "Users",
        roles: ["Admin"],
      },
      {
        title: "Approvals",
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
        path: "/admin/groups",
        icon: "Groups",
        roles: ["Admin"],
      },
      {
        title: "Contests",
        path: "/admin/contests",
        icon: "Trophy",
        roles: ["Admin"],
      },
      {
        title: "Problem Bank",
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
        path: "/admin/profile",
        icon: "UserCircle",
        roles: ["Admin"],
      },

      // ================= TRAINER =================
      {
        title: "Dashboard",
        path: "/trainer/dashboard",
        icon: "Dashboard",
        roles: ["Trainer"],
      },
      {
        title: "My Groups",
        path: "/trainer/groups",
        icon: "Groups",
        roles: ["Trainer"],
      },
      {
        title: "Contests",
        path: "/trainer/contests",
        icon: "Trophy",
        roles: ["Trainer"],
      },
      {
        title: "Problem Bank",
        path: "/trainer/problems",
        icon: "BookOpen",
        roles: ["Trainer"],
      },
      {
        title: "Profile",
        path: "/trainer/profile",
        icon: "UserCircle",
        roles: ["Trainer"],
      },

      // ================= STUDENT =================
      {
        title: "Dashboard",
        path: "/student/dashboard",
        icon: "Dashboard",
        roles: ["Student"],
      },
      {
        title: "My Groups",
        path: "/student/groups",
        icon: "Groups",
        roles: ["Student"],
      },
      {
        title: "Problems",
        path: "/student/problems",
        icon: "BookOpen",
        roles: ["Student"],
        items: [
          { title: "All Problems", path: "/student/problems", icon: "FileText" },
          { title: "My Submissions", path: "/student/problems/submissions", icon: "CheckCircle" },
        ],
      },
      {
        title: "Profile",
        path: "/student/profile",
        icon: "UserCircle",
        roles: ["Student"],
      },
      {
        title: "Logout",
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