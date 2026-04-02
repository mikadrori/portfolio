import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";

import { cloudinaryUrl } from "../lib/cloudinary";
import { stickyTitleClass, projectNameClass, subTitleClass, smallTitleClass, bodyTextClass } from "../lib/typography";
import { sectionPageGridClass, sectionPageGridStretchClass, sectionColumnPaddingClass } from "../lib/sectionLayout";
import { PageGrid } from "../components/PageGrid";
import { ProjectNav } from "../components/ProjectNav";
import { useDragScroll } from "../hooks/useDragScroll";

const Q = "auto:best";

const HERO_VIDEO = cloudinaryUrl("WLLpromoVID_s8x1if.mp4", { resourceType: "video", quality: Q });
const HERO_POSTER = cloudinaryUrl("WLLpromoVID_s8x1if.jpg", { quality: Q });
const BOOK_COVER = cloudinaryUrl("WWLbook_z0ojgt.png", { quality: Q });
const FINAL_INTRO_VIDEO = cloudinaryUrl("WLLfinalintro_ag05ys.mp4", { resourceType: "video", quality: Q });
const FINAL_INTRO_POSTER = cloudinaryUrl("WWLtypocadence_1_gsc0qn.jpg", { quality: Q, width: 1280 });
const STORYBOARD = cloudinaryUrl("WLLstoryboard_zeemra.png", { quality: Q });

const TYPO_CHARACTERS = [
  { name: "cadence", ids: ["WWLtypocadence_1_gsc0qn.jpg", "WWLtypocadence_2_hsd8ix.jpg", "WWLtypocadence_3_hxwlgw.jpg"] },
  { name: "jhonny", ids: ["WWLtypojhonny_1_x3qec5.jpg", "WWLtypojhonny_2_iaenvq.jpg", "WWLtypojhonny_3_yirz0w.jpg"] },
  { name: "myren", ids: ["WWLtypomyren_1_d10pcc.jpg", "WWLtypomyren_2_yfgqyh.jpg", "WWLtypomyren_3_gi0zu1.jpg"] },
  { name: "gat", ids: ["WWLtypoGat_1_cahhoq.jpg", "WWLtypoGat_2_ixlu44.jpg", "WWLtypoGat_3_z3txqf.jpg"] },
  { name: "end", ids: ["WWLtypoend_1_t1odor.jpg", "WWLtypoend_2_nnx3ey.jpg", "WWLtypoend_3_bi3upj.jpg"] },
];

const VISUAL_ELEMENTS_LEFT = [
  { title: "Waves", desc: "The island setting and Cadence's perceived drowning." },
  { title: "Smoke", desc: "A subtle hint of the upcoming disaster." },
  { title: "Fire", desc: "The real tragedy that changed everything." },
];

const VISUAL_ELEMENTS_RIGHT = [
  { title: "Shore & Polaroid", desc: "A perfect summer slowly being forgotten." },
  { title: "Floating Objects", desc: "Luxury items showing how wealth caused the conflict." },
  { title: "The Hand", desc: "A reference to Gat and his habit of writing on his skin." },
];

function StoryboardCarousel() {
  const { ref, onMouseDown } = useDragScroll();

  return (
    <div ref={ref} onMouseDown={onMouseDown} className="overflow-x-auto scrollbar-hide cursor-grab">
      <img
        src={STORYBOARD}
        alt="Initial storyboard sketches"
        className="h-[150px] md:h-[200px] w-auto max-w-none pointer-events-none"
        loading="lazy"
      />
    </div>
  );
}

const TYPO_OVERLAY_FADE_S = 0.95;
const TYPO_OVERLAY_EASE: [number, number, number, number] = [0.22, 0.61, 0.36, 1];
const TYPO_REMOVE_BASE_AFTER_MS = 1000;
const TYPO_BASE_FADE_OUT_S = 0.55;
const TYPO_BASE_FADE_EASE: [number, number, number, number] = [0.33, 1, 0.68, 1];
const TYPO_VARIANT_INTERVAL_MS = 2400;

function TypographyCarousel() {
  const [baseIdx, setBaseIdx] = useState(0);
  const [overlayIdx, setOverlayIdx] = useState<number | null>(null);
  const [fadeBaseOut, setFadeBaseOut] = useState(false);
  const baseIdxRef = useRef(0);
  const removeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const removalScheduledRef = useRef(false);
  const pendingIncomingRef = useRef(0);
  const { ref, onMouseDown } = useDragScroll();

  baseIdxRef.current = baseIdx;

  const idle = overlayIdx === null && !fadeBaseOut;

  useEffect(() => {
    if (!idle) return;
    const id = setInterval(() => {
      const next = (baseIdxRef.current + 1) % 3;
      setOverlayIdx(next);
    }, TYPO_VARIANT_INTERVAL_MS);
    return () => clearInterval(id);
  }, [idle]);

  useEffect(() => {
    if (overlayIdx === null && !fadeBaseOut) {
      removalScheduledRef.current = false;
      if (removeTimeoutRef.current) {
        clearTimeout(removeTimeoutRef.current);
        removeTimeoutRef.current = null;
      }
    }
  }, [overlayIdx, fadeBaseOut]);

  useEffect(
    () => () => {
      if (removeTimeoutRef.current) clearTimeout(removeTimeoutRef.current);
    },
    []
  );

  const scheduleFadeOutBase = useCallback((incomingIdx: number) => {
    if (removalScheduledRef.current) return;
    removalScheduledRef.current = true;
    pendingIncomingRef.current = incomingIdx;
    removeTimeoutRef.current = setTimeout(() => {
      removeTimeoutRef.current = null;
      setFadeBaseOut(true);
    }, TYPO_REMOVE_BASE_AFTER_MS);
  }, []);

  const finishBaseTransition = useCallback(() => {
    setBaseIdx(pendingIncomingRef.current);
    setOverlayIdx(null);
    setFadeBaseOut(false);
    removalScheduledRef.current = false;
  }, []);

  return (
    <div ref={ref} onMouseDown={onMouseDown} className="overflow-x-auto scrollbar-hide cursor-grab">
      <div className="flex gap-6 md:gap-20 w-max pr-[20%]">
        {TYPO_CHARACTERS.map((char, slideIndex) => (
          <div
            key={char.name}
            className="relative w-[52vw] md:w-[720px] aspect-[898/505] shrink-0 overflow-hidden rounded-sm"
          >
            <motion.img
              key={`${char.name}-base-${baseIdx}`}
              src={cloudinaryUrl(char.ids[baseIdx], { quality: Q })}
              alt={`${char.name} typography variant ${baseIdx + 1}`}
              initial={{ opacity: 1 }}
              animate={{ opacity: fadeBaseOut ? 0 : 1 }}
              transition={{
                duration: fadeBaseOut ? TYPO_BASE_FADE_OUT_S : 0,
                ease: fadeBaseOut ? TYPO_BASE_FADE_EASE : TYPO_OVERLAY_EASE,
              }}
              onAnimationComplete={() => {
                if (slideIndex !== 0 || !fadeBaseOut) return;
                finishBaseTransition();
              }}
              className="absolute inset-0 z-0 h-full w-full object-cover pointer-events-none"
              loading="lazy"
            />
            {overlayIdx !== null && (
              <motion.img
                key={`${char.name}-overlay-${overlayIdx}`}
                src={cloudinaryUrl(char.ids[overlayIdx], { quality: Q })}
                alt={`${char.name} typography variant ${overlayIdx + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: TYPO_OVERLAY_FADE_S, ease: TYPO_OVERLAY_EASE }}
                onAnimationComplete={() => {
                  if (slideIndex === 0) scheduleFadeOutBase(overlayIdx);
                }}
                className="absolute inset-0 z-10 h-full w-full object-cover pointer-events-none"
                loading="lazy"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface WeWereLiarsProps {
  onSelectSection: (id: string) => void;
  onReady?: () => void;
}

export default function WeWereLiars({ onSelectSection, onReady }: WeWereLiarsProps) {
  const readyFired = useRef(false);

  const signalReady = useCallback(() => {
    if (readyFired.current) return;
    readyFired.current = true;
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    const img = new Image();
    img.src = HERO_POSTER;
    if (img.complete) {
      signalReady();
    } else {
      img.onload = signalReady;
      img.onerror = signalReady;
    }
  }, [signalReady]);

  return (
    <div className="flex flex-col">
      {/* Hero + Concept combined = min 100vh */}
      <div className="min-h-screen flex flex-col">
        {/* Hero Video Banner */}
        <div className="w-full h-[300px] md:h-[500px] shrink-0 overflow-hidden">
          <video
            src={HERO_VIDEO}
            poster={HERO_POSTER}
            preload="auto"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        {/* Divider */}
        <div className="w-full h-px shrink-0 bg-[#2200b8]" />

        {/* CONCEPT Section */}
        <section className="flex-1 flex flex-col justify-center">
          <PageGrid className={sectionPageGridClass}>
            <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
              <h2 className={`${stickyTitleClass} leading-[1.5]`}>
                Concept
              </h2>
            </div>
            <div className={`col-span-8 md:col-span-4 md:col-start-3 flex flex-col gap-2 ${sectionColumnPaddingClass}`}>
              <h3 className={`${projectNameClass} leading-[1.5]`}>
                We Were Liars
              </h3>
              <p className={`${smallTitleClass} leading-[1.5]`}>
                Book intro
              </p>
              <p className={bodyTextClass}>
                This project is a cinematic intro for the book We Were Liars. It follows the Sinclairs, a wealthy
                family spending summers on their private island, where four friends{" "}
                <span className="font-medium">rebel against the family's greed.</span>{" "}
                The story centers on Cadence, who struggles with memory loss and chronic pain following
                a mysterious accident as she uncovers the truth of that summer.
              </p>
            </div>
            <div className={`col-span-4 md:col-span-1 md:col-start-7 flex justify-center md:justify-start ${sectionColumnPaddingClass}`}>
              <img
                src={BOOK_COVER}
                alt="We Were Liars book cover"
                className="w-[120px] md:w-[140px] rounded-[10px] object-cover"
              />
            </div>
          </PageGrid>
        </section>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#2200b8]" />

      {/* FINAL INTRO Section */}
      <section>
        <PageGrid className={sectionPageGridClass}>
          <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
            <h2 className={stickyTitleClass}>Final Intro</h2>
          </div>
          <div className={`col-span-8 md:col-span-5 md:col-start-3 ${sectionColumnPaddingClass}`}>
            <div className="w-full aspect-video">
              <video
                src={FINAL_INTRO_VIDEO}
                poster={FINAL_INTRO_POSTER}
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-contain bg-black rounded-sm"
              />
            </div>
          </div>
        </PageGrid>
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-[#2200b8]" />

      {/* DESIGN Section — single PageGrid so the sticky title shares one tall row with all content (md+) */}
      <section>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>
              Design
            </h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-12 md:gap-16 ${sectionColumnPaddingClass}`}>
            <div>
              <h3 className={`${subTitleClass} leading-none`}>Initial Story Board</h3>
            </div>

            <div className="overflow-hidden">
              <StoryboardCarousel />
            </div>

            <p className={bodyTextClass}>
              My first thought was sea, waves, fire, and smoke. While I initially considered including characters,
              I later chose to represent them only through hints—a photo, decorative objects, and a hand.
            </p>

            {/* Visual Elements */}
            <div className="flex flex-col gap-2">
              <h3 className={subTitleClass}>Visual Elements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
                <div className="flex flex-col gap-6">
                  {VISUAL_ELEMENTS_LEFT.map((el) => (
                    <div key={el.title} className="flex flex-col gap-1">
                      <p className={smallTitleClass}>
                        {el.title}
                      </p>
                      <p className={bodyTextClass}>{el.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-6">
                  {VISUAL_ELEMENTS_RIGHT.map((el) => (
                    <div key={el.title} className="flex flex-col gap-1">
                      <p className={smallTitleClass}>
                        {el.title}
                      </p>
                      <p className={bodyTextClass}>{el.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="flex flex-col gap-2">
              <h3 className={subTitleClass}>Typography</h3>
              <p className={bodyTextClass}>
                To evoke memory loss, I used blur and glare on the text. The titles appear and disappear, creating
                a sense of uncertainty - as if they are "there but not really there."
              </p>
            </div>

            <div className="overflow-hidden">
              <TypographyCarousel />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className={subTitleClass}>Video & Editing</h3>
              <p className={bodyTextClass}>
                I combined stock footage, a Veo-generated video, and my own shots. To ensure a uniform
                look,<br /> I used smooth, blurry transitions to create a sense of flow and lack of clarity.
              </p>
            </div>
          </div>
        </PageGrid>
      </section>

      {/* Next Project */}
      <ProjectNav currentProject="wwl" onSelectSection={onSelectSection} />
    </div>
  );
}
