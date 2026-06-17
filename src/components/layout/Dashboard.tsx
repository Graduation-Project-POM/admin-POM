import React from 'react';
import { Box, Container, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { useTranslation } from 'react-i18next';
import { Sidebar } from './Sidebar/Sidebar';
import { ErrorBoundary } from '../common/ErrorBoundary';
import type { UserRole } from '../../types';

const createAppTheme = (direction: 'ltr' | 'rtl') =>
  createTheme({
    direction,
    palette: {
      background: {
        default: '#f8fafc',
      },
    },
    typography: {
      fontFamily: '"Lenos", sans-serif',
    },
  });

export const theme = createAppTheme('ltr');

// Two emotion caches. The RTL cache runs styles through stylis-plugin-rtl so
// that all MUI/styled CSS (margins, paddings, borders, the active-tab
// indicator, and the Drawer anchor) mirrors automatically for Arabic.
const ltrCache = createCache({ key: 'mui', stylisPlugins: [prefixer] });
const rtlCache = createCache({
  key: 'mui-rtl',
  stylisPlugins: [prefixer, rtlPlugin],
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
  const { i18n } = useTranslation();
  const isRtl = i18n.resolvedLanguage === 'ar';
  const direction = isRtl ? 'rtl' : 'ltr';

  // Recreate the theme/cache only when the language direction changes.
  const appTheme = React.useMemo(() => createAppTheme(direction), [direction]);
  const cache = isRtl ? rtlCache : ltrCache;

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={appTheme}>
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
              <ErrorBoundary>{children}</ErrorBoundary>
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
};
