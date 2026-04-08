import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useMute } from "./MuteContext";

/** Clips decoded video (and outer frame) to 12px corners; `border-radius` alone often fails on `<video>`. */
export const VIDEO_CORNER_CLIP_12: CSSProperties = {
  clipPath: "inset(0 round 12px)",
  WebkitClipPath: "inset(0 round 12px)",
};

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
  /** When true, no inner rounded/overflow wrapper — use a parent with `VIDEO_CORNER_CLIP_12` (or similar). */
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
    <div
      ref={containerRef}
      className={`relative ${unframed ? "min-h-0" : "rounded-[12px] overflow-hidden"} ${containFit ? "min-h-0" : ""} ${className}`}
    >
      {!loaded && (
        <div
          className={`absolute inset-0 z-10 ${
            unframed ? "bg-[var(--color-bg)]" : "skeleton-shimmer-primary"
          }`}
          style={containFit && !unframed ? VIDEO_CORNER_CLIP_12 : undefined}
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
              ? { ...VIDEO_CORNER_CLIP_12, backgroundColor: "var(--color-bg)" }
              : undefined
          }
          className={`w-full block transition-opacity duration-300 ${
            containFit ? "" : "rounded-[12px]"
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
