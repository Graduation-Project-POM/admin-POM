import React from 'react';
import { Box, Container } from '@mui/material';
import { Sidebar } from './Sidebar/Sidebar';
import { ErrorBoundary } from '../common/ErrorBoundary';
import type { UserRole } from '../../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
  userName: string;
  userEmail?: string;
}

// Theme/direction handling lives in <DirectionProvider> at the app root, so this
// layout only arranges the sidebar + content.
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  role,
  userName,
  userEmail = ""
}) => {
  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      <Sidebar role={role} userName={userName} userEmail={userEmail} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          p: 4,
        }}
      >
        <Container maxWidth="lg">
          <ErrorBoundary>{children}</ErrorBoundary>
        </Container>
      </Box>
    </Box>
  );
};
