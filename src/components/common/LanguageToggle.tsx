import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import { Languages } from "lucide-react";
import { neutral } from '../../theme';

interface LanguageToggleProps {
  /** Render fixed in the top corner — handy for full-screen pages like auth. */
  floating?: boolean;
}

/**
 * Toggles the app language between English and Arabic via i18n.
 * i18n persists the choice to localStorage and flips <html dir> automatically,
 * so this single component works anywhere — no per-page logic.
 */
export const LanguageToggle = ({ floating = false }: LanguageToggleProps) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === "ar";

  const toggleLanguage = () => i18n.changeLanguage(isArabic ? "en" : "ar");

  return (
    <Button
      onClick={toggleLanguage}
      variant="contained"
      startIcon={<Languages size={18} />}
      sx={{
        textTransform: "none",
        fontWeight: 700,
        py: 1,
        px: 2,
        color: neutral[0],
        backgroundColor: "#7D1C48",
        "&:hover": { backgroundColor: "#5c1335" },
        ...(floating && {
          position: "fixed",
          top: 16,
          insetInlineEnd: 16, // right in LTR, left in RTL
          zIndex: 1300,
        }),
      }}
    >
      {/* Show the language the user will switch TO. */}
      {isArabic ? "English" : "العربية"}
    </Button>
  );
};
