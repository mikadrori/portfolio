import type { VideoHTMLAttributes } from "react";

/**
 * Full-width project hero: aspect-ratio strip, purple→lavender gradient, primary top/bottom rules.
 * Media should fill the strip with object-cover (see ProjectHeroVideo).
 */
export const PROJECT_HERO_VIDEO_SHELL_CLASS = [
  "relative w-full shrink-0 overflow-hidden",
  "aspect-[1920/507] max-h-[var(--project-hero-max-h)]",
  "border-y border-[#2200b8]",
  "bg-gradient-to-r from-[#8E94F2] to-[#E8EAF6]",
].join(" ");

const HERO_VIDEO_RADIUS = "0px";

const videoClassName = "absolute inset-0 h-full w-full object-cover";

type ProjectHeroVideoProps = {
  src: string;
  poster: string;
} & Pick<VideoHTMLAttributes<HTMLVideoElement>, "preload">;

export function ProjectHeroVideo({ src, poster, preload = "auto" }: ProjectHeroVideoProps) {
  return (
    <div className={PROJECT_HERO_VIDEO_SHELL_CLASS}>
      <video
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload={preload}
        className={videoClassName}
        style={{ borderRadius: HERO_VIDEO_RADIUS }}
      />
    </div>
  );
}
