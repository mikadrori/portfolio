/**
 * OGEN video crop & corner radius — edit these and save; Vite hot-reloads.
 *
 * cropX / cropY — % trimmed from EACH side of the source frame
 *   (higher = tighter crop into the screen / device)
 * radius — CSS length for wrapper border-radius + video clip-path
 *   fixed px  → "28px"
 *   scales    → "3.6%"
 *   token     → "var(--radius-video-inline)"
 * sourceAspect — original frame size before crop (w × h units)
 */

/** Black-bezel screen recordings (intro overview + Design → Screens carousel). */
export const OGEN_SCREEN_VIDEO = {
  cropX: 2,
  cropY: 3.95,
  radius: "42px",
  sourceAspect: { w: 14.4, h: 10.8 },
} as const;

/** Architecture prototype walkthrough (iPad in scene — strip white backdrop). */
export const OGEN_PROTOTYPE_VIDEO = {
  cropX: 15,
  cropY: 5,
  radius: "45px",
  sourceAspect: { w: 16, h: 9 },
} as const;
