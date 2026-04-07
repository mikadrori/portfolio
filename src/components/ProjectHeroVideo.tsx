import type { VideoHTMLAttributes } from "react";

/** Outer wrapper — matches PackUp hero banner. */
export const PROJECT_HERO_VIDEO_SHELL_CLASS = "w-full shrink-0 overflow-hidden";

const HERO_VIDEO_RADIUS = "0px";

const videoClassName = "w-full h-auto";

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
