import { Typography } from "@mui/material";
import type { ReactNode } from "react";
import { neutral, statusTone } from '../../../theme';

interface LabelProps {
  children: ReactNode;
  required?: boolean;
  /**
   * Id of the field this labels. When given, the label renders as a real
   * <label for> so clicking it focuses the input and screen readers announce
   * the two together. Optional so existing standalone usages keep working.
   */
  htmlFor?: string;
}

export const Label = ({ children, required = false, htmlFor }: LabelProps) => {
  return (
    <Typography
      component={htmlFor ? "label" : "span"}
      htmlFor={htmlFor}
      variant="body2"
      sx={{
        display: "block",
        fontWeight: 600,
        color: neutral[700],
        mb: 0.75,
        cursor: htmlFor ? "pointer" : "inherit",
      }}
    >
      {children}
      {required && (
        <span aria-hidden style={{ color: statusTone.danger.fg, marginInlineStart: 4 }}>
          *
        </span>
      )}
    </Typography>
  );
};
