import type { VideoHTMLAttributes } from "react";

/**
 * Full-width project hero: aspect-ratio strip, purple→lavender gradient, primary top/bottom rules.
 * Media fills the strip with object-cover by default (see ProjectHeroVideo).
 * Pass `fillViewport` for a full-screen hero (min 100svh) instead of the aspect strip.
 * Pass `shellFillClass` to replace the gradient (e.g. Signal 50 black skeleton).
 * Pass `objectFit="contain"` when side crop would clip UI/type (e.g. Nabat website vid).
 * Pass `sizeToMedia` to size the shell to the video’s intrinsic frame so rules sit flush
 * on the picture (e.g. Nabat — full frame, navy rule at the video bottom, no letterbox gap).
 * Pass `hideBottomBorder` to keep only the top rule.
 */
const PROJECT_HERO_SHELL_LAYOUT_CLASS = [
  "relative w-full shrink-0 overflow-hidden",
  "aspect-[1920/507] max-h-[var(--project-hero-max-h)]",
].join(" ");

const PROJECT_HERO_VIEWPORT_LAYOUT_CLASS = [
  "relative w-full shrink-0 overflow-hidden",
  "h-svh min-h-svh max-h-svh",
].join(" ");

const PROJECT_HERO_BORDER_Y_CLASS = "border-y border-[#2200b8]";
const PROJECT_HERO_BORDER_TOP_CLASS = "border-t border-[#2200b8]";

export const PROJECT_HERO_SHELL_FILL_CLASS = "bg-gradient-to-r from-[#8E94F2] to-[#E8EAF6]";

export const PROJECT_HERO_VIDEO_SHELL_CLASS = [
  PROJECT_HERO_SHELL_LAYOUT_CLASS,
  PROJECT_HERO_BORDER_Y_CLASS,
  PROJECT_HERO_SHELL_FILL_CLASS,
].join(" ");

export const PROJECT_HERO_VIDEO_VIEWPORT_CLASS = [
  PROJECT_HERO_VIEWPORT_LAYOUT_CLASS,
  PROJECT_HERO_BORDER_Y_CLASS,
  PROJECT_HERO_SHELL_FILL_CLASS,
].join(" ");

const HERO_VIDEO_RADIUS = "0px";

type ProjectHeroVideoProps = {
  src: string;
  /** Optional still while the video loads. Omit for a fill-only skeleton (e.g. Signal 50). */
  poster?: string;
  /** When true, hero fills the viewport height instead of the short aspect strip. */
  fillViewport?: boolean;
  /** Replaces the default gradient shell fill (loading / letterbox). */
  shellFillClass?: string;
  /**
   * How the video fills the shell. `cover` (default) may crop; `contain` shows the full frame
   * (letterbox with `shellFillClass`) — use for website/UI recordings where side crop cuts type.
   * Ignored when `sizeToMedia` is set.
   */
  objectFit?: "cover" | "contain";
  /**
   * Size the shell to the video’s intrinsic aspect (full width, no crop) so top/bottom rules
   * sit on the picture edge. Takes precedence over `fillViewport` and the default aspect strip.
   */
  sizeToMedia?: boolean;
  /** When true, keep only the top shell rule so the hero sits flush with content below. */
  hideBottomBorder?: boolean;
} & Pick<VideoHTMLAttributes<HTMLVideoElement>, "preload">;

export function ProjectHeroVideo({
  src,
  poster,
  fillViewport = false,
  shellFillClass = PROJECT_HERO_SHELL_FILL_CLASS,
  objectFit = "cover",
  sizeToMedia = false,
  hideBottomBorder = false,
  preload = "auto",
}: ProjectHeroVideoProps) {
  const borderClass = hideBottomBorder
    ? PROJECT_HERO_BORDER_TOP_CLASS
    : PROJECT_HERO_BORDER_Y_CLASS;

  if (sizeToMedia) {
    return (
      <div className={`relative w-full shrink-0 overflow-hidden ${borderClass} ${shellFillClass}`}>
        <video
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload={preload}
          className="block h-auto w-full"
          style={{ borderRadius: HERO_VIDEO_RADIUS }}
        />
      </div>
    );
  }

  const layoutClass = fillViewport
    ? PROJECT_HERO_VIEWPORT_LAYOUT_CLASS
    : PROJECT_HERO_SHELL_LAYOUT_CLASS;
  return (
    <div className={`${layoutClass} ${borderClass} ${shellFillClass}`}>
      <video
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload={preload}
        className={`absolute inset-0 h-full w-full ${
          objectFit === "contain" ? "object-contain" : "object-cover"
        }`}
        style={{ borderRadius: HERO_VIDEO_RADIUS }}
      />
    </div>
  );
}
