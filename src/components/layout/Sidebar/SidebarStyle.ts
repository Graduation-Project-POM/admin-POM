import { styled } from '@mui/material/styles';
import { Drawer, Box, ListItemButton } from '@mui/material';

export const DRAWER_WIDTH = 250;

export const SidebarContainer = styled(Drawer)({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box',
    borderRight: '1px solid #f1f5f9',
    backgroundColor: '#ffffff',
  },
});

export const LogoContainer = styled(Box)({
  padding: '24px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const ScrollContainer = styled(Box)({
  flexGrow: 1,
  overflowY: 'auto',
  marginTop: '8px',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
});

export const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({ isActive }) => ({
  margin: '2px 16px',
  borderRadius: '8px',
  padding: '10px 12px',
  position: 'relative',
  backgroundColor: isActive ? 'rgba(139, 29, 35, 0.04)' : 'transparent',

  '&:hover': {
    backgroundColor: isActive
      ? 'rgba(139, 29, 35, 0.08)'
      : '#f8fafc',
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