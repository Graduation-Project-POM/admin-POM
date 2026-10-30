import { neutral, radius, shadow } from "./tokens";

/**
 * The card surface.
 *
 * The five card components each had their own take on this — radius 16 vs 20,
 * three different border greys, four different shadows, and hover states that
 * lifted 6px, 3px or not at all. Sitting them side by side on a dashboard made
 * the grid look assembled rather than designed. This is the one treatment they
 * now share; each card keeps its own content and layout.
 */
export const cardSurface = {
  borderRadius: `${radius["2xl"]}px`,
  border: `1px solid ${neutral[200]}`,
  backgroundColor: neutral[0],
  boxShadow: shadow.xs,
  transition:
    "box-shadow .2s ease, border-color .2s ease, transform .2s ease",
  "&:hover": {
    boxShadow: shadow.md,
    borderColor: neutral[300],
    transform: "translateY(-2px)",
  },
  // A card that lifts on hover should sit still for anyone who asked the OS to
  // stop moving things.
  "@media (prefers-reduced-motion: reduce)": {
    "&:hover": { transform: "none" },
  },
} as const;

/** Small pill used for inline stats inside cards. */
export const statPill = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  backgroundColor: neutral[50],
  border: `1px solid ${neutral[100]}`,
  padding: "6px 12px",
  borderRadius: `${radius.pill}px`,
} as const;
