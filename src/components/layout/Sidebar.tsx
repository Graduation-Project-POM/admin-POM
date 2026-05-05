import React from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Avatar, 
  Divider, 
  styled,
  createTheme,
  ThemeProvider,
  CssBaseline
} from '@mui/material';
import { 
  LayoutDashboard, 
  Users, 
  CheckCircle, 
  Megaphone, 
  Users2, 
  Trophy, 
  BookOpen, 
  BarChart3, 
  Settings, 
  UserCircle 
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getVisibleNavigation  } from '../../config/navigation';
import type { UserRole } from '../../types';

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const DRAWER_WIDTH = 280;

const SidebarContainer = styled(Drawer)({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box',
    borderRight: '1px solid #f1f5f9',
    backgroundColor: '#ffffff',
  },
});

const LogoContainer = styled(Box)({
  padding: '24px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const LogoIcon = styled(Box)({
  width: 50,
  height: 50,
  backgroundColor: '#8B1D23',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ffffff',
  fontWeight: 'bold',
  fontSize: '1rem',
  boxShadow: '0 4px 12px rgba(139, 29, 35, 0.2)',
});

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({ isActive }) => ({
  margin: '2px 16px',
  borderRadius: '8px',
  padding: '10px 12px',
  position: 'relative',
  backgroundColor: isActive ? 'rgba(139, 29, 35, 0.04)' : 'transparent',
  '&:hover': {
    backgroundColor: isActive ? 'rgba(139, 29, 35, 0.08)' : '#f8fafc',
  },
  ...(isActive && {
    '&::before': {
      content: '""',
      position: 'absolute',
      left: '-16px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '4px',
      height: '24px',
      backgroundColor: '#8B1D23',
      borderRadius: '0 4px 4px 0',
      boxShadow: '0 0 8px rgba(139, 29, 35, 0.3)',
    },
  }),
}));

const iconMap: Record<string, React.ReactNode> = {
  Dashboard: <LayoutDashboard size={20} strokeWidth={2.5} />,
  Users: <Users size={20} strokeWidth={2.5} />,
  CheckCircle: <CheckCircle size={20} strokeWidth={2.5} />,
  Megaphone: <Megaphone size={20} strokeWidth={2.5} />,
  Groups: <Users2 size={20} strokeWidth={2.5} />,
  Trophy: <Trophy size={20} strokeWidth={2.5} />,
  BookOpen: <BookOpen size={20} strokeWidth={2.5} />,
  BarChart3: <BarChart3 size={20} strokeWidth={2.5} />,
  Settings: <Settings size={20} strokeWidth={2.5} />,
  UserCircle: <UserCircle size={20} strokeWidth={2.5} />,
};

interface SidebarProps {
  role: UserRole;
  userName: string;
  userEmail: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, userName, userEmail }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const sections = getVisibleNavigation(role);

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return 'Super Admin';
      case 'TRAINER': return 'Trainer';
      case 'STUDENT': return 'Student';
      default: return role;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SidebarContainer variant="permanent">
        <LogoContainer>
          <LogoIcon>PMO</LogoIcon>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', lineHeight: 1.2 }}>
              PMO Platform
            </Typography>
            {/* <Typography variant="caption" sx={{ color: '#94a3b8',textAlign: 'left', fontWeight: 600 }}>
              {getRoleLabel(role)}
            </Typography> */}
          </Box>
        </LogoContainer>

        <Box sx={{ flexGrow: 1, overflowY: 'auto', mt: 1 }}>
          {sections.map((section) => (
            <Box key={section.title} sx={{ mb: 1 }}>
              <List disablePadding>
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <ListItem key={item.path} disablePadding>
                      <StyledListItemButton 
                        isActive={isActive}
                        onClick={() => navigate(item.path)}
                      >
                        <ListItemIcon sx={{ 
                          minWidth: 40, 
                          color: isActive ? '#8B1D23' : '#94a3b8' 
                        }}>
                          {iconMap[item.icon]}
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Typography sx={{ 
                              fontSize: '14px', 
                              fontWeight: isActive ? 700 : 600,
                              color: isActive ? '#8B1D23' : '#64748b'
                            }}>
                              {item.title}
                            </Typography>
                          }
                        />
                      </StyledListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          ))}
        </Box>

        <Divider sx={{ borderColor: '#f1f5f9' }} />
        
        <Box sx={{ p: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5, 
            p: 1.5, 
            borderRadius: '12px',
            bgcolor: '#f8fafc',
            border: '1px solid #f1f5f9'
          }}>
            <Avatar sx={{ 
              bgcolor: '#8B1D23', 
              fontSize: '0.875rem', 
              fontWeight: 'bold',
              width: 40,
              height: 40
            }}>
              {userName.split(' ').map(n => n[0]).join('')}
            </Avatar>
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }} noWrap>
                {userName}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }} noWrap>
                {userEmail}
              </Typography>
            </Box>
          </Box>
        </Box>
      </SidebarContainer>
    </ThemeProvider>
  );
};
