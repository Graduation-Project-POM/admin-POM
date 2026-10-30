import React from 'react';
import { Box, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Sidebar } from './Sidebar/Sidebar';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { brand, neutral, radius } from '../../theme';
import type { UserRole } from '../../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
  userName: string;
  userEmail?: string;
}

const MAIN_ID = 'main-content';

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  role,
  userName,
  userEmail = ""
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/*
        Keyboard users previously had to tab through the whole sidebar on every
        route. This link is off-screen until focused, then jumps to the content.
      */}
      <Box
        component="a"
        href={`#${MAIN_ID}`}
        sx={{
          position: 'fixed',
          insetInlineStart: 16,
          top: -80,
          zIndex: 2000,
          px: 2,
          py: 1.25,
          borderRadius: `${radius.sm}px`,
          bgcolor: brand[500],
          color: neutral[0],
          fontSize: 14,
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'top .15s ease',
          '&:focus': { top: 16 },
        }}
      >
        {t('ui.common.skipToContent')}
      </Box>

      <Sidebar role={role} userName={userName} userEmail={userEmail} />
      <Box
        component="main"
        id={MAIN_ID}
        tabIndex={-1}
        sx={{
          flexGrow: 1,
          minWidth: 0,
          height: '100vh',
          overflow: 'auto',
          outline: 'none',
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
