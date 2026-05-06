import React from 'react';
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
  Menu,
  type LucideIcon
} from 'lucide-react';

import { useLocation, useNavigate } from 'react-router-dom';
import { getVisibleNavigation } from '../../../config/navigation';
import type { UserRole } from '../../../types';

import {
  SidebarContainer,
  LogoContainer,
  ScrollContainer,
  StyledListItemButton
} from './SidebarStyle';

interface SidebarProps {
  role: UserRole;
  userName: string;
  userEmail: string;
}

const createIcon = (Icon: LucideIcon) => (
  <Icon size={20} strokeWidth={2.5} />
);

const iconMap: Record<string, React.ReactNode> = {
  Dashboard: createIcon(LayoutDashboard),
  Users: createIcon(Users),
  CheckCircle: createIcon(CheckCircle),
  Megaphone: createIcon(Megaphone),
  Groups: createIcon(Users2),
  Trophy: createIcon(Trophy),
  BookOpen: createIcon(BookOpen),
  BarChart3: createIcon(BarChart3),
  Settings: createIcon(Settings),
  UserCircle: createIcon(UserCircle),
};

export const Sidebar: React.FC<SidebarProps> = ({ role, userName, userEmail }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const sections = getVisibleNavigation(role);

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div>
      <IconButton
        onClick={handleDrawerToggle}
        sx={{ display: { md: 'none' } }}
      >
        <Menu />
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
            style={{ maxWidth: '100%', height: 'auto', width: '128px' }}
          />
        </LogoContainer>

        <Divider sx={{ borderColor: '#e6e7e7' }} />

        <ScrollContainer>
          {sections.map((section) => (
            <Box key={section.title} sx={{ mb: 1 }}>
              <List disablePadding>
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path;

                  return (
                    <ListItem key={item.path} disablePadding>
                      <StyledListItemButton
                        isActive={isActive}
                        onClick={() => {
                          navigate(item.path);
                          if (isMobile) setMobileOpen(false);
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 40,
                            color: isActive ? '#8B1D23' : '#94a3b8',
                          }}
                        >
                          {iconMap[item.icon]}
                        </ListItemIcon>

                        <ListItemText
                          primary={
                            <Typography
                              sx={{
                                fontSize: '14px',
                                fontWeight: isActive ? 700 : 600,
                                color: isActive ? '#8B1D23' : '#64748b',
                              }}
                            >
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
        </ScrollContainer>

        <Divider sx={{ borderColor: '#e6e7e7' }} />

        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 1.5,
              borderRadius: '12px',
              bgcolor: '#f8fafc',
              border: '1px solid #f1f5f9',
            }}
          >
            <Avatar
              sx={{
                bgcolor: '#f1f5f9',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserCircle size={22} strokeWidth={2} color="#64748b" />
            </Avatar>

            <Box sx={{ minWidth: 0, flexGrow: 0.5 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: '#0f172a' }}
                noWrap
              >
                {userName}
              </Typography>

              <Typography
                variant="caption"
                sx={{ color: '#94a3b8' }}
                noWrap
              >
                {userEmail}
              </Typography>
            </Box>
          </Box>
        </Box>
      </SidebarContainer>
    </div>
  );
};