/**
 * Design tokens — the single source of truth for colour, radius, shadow and
 * spacing across the app.
 *
 * The brand maroon and the slate neutrals were already in use across the UI;
 * this file gives them names and fills in the missing steps so a shade is
 * chosen from a ramp rather than invented per component. Values that were
 * already on screen (brand[500] and brand[600], the slate ramp, the status
 * colours) are preserved exactly, so adopting a token never shifts a colour
 * that a page had deliberately picked.
 */

// Brand maroon. 500 is the Palestine Math Olympiad red used throughout;
// 600 is the hover state buttons already used.
export const brand = {
  50: "#fdf5f5",
  100: "#fbe8e9",
  200: "#f5cbcd",
  300: "#e0989c",
  400: "#b8474f",
  500: "#8b1d23",
  600: "#72181d",
  700: "#5c1317",
  800: "#420d10",
  900: "#2b080a",
} as const;

// Neutral ramp. Matches the slate scale the pages already reach for, so
// swapping a literal for a token is a no-op on screen.
export const neutral = {
  0: "#ffffff",
  50: "#f8fafc",
  100: "#f1f5f9",
  200: "#e2e8f0",
  300: "#cbd5e1",
  400: "#94a3b8",
  500: "#64748b",
  600: "#475569",
  700: "#334155",
  800: "#1e293b",
  900: "#0f172a",
} as const;

/**
 * Status colours. Each family has a tinted surface (`bg`), a matching `border`,
 * a dark `fg` that clears WCAG AA on that surface, and a mid-tone `solid` for
 * icons and progress fills that need to read against white.
 *
 * The pages previously carried four near-identical greens, four ambers and
 * three reds — the ramp collapses those into one set per meaning.
 */
export const statusTone = {
  success: { bg: "#e7f7ec", border: "#a7f3d0", fg: "#166534", solid: "#059669" },
  warning: { bg: "#fff7e0", border: "#fde68a", fg: "#92400e", solid: "#d97706" },
  danger: { bg: "#fdecec", border: "#fecaca", fg: "#991b1b", solid: "#dc2626" },
  info: { bg: "#eef2ff", border: "#c7d2fe", fg: "#4338ca", solid: "#4f46e5" },
} as const;

export const radius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  "2xl": 16,
  pill: 999,
} as const;

/**
 * Shadows are deliberately soft and tinted toward the neutral ramp rather than
 * pure black — a hard black shadow reads as dirty against the #f8fafc canvas.
 */
export const shadow = {
  none: "none",
  xs: "0 1px 2px rgba(15, 23, 42, 0.04)",
  sm: "0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)",
  md: "0 4px 12px rgba(15, 23, 42, 0.06), 0 2px 4px rgba(15, 23, 42, 0.04)",
  lg: "0 12px 28px rgba(15, 23, 42, 0.10), 0 4px 8px rgba(15, 23, 42, 0.04)",
  brand: "0 4px 12px rgba(139, 29, 35, 0.24)",
} as const;

// One focus treatment for the whole app. Applied on :focus-visible only, so a
// mouse click never draws it but Tab always does.
export const focusRing = {
  outline: `2px solid ${brand[500]}`,
  outlineOffset: "2px",
} as const;

/**
 * Font stacks.
 *
 * Lenos is the display/latin face and is the only webfont actually present in
 * the repo. App.css also declares @font-face blocks for "Readex Pro", but the
 * files they point at (public/fonts/readex/*) do not exist -- the dev server
 * answers those URLs with index.html, which the browser parses as a font with
 * advance widths and no glyphs, rendering every character invisible. So Readex
 * Pro is deliberately NOT referenced here.
 *
 * Arabic therefore resolves to the platform UI face (Segoe UI on Windows), the
 * same as before. To switch Arabic to Readex Pro, add the .ttf files under
 * public/fonts/readex/ and put '"Readex Pro"' at the front of `rtl`.
 */
export const fontStack = {
  ltr: '"Lenos", system-ui, -apple-system, "Segoe UI", sans-serif',
  rtl: 'system-ui, -apple-system, "Segoe UI", "Lenos", sans-serif',
  mono: '"SFMono-Regular", ui-monospace, Menlo, Consolas, "Liberation Mono", monospace',
} as const;
