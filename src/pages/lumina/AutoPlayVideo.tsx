import { useEffect, useRef } from "react";
import { useMute } from "./MuteContext";

interface AutoPlayVideoProps {
  src: string;
  className?: string;
  alwaysMuted?: boolean;
}

export function AutoPlayVideo({ src, className = "", alwaysMuted = false }: AutoPlayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { muted } = useMute();

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = alwaysMuted || muted;
  }, [muted, alwaysMuted]);

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
  }, []);

  return (
    <div className={`rounded-[8px] overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover block"
      />
    </div>
  );
}
