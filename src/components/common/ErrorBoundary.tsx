import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { AlertTriangle } from "lucide-react";
import i18n from "../../i18n";
import { neutral, radius, statusTone } from '../../theme';

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
 *
 * The stack is kept — it is the useful part when this fires — but it is now
 * tucked into a collapsed <details> so the crash reads as a message first and
 * a wall of text only on request.
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
      <Box sx={{ py: 4 }} role="alert">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: `${radius["2xl"]}px`,
            border: `1px solid ${statusTone.danger.border}`,
            bgcolor: "background.paper",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
            <Box
              aria-hidden
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                borderRadius: "50%",
                bgcolor: statusTone.danger.bg,
                color: statusTone.danger.fg,
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={22} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h5" component="h2" sx={{ color: statusTone.danger.fg, mb: 0.5 }}>
                {i18n.t("ui.errors.renderError")}
              </Typography>
              <Typography sx={{ fontWeight: 600, color: "text.primary", wordBreak: "break-word" }}>
                {error.message}
              </Typography>
            </Box>
          </Box>

          <Box component="details" sx={{ mt: 1 }}>
            <Box
              component="summary"
              sx={{
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                color: "text.secondary",
                py: 0.5,
                "&:focus-visible": { outline: `2px solid ${statusTone.danger.fg}`, outlineOffset: 2 },
              }}
            >
              {i18n.t("ui.errors.technicalDetails")}
            </Box>
            <Box
              component="pre"
              sx={{
                whiteSpace: "pre-wrap",
                fontSize: 12,
                lineHeight: 1.6,
                color: neutral[600],
                bgcolor: neutral[50],
                border: `1px solid ${neutral[200]}`,
                borderRadius: `${radius.md}px`,
                p: 2,
                mt: 1,
                overflow: "auto",
                maxHeight: 400,
              }}
            >
              {error.stack}
              {info?.componentStack}
            </Box>
          </Box>
        </Paper>
      </Box>
    );
  }
}
