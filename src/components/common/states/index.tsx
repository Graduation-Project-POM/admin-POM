import type { ReactNode } from "react";
import { Alert, Box, CircularProgress, Paper, Typography } from "@mui/material";
import { neutral, radius } from '../../../theme';

/**
 * The three states every data view passes through. Pages previously spelled
 * each one out inline, so a spinner in one screen sat at a different size and
 * offset than the next. These give all of them the same shape.
 */

interface LoadingStateProps {
  /** Vertical breathing room. `inline` suits a card, `page` a whole route. */
  size?: "inline" | "page";
  label?: string;
}

export const LoadingState = ({ size = "page", label }: LoadingStateProps) => (
  <Box
    role="status"
    aria-live="polite"
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 1.5,
      py: size === "page" ? 8 : 4,
    }}
  >
    <CircularProgress size={size === "page" ? 40 : 28} />
    {label && (
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>
    )}
  </Box>
);

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  /** A primary action, e.g. a "Create" button. */
  action?: ReactNode;
  /** `bare` drops the dashed container for use inside an existing card. */
  variant?: "card" | "bare";
}

export const EmptyState = ({
  title,
  description,
  icon,
  action,
  variant = "card",
}: EmptyStateProps) => {
  const content = (
    <>
      {icon && (
        <Box
          aria-hidden
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            borderRadius: "50%",
            bgcolor: neutral[100],
            color: neutral[400],
            mb: 2,
          }}
        >
          {icon}
        </Box>
      )}
      <Typography sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" sx={{ color: "text.secondary", maxWidth: 420, mx: "auto" }}>
          {description}
        </Typography>
      )}
      {action && <Box sx={{ mt: 2.5 }}>{action}</Box>}
    </>
  );

  if (variant === "bare") {
    return <Box sx={{ textAlign: "center", py: 5 }}>{content}</Box>;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 4, sm: 6 },
        borderRadius: `${radius["2xl"]}px`,
        border: `1px dashed ${neutral[200]}`,
        bgcolor: "background.paper",
        textAlign: "center",
      }}
    >
      {content}
    </Paper>
  );
};

interface ErrorStateProps {
  message: string;
  /** Optional retry control. */
  action?: ReactNode;
  onClose?: () => void;
}

export const ErrorState = ({ message, action, onClose }: ErrorStateProps) => (
  <Alert severity="error" onClose={onClose} action={action} sx={{ borderRadius: `${radius.lg}px` }}>
    {message}
  </Alert>
);
