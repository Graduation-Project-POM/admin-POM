
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
