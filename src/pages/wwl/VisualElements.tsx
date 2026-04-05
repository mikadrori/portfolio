import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cloudinaryUrl } from "../../lib/cloudinary";
import { smallTitleClass, bodyTextClass } from "../../lib/typography";

const Q = "auto:best";

interface VisualElement {
  title: string;
  desc: string;
  imageId: string;
}

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
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
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
    <div className="flex flex-col gap-4">
      {/* Preview area — invisible sizer reserves space */}
      <div className="relative" style={{ zIndex: 2 }}>
        <div className="invisible">
          <div className="flex flex-col items-center gap-2 pt-2 md:pt-4">
            <div className="max-w-[50%] md:max-w-[55%] lg:max-w-[60%] w-full aspect-video" />
            <div className="max-w-[50%] md:max-w-[55%] lg:max-w-[60%] w-full">
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
              className="absolute inset-0 flex flex-col items-center gap-2 pt-2 md:pt-4"
            >
              <img
                src={cloudinaryUrl(activeEl.imageId, { quality: Q, width: 900 })}
                alt={activeEl.title}
                className="max-w-[50%] md:max-w-[55%] lg:max-w-[60%] w-full rounded-[4px] object-cover aspect-video"
              />
              <div className="max-w-[50%] md:max-w-[55%] lg:max-w-[60%] w-full text-center">
                <p className={smallTitleClass}>{activeEl.title}</p>
                <p className={`${bodyTextClass} mt-1`}>{activeEl.desc}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Thumbnail strip — overlapping, hover to preview */}
      <div onMouseLeave={onMouseLeave}>
        <div className="flex items-end gap-2">
          {ELEMENTS.map((el, i) => {
            const isDimmed = activeIdx !== null && activeIdx !== i;

            return (
              <div
                key={el.imageId}
                className="cursor-pointer flex-1"
                style={{
                  opacity: isDimmed ? 0.3 : 1,
                  transition: "opacity 0.15s ease",
                }}
                onMouseEnter={() => onMouseEnter(i)}
              >
                <img
                  src={cloudinaryUrl(el.imageId, { quality: Q, width: 400 })}
                  alt={el.title}
                  className="w-full aspect-video object-cover rounded-[2px] pointer-events-none"
                  loading="lazy"
                />
              </div>
            );
          })}
        </div>
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
              className="cursor-pointer rounded-[2px] overflow-hidden"
              style={{
                opacity: isDimmed ? 0.5 : 1,
                transition: "opacity 0.15s ease",
                outline: isActive ? "2px solid currentColor" : "2px solid transparent",
                outlineOffset: -2,
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                onTap(i);
              }}
            >
              <img
                src={cloudinaryUrl(el.imageId, { quality: Q, width: 300 })}
                alt={el.title}
                className="w-full aspect-video object-cover pointer-events-none"
                loading="lazy"
              />
            </div>
          );
        })}
      </div>

      {/* Preview area */}
      <div className="flex-1 min-w-0">
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
                src={cloudinaryUrl(activeEl.imageId, { quality: Q, width: 600 })}
                alt={activeEl.title}
                className="w-full rounded-[4px] object-cover aspect-video"
              />
              <div>
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
