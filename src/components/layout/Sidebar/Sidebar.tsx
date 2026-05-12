import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
  Collapse,
} from '@mui/material';

import {
  LayoutDashboard,
  Users,
  CheckCircle,
  Users2,
  Trophy,
  BookOpen,
  Settings,
  UserCircle,
  Menu as MenuIcon,
  FileText,
  ChevronDown,
  ChevronRight,
  Languages,
  LogOut,
  type LucideIcon,
} from 'lucide-react';

import { useLocation, useNavigate } from 'react-router-dom';
import { getVisibleNavigation } from '../../../config/navigation';
import type { UserRole } from '../../../types';

import {
  SidebarContainer,
  LogoContainer,
  ScrollContainer,
  StyledListItemButton,
} from './SidebarStyle';

interface SidebarProps {
  role: UserRole;
  userName: string;
  userEmail: string;
  onLogout?: () => void;
}

const createIcon = (Icon: LucideIcon) => (
  <Icon size={20} strokeWidth={2.2} />
);

const iconMap: Record<string, React.ReactNode> = {
  Dashboard: createIcon(LayoutDashboard),
  Users: createIcon(Users),
  CheckCircle: createIcon(CheckCircle),
  Groups: createIcon(Users2),
  Trophy: createIcon(Trophy),
  BookOpen: createIcon(BookOpen),
  Settings: createIcon(Settings),
  UserCircle: createIcon(UserCircle),
  FileText: createIcon(FileText),
  LogOut: createIcon(LogOut),
  Languages: createIcon(Languages),
};

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  userName,
  userEmail,
  onLogout,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const originalSections = getVisibleNavigation(role);

  const sections = React.useMemo(() => {
    return originalSections.map((section) => {
      const logoutIndex = section.items.findIndex((item) => item.title === 'Logout');
      if (logoutIndex !== -1) {
        const languageItem = {
          title: 'Language',
          path: '#',
          icon: 'Languages',
        };
        const newItems = [...section.items];
        newItems.splice(logoutIndex, 0, languageItem);
        return { ...section, items: newItems };
      }
      return section;
    });
  }, [originalSections]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openItem, setOpenItem] = useState<string | null>(null);

  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleItem = (path: string) => {
    setOpenItem(openItem === path ? null : path);
  };

  const isChildActive = (item: any) => {
    if (!item.items) return false;
    return item.items.some(
      (subItem: any) => location.pathname === subItem.path
    );
  };

  const handleLanguageToggle = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    if (isMobile) setMobileOpen(false);
  };

  return (
    <Box>
      <IconButton
        onClick={handleDrawerToggle}
        sx={{ display: { md: 'none' }, position: 'fixed', top: 16, left: 16, zIndex: 1200 }}
      >
        <MenuIcon />
      </IconButton>

      <SidebarContainer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        <LogoContainer>
          <img
            src="/logoPOM.png"
            alt="PMO Logo"
            style={{
              maxWidth: '100%',
              height: 'auto',
              width: '128px',
            }}
          />
        </LogoContainer>

        <Divider sx={{ borderColor: '#eceff3' }} />

        <ScrollContainer>
          {sections.map((section, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <List disablePadding>
                {section.items.map((item: any) => {
                  const hasChildren = item.items && item.items.length > 0;
                  const isOpen = openItem === item.path;
                  const isActive = location.pathname === item.path;
                  const isParentActive = isActive || isChildActive(item);
                  
                  const isLogoutItem = item.title === 'Logout';
                  const isLanguageItem = item.title === 'Language';
                  
                  return (
                    <React.Fragment key={item.title + item.path}>
                      <ListItem disablePadding>
                        <StyledListItemButton
                          isActive={isParentActive}
                          onClick={() => {
                            if (isLogoutItem) {
                              handleLogout();
                              return;
                            }
                            if (isLanguageItem) {
                              handleLanguageToggle();
                              return;
                            }
                            if (hasChildren) {
                              toggleItem(item.path);
                            } else {
                              setOpenItem(null);
                              navigate(item.path);
                              if (isMobile) setMobileOpen(false);
                            }
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40, color: isParentActive ? '#8B1D23' : '#94a3b8' }}>
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
                                {isLanguageItem
                                  ? (language === 'ar' ? 'العربية' : 'English')
                                  : item.title}
                              </Typography>
                            }
                          />
                          {hasChildren && !isLogoutItem && !isLanguageItem &&
                            (isOpen ? (
                              <ChevronDown size={16} color="#94a3b8" />
                            ) : (
                              <ChevronRight size={16} color="#94a3b8" />
                            ))}
                        </StyledListItemButton>
                      </ListItem>

                      {hasChildren && (
                        <Collapse in={isOpen} timeout="auto" unmountOnExit>
                          <List disablePadding>
                            {item.items.map((subItem: any) => {
                              const isSubActive = location.pathname === subItem.path;
                              return (
                                <ListItem key={subItem.path} disablePadding>
                                  <StyledListItemButton
                                    isActive={isSubActive}
                                    onClick={() => {
                                      navigate(subItem.path);
                                      if (isMobile) setMobileOpen(false);
                                    }}
                                    sx={{ ml: 4, py: 0.7, minHeight: 40 }}
                                  >
                                    <ListItemIcon
                                      sx={{
                                        minWidth: 34,
                                        color: isSubActive ? '#8B1D23' : '#94a3b8',
                                      }}
                                    >
                                      {iconMap[subItem.icon]}
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={
                                        <Typography
                                          sx={{
                                            fontSize: '12px',
                                            fontWeight: isSubActive ? 800 : 600,
                                            color: isSubActive ? '#8B1D23' : '#64748b',
                                          }}
                                        >
                                          {subItem.title}
                                        </Typography>
                                      }
                                    />
                                  </StyledListItemButton>
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
        </ScrollContainer>

        <Divider sx={{ borderColor: '#eceff3' }} />

        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              borderRadius: '16px',
              bgcolor: '#fafafa',
              border: '1px solid #f1f5f9',
            }}
          >
            <Avatar sx={{ bgcolor: '#fff', color: '#fff', width: 42, height: 42 }}>
              <UserCircle size={35} strokeWidth={2} color="#8B1D23" />
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                noWrap
                sx={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}
              >
                {userName}
              </Typography>
              <Typography noWrap sx={{ fontSize: '12px', color: '#94a3b8' }}>
                {userEmail}
              </Typography>
            </Box>
          </Box>
        </Box>
      </SidebarContainer>
    </Box>
  );
};