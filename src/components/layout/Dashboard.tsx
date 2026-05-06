import React from 'react';
import { Box, Container, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Sidebar } from './Sidebar/Sidebar';
import type { UserRole } from '../../types';

const theme = createTheme({
  palette: {
    background: {
      default: '#f8fafc',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
  userName: string;
  userEmail: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  role,
  userName,
  userEmail
}) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
            {children}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
