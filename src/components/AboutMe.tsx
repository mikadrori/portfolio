import { useCallback, useEffect, useRef, useState } from "react";
import { PageGrid } from "./PageGrid";
import { Footer } from "./Footer";
import { OrganicLiquidCursor } from "./OrganicLiquidCursor";
import { AboutScene3D, COPY, type AboutObjectId } from "./AboutScene3D";
import { BrushPaintLayer, type BrushPaintLayerHandle } from "./BrushPaintLayer";
import { BrushGlbCursor } from "./BrushGlbCursor";
import { bodyTextClass, navLinkTextClass, sectionTitleCoreClass, smallTitleClass } from "../lib/typography";
import { aboutPtClass, gapAboutXClass, gapAboutYClass } from "../lib/spacing";

/** Tailwind `lg` — paint mode is desktop-only. */
const PAINT_MEDIA = "(min-width: 1024px)";

const introClassMerged =
  "pointer-events-auto w-full self-start mt-1 md:mt-0 font-['Bricolage_Grotesque'] font-semibold text-[length:var(--text-subtitle)] text-[#2200b8] tracking-[1.4px] leading-[1.6] max-md:leading-[1.4]";

const introClassDesktop =
  "pointer-events-auto w-full self-start font-['Bricolage_Grotesque'] font-semibold text-[length:var(--text-subtitle)] text-[#2200b8] tracking-[1.4px] leading-[1.6] max-md:leading-[1.88] lg:col-start-3 lg:col-end-7 lg:row-start-1 lg:mt-1";

/** Same grid as intro; body style when a prop is selected (longer copy). */
const objectCopyInIntroSlotClass = `${bodyTextClass} [text-wrap:pretty] max-md:leading-[1.45] lg:leading-[1.52]`;

const PALETTE_COLORS = [
  ["#2200b8", "#7b1fa2"],
  ["#00bfff", "#ff0090"],
  ["#00897b", "#e53935"],
  ["#7cb342", "#ff6d00"],
  ["#fdd835", "#ffab00"],
  ["#ffffff", "#e0d6c8"],
];

function PalettePicker({
  activeColor,
  onPickColor,
}: {
  activeColor: string;
  onPickColor: (hex: string) => void;
}) {
  return (
    <div
      className="rounded-2xl shadow-lg"
      style={{ background: "#f0ebe1", padding: "12px" }}
    >
      <div className="flex flex-col gap-2.5">
        {PALETTE_COLORS.map((row, ri) => (
          <div key={ri} className="flex gap-5">
            {row.map((hex) => {
              const active = activeColor.toLowerCase() === hex.toLowerCase();
              return (
                <button
                  key={hex}
                  type="button"
                  onClick={() => onPickColor(hex)}
                  aria-label={`Pick color ${hex}`}
                  className="relative size-9 rounded-full transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2200b8]"
                  style={{
                    backgroundColor: hex,
                    boxShadow: active
                      ? `0 0 0 2px #f0ebe1, 0 0 0 4px #2200b8`
                      : "inset 0 1px 3px rgba(0,0,0,0.18)",
                  }}
                >
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function IntroLines() {
  return (
    <>
      I'm Mika, <br /> A 25-year-old Visual
      Communication <br /> student at HIT 3rd year, based in Ramat-Gan.
      <br />
      <span className={smallTitleClass}>Click to get to know me (:</span>
    </>
  );
}

export const AboutMe = ({
  onReady,
  aboutResetSignal = 0,
}: {
  onSelectSection: (id: string) => void;
  onReady?: () => void;
  aboutResetSignal?: number;
}) => {
  const [selectedObjectId, setSelectedObjectId] = useState<AboutObjectId | null>(null);
  const [paintMode, setPaintMode] = useState(false);
  const [paintPointerClient, setPaintPointerClient] = useState<{ x: number; y: number } | null>(null);
  const [brushPaintColor, setBrushPaintColor] = useState("#2200b8");
  const [paletteDocked, setPaletteDocked] = useState(false);
  const [paletteHint, setPaletteHint] = useState(false);
  const [mikaFacingFront, setMikaFacingFront] = useState(false);
  const brushPaintRef = useRef<BrushPaintLayerHandle>(null);

  const [paintCapable, setPaintCapable] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(PAINT_MEDIA).matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(PAINT_MEDIA);
    const onChange = () => setPaintCapable(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!paintCapable) {
      setPaintMode(false);
      setPaintPointerClient(null);
      setPaletteDocked(false);
    }
  }, [paintCapable]);

  const paintActive = paintCapable && paintMode;

  const onPaintEmptyPointerDown = useCallback((e: PointerEvent) => {
    if (!paintActive) return;
    brushPaintRef.current?.beginFromMissedPointer(e);
  }, [paintActive]);

  const onSelectIntro = useCallback(() => {
    setSelectedObjectId(null);
    setMikaFacingFront(true);
  }, []);

  const onSelectObject = useCallback(
    (id: AboutObjectId) => {
      if (paintCapable && id === "palette" && selectedObjectId === "brush" && paintMode) {
        if (!paletteDocked) setPaletteDocked(true);
        return;
      }
      setMikaFacingFront(false);
      setSelectedObjectId((prev) => (prev === id ? null : id));
    },
    [paintCapable, paintMode, paletteDocked, selectedObjectId],
  );

  const liquidCursorOn = !paintActive;

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    if (!aboutResetSignal) return;
    setSelectedObjectId(null);
    setPaintMode(false);
    setPaintPointerClient(null);
    setBrushPaintColor("#2200b8");
    setPaletteDocked(false);
    setPaletteHint(false);
    setMikaFacingFront(false);
  }, [aboutResetSignal]);

  useEffect(() => {
    if (selectedObjectId !== "brush") {
      setPaintMode(false);
      setPaletteDocked(false);
    }
  }, [selectedObjectId]);

  useEffect(() => {
    if (!paintMode) setPaletteDocked(false);
  }, [paintMode]);

  useEffect(() => {
    setPaletteHint(paintCapable && paintMode && !paletteDocked);
  }, [paintCapable, paintMode, paletteDocked]);

  useEffect(() => {
    if (!paintActive) setPaintPointerClient(null);
  }, [paintActive]);

  useEffect(() => {
    if (paintActive) {
      document.body.style.cursor = "none";
    } else {
      document.body.style.cursor = "";
    }
    return () => {
      document.body.style.cursor = "";
    };
  }, [paintActive]);

  useEffect(() => {
    if (!paintActive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPaintMode(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paintActive]);

  return (
    <section className="relative w-full h-[calc(100dvh-56px)] md:h-[calc(100dvh-72px)] overflow-hidden bg-[#fcf7ee]">
      <OrganicLiquidCursor enabled={liquidCursorOn} />
      <BrushGlbCursor active={paintActive} seedClient={paintPointerClient} />
      <BrushPaintLayer ref={brushPaintRef} active={paintActive} brushColor={brushPaintColor} />
      <div className="pointer-events-auto absolute inset-0 z-[18]">
        <AboutScene3D
          onSelectObject={onSelectObject}
          onSelectIntro={onSelectIntro}
          selectedObjectId={selectedObjectId}
          mikaFacingFront={mikaFacingFront}
          hideBrushInScene={paintActive}
          hidePaletteInScene={paletteDocked}
          hintPalette={paletteHint}
          onPaintEmptyPointerDown={paintActive ? onPaintEmptyPointerDown : undefined}
        />
      </div>

      {paintCapable && selectedObjectId === "brush" && (
        <div className="pointer-events-auto absolute bottom-6 right-4 z-[30] mb-[32px] flex w-[116px] flex-col items-center gap-6 md:right-8 md:mb-[52px] xl:mb-[70px]">
          {paletteDocked && (
            <PalettePicker
              activeColor={brushPaintColor}
              onPickColor={setBrushPaintColor}
            />
          )}
          <button
            type="button"
            onClick={(e) => {
              if (paintMode) {
                setPaintPointerClient(null);
                setPaintMode(false);
              } else {
                setPaintPointerClient({ x: e.clientX, y: e.clientY });
                setPaintMode(true);
              }
            }}
            className={`${navLinkTextClass} bg-transparent border-none no-underline transition-all duration-200 ease-out hover:text-[#ff0090] hover:underline hover:font-medium hover:translate-x-0.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2200b8]`}
          >
            {paintMode ? "Done" : "Paint"}
          </button>
        </div>
      )}

      <PageGrid
        className={`pointer-events-none relative z-10 items-start ${gapAboutXClass} ${gapAboutYClass} w-full ${aboutPtClass} pb-24`}
      >
        <h2
          className={`pointer-events-auto col-span-8 md:col-span-2 md:col-start-1 md:row-start-1 self-start ${sectionTitleCoreClass} uppercase whitespace-nowrap`}
        >
          about me
        </h2>

        <p
          aria-live="polite"
          className={
            selectedObjectId
              ? `${objectCopyInIntroSlotClass} col-span-8 md:col-start-3 md:col-end-7 md:row-start-1 mt-1 md:mt-0 lg:hidden`
              : `${introClassMerged} col-span-8 md:col-start-3 md:col-end-7 md:row-start-1 lg:hidden`
          }
        >
          {selectedObjectId ? COPY[selectedObjectId] : <IntroLines />}
        </p>

        <p
          aria-live="polite"
          className={
            selectedObjectId
              ? `${objectCopyInIntroSlotClass} hidden lg:block lg:col-start-3 lg:col-end-7 lg:row-start-1 lg:mt-1`
              : `${introClassDesktop} hidden lg:block`
          }
        >
          {selectedObjectId ? COPY[selectedObjectId] : <IntroLines />}
        </p>
      </PageGrid>

      <div className="absolute bottom-0 left-0 right-0 z-20">
        <Footer />
      </div>
    </section>
  );
};
