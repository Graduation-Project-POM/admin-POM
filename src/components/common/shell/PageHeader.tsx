import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../../ui/button/Button";

interface PageHeaderProps {
  title: string;
  /** One line of context under the title. */
  subtitle?: string;
  /** Buttons or controls aligned to the far end of the header row. */
  actions?: ReactNode;
  /** Renders a Back control above the title when provided. */
  onBack?: () => void;
  backLabel?: string;
  /** Small status chips or counters shown beside the title. */
  meta?: ReactNode;
}

/**
 * The header every screen opens with.
 *
 * Each page used to hand-roll this, which is why titles landed at three
 * different sizes, back buttons sat at four different offsets, and some screens
 * had a subtitle while their siblings did not. One component, one rhythm.
 */
export const PageHeader = ({
  title,
  subtitle,
  actions,
  onBack,
  backLabel,
  meta,
}: PageHeaderProps) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: 4 }}>
      {onBack && (
        <Button
          variantType="ghost"
          size="small"
          startIcon={<ArrowLeft size={16} />}
          onClick={onBack}
          sx={{ mb: 1.5, ml: -1 }}
        >
          {backLabel ?? t("buttons.back")}
        </Button>
      )}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
            <Typography variant="h4" component="h1" sx={{ color: "text.primary" }}>
              {title}
            </Typography>
            {meta}
          </Box>
          {subtitle && (
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.75, maxWidth: 720 }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {actions && (
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
            {actions}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PageHeader;
