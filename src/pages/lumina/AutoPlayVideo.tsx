import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useMute } from "./MuteContext";
import { radiusVideoInlineClass } from "../../lib/spacing";

/** Clips decoded video; radius matches `--radius-video-inline` (border-radius alone often fails on `<video>`). */
export const videoCornerClipInlineStyle: CSSProperties = {
  clipPath: "inset(0 round var(--radius-video-inline))",
  WebkitClipPath: "inset(0 round var(--radius-video-inline))",
};

/** @deprecated Use `videoCornerClipInlineStyle` — kept for existing imports. */
export const VIDEO_CORNER_CLIP_12 = videoCornerClipInlineStyle;

interface AutoPlayVideoProps {
  src: string;
  className?: string;
  alwaysMuted?: boolean;
  /** When true the video keeps its native aspect ratio instead of cropping to fill. */
  nativeFit?: boolean;
  /** When true the video fits inside the container without cropping. */
  containFit?: boolean;
  /**
   * With `containFit`: `contain` letterboxes; `cover` fills the frame (may crop edges).
   */
  containMode?: "contain" | "cover";
  /** When true no inner rounded/overflow wrapper — use a parent with `videoCornerClipInlineStyle` (or similar). */
  unframed?: boolean;
}

export function AutoPlayVideo({
  src,
  className = "",
  alwaysMuted = false,
  nativeFit = false,
  containFit = false,
  containMode = "contain",
  unframed = false,
}: AutoPlayVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { muted } = useMute();
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const frameClass = unframed ? "min-h-0" : `${radiusVideoInlineClass} overflow-hidden`;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          v.play().catch(() => {});
        } else if (!v.paused) {
          v.pause();
        }
      },
      { threshold: 0.9 },
    );
    observer.observe(v);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div ref={containerRef} className={`relative ${frameClass} ${containFit ? "min-h-0" : ""} ${className}`}>
      {!loaded && (
        <div
          className={`absolute inset-0 z-10 ${
            unframed ? "bg-[var(--color-bg)]" : "skeleton-shimmer-primary"
          }`}
          style={containFit && !unframed ? videoCornerClipInlineStyle : undefined}
        />
      )}
      {visible && (
        <video
          ref={videoRef}
          src={src}
          muted={alwaysMuted || muted}
          loop
          playsInline
          preload="metadata"
          style={
            containFit
              ? { ...videoCornerClipInlineStyle, backgroundColor: "var(--color-bg)" }
              : undefined
          }
          className={`w-full block transition-opacity duration-300 ${
            containFit ? "" : radiusVideoInlineClass
          } ${
            nativeFit
              ? "h-auto"
              : containFit
                ? containMode === "cover"
                  ? "h-full min-h-0 w-full object-cover object-center [transform:translateZ(0)]"
                  : "h-full min-h-0 w-full object-contain object-center [transform:translateZ(0)]"
                : "h-full object-cover"
          } ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoadedData={() => setLoaded(true)}
        />
      )}
    </div>
  );
}
