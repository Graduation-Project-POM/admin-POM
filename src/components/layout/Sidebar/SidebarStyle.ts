import { styled } from '@mui/material/styles';
import { Drawer, Box, ListItemButton } from '@mui/material';
import { brand, neutral, radius } from '../../../theme';

export const DRAWER_WIDTH = 250;

export const SidebarContainer = styled(Drawer)({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box',
    // borderInlineEnd rather than borderRight so the divider follows the
    // reading direction and lands on the correct edge in Arabic.
    borderInlineEnd: `1px solid ${neutral[200]}`,
    borderRight: 'none',
    backgroundColor: neutral[0],
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
  paddingBottom: '8px',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
});

export const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({ isActive }) => ({
  margin: '2px 12px',
  borderRadius: radius.md,
  padding: '10px 12px',
  minHeight: 44,
  position: 'relative',
  transition: 'background-color .15s ease, color .15s ease',

  backgroundColor: isActive ? brand[50] : 'transparent',

  '&:hover': {
    backgroundColor: isActive ? brand[100] : neutral[50],
  },

  // The active marker sits on the inline-start edge, so it mirrors to the
  // right-hand side in Arabic instead of being stranded on the left.
  ...(isActive && {
    '&::before': {
      content: '""',
      position: 'absolute',
      insetInlineStart: '-12px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '4px',
      height: '22px',
      backgroundColor: brand[500],
      borderStartEndRadius: '4px',
      borderEndEndRadius: '4px',
    },
  }),
}));
