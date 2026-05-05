import type { UserRole  } from "../types";

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
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: "Dashboard",
        roles: ["ADMIN", "TRAINER", "STUDENT"],
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
        title: "Reports",
        path: "/admin/reports",
        icon: "BarChart3",
        roles: ["ADMIN"],
      },

      {
        title: "My Groups",
        path: "/groups",
        icon: "Groups",
        roles: ["TRAINER", "STUDENT"],
      },
      {
        title: "Groups",
        path: "/admin/groups",
        icon: "Groups",
        roles: ["ADMIN"],
      },

      {
        title: "Contests",
        path: "/contests",
        icon: "Trophy",
        roles: ["ADMIN", "TRAINER", "STUDENT"],
      },

      {
        title: "Problem Bank",
        path: "/problems",
        icon: "BookOpen",
        roles: ["ADMIN", "TRAINER"],
      },

      {
        title: "Practice",
        path: "/student/practice",
        icon: "BookOpen",
        roles: ["STUDENT"],
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
    .map(section => ({
      ...section,
      items: section.items.filter(item => {
        if (!item.roles) return true;
        return item.roles.includes(role);
      }),
    }))
    .filter(section => section.items.length > 0);
};