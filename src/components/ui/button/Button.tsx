import React from "react";
import {
  Button as MuiButton,
  type ButtonProps as MuiButtonProps,
  styled,
} from "@mui/material";

interface StyledButtonProps extends MuiButtonProps {
  variantType?: "default" | "outline" | "ghost" | "danger";
}

const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== "variantType",
})<StyledButtonProps>(({ variantType }) => ({
  textTransform: "none",
  fontWeight: 600,
  padding: "8px 16px",
  borderRadius: "8px",
  boxShadow: "none",
  "&:hover": {
    boxShadow: "none",
  },
  ...(variantType === "default" && {
    backgroundColor: "#8B1D23",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#72181d",
    },
  }),
  ...(variantType === "outline" && {
    border: "1px solid #e2e8f0",
    color: "#1e293b",
    backgroundColor: "#ffffff",
    "&:hover": {
      backgroundColor: "#f8fafc",
      borderColor: "#cbd5e1",
    },
  }),
  ...(variantType === "ghost" && {
    color: "#64748b",
    "&:hover": {
      backgroundColor: "#f1f5f9",
    },
  }),
  ...(variantType === "danger" && {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    "&:hover": {
      backgroundColor: "#fecaca",
    },
    "&.Mui-disabled": {
      backgroundColor: "#f1f5f9",
      color: "#cbd5e1",
    },
  }),
  "&.Mui-disabled": {
    backgroundColor: "#f1f5f9",
    color: "#cbd5e1",
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
