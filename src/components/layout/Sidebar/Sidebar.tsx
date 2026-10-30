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
import { getVisibleNavigation, type NavItem } from "../../../config/navigation";
import type { UserRole } from "../../../types";

import {
  SidebarContainer,
  LogoContainer,
  ScrollContainer,
  StyledListItemButton,
} from "./SidebarStyle";
import { useAuth } from "../../../services/AuthContext";
import { brand, neutral } from '../../../theme';

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

  const matchesPath = (path: string) =>
    !!path &&
    path !== "#" &&
    (location.pathname === path || location.pathname.startsWith(path + "/"));

  const activeChildPath = (item: NavItem): string | undefined => {
    if (!item.items) return undefined;
    return item.items
      .filter((subItem: NavItem) => matchesPath(subItem.path))
      .sort((a: NavItem, b: NavItem) => b.path.length - a.path.length)[0]?.path;
  };

  const isChildActive = (item: NavItem) => !!activeChildPath(item);

  useEffect(() => {
    const parent = sections
      .flatMap((s) => s.items)
      .find((item: NavItem) => item.items && isChildActive(item));
    if (parent) setOpenItem(parent.path);
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
        aria-label={t("ui.common.openMenu")}
        aria-expanded={mobileOpen}
        aria-controls="app-sidebar"
        sx={{
          display: { md: "none" },
          position: "fixed",
          top: 12,
          insetInlineStart: 12,
          zIndex: 1200,
          bgcolor: neutral[0],
          border: `1px solid ${neutral[200]}`,
          boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)",
          "&:hover": { bgcolor: neutral[50] },
        }}
      >
        <MenuIcon />
      </IconButton>

      <SidebarContainer
        id="app-sidebar"
        component="nav"
        aria-label={t("ui.common.mainNavigation")}
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        <LogoContainer>
          <img
            src="/logoPOM.png"
            alt={t("ui.common.logoAlt")}
            style={{
              maxWidth: "100%",
              height: "auto",
              width: "128px",
            }}
          />
        </LogoContainer>

        <Divider />

        <ScrollContainer>
          {sections.map((section, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <List disablePadding>
                {section.items.map((item: NavItem) => {
                  const hasChildren = item.items && item.items.length > 0;
                  const isOpen = openItem === item.path;
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
                          aria-current={isActive ? "page" : undefined}
                          {...(hasChildren && !isLogoutItem && !isLanguageItem
                            ? { "aria-expanded": isOpen }
                            : {})}
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
                              color: isParentActive ? brand[500] : neutral[400],
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
                                  color: isParentActive ? brand[500] : neutral[500],
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
                              <ChevronDown size={16} color={neutral[400]} />
                            ) : (
                              <ChevronRight size={16} color={neutral[400]} />
                            ))}
                        </StyledListItemButton>
                      </ListItem>

                      {hasChildren && (
                        <Collapse in={isOpen} timeout="auto" unmountOnExit>
                          <List disablePadding>
                            {(() => {
                              const currentActiveChild = activeChildPath(item);
                              return item.items?.map((subItem: NavItem) => {
                              const isSubActive = subItem.path === currentActiveChild;
                              return (
                                <ListItem key={subItem.path} disablePadding>
                                  <StyledListItemButton
                                    isActive={isSubActive}
                                    aria-current={isSubActive ? "page" : undefined}
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
                                          ? brand[500]
                                          : neutral[400],
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
                                              ? brand[500]
                                              : neutral[500],
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

        <Divider />

        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.5,
              borderRadius: "14px",
              bgcolor: neutral[50],
              border: `1px solid ${neutral[200]}`,
            }}
          >
            <Avatar
              aria-hidden
              sx={{ bgcolor: brand[50], width: 42, height: 42 }}
            >
              <UserCircle size={26} strokeWidth={2} color={brand[500]} />
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                noWrap
                sx={{ fontSize: "14px", fontWeight: 700, color: neutral[900] }}
              >
                {userName}
              </Typography>
              {/* Rendered only when present — an empty address previously left
                  a blank line that made the card look broken. */}
              {userEmail && (
                <Typography noWrap sx={{ fontSize: "12px", color: neutral[400] }}>
                  {userEmail}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </SidebarContainer>
    </Box>
  );
};
