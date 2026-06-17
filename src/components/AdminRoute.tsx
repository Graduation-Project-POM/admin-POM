import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import type { UserRole } from '../types';
interface AdminRouteProps {
  role: UserRole;
  children: ReactNode;
}

export const AdminRoute = ({ role, children }: AdminRouteProps) => {
  return role === 'ADMIN' ? <>{children}</> : <Navigate to="/" replace />;
};