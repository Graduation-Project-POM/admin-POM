import React from "react";
import MuiButton from "@mui/material/Button";
import type { ButtonProps as MuiButtonProps } from "@mui/material/Button";

type Props = MuiButtonProps & {
  variantType?: "default" | "outline" | "ghost";
  sizeType?: "sm" | "md" | "lg";
};

export const Button: React.FC<Props> = ({
  variantType = "default",
  sizeType = "md",
  sx,
  ...props
}) => {
  const getVariant = () => {
    switch (variantType) {
      case "outline":
        return "outlined";
      case "ghost":
        return "text";
      default:
        return "contained";
    }
  };

  const getSize = () => {
    switch (sizeType) {
      case "sm":
        return "small";
      case "lg":
        return "large";
      default:
        return "medium";
    }
  };

  return (
    <MuiButton
      variant={getVariant()}
      size={getSize()}
      sx={{
        textTransform: "none",
        borderRadius: "8px",
        bgcolor: "#8B1D23",
        color: "#fff",

        "&:hover": {
          bgcolor: "#6f161b",
        },
        ...sx,
      }}
      {...props}
    />
  );
};
