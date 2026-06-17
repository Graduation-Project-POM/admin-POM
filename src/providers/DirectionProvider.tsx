import React from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { useTranslation } from "react-i18next";

const createAppTheme = (direction: "ltr" | "rtl") =>
  createTheme({
    direction,
    palette: {
      background: {
        default: "#f8fafc",
      },
    },
    typography: {
      fontFamily: '"Lenos", sans-serif',
    },
  });

export const theme = createAppTheme("ltr");

// Two emotion caches. The RTL cache runs styles through stylis-plugin-rtl so
// all MUI/styled CSS (margins, paddings, borders, input adornments, the Drawer
// anchor, etc.) mirrors automatically for Arabic.
const ltrCache = createCache({ key: "mui", stylisPlugins: [prefixer] });
const rtlCache = createCache({
  key: "mui-rtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

/**
 * App-wide direction handling: picks the MUI theme direction and emotion cache
 * from the current i18n language. Wrapping the whole app (not just the
 * dashboard) means auth pages and every other screen mirror correctly in RTL.
 */
export const DirectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.resolvedLanguage === "ar";
  const direction = isRtl ? "rtl" : "ltr";

  // Recreate the theme only when the language direction changes.
  const appTheme = React.useMemo(() => createAppTheme(direction), [direction]);
  const cache = isRtl ? rtlCache : ltrCache;

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
};
