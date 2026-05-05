// src/components/Sidebar.tsx
import React, { useState } from 'react';
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
  CssBaseline,
  Collapse,
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
  UserCircle,
  Send,
  Bookmark,
  FolderOpen,
  Video,
  FileText,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getVisibleNavigation } from '../../config/navigation';
import type { UserRole } from '../../types';

export const theme = createTheme({
  typography: {
    fontFamily: "Lenos, sans-serif",
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

const SubItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({ isActive }) => ({
  margin: '2px 16px 2px 48px',
  borderRadius: '8px',
  padding: '8px 12px',
  backgroundColor: isActive ? 'rgba(139, 29, 35, 0.04)' : 'transparent',
  '&:hover': {
    backgroundColor: isActive ? 'rgba(139, 29, 35, 0.08)' : '#f8fafc',
  },
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
  Send: <Send size={20} strokeWidth={2.5} />,
  Bookmark: <Bookmark size={20} strokeWidth={2.5} />,
  FolderOpen: <FolderOpen size={20} strokeWidth={2.5} />,
  Video: <Video size={20} strokeWidth={2.5} />,
  FileText: <FileText size={20} strokeWidth={2.5} />,
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
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (path: string) => {
    setOpenItems((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const isChildActive = (item: any): boolean => {
    if (!item.items) return false;
    return item.items.some((sub: any) => location.pathname === sub.path);
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
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
              Math Olympiad
            </Typography>
          </Box>
        </LogoContainer>

        <Box sx={{ flexGrow: 1, overflowY: 'auto', mt: 1 }}>
          {sections.map((section) => (
            <Box key={section.title || 'no-title'} sx={{ mb: 2 }}>
              {section.title && (
                <Typography
                  variant="caption"
                  sx={{ px: 3, py: 1, display: 'block', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.8px' }}
                >
                  {section.title}
                </Typography>
              )}
              <List disablePadding>
                {section.items.map((item) => {
                  const hasChildren = !!(item.items && item.items.length > 0);
                  const isOpen = openItems[item.path] || false;
                  const isActive = location.pathname === item.path;
                  const isParentActive = isActive || (hasChildren && isChildActive(item));

                  return (
                    <React.Fragment key={item.path}>
                      <ListItem disablePadding>
                        <StyledListItemButton
                          isActive={isParentActive}
                          onClick={() => {
                            if (hasChildren) {
                              toggleItem(item.path);
                            } else {
                              navigate(item.path);
                            }
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 40,
                              color: isParentActive ? '#8B1D23' : '#94a3b8',
                            }}
                          >
                            {iconMap[item.icon]}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography
                                sx={{
                                  fontSize: '14px',
                                  fontWeight: isParentActive ? 700 : 600,
                                  color: isParentActive ? '#8B1D23' : '#64748b',
                                }}
                              >
                                {item.title}
                              </Typography>
                            }
                          />

                        </StyledListItemButton>
                      </ListItem>

                      {hasChildren && (
                        <Collapse in={isOpen} timeout="auto" unmountOnExit>
                          <List disablePadding>
                            {item.items!.map((subItem) => {
                              const isSubActive = location.pathname === subItem.path;
                              return (
                                <ListItem key={subItem.path} disablePadding>
                                  <SubItemButton
                                    isActive={isSubActive}
                                    onClick={() => navigate(subItem.path)}
                                  >
                                    <ListItemIcon
                                      sx={{
                                        minWidth: 36,
                                        color: isSubActive ? '#8B1D23' : '#94a3b8',
                                      }}
                                    >
                                      {iconMap[subItem.icon]}
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={
                                        <Typography
                                          sx={{
                                            fontSize: '13px',
                                            fontWeight: isSubActive ? 600 : 500,
                                            color: isSubActive ? '#8B1D23' : '#64748b',
                                          }}
                                        >
                                          {subItem.title}
                                        </Typography>
                                      }
                                    />
                                  </SubItemButton>
                                </ListItem>
                              );
                            })}
                          </List>
                        </Collapse>
                      )}
                    </React.Fragment>
                  );
                })}
              </List>
            </Box>
          ))}
        </Box>

        <Divider sx={{ borderColor: '#f1f5f9' }} />

        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              borderRadius: '12px',
              bgcolor: '#f8fafc',
              border: '1px solid #f1f5f9',
            }}
          >
            <Avatar
              sx={{
                bgcolor: '#8B1D23',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                width: 40,
                height: 40,
              }}
            >
              {userName
                .split(' ')
                .map((n) => n[0])
                .join('')}
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