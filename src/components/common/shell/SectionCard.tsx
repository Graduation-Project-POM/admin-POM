import type { ReactNode } from "react";
import { Box, Paper, Typography } from "@mui/material";
import type { LucideIcon } from "lucide-react";
import { brand, neutral, radius, shadow } from "../../../theme";

interface SectionCardProps {
  title?: string;
  icon?: LucideIcon;
  /** Control aligned to the end of the heading row, e.g. a "View all" link. */
  action?: ReactNode;
  children: ReactNode;
  /** Removes the inner padding for content that manages its own, e.g. a table. */
  flush?: boolean;
  /** Stretches the card to fill its grid cell. */
  fullHeight?: boolean;
}

/**
 * A titled panel. The dashboards and detail screens are built almost entirely
 * from these; giving them one shell means the heading size, icon treatment and
 * padding no longer drift between sections.
 */
export const SectionCard = ({
  title,
  icon: Icon,
  action,
  children,
  flush = false,
  fullHeight = false,
}: SectionCardProps) => (
  <Paper
    elevation={0}
    sx={{
      borderRadius: `${radius["2xl"]}px`,
      border: `1px solid ${neutral[200]}`,
      bgcolor: "background.paper",
      boxShadow: shadow.xs,
      height: fullHeight ? "100%" : undefined,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}
  >
    {title && (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          px: 3,
          pt: 2.5,
          pb: flush ? 2.5 : 0,
          borderBottom: flush ? `1px solid ${neutral[100]}` : undefined,
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{ display: "flex", alignItems: "center", gap: 1.25, color: "text.primary", minWidth: 0 }}
        >
          {Icon && <Icon size={18} color={brand[500]} aria-hidden />}
          {title}
        </Typography>
        {action}
      </Box>
    )}
    <Box sx={{ p: flush ? 0 : 3, pt: title && !flush ? 2 : undefined, flex: 1, minWidth: 0 }}>
      {children}
    </Box>
  </Paper>
);

export default SectionCard;
