import type { CSSProperties } from "react";

/** Matches `--radius-phone-*` / `--radius-phone-packup-*` / `--radius-phone-muchi-*` in `responsive-tokens.css`. */
export type PhoneClipTier =
  | "xs"
  | "small"
  | "medium"
  | "large"
  | "packup-medium"
  | "packup-large"
  | "muchi-medium"
  | "muchi-large"
  | "muchi-xl";

const TIER_VAR: Record<PhoneClipTier, string> = {
  xs: "var(--radius-phone-xs)",
  small: "var(--radius-phone-small)",
  medium: "var(--radius-phone-medium)",
  large: "var(--radius-phone-large)",
  "packup-medium": "var(--radius-phone-packup-medium)",
  "packup-large": "var(--radius-phone-packup-large)",
  "muchi-medium": "var(--radius-phone-muchi-medium)",
  "muchi-large": "var(--radius-phone-muchi-large)",
  "muchi-xl": "var(--radius-phone-muchi-xl)",
};

/** Clips decoded `<video>` corners when border-radius alone fails (see Lumina `AutoPlayVideo`). */
export function phoneClipPathStyle(tier: PhoneClipTier): CSSProperties {
  const r = TIER_VAR[tier];
  return {
    clipPath: `inset(0 round ${r})`,
    WebkitClipPath: `inset(0 round ${r})`,
  };
}

/** Outer wrapper for phone demo videos — pair with `radiusPhone*Class` from `spacing.ts`. */
export const phoneClipWrapperBaseClass = "relative overflow-hidden";
