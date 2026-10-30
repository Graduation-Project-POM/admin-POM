import type { ReactNode } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { brand, neutral, radius, shadow, statusTone } from "../../../theme";

export type StatTone = "brand" | "success" | "warning" | "danger" | "info";

const TONES: Record<StatTone, { bg: string; fg: string }> = {
  brand: { bg: brand[50], fg: brand[500] },
  success: { bg: statusTone.success.bg, fg: statusTone.success.fg },
  warning: { bg: statusTone.warning.bg, fg: statusTone.warning.fg },
  danger: { bg: statusTone.danger.bg, fg: statusTone.danger.fg },
  info: { bg: statusTone.info.bg, fg: statusTone.info.fg },
};

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  /**
   * Chooses the icon's colour pair. Named rather than raw hex so a "pending"
   * tile is amber on every dashboard instead of amber on one and red on
   * another.
   */
  tone?: StatTone;
  trend?: { value: number; label: string; direction: "up" | "down" };
  /** Extra content below the value, e.g. a progress bar. */
  footer?: ReactNode;
  onClick?: () => void;
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  tone = "brand",
  trend,
  footer,
  onClick,
}: StatCardProps) => {
  const palette = TONES[tone];
  const TrendIcon = trend?.direction === "down" ? TrendingDown : TrendingUp;
  const trendColor =
    trend?.direction === "down" ? statusTone.danger.fg : statusTone.success.fg;

  // A tile that navigates renders as a real button so it is reachable and
  // pressable from the keyboard, not just clickable.
  return (
    <Paper
      elevation={0}
      {...(onClick
        ? { component: "button" as const, type: "button" as const, onClick }
        : {})}
      sx={{
        p: 2.5,
        width: "100%",
        textAlign: "start",
        font: "inherit",
        borderRadius: `${radius["2xl"]}px`,
        border: `1px solid ${neutral[200]}`,
        bgcolor: "background.paper",
        boxShadow: shadow.xs,
        height: "100%",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 2,
        cursor: onClick ? "pointer" : "default",
        transition: "box-shadow .2s ease, border-color .2s ease",
        ...(onClick && {
          "&:hover": { boxShadow: shadow.md, borderColor: neutral[300] },
        }),
      }}
    >
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          sx={{
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "text.secondary",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            mb: 0.75,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{ fontSize: "2rem", fontWeight: 800, color: neutral[900], lineHeight: 1.15 }}
        >
          {typeof value === "number" ? value.toLocaleString() : value}
        </Typography>

        {trend && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}>
            <TrendIcon size={14} color={trendColor} aria-hidden />
            <Typography variant="caption" sx={{ color: trendColor, fontWeight: 700 }}>
              {trend.value}%
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {trend.label}
            </Typography>
          </Box>
        )}

        {footer && <Box sx={{ mt: 1.5 }}>{footer}</Box>}

        {subtitle && (
          <Typography variant="caption" sx={{ color: "text.secondary", mt: 1, display: "block" }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      <Box
        aria-hidden
        sx={{
          bgcolor: palette.bg,
          color: palette.fg,
          p: 1.5,
          borderRadius: `${radius.xl}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={22} />
      </Box>
    </Paper>
  );
};

export default StatCard;
