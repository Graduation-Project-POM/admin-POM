import React, { useState, useEffect } from "react";
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
} from "@mui/material";

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
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { getVisibleNavigation } from "../../../config/navigation";
import type { UserRole } from "../../../types";

import {
  SidebarContainer,
  LogoContainer,
  ScrollContainer,
  StyledListItemButton,
} from "./SidebarStyle";
import { useAuth } from "../../../services/AuthContext";

interface SidebarProps {
  role: UserRole;
  userName: string;
  userEmail?: string;
  onLogout?: () => void;
}

const createIcon = (Icon: LucideIcon) => <Icon size={20} strokeWidth={2.2} />;

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
  userEmail = "",
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const originalSections = getVisibleNavigation(role);

  const sections = React.useMemo(() => {
    return originalSections.map((section) => {
      const logoutIndex = section.items.findIndex(
        (item) => item.title === "Logout",
      );
      if (logoutIndex !== -1) {
        const languageItem = {
          title: "Language",
          path: "#",
          icon: "Languages",
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

  const language = i18n.resolvedLanguage === 'ar' ? 'ar' : 'en';

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleItem = (path: string) => {
    setOpenItem(openItem === path ? null : path);
  };

  // Active if the path matches exactly or is an ancestor segment of the current
  // route (so e.g. /student/problems/3 still highlights the Problems item).
  const matchesPath = (path: string) =>
    !!path &&
    path !== "#" &&
    (location.pathname === path || location.pathname.startsWith(path + "/"));

  // Among an item's children, the active one is the longest matching path
  // (so /student/problems/submissions activates "My Submissions", not "All Problems").
  const activeChildPath = (item: any): string | undefined => {
    if (!item.items) return undefined;
    return item.items
      .filter((subItem: any) => matchesPath(subItem.path))
      .sort((a: any, b: any) => b.path.length - a.path.length)[0]?.path;
  };

  const isChildActive = (item: any) => !!activeChildPath(item);

  // Keep the submenu of the active route expanded (e.g. on a problem details page).
  useEffect(() => {
    const parent = sections
      .flatMap((s) => s.items)
      .find((item: any) => item.items && isChildActive(item));
    if (parent) setOpenItem(parent.path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleLanguageToggle = () => {
    i18n.changeLanguage(language === "ar" ? "en"   : "ar");
  };

  const handleLogout = () => {
    logout();
    navigate("/credentials/login", { replace: true });
    if (isMobile) setMobileOpen(false);
  };

  return (
    <Box>
      <IconButton
        onClick={handleDrawerToggle}
        sx={{
          display: { md: "none" },
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 1200,
        }}
      >
        <MenuIcon />
      </IconButton>

      <SidebarContainer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        <LogoContainer>
          <img
            src="/logoPOM.png"
            alt="PMO Logo"
            style={{
              maxWidth: "100%",
              height: "auto",
              width: "128px",
            }}
          />
        </LogoContainer>

        <Divider sx={{ borderColor: "#eceff3" }} />

        <ScrollContainer>
          {sections.map((section, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <List disablePadding>
                {section.items.map((item: any) => {
                  const hasChildren = item.items && item.items.length > 0;
                  const isOpen = openItem === item.path;
                  // Parent items with children shouldn't self-highlight from a prefix
                  // match (the child handles it); leaf items use the segment match.
                  const hasChildItems = item.items && item.items.length > 0;
                  const isActive = hasChildItems
                    ? location.pathname === item.path
                    : matchesPath(item.path);
                  const isParentActive = isActive || isChildActive(item);

                  const isLogoutItem = item.title === "Logout";
                  const isLanguageItem = item.title === "Language";

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
                          <ListItemIcon
                            sx={{
                              minWidth: 40,
                              color: isParentActive ? "#8B1D23" : "#94a3b8",
                            }}
                          >
                            {iconMap[item.icon]}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography
                                sx={{
                                  fontSize: "14px",
                                  fontWeight: isParentActive ? 700 : 600,
                                  color: isParentActive ? "#8B1D23" : "#64748b",
                                }}
                              >
                                {isLanguageItem
                                  ? language === "ar"
                                    ? "العربية"
                                    : "English"
                                  : item.titleKey ? t(item.titleKey) : item.title}
                              </Typography>
                            }
                          />
                          {hasChildren &&
                            !isLogoutItem &&
                            !isLanguageItem &&
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
                            {(() => {
                              const currentActiveChild = activeChildPath(item);
                              return item.items.map((subItem: any) => {
                              const isSubActive = subItem.path === currentActiveChild;
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
                                        color: isSubActive
                                          ? "#8B1D23"
                                          : "#94a3b8",
                                      }}
                                    >
                                      {iconMap[subItem.icon]}
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={
                                        <Typography
                                          sx={{
                                            fontSize: "12px",
                                            fontWeight: isSubActive ? 800 : 600,
                                            color: isSubActive
                                              ? "#8B1D23"
                                              : "#64748b",
                                          }}
                                        >
                                          {subItem.titleKey ? t(subItem.titleKey) : subItem.title}
                                        </Typography>
                                      }
                                    />
                                  </StyledListItemButton>
                                </ListItem>
                              );
                              });
                            })()}
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

        <Divider sx={{ borderColor: "#eceff3" }} />

        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.5,
              borderRadius: "16px",
              bgcolor: "#fafafa",
              border: "1px solid #f1f5f9",
            }}
          >
            <Avatar
              sx={{ bgcolor: "#fff", color: "#fff", width: 42, height: 42 }}
            >
              <UserCircle size={35} strokeWidth={2} color="#8B1D23" />
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                noWrap
                sx={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}
              >
                {userName}
              </Typography>
              <Typography noWrap sx={{ fontSize: "12px", color: "#94a3b8" }}>
                {userEmail}
              </Typography>
            </Box>
          </Box>
        </Box>
      </SidebarContainer>
    </Box>
  );
};
