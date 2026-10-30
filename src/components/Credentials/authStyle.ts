import type { SxProps, Theme } from '@mui/material';
import { brand, neutral, radius, shadow } from '../../theme';

/**
 * Shared chrome for the login and signup screens.
 *
 * Both files previously carried their own byte-identical copy of this, keyed on
 * `#7D1C48` — a purple-maroon that is not the brand colour. The result was that
 * the first screen anyone sees was the one screen off-brand. These now sit on
 * the brand ramp like the rest of the app.
 */

export const containerStyles: SxProps<Theme> = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  py: 6,
};

export const paperStyles: SxProps<Theme> = {
  p: { xs: 3, sm: 4 },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  borderRadius: `${radius['2xl']}px`,
  border: `1px solid ${neutral[200]}`,
  boxShadow: shadow.lg,
};

export const titleStyles: SxProps<Theme> = {
  mb: 1,
  fontWeight: 800,
  color: brand[500],
  textAlign: 'center',
};

export const subtitleStyles: SxProps<Theme> = {
  mb: 3,
  textAlign: 'center',
};

export const formStyles: SxProps<Theme> = {
  width: '100%',
};

// The focus treatment now comes from the theme; this only remains so the two
// screens keep a single named hook for any field-level tweak.
export const textFieldStyles: SxProps<Theme> = {};

export const buttonStyles: SxProps<Theme> = {
  mt: 3,
  mb: 2,
  py: 1.5,
  fontSize: '0.9375rem',
  fontWeight: 700,
  color: neutral[0],
  backgroundColor: brand[500],
  '&:hover': { backgroundColor: brand[600] },
  '&:active': { backgroundColor: brand[700] },
};

export const linkStyles: SxProps<Theme> = {
  cursor: 'pointer',
  fontWeight: 700,
  color: brand[500],
};
