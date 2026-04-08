import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface MuteContextValue {
  muted: boolean;
  toggleMute: () => void;
}

const MuteContext = createContext<MuteContextValue>({
  muted: false,
  toggleMute: () => {},
});

export const useMute = () => useContext(MuteContext);

export function MuteProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(false);
  return (
    <MuteContext.Provider value={{ muted, toggleMute: () => setMuted((m) => !m) }}>
      {children}
    </MuteContext.Provider>
  );
}

/** Viewport-fixed to `document.body` so Framer Motion transforms on section wrappers do not break `position: fixed`. */
export function MuteButton() {
  const { muted, toggleMute } = useMute();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const button = (
    <button
      type="button"
      onClick={toggleMute}
      aria-label={muted ? "Unmute" : "Mute"}
      className="fixed z-[100] w-[30px] h-[30px] rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer pointer-events-auto"
      style={{
        background: "transparent",
        color: "var(--color-accent)",
        right: "max(env(safe-area-inset-right, 0px), clamp(12px, 3vw, 24px))",
        bottom: "max(env(safe-area-inset-bottom, 0px), clamp(12px, 2.5vh, 24px))",
      }}
    >
      {muted ? (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </button>
  );

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  return createPortal(button, document.body);
}
