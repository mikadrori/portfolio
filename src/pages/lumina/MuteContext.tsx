import { createContext, useContext, useState, type ReactNode } from "react";

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

export function MuteButton() {
  const { muted, toggleMute } = useMute();
  return (
    <button
      onClick={toggleMute}
      aria-label={muted ? "Unmute" : "Mute"}
      className="fixed bottom-6 right-6 z-50 w-[30px] h-[30px] rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer"
      style={{ background: "transparent", color: "var(--color-accent)" }}
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
}
