import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cloudinaryUrl } from "../../lib/cloudinary";
import { cn } from "../../lib/utils";
import { smallTitleClass, bodyTextClass } from "../../lib/typography";
import { radiusWwlFrameClass, radiusWwlTightClass } from "../../lib/spacing";

const Q = "auto:best";

interface VisualElement {
  title: string;
  desc: string;
  imageId: string;
}

/** Within the col 3–7 strip, centers preview in cols 4–6 (middle 3/5). Thumbnails stay full width. */
const DESKTOP_PREVIEW_GRID_CLASS =
  "w-full md:grid md:grid-cols-[1fr_minmax(0,3fr)_1fr] md:min-w-0";

/** Dock hover: hovered grows modestly; neighbors shrink (flex-grow). */
const THUMB_FLEX_HOVERED = "flex-[1.5_1_0%]";
const THUMB_FLEX_PEER = "flex-[0.78_1_0%]";

const ELEMENTS: VisualElement[] = [
  { title: "Waves", desc: "The island setting and Cadence's perceived drowning.", imageId: "waves_ltenle_yjple4.jpg" },
  { title: "Smoke", desc: "A subtle hint of the upcoming disaster.", imageId: "smoke_u4cs2y_xtsixa.jpg" },
  { title: "Shore & Polaroid", desc: "A perfect summer slowly being forgotten.", imageId: "polaroid_k9bhsh_mp2get.jpg" },
  { title: "Fire", desc: "The real tragedy that changed everything.", imageId: "fire_n26n1s_hxryyt.jpg" },
  { title: "Floating Objects", desc: "Luxury items showing how wealth caused the conflict.", imageId: "objects_aeyxfh_p2bclj.jpg" },
  { title: "The Hand", desc: "A reference to Gat and his habit of writing on his skin.", imageId: "hand_hfjgoe_zkjeek.jpg" },
];

export function VisualElements() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(0);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const activeIdx = isMobile ? selectedIdx : hoveredIdx;
  const activeEl = activeIdx !== null ? ELEMENTS[activeIdx] : null;


  const handleTap = useCallback((i: number) => {
    setSelectedIdx((prev) => (prev === i ? null : i));
  }, []);

  const handleMouseEnter = useCallback((i: number) => {
    setHoveredIdx(i);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredIdx(null);
  }, []);

  if (isMobile) {
    return <TouchLayout selectedIdx={selectedIdx} onTap={handleTap} />;
  }

  return (
    <DesktopLayout
      activeIdx={activeIdx}
      activeEl={activeEl}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
}

/* ─── Desktop: preview above + overlapping thumbnail strip ─── */

function DesktopLayout({
  activeIdx,
  activeEl,
  onMouseEnter,
  onMouseLeave,
}: {
  activeIdx: number | null;
  activeEl: VisualElement | null;
  onMouseEnter: (i: number) => void;
  onMouseLeave: () => void;
}) {
  return (
    <div className="flex w-full flex-col gap-4 overflow-visible">
      {/* Preview area — centered cols 4–6 on md; captions stay left-aligned to image */}
      <div className={DESKTOP_PREVIEW_GRID_CLASS}>
        <div className="hidden min-w-0 md:block" aria-hidden />
        <div className="relative w-full min-w-0" style={{ zIndex: 2 }}>
          <div className="invisible w-full">
            <div className="flex w-full min-w-0 flex-col items-start gap-2 pt-2 md:pt-4">
              <div className="w-full aspect-video" />
              <div className="w-full text-left">
                <p className={smallTitleClass}>&nbsp;</p>
                <p className={`${bodyTextClass} mt-1`}>&nbsp;</p>
              </div>
            </div>
          </div>
          <AnimatePresence>
            {activeEl && (
              <motion.div
                key={activeEl.imageId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0 } }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex w-full min-w-0 flex-col items-start gap-2 pt-2 md:pt-4"
              >
                <img
                  src={cloudinaryUrl(activeEl.imageId, { quality: Q })}
                  alt={activeEl.title}
                  className={`w-full ${radiusWwlFrameClass} object-cover aspect-video`}
                />
                <div className="w-full text-left">
                  <p className={smallTitleClass}>{activeEl.title}</p>
                  <p className={`${bodyTextClass} mt-1`}>{activeEl.desc}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="hidden min-w-0 md:block" aria-hidden />
      </div>

      {/* Thumbnail strip — fixed-width thumbs, gaps grow on hover to spread */}
      <ThumbStrip
        activeIdx={activeIdx}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    </div>
  );
}

/* ─── Thumbnail strip: measures idle widths, locks them, grows only gaps ─── */

const IDLE_GAP = 13;
const HOVER_GAP = 26;
const HOVERED_SCALE = 1.35;
const PEER_SCALE = 0.92;

function ThumbStrip({
  activeIdx,
  onMouseEnter,
  onMouseLeave,
}: {
  activeIdx: number | null;
  onMouseEnter: (i: number) => void;
  onMouseLeave: () => void;
}) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [thumbWidth, setThumbWidth] = useState<number | null>(null);

  useEffect(() => {
    const measure = () => {
      if (!stripRef.current) return;
      const containerW = stripRef.current.offsetWidth;
      const totalGaps = IDLE_GAP * (ELEMENTS.length - 1);
      setThumbWidth((containerW - totalGaps) / ELEMENTS.length);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const dockActive = activeIdx !== null;
  const gap = dockActive ? HOVER_GAP : IDLE_GAP;

  return (
    <div ref={stripRef} className="w-full overflow-visible" onMouseLeave={onMouseLeave}>
      <div
        className="flex items-center justify-center overflow-visible"
        style={{ gap, transition: "gap 0.35s ease-in" }}
      >
        {ELEMENTS.map((el, i) => {
          const isHovered = activeIdx === i;
          const isDimmed = dockActive && !isHovered;

          return (
            <div
              key={el.imageId}
              className="shrink-0 cursor-pointer"
              style={{
                width: thumbWidth
                  ? dockActive
                    ? isHovered
                      ? thumbWidth * HOVERED_SCALE
                      : thumbWidth * PEER_SCALE
                    : thumbWidth
                  : undefined,
                opacity: isDimmed ? 0.5 : 1,
                transition: "width 0.35s ease-in, opacity 0.2s ease",
              }}
              onMouseEnter={() => onMouseEnter(i)}
            >
              <img
                src={cloudinaryUrl(el.imageId, { quality: Q })}
                alt={el.title}
                className={`aspect-video w-full ${radiusWwlTightClass} object-cover pointer-events-none`}
                loading="lazy"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Touch: vertical thumbnails left + preview right ─── */

function TouchLayout({
  selectedIdx,
  onTap,
}: {
  selectedIdx: number | null;
  onTap: (i: number) => void;
}) {
  const activeEl = selectedIdx !== null ? ELEMENTS[selectedIdx] : null;

  return (
    <div className="flex gap-4">
      {/* Vertical thumbnail column */}
      <div className="flex flex-col gap-2 shrink-0 w-[30%]">
        {ELEMENTS.map((el, i) => {
          const isActive = selectedIdx === i;
          const isDimmed = selectedIdx !== null && !isActive;

          return (
            <div
              key={el.imageId}
              className={`cursor-pointer ${radiusWwlTightClass} overflow-hidden`}
              style={{
                opacity: isDimmed ? 0.5 : 1,
                transform: selectedIdx !== null && !isActive ? "scale(0.88)" : "scale(1)",
                transition: "opacity 0.15s ease, transform 0.25s ease",
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                onTap(i);
              }}
            >
              <img
                src={cloudinaryUrl(el.imageId, { quality: Q })}
                alt={el.title}
                className="w-full aspect-video object-cover pointer-events-none"
                loading="lazy"
              />
            </div>
          );
        })}
      </div>

      {/* Preview area */}
      <div className="flex-1 min-w-0 flex items-center">
        <AnimatePresence>
          {activeEl && (
            <motion.div
              key={activeEl.imageId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0 } }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2"
            >
              <img
                src={cloudinaryUrl(activeEl.imageId, { quality: Q })}
                alt={activeEl.title}
                className={`w-full ${radiusWwlFrameClass} object-cover aspect-video`}
              />
              <div className="text-left">
                <p className={smallTitleClass}>{activeEl.title}</p>
                <p className={`${bodyTextClass} mt-1`}>{activeEl.desc}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
