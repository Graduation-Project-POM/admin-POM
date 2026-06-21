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

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  role,
  userName,
  userEmail = ""
}) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar role={role} userName={userName} userEmail={userEmail} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          height: '100vh',
          overflow: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          pb: { xs: 3, md: 4 },
          // Clear the fixed hamburger button on mobile so the page title isn't
          // hidden beneath it; normal top padding on desktop.
          pt: { xs: 8, md: 4 },
        }}
      >
        <Container maxWidth="lg" disableGutters>
          <ErrorBoundary>{children}</ErrorBoundary>
        </Container>
      </Box>
    </Box>
  );
};
