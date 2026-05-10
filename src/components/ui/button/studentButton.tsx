import React from 'react';
import { Button as MuiButton } from '@mui/material';
import { styled } from '@mui/material/styles';

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

const StyledButton = styled(MuiButton)<{ varianttype?: string }>(({ varianttype }) => ({
  textTransform: 'none',
  fontWeight: 700,
  borderRadius: '10px',
  padding: varianttype === 'large' ? '12px 24px' : '8px 20px',
  fontSize: '14px',
  transition: 'all 0.2s ease',
  ...(varianttype === 'default' && {
    backgroundColor: '#8B1D23',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#6d1620',
      boxShadow: '0 4px 12px rgba(139, 29, 35, 0.3)',
    },
  }),
  ...(varianttype === 'outline' && {
    backgroundColor: 'transparent',
    color: '#1e293b',
    border: '1.5px solid #e2e8f0',
    '&:hover': {
      borderColor: '#8B1D23',
      color: '#8B1D23',
      backgroundColor: '#fef2f2',
    },
  }),
  ...(varianttype === 'ghost' && {
    backgroundColor: 'transparent',
    color: '#64748b',
    '&:hover': {
      backgroundColor: '#f1f5f9',
      color: '#1e293b',
    },
  }),
  ...(varianttype === 'danger' && {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: '1.5px solid #fecaca',
    '&:hover': {
      backgroundColor: '#fee2e2',
      borderColor: '#f87171',
    },
  }),
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
