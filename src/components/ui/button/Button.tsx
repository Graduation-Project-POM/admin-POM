import React from "react";
import {
  Button as MuiButton,
  type ButtonProps as MuiButtonProps,
  styled,
} from "@mui/material";
import { brand, neutral, radius, statusTone } from '../../../theme';

interface StyledButtonProps extends MuiButtonProps {
  variantType?: "default" | "outline" | "ghost" | "danger";
}

/**
 * The app's button. Same four variants and the same colours as before, now
 * drawn from the token ramp, with a real disabled treatment and a hover that
 * moves rather than just tints.
 */
const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== "variantType",
})<StyledButtonProps>(({ variantType }) => ({
  textTransform: "none",
  fontWeight: 600,
  borderRadius: radius.sm,
  boxShadow: "none",
  gap: 6,
  transition: "background-color .18s ease, border-color .18s ease, color .18s ease, box-shadow .18s ease",
  "&:hover": { boxShadow: "none" },

  ...(variantType === "default" && {
    backgroundColor: brand[500],
    color: neutral[0],
    "&:hover": { backgroundColor: brand[600] },
    "&:active": { backgroundColor: brand[700] },
  }),

  ...(variantType === "outline" && {
    border: `1px solid ${neutral[200]}`,
    color: neutral[800],
    backgroundColor: neutral[0],
    "&:hover": {
      backgroundColor: neutral[50],
      borderColor: neutral[300],
    },
    "&:active": { backgroundColor: neutral[100] },
  }),

  ...(variantType === "ghost" && {
    color: neutral[500],
    backgroundColor: "transparent",
    "&:hover": { backgroundColor: neutral[100], color: neutral[800] },
    "&:active": { backgroundColor: neutral[200] },
  }),

  ...(variantType === "danger" && {
    backgroundColor: statusTone.danger.bg,
    color: statusTone.danger.fg,
    border: `1px solid ${statusTone.danger.border}`,
    "&:hover": { backgroundColor: "#fbdcdc", borderColor: "#f8b4b4" },
    "&:active": { backgroundColor: "#f8cdcd" },
  }),

  // One disabled treatment for every variant. The previous grey-on-grey was
  // below readable contrast; this keeps the label legible while still reading
  // clearly as unavailable.
  "&.Mui-disabled": {
    backgroundColor: variantType === "ghost" ? "transparent" : neutral[100],
    borderColor: neutral[200],
    color: neutral[400],
    boxShadow: "none",
  },
}));

export const Button: React.FC<StyledButtonProps> = ({
  variantType = "default",
  children,
  ...props
}) => {
  return (
    <StyledButton variantType={variantType} {...props}>
      {children}
    </StyledButton>
  );
};
