import { useEffect, useRef, useState } from "react";
import { useMute } from "./MuteContext";

interface AutoPlayVideoProps {
  src: string;
  className?: string;
  alwaysMuted?: boolean;
  /** When true the video keeps its native aspect ratio instead of cropping to fill. */
  nativeFit?: boolean;
}

export function AutoPlayVideo({ src, className = "", alwaysMuted = false, nativeFit = false }: AutoPlayVideoProps) {
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
    <div ref={containerRef} className={`relative rounded-[8px] overflow-hidden ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 skeleton-shimmer-primary z-10" />
      )}
      {visible && (
        <video
          ref={videoRef}
          src={src}
          muted={alwaysMuted || muted}
          loop
          playsInline
          preload="metadata"
          className={`w-full block transition-opacity duration-300 ${nativeFit ? "h-auto" : "h-full object-cover"} ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoadedData={() => setLoaded(true)}
        />
      )}
    </div>
  );
}
