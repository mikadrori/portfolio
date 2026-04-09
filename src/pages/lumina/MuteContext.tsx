import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { cloudinaryUrl } from "../../lib/cloudinary";

const SOUND_BTN_ON = cloudinaryUrl("sound_btn-on_iiyz1g.svg");
const SOUND_BTN_OFF = cloudinaryUrl("sound_btn-off_mr2zu3.svg");

interface MuteContextValue {
  muted: boolean;
  toggleMute: () => void;
}

const MuteContext = createContext<MuteContextValue>({
  muted: true,
  toggleMute: () => {},
});

export const useMute = () => useContext(MuteContext);

export function MuteProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(true);
  return (
    <MuteContext.Provider value={{ muted, toggleMute: () => setMuted((m) => !m) }}>
      {children}
    </MuteContext.Provider>
  );
}

/** On mobile (< lg): portals into #navbar-mute-slot in the sticky navbar.
 *  On desktop (lg+): fixed to bottom-right via portal to document.body. */
export function MuteButton() {
  const { muted, toggleMute } = useMute();
  const [navSlot, setNavSlot] = useState<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const slot = document.getElementById("navbar-mute-slot");
    setNavSlot(slot);

    if (!slot) return;
    const mql = window.matchMedia("(min-width: 1024px)");
    const update = () => setNavSlot(mql.matches ? null : slot);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  if (!mounted || typeof document === "undefined") return null;

  if (navSlot) {
    return createPortal(
      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "Unmute" : "Mute"}
        className="flex items-center justify-center h-11 w-11 translate-y-[2px] bg-transparent border-none cursor-pointer pointer-events-auto"
      >
        <img
          src={muted ? SOUND_BTN_OFF : SOUND_BTN_ON}
          alt=""
          className="h-9 w-auto object-contain shrink-0 pointer-events-none select-none"
          draggable={false}
          aria-hidden
        />
      </button>,
      navSlot,
    );
  }

  return createPortal(
    <button
      type="button"
      onClick={toggleMute}
      aria-label={muted ? "Unmute" : "Mute"}
      className="fixed z-[100] h-20 w-20 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer pointer-events-auto"
      style={{
        background: "transparent",
        right: "max(env(safe-area-inset-right, 0px), var(--grid-margin, 16px))",
        bottom: "max(env(safe-area-inset-bottom, 0px), clamp(12px, 2.5vh, 24px))",
      }}
    >
      <img
        src={muted ? SOUND_BTN_OFF : SOUND_BTN_ON}
        alt=""
        className="h-[4.25rem] w-auto max-w-[4.75rem] object-contain shrink-0 pointer-events-none select-none"
        draggable={false}
        aria-hidden
      />
    </button>,
    document.body,
  );
}
