import React from "react";
import { Box, Typography } from "@mui/material";
import i18n from "../../i18n";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
  info: React.ErrorInfo | null;
}

/**
 * Catches render-time exceptions in the page tree so a crash shows a readable
 * message (with the component stack) instead of a blank white screen.
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null, info: null };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Also surface it in the console for good measure.
    console.error("ErrorBoundary caught:", error, info);
    this.setState({ info });
  }

  render() {
    const { error, info } = this.state;
    if (!error) return this.props.children;

    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#dc2626", mb: 2 }}>
          {i18n.t("ui.errors.renderError")}
        </Typography>
        <Typography sx={{ fontWeight: 700, mb: 1 }}>{error.message}</Typography>
        <Box
          component="pre"
          sx={{
            whiteSpace: "pre-wrap",
            fontSize: 12,
            color: "#475569",
            bgcolor: "#f8fafc",
            border: "1px solid #e5e7eb",
            borderRadius: 2,
            p: 2,
            overflow: "auto",
            maxHeight: 400,
          }}
        >
          {error.stack}
          {info?.componentStack}
        </Box>
      </Box>
    );
  }
}
