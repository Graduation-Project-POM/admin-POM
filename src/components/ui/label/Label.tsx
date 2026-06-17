import { Typography } from "@mui/material";
import type { ReactNode } from "react";

export const Label = ({
  children,
  required = false,
}: {
  children: ReactNode;
  required?: boolean;
}) => {
  return (
    <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
      {children}
      {required && (
        <span style={{ color: "#dc2626", marginInlineStart: 4 }}>*</span>
      )}
    </Typography>
  );
};
