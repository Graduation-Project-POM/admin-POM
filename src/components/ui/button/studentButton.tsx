import React from 'react';
import { Button as MuiButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { brand, neutral, radius, shadow, statusTone } from '../../../theme';

interface ButtonProps {
  children: React.ReactNode;
  variantType?: 'default' | 'outline' | 'ghost' | 'danger';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  sx?: object;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Student-facing button. Slightly rounder and heavier than the base Button;
 * both now pull from the same token ramp so the two never drift apart.
 */
const StyledButton = styled(MuiButton)<{ varianttype?: string }>(({ varianttype }) => ({
  textTransform: 'none',
  fontWeight: 700,
  borderRadius: radius.md,
  padding: '8px 20px',
  fontSize: '14px',
  gap: 6,
  transition: 'background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease',

  ...(varianttype === 'default' && {
    backgroundColor: brand[500],
    color: neutral[0],
    '&:hover': {
      backgroundColor: brand[600],
      boxShadow: shadow.brand,
    },
    '&:active': { backgroundColor: brand[700] },
  }),

  ...(varianttype === 'outline' && {
    backgroundColor: 'transparent',
    color: neutral[800],
    border: `1.5px solid ${neutral[200]}`,
    '&:hover': {
      borderColor: brand[500],
      color: brand[500],
      backgroundColor: brand[50],
    },
  }),

  ...(varianttype === 'ghost' && {
    backgroundColor: 'transparent',
    color: neutral[500],
    '&:hover': {
      backgroundColor: neutral[100],
      color: neutral[800],
    },
  }),

  ...(varianttype === 'danger' && {
    backgroundColor: statusTone.danger.bg,
    color: statusTone.danger.fg,
    border: `1.5px solid ${statusTone.danger.border}`,
    '&:hover': {
      backgroundColor: '#fbdcdc',
      borderColor: '#f87171',
    },
  }),

  '&.Mui-disabled': {
    backgroundColor: varianttype === 'ghost' ? 'transparent' : neutral[100],
    borderColor: neutral[200],
    color: neutral[400],
    boxShadow: 'none',
  },
}));

export const Button: React.FC<ButtonProps> = ({
  children,
  variantType = 'default',
  startIcon,
  endIcon,
  fullWidth,
  disabled,
  onClick,
  sx,
  size,
}) => {
  return (
    <StyledButton
      varianttype={variantType}
      startIcon={startIcon}
      endIcon={endIcon}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      sx={sx}
      size={size}
    >
      {children}
    </StyledButton>
  );
};
