import { createTheme, type Theme } from "@mui/material/styles";
import {
  brand,
  focusRing,
  fontStack,
  neutral,
  radius,
  shadow,
  statusTone,
} from "./tokens";

export * from "./tokens";
export * from "./surfaces";

/**
 * The app theme. Everything a page does not explicitly override comes from
 * here, so the defaults are where consistency is won: one focus ring, one
 * input treatment, one card radius, one set of brand-coloured controls.
 *
 * Pages that pass their own `sx` still win — this raises the floor without
 * moving anything a page deliberately styled.
 */
export const createAppTheme = (direction: "ltr" | "rtl"): Theme =>
  createTheme({
    direction,

    palette: {
      primary: {
        main: brand[500],
        dark: brand[600],
        light: brand[300],
        contrastText: neutral[0],
      },
      error: { main: statusTone.danger.fg, light: statusTone.danger.bg, dark: "#7f1d1d" },
      warning: { main: statusTone.warning.fg, light: statusTone.warning.bg, dark: "#78350f" },
      success: { main: statusTone.success.fg, light: statusTone.success.bg, dark: "#14532d" },
      info: { main: statusTone.info.fg, light: statusTone.info.bg, dark: "#3730a3" },
      background: { default: neutral[50], paper: neutral[0] },
      text: {
        primary: neutral[800],
        secondary: neutral[500],
        disabled: neutral[400],
      },
      divider: neutral[200],
      grey: {
        50: neutral[50],
        100: neutral[100],
        200: neutral[200],
        300: neutral[300],
        400: neutral[400],
        500: neutral[500],
        600: neutral[600],
        700: neutral[700],
        800: neutral[800],
        900: neutral[900],
      },
    },

    // A real scale, so a heading is picked from the ramp instead of being
    // hand-set with fontWeight/fontSize at each call site.
    typography: {
      fontFamily: direction === "rtl" ? fontStack.rtl : fontStack.ltr,
      h1: { fontSize: "2.5rem", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" },
      h2: { fontSize: "2rem", fontWeight: 800, lineHeight: 1.25, letterSpacing: "-0.02em" },
      h3: { fontSize: "1.625rem", fontWeight: 800, lineHeight: 1.3, letterSpacing: "-0.01em" },
      h4: { fontSize: "1.375rem", fontWeight: 800, lineHeight: 1.35, letterSpacing: "-0.01em" },
      h5: { fontSize: "1.125rem", fontWeight: 700, lineHeight: 1.4 },
      h6: { fontSize: "1rem", fontWeight: 700, lineHeight: 1.45 },
      subtitle1: { fontSize: "0.9375rem", fontWeight: 600, lineHeight: 1.5 },
      subtitle2: { fontSize: "0.8125rem", fontWeight: 600, lineHeight: 1.5 },
      body1: { fontSize: "0.9375rem", lineHeight: 1.65 },
      body2: { fontSize: "0.875rem", lineHeight: 1.6 },
      caption: { fontSize: "0.75rem", lineHeight: 1.5 },
      button: { fontSize: "0.875rem", fontWeight: 600, textTransform: "none" },
    },

    shape: { borderRadius: radius.lg },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: neutral[50],
            color: neutral[800],
            // Keeps Arabic and Latin from rendering at visibly different
            // optical sizes when both appear in one line.
            textRendering: "optimizeLegibility",
            WebkitFontSmoothing: "antialiased",
          },
          // One focus treatment everywhere. :focus-visible means a mouse click
          // never paints a ring but keyboard navigation always does — the app
          // previously had no reliable focus indicator at all.
          "*:focus-visible": focusRing,
          // A thin, neutral scrollbar instead of the default chrome, which is
          // visually heavy against the light canvas.
          "*::-webkit-scrollbar": { width: 10, height: 10 },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: neutral[300],
            borderRadius: radius.pill,
            border: `2px solid ${neutral[50]}`,
          },
          "*::-webkit-scrollbar-thumb:hover": { backgroundColor: neutral[400] },
          "*::-webkit-scrollbar-track": { backgroundColor: "transparent" },
          // Respect the OS "reduce motion" setting.
          "@media (prefers-reduced-motion: reduce)": {
            "*, *::before, *::after": {
              animationDuration: "0.01ms !important",
              animationIterationCount: "1 !important",
              transitionDuration: "0.01ms !important",
              scrollBehavior: "auto !important",
            },
          },
          img: { maxWidth: "100%" },
        },
      },

      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: radius.sm,
            textTransform: "none",
            fontWeight: 600,
            // 40px keeps buttons above the comfortable-tap threshold without
            // making dense toolbars feel loose.
            minHeight: 40,
            paddingInline: 16,
            transition: "background-color .18s ease, border-color .18s ease, color .18s ease",
            "&:focus-visible": focusRing,
          },
          sizeSmall: { minHeight: 32, paddingInline: 12, fontSize: "0.8125rem" },
          sizeLarge: { minHeight: 48, paddingInline: 24, fontSize: "0.9375rem" },
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: radius.sm,
            color: neutral[500],
            "&:hover": { backgroundColor: neutral[100], color: neutral[800] },
            "&:focus-visible": focusRing,
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: radius.md,
            backgroundColor: neutral[0],
            "& fieldset": { borderColor: neutral[200] },
            "&:hover fieldset": { borderColor: neutral[300] },
            "&.Mui-focused fieldset": {
              borderColor: brand[500],
              borderWidth: "1.5px",
            },
            "&.Mui-disabled": { backgroundColor: neutral[50] },
          },
          input: {
            "&::placeholder": { color: neutral[400], opacity: 1 },
            // Chrome paints autofilled fields its own pale blue, which broke
            // the field styling on every login and edit form. The inset shadow
            // is the only way to repaint that background.
            "&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus": {
              WebkitBoxShadow: `0 0 0 100px ${neutral[0]} inset`,
              WebkitTextFillColor: neutral[800],
              caretColor: neutral[800],
              borderRadius: "inherit",
            },
          },
        },
      },

      MuiInputLabel: {
        styleOverrides: {
          root: { "&.Mui-focused": { color: brand[500] } },
        },
      },

      MuiFormHelperText: {
        styleOverrides: { root: { marginInlineStart: 2, fontSize: "0.75rem" } },
      },

      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600, borderRadius: radius.sm },
          sizeSmall: { height: 24 },
          label: { paddingInline: 10 },
        },
      },

      MuiPaper: {
        styleOverrides: {
          // MUI paints a translucent white gradient over elevated Paper; it
          // muddies the brand colours on cards, and the app is light-only.
          root: { backgroundImage: "none" },
        },
      },

      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: radius["2xl"], boxShadow: shadow.lg },
        },
      },

      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: radius.md,
            border: `1px solid ${neutral[200]}`,
            boxShadow: shadow.md,
          },
        },
      },

      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontSize: "0.875rem",
            fontWeight: 500,
            "&:focus-visible": focusRing,
          },
        },
      },

      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: neutral[800],
            fontSize: "0.75rem",
            fontWeight: 500,
            borderRadius: radius.sm,
            paddingInline: 10,
            paddingBlock: 6,
          },
          arrow: { color: neutral[800] },
        },
      },

      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: radius.lg, fontSize: "0.875rem", alignItems: "center" },
        },
        variants: [
          {
            props: { variant: "standard", severity: "error" },
            style: { backgroundColor: statusTone.danger.bg, color: statusTone.danger.fg },
          },
          {
            props: { variant: "standard", severity: "success" },
            style: { backgroundColor: statusTone.success.bg, color: statusTone.success.fg },
          },
          {
            props: { variant: "standard", severity: "warning" },
            style: { backgroundColor: statusTone.warning.bg, color: statusTone.warning.fg },
          },
          {
            props: { variant: "standard", severity: "info" },
            style: { backgroundColor: statusTone.info.bg, color: statusTone.info.fg },
          },
        ],
      },

      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: neutral[300],
            "&.Mui-checked, &.MuiCheckbox-indeterminate": { color: brand[500] },
            "&:focus-visible": focusRing,
          },
        },
      },

      MuiRadio: {
        styleOverrides: {
          root: {
            color: neutral[300],
            "&.Mui-checked": { color: brand[500] },
            "&:focus-visible": focusRing,
          },
        },
      },

      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            "&.Mui-checked": { color: brand[500] },
            "&.Mui-checked + .MuiSwitch-track": { backgroundColor: brand[500] },
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          root: { borderColor: neutral[100] },
        },
      },

      MuiLink: {
        defaultProps: { underline: "hover" },
        styleOverrides: {
          root: { color: brand[500], fontWeight: 600, "&:focus-visible": focusRing },
        },
      },

      MuiDivider: {
        styleOverrides: { root: { borderColor: neutral[200] } },
      },

      MuiListItemButton: {
        styleOverrides: {
          root: { borderRadius: radius.sm, "&:focus-visible": focusRing },
        },
      },

      MuiAvatar: {
        styleOverrides: { root: { fontWeight: 700 } },
      },

      MuiCircularProgress: {
        styleOverrides: { root: { color: brand[500] } },
      },

      MuiSkeleton: {
        defaultProps: { animation: "wave" },
        styleOverrides: { root: { backgroundColor: neutral[100], borderRadius: radius.sm } },
      },
    },
  });

export const theme = createAppTheme("ltr");
