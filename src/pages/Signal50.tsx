import { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "motion/react";

import {
  stickyTitleClass,
  projectHeroNameClass,
  subTitleClass,
  smallTitleClass,
  bodyTextClass,
} from "../lib/typography";
import {
  sectionPageGridStretchClass,
  sectionColumnPaddingClass,
} from "../lib/sectionLayout";
import {
  gapContentClass,
  gapSubtitleClass,
  gapIntroClass,
  gapTightStripClass,
} from "../lib/spacing";
import { PageGrid } from "../components/PageGrid";
import { MobileStickyTitle, TITLE_COL_DESKTOP_CLASS } from "../components/MobileStickyTitle";
import { IntroToggle } from "../components/IntroToggle";
import { ProjectHeroVideo } from "../components/ProjectHeroVideo";
import { ProjectNav } from "../components/ProjectNav";
import { useDragScroll } from "../hooks/useDragScroll";
import { usePaletteBarsReveal } from "../hooks/usePaletteBarsReveal";
import { cloudinaryUrl } from "../lib/cloudinary";

const SIGNAL50_SUBTITLE = "Bringing the noise back home";

const HERO_VIDEO = cloudinaryUrl("Signal50/signal50_AIlogoIDVID_vlrb0x.mp4", {
  resourceType: "video",
});

/** Overview showreel — wider than Deliverables (page cols 2–7). */
const SHOWREEL_VIDEO = cloudinaryUrl("Signal50/signal50_ShowreelVID_en96qk.mp4", {
  resourceType: "video",
});
const SHOWREEL_VIDEO_ID = "Signal50/signal50_ShowreelVID_en96qk.mp4";
/** Near-end cover still (~30s clip). */
const SHOWREEL_POSTER_AT = 20;

const SIGNAL50_INTRO_TAGS = ["Brand Identity", "On-Screen Graphics", "Solo Project"] as const;

const SIGNAL50_BRIEF =
  "Full on-screen broadcast branding for a major channel / live event";

const SIGNAL50_CONCEPT =
  "A cultural tribute celebrating 50 years of Israeli rock across five decades — from the 1970s to the 2010s, positioning raw music history as a living national monument through a milestone awards ceremony.";

const SIGNAL50_TOOLS = [
  "Adobe After Effects",
  "Adobe Premiere",
  "Adobe Photoshop",
  "Adobe Firefly",
  "Veo",
  "Suno",
] as const;

const BRAND_IDENTITY_IMAGE = cloudinaryUrl("Signal50/Signal50_BrandIdentity_jyxczs.jpg");

/** Eight Initial Sketches cells (logosketches1_1–8); circular #9 removed. */
const LOGO_SKETCHES = [
  "Signal50/logo sketches/signal50_logosketches1_1_jqyfqe.png",
  "Signal50/logo sketches/signal50_logosketches1_2_t7wct3.png",
  "Signal50/logo sketches/signal50_logosketches1_3_ssvhoq.png",
  "Signal50/logo sketches/signal50_logosketches1_4_xqwsn3.png",
  "Signal50/logo sketches/signal50_logosketches1_5_f4uiyw.png",
  "Signal50/logo sketches/signal50_logosketches1_6_urftqh.png",
  "Signal50/logo sketches/signal50_logosketches1_7_egy8ci.png",
  "Signal50/logo sketches/signal50_logosketches1_8_ybbfgo.png",
].map((id) => cloudinaryUrl(encodeURI(id)));

/** Final Logo process: sketch1 → sketch2 → black mark, then white lockup on #000000. */
const FINAL_LOGO_PROCESS = [
  "Signal50/signal50_logosketch1_ys9i7u.png",
  "Signal50/signal50_logosketch2_resvpd.jpg",
  "Signal50/signal50_logoBlack_ix2mmy.png",
].map((id) => cloudinaryUrl(id));

const FINAL_LOGO_WHITE = cloudinaryUrl("Signal50/signal50_logo_slogen_pb3i1s.svg");
const SIGNAL50_BLACK = "#000000";

/** Visual research moodboard — 20 images in original screenshot order (4×5). */
const INSPIRATIONS = [
  "Signal50/Insparations/signal50_insparations-8_gpmxzp.png", // sawblade / Mashina 1995
  "Signal50/Insparations/signal50_insparations-5_ytmmzs.png", // grainy face + red text
  "Signal50/Insparations/signal50_insparations-7_roaibm.png", // pink Mashina live
  "Signal50/Insparations/signal50_insparations-2_yc9m00.png", // yellow Eifa stage
  "Signal50/Insparations/signal50_insparations_ky6aq8.png", // Benzin blue/yellow
  "Signal50/Insparations/signal50_insparations-6_cgy4ze.png", // red vortex
  "Signal50/Insparations/signal50_insparations-1_af1ddn.png", // constructivist geometry
  "Signal50/Insparations/signal50_insparations-10_vzipa6.png", // ISRAEL rainbow arc
  "Signal50/Insparations/signal50_insparations-9_lc7yaj.png", // israel vertical bars
  "Signal50/Insparations/signal50_insparations-11_kxpjrp.png", // Mifgash Jerusalem 76
  "Signal50/Insparations/signal50_insparations-17_fxdqbq.png", // PHOTON
  "Signal50/Insparations/signal50_insparations-18_jqgqiu.png", // Scotch VHS
  "Signal50/Insparations/signal50_insparations-19_kcflpr.png", // COSMAG VHS
  "Signal50/Insparations/signal50_insparations-4_xw0dzl.png", // Artrosil B1
  "Signal50/Insparations/signal50_insparations-3_cwcoun.png", // op-art waves
  "Signal50/Insparations/signal50_insparations-14_weze6a.png", // psychodelic sound
  "Signal50/Insparations/signal50_insparations-13_vbfxde.png", // Exotic Moog
  "Signal50/Insparations/signal50_insparations-15_kelrqg.png", // Toshiba / synth hand
  "Signal50/Insparations/signal50_insparations-16_hji4oj.png", // .50 CAL eye
  "Signal50/Insparations/signal50_insparations-12_ddlteh.png", // radiating silhouette
].map((id) => cloudinaryUrl(id));

/** Logo inspirations — 10 images in 2×5 (original 9 + new -9). */
const LOGO_INSPIRATIONS = [
  "Signal50/Insparations/signal50_LogoInsparations_jn3h9l.png", // circular jagged mark
  "Signal50/Insparations/signal50_LogoInsparations-1_ri66rc.png", // brush Hebrew
  "Signal50/Insparations/signal50_LogoInsparations-6_bnb715.png", // CRETE
  "Signal50/Insparations/signal50_LogoInsparations-8_ssb5oa.png", // REJECTED
  "Signal50/Insparations/signal50_LogoInsparations-7_xdqe3e.png", // THE SUBURB
  "Signal50/Insparations/signal50_LogoInsparations-9_bly6fh.png", // רוק / yellow X
  "Signal50/Insparations/signal50_LogoInsparations-4_reuwvg.png", // INSOMNIA
  "Signal50/Insparations/signal50_LogoInsparations-3_cqgtab.png", // THREAD Heads
  "Signal50/Insparations/signal50_LogoInsparations-5_qtvqfx.png", // MR HAND
  "Signal50/Insparations/signal50_LogoInsparations-2_xcei9e.png", // dripping R
].map((id) => cloudinaryUrl(id));

const INSPIRATIONS_BODY =
  "Drawing inspiration from the 1960s through the 1990s, the visual research explores record covers, film packaging, music videos, era-defining photo filters, and kinetic art. Particular focus was placed on Israeli culture during these decades, analyzing iconic Israeli rock album covers and vintage graphic design posters.";

const LOGO_INSPIRATIONS_BODY =
  "For the logotype, the goal was to create a bold, raw, hand-drawn mark. Something striking, authentic, and unapologetically powerful.";

const TYPOGRAPHY_SVG = cloudinaryUrl("signal50_typography_rbguqy.svg");
const TYPOGRAPHY_SVG_ASPECT = "683 / 544";

/** Signal 50 only — video loading shells (`#252525`, not the shared navy shimmer). */
const SIGNAL50_VIDEO_SKELETON_CLASS = "bg-[#252525]";

/** Hexes from `signal50_colorpallete` (left → right). */
const SIGNAL50_COLOR_PALETTE = [
  "#000000",
  "#63008D",
  "#FF0004",
  "#00FFE1",
  "#C6FF00",
] as const;

/** Bright swatches need dark hex labels. */
const SIGNAL50_PALETTE_DARK_LABEL = new Set<string>(["#00FFE1", "#C6FF00"]);

/** Bar height by index distance from hovered swatch (same rings as MuchiWaze). */
const PALETTE_HOVER_HEIGHT_BY_DISTANCE = [
  "100%", // d=0
  "76%", // d=1
  "54%", // d=2
  "38%", // d=3
  "26%", // d=4
] as const;

/** Decade archive clips (70→10) — one column each under the palette. */
const DECADE_VIDEOS = [
  "Signal50/shortvid_70_1_btz0jy.mp4",
  "Signal50/shortvid_80_1_snsj6s.mp4",
  "Signal50/shortvid_90_1_fdxy3q.mp4",
  "Signal50/shortvid_00_1_ubtoko.mp4",
  "Signal50/shortvid_10_1_qp87qq.mp4",
] as const;

const COLOR_PALETTE_BODY =
  "I used authentic archive performance clips filmed during each band's nominated decade, unifying them into a cohesive language through the color palette.";

const GRID_SYSTEM_BODY =
  "Vinyl-inspired geometry utilizing center lines, diagonals, and concentric circles to create rhythm and mirror the pulse of a vibrating speaker.";

const COMMERCIAL_PROMO_BODY =
  "For the Logo ID promo, I created a nostalgic Israeli living room journey filled with 1970s to 2010s music references. Using eight keyframes, I generated smooth scene transitions, edited the sequence, and added custom audio.";

const STAGE_MOCKUP_REST = cloudinaryUrl("Signal50/signal50_mockup_2_wn8ml5.png");
const STAGE_MOCKUP_HOVER = cloudinaryUrl("Signal50/signal50_mockup_1_rselkx.png");

const GRID_SYSTEM_VIDEO = cloudinaryUrl("Signal50/signal50_gridVID_lugyic.mp4", {
  resourceType: "video",
});

/** Vertical stack beside the grid video (page col 3); video spans cols 4–7. */
const GRID_INSPIRATIONS = [
  "Signal50/Insparations/signal50_gridInsparations_rpx5nq.png",
  "Signal50/Insparations/signal50_gridInsparations-1_r1oysc.png",
  "Signal50/Insparations/signal50_gridInsparations-2_sod7xt.png",
].map((id) => cloudinaryUrl(id));

const MOTION_ASSETS = [
  {
    title: "Logo ID",
    video: "Signal50/signal50_logoIDVID_sefadx.mp4",
    /** Near-end cover (not first frame). Durations ~12 / 19 / 29 / 20 / 29s. */
    posterAt: 9,
  },
  {
    title: "Stage Teaser",
    video: "Signal50/signal50_stageVID_msii0s.mp4",
    posterAt: 15,
  },
  {
    title: "Nominee Sequence",
    video: "Signal50/signal50_NomineeVID_sv6304.mp4",
    posterAt: 24,
  },
  {
    title: "Winner Announcement",
    video: "Signal50/signal50_winnerVID_grqbpk.mp4",
    posterAt: 16,
  },
  {
    title: "Logo ID (Commercial Promo)",
    video: "Signal50/signal50_AIlogoIDVID_vlrb0x.mp4",
    posterAt: 24,
  },
] as const;

/** Commercial Promo storyboard — 8 frames in reading order 1–8. */
const COMMERCIAL_STORYBOARD = [
  "Signal50/signal50_AiFrame_1_nvc47m.jpg",
  "Signal50/signal50_AiFrame_2_ogo0am.jpg",
  "Signal50/signal50_AiFrame_3_bu5wmy.jpg",
  "Signal50/signal50_AiFrame_4_stffjc.jpg",
  "Signal50/signal50_AiFrame_6_hkg7p0.jpg",
  "Signal50/signal50_AiFrame_5_ckyevc.jpg",
  "Signal50/signal50_AiFrame_7_rwmdwh.jpg",
  "Signal50/signal50_AiFrame_8_ufwozw.jpg",
].map((id) => cloudinaryUrl(id));

/** Storyboard slides — smaller than OGEN HiFi so ~3 frames show on desktop. */
const storyboardSlideClass =
  "w-[60vw] md:w-[calc((100vw-2*var(--grid-margin)-2*var(--grid-gutter))/3)] shrink-0";

/** Source frames — horizontal drag carousel (OGEN HiFi / Aviv KeyFeatures pattern). */
function CommercialStoryboardCarousel() {
  const { ref, onMouseDown } = useDragScroll();

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      className="min-w-0 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none"
      data-signal50-commercial-storyboard=""
      aria-label="Commercial Promo source frames"
    >
      <div className={`flex ${gapTightStripClass} w-max`}>
        {COMMERCIAL_STORYBOARD.map((src, i) => {
          const n = String(i + 1).padStart(2, "0");
          return (
            <div
              key={src}
              className={`flex flex-col gap-2 ${storyboardSlideClass}`}
            >
              <p className={`${smallTitleClass} select-none`}>{n}</p>
              <div className="relative w-full aspect-video overflow-hidden rounded-sm bg-black">
                <img
                  src={src}
                  alt={`Source frame ${n}`}
                  className="absolute inset-0 h-full w-full object-cover pointer-events-none"
                  draggable={false}
                  loading="lazy"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME || "dmrtjbfbb";
const useLocalAssets =
  import.meta.env.DEV && import.meta.env.VITE_USE_CLOUDINARY !== "true";

/** Cover still from a near-end frame (Cloudinary `so_`), or local `*_poster.jpg` in DEV. */
function signal50VideoPoster(videoPublicId: string, atSeconds: number): string {
  const bare = videoPublicId.replace(/\.(mp4|webm|mov)$/i, "");
  if (useLocalAssets) {
    return `/assets/${bare}_poster.jpg`;
  }
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/so_${atSeconds},f_jpg,q_auto,w_1280/${bare}.jpg`;
}

/** Scroll-reveal scaleY + distance-based hover (MuchiWaze palette pattern). */
function Signal50ColorPalette() {
  const containerRef = useRef<HTMLDivElement>(null);
  const showBars = usePaletteBarsReveal(containerRef);
  const [hovered, setHovered] = useState<number | null>(null);
  const isTouchRef = useRef(false);

  const ariaLabel = `Signal 50 color palette: ${SIGNAL50_COLOR_PALETTE.join(", ")}`;

  const barScaleY = (i: number) => {
    if (!showBars) return 0;
    if (hovered === null) return 1;
    const d = Math.abs(i - hovered);
    const pct = PALETTE_HOVER_HEIGHT_BY_DISTANCE[d] ?? PALETTE_HOVER_HEIGHT_BY_DISTANCE[PALETTE_HOVER_HEIGHT_BY_DISTANCE.length - 1];
    return parseFloat(pct) / 100;
  };

  return (
    <div
      ref={containerRef}
      className="grid h-full w-full min-w-0 grid-cols-5 gap-x-[var(--grid-gutter)]"
      role="img"
      aria-label={ariaLabel}
      data-signal50-palette-bars=""
      onMouseLeave={() => { if (!isTouchRef.current) setHovered(null); }}
    >
      {SIGNAL50_COLOR_PALETTE.map((hex, i) => (
        <div
          key={hex}
          className="relative min-h-0 w-full overflow-hidden rounded-none"
          onMouseEnter={() => { if (!isTouchRef.current) setHovered(i); }}
          onTouchStart={() => { isTouchRef.current = true; }}
          onClick={() => { if (isTouchRef.current) setHovered((prev) => (prev === i ? null : i)); }}
        >
          <motion.div
            className="absolute inset-0 rounded-none"
            style={{
              backgroundColor: hex,
              transformOrigin: "center bottom",
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: barScaleY(i) }}
            transition={{
              duration: hovered === null ? 0.8 : 0.35,
              ease: "easeIn",
            }}
          />
          <motion.span
            className={`pointer-events-none absolute bottom-2 left-0 right-0 z-10 text-center font-['Bricolage_Grotesque'] font-light leading-none tracking-[0.7px] text-[6px] sm:text-xs md:text-[clamp(9px,2.4vw,12px)] lg:text-[9px] xl:text-xs ${
              SIGNAL50_PALETTE_DARK_LABEL.has(hex) ? "text-black" : "text-white"
            }`}
            initial={{ opacity: 0 }}
            animate={showBars ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {hex}
          </motion.span>
        </div>
      ))}
    </div>
  );
}

function Signal50Typography() {
  return (
    <div
      className="w-full min-w-0 overflow-hidden"
      style={{ aspectRatio: TYPOGRAPHY_SVG_ASPECT }}
      data-signal50-typography=""
    >
      <img
        src={TYPOGRAPHY_SVG}
        alt="Signal 50 typography"
        className="h-full w-full object-contain object-left"
        loading="lazy"
      />
    </div>
  );
}

/**
 * Same 5-col track as Visual Language content (page cols 3–7):
 * palette → end of col 5, `signal50_typography_rbguqy` on cols 6–7.
 * Bars stretch to type height.
 */
function Signal50PaletteAndTypography() {
  return (
    <div
      className="grid grid-cols-5 items-stretch gap-x-[var(--grid-gutter)]"
      data-signal50-palette-typo=""
    >
      <div className="relative col-span-3 min-w-0">
        <div className="absolute inset-0">
          <Signal50ColorPalette />
        </div>
      </div>
      <div className="col-span-2 min-w-0">
        <Signal50Typography />
      </div>
    </div>
  );
}

/** Simple continuous process arrow between logo stages. */
function ProcessArrow() {
  return (
    <svg
      className="h-5 w-10 sm:w-14 md:w-16 shrink-0 text-[#2200b8]"
      viewBox="0 0 64 20"
      fill="none"
      aria-hidden
    >
      <path
        d="M2 10H54M54 10L46 4M54 10L46 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Final Logo process strip (full content width).
 * Equal stage cells + fixed arrows; hover uses GPU scale only (no flex reflow).
 */
function FinalLogoProcess() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      className="grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-2 sm:gap-x-4 py-6 overflow-visible"
      data-signal50-final-logo-process=""
      onMouseLeave={() => setHovered(null)}
    >
      {FINAL_LOGO_PROCESS.flatMap((src, i) => {
        const stage = (
          <button
            key={`stage-${i}`}
            type="button"
            className="relative flex aspect-square w-full max-h-[160px] mx-auto items-center justify-center overflow-visible bg-transparent p-0 border-0 cursor-pointer"
            onMouseEnter={() => setHovered(i)}
            aria-label={`Signal 50 logo process step ${i + 1}`}
          >
            <img
              src={src}
              alt={`Signal 50 logo process step ${i + 1}`}
              className="max-h-full max-w-full object-contain pointer-events-none will-change-transform"
              style={{
                transform:
                  hovered === null
                    ? "scale(1)"
                    : hovered === i
                      ? "scale(1.2)"
                      : "scale(0.85)",
                opacity: hovered === null || hovered === i ? 1 : 0.45,
                transition:
                  "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease",
              }}
              loading="lazy"
            />
          </button>
        );
        if (i === FINAL_LOGO_PROCESS.length - 1) return [stage];
        return [stage, <ProcessArrow key={`arrow-${i}`} />];
      })}
    </div>
  );
}
/**
 * Motion Asset video: native controls, sound on, no loop, click-to-play only (no scroll autoplay).
 * Only one Signal 50 motion video plays at a time (showreel + deliverables). Uses a near-end poster.
 */
const motionAssetVideos = new Set<HTMLVideoElement>();

function pauseOtherMotionVideos(except: HTMLVideoElement) {
  for (const other of motionAssetVideos) {
    if (other !== except && !other.paused) other.pause();
  }
}

/** Overview showreel: autoplay when fully in view; native controls; exclusive with deliverables.
 * Always starts muted so autoplay works after a hard refresh (browser policy). Unmutes when a
 * prior gesture exists, or on the next pointer/key gesture — no overlay/button.
 * User pause (native controls) is respected: autoplay/retry will not restart it while still in view. */
function ShowreelVideo({
  src,
  poster,
  className = "",
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullyVisibleRef = useRef(false);
  const userPausedRef = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    const root = containerRef.current;
    if (!v || !root) return;

    motionAssetVideos.add(v);
    // Muted attribute required for autoplay-after-refresh in Chrome/Safari/Firefox.
    v.muted = true;
    v.defaultMuted = true;

    const onPlay = () => {
      userPausedRef.current = false;
      pauseOtherMotionVideos(v);
    };
    const onPause = () => {
      // Pause while still fully on-screen = native controls (or exclusive playback).
      // Scroll-out pause happens after fullyVisibleRef is already false.
      if (fullyVisibleRef.current) userPausedRef.current = true;
    };
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);

    const isFullyOnScreen = (entry: IntersectionObserverEntry) => {
      const rootBounds = entry.rootBounds ?? {
        height: window.innerHeight,
        width: window.innerWidth,
        top: 0,
        left: 0,
      };
      const rect = entry.boundingClientRect;
      const viewH = "height" in rootBounds ? rootBounds.height : window.innerHeight;
      // Element fits in viewport: top/bottom on-screen (tolerance for chrome / subpixels)
      if (rect.height <= viewH + 2) {
        return rect.top >= -12 && rect.bottom <= viewH + 12;
      }
      // Taller than viewport: treat as fully on-screen when it fills the viewport
      return rect.top <= 12 && rect.bottom >= viewH - 12;
    };

    const hasUserGesture = () => {
      const ua = (
        navigator as Navigator & {
          userActivation?: { hasBeenActive?: boolean; isActive?: boolean };
        }
      ).userActivation;
      return Boolean(ua?.hasBeenActive || ua?.isActive);
    };

    let unlockSound: (() => void) | null = null;
    const removeUnlockListeners = () => {
      if (!unlockSound) return;
      window.removeEventListener("pointerdown", unlockSound, true);
      window.removeEventListener("keydown", unlockSound, true);
      unlockSound = null;
    };

    const enableSound = () => {
      v.muted = false;
      v.defaultMuted = false;
      if (fullyVisibleRef.current && v.paused && !userPausedRef.current) {
        void v.play().catch(() => {});
      }
      removeUnlockListeners();
    };

    const armSoundUnlock = () => {
      if (unlockSound || !v.muted) return;
      unlockSound = enableSound;
      window.addEventListener("pointerdown", unlockSound, true);
      window.addEventListener("keydown", unlockSound, true);
    };

    const tryPlay = async () => {
      if (!fullyVisibleRef.current || !v || userPausedRef.current) return;
      // Mute-first: guaranteed autoplay after refresh without a click.
      v.muted = true;
      v.defaultMuted = true;
      try {
        await v.play();
        if (hasUserGesture()) {
          enableSound();
        } else {
          armSoundUnlock();
        }
      } catch {
        /* Native controls remain available */
      }
    };

    const onCanPlay = () => {
      if (fullyVisibleRef.current && v.paused && !userPausedRef.current) void tryPlay();
    };
    v.addEventListener("canplay", onCanPlay);

    const retryId = window.setInterval(() => {
      if (fullyVisibleRef.current && v.paused && !userPausedRef.current && v.readyState >= 2) {
        void tryPlay();
      }
    }, 400);

    const observer = new IntersectionObserver(
      ([entry]) => {
        const fully = isFullyOnScreen(entry);
        const wasFully = fullyVisibleRef.current;
        fullyVisibleRef.current = fully;
        if (fully && !userPausedRef.current && (!wasFully || v.paused)) {
          void tryPlay();
        } else if (!fully && !v.paused) {
          v.pause();
        }
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 0.9, 0.99, 1] },
    );
    observer.observe(root);

    return () => {
      window.clearInterval(retryId);
      removeUnlockListeners();
      observer.disconnect();
      motionAssetVideos.delete(v);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("canplay", onCanPlay);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {!ready && (
        <div className={`pointer-events-none absolute inset-0 ${SIGNAL50_VIDEO_SKELETON_CLASS}`} />
      )}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        controls
        playsInline
        preload="auto"
        className="relative z-[1] h-full w-full object-cover"
        aria-label="Signal 50 showreel"
        onLoadedData={() => setReady(true)}
        onCanPlay={() => setReady(true)}
        onError={() => setReady(true)}
      />
    </div>
  );
}

function MotionAssetVideo({
  src,
  poster,
  className = "",
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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
    if (!v || !visible) return;

    motionAssetVideos.add(v);
    v.muted = false;
    v.defaultMuted = false;

    const onPlay = () => pauseOtherMotionVideos(v);
    v.addEventListener("play", onPlay);

    return () => {
      motionAssetVideos.delete(v);
      v.removeEventListener("play", onPlay);
    };
  }, [visible]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {!loaded && <div className={`absolute inset-0 z-10 ${SIGNAL50_VIDEO_SKELETON_CLASS}`} />}
      {visible && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          controls
          playsInline
          preload="metadata"
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoadedData={() => setLoaded(true)}
        />
      )}
    </div>
  );
}

/** Muted looping clip with a black skeleton until the first frame. */
function Signal50AutoLoopVideo({
  src,
  className = "",
  objectClassName = "object-contain",
  ariaLabel,
  gridVideo = false,
}: {
  src: string;
  className?: string;
  objectClassName?: string;
  ariaLabel?: string;
  gridVideo?: boolean;
}) {
  const [ready, setReady] = useState(false);
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!ready && (
        <div className={`pointer-events-none absolute inset-0 ${SIGNAL50_VIDEO_SKELETON_CLASS}`} />
      )}
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className={`relative z-[1] h-full w-full ${objectClassName}`}
        aria-label={ariaLabel}
        data-signal50-grid-video={gridVideo ? "" : undefined}
        ref={(el) => {
          if (el) {
            el.muted = true;
            el.defaultMuted = true;
          }
        }}
        onLoadedData={() => setReady(true)}
        onCanPlay={() => setReady(true)}
        onError={() => setReady(true)}
      />
    </div>
  );
}

const LOGO_SKETCH_COLS = 4;
const LOGO_SKETCH_ROWS = 2;
const LOGO_SKETCH_COL_DEFAULT = "1fr 1fr 1fr 1fr";
const LOGO_SKETCH_ROW_DEFAULT = "1fr 1fr";

/** Lumina-style 2×4 gallery: hovered cell grows (4fr), siblings shrink (1fr) + dim. */
function LogoSketchesGallery() {
  const [hovered, setHovered] = useState<number | null>(null);
  const { ref, onMouseDown } = useDragScroll();

  const hoveredCol = hovered !== null ? hovered % LOGO_SKETCH_COLS : -1;
  const hoveredRow = hovered !== null ? Math.floor(hovered / LOGO_SKETCH_COLS) : -1;
  const cols = Array.from({ length: LOGO_SKETCH_COLS }, (_, c) =>
    c === hoveredCol ? "4fr" : "1fr",
  ).join(" ");
  const rows = Array.from({ length: LOGO_SKETCH_ROWS }, (_, r) =>
    r === hoveredRow ? "4fr" : "1fr",
  ).join(" ");

  return (
    <>
      {/* Mobile: horizontal drag strip */}
      <div
        ref={ref}
        onMouseDown={onMouseDown}
        className="md:hidden overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
        data-signal50-logo-sketches=""
      >
        <div className="flex w-max gap-2 pr-[20%]">
          {LOGO_SKETCHES.map((src, i) => (
            <div
              key={src}
              className="flex h-[140px] w-[140px] shrink-0 items-center justify-center rounded-sm bg-white p-3"
            >
              <img
                src={src}
                alt={`Signal 50 logo sketch ${i + 1}`}
                className="max-h-full max-w-full object-contain pointer-events-none"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: 2×4 hover expand — object-contain + white so each mark stays fully visible at rest */}
      <div
        className="relative hidden md:block w-full aspect-[2/1] shrink-0 overflow-hidden"
        data-signal50-logo-sketches=""
        onMouseLeave={() => setHovered(null)}
      >
        <div
          className="absolute inset-0 grid min-h-0 min-w-0 gap-2"
          style={{
            gridTemplateColumns: hovered !== null ? cols : LOGO_SKETCH_COL_DEFAULT,
            gridTemplateRows: hovered !== null ? rows : LOGO_SKETCH_ROW_DEFAULT,
            transition: "grid-template-columns 0.35s ease, grid-template-rows 0.35s ease",
          }}
        >
          {LOGO_SKETCHES.map((src, i) => (
            <div
              key={src}
              className="relative flex min-h-0 min-w-0 items-center justify-center overflow-hidden rounded-sm bg-white p-3"
              onMouseEnter={() => setHovered(i)}
            >
              <img
                src={src}
                alt={`Signal 50 logo sketch ${i + 1}`}
                loading="lazy"
                className={`h-auto w-auto max-h-full max-w-full object-contain cursor-pointer transition-opacity duration-300 ${
                  hovered === i
                    ? "opacity-100"
                    : hovered !== null
                      ? "opacity-50"
                      : "opacity-100"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const INSPIRATION_COLS = 5;
const INSPIRATION_ROWS = 4;

/** 4×5 moodboard: square-ish tiles via fixed aspect shell + equal 1fr tracks (same smooth
 * hover as Logo Inspirations). Full content width (cols 3–7). */
function InspirationsGallery() {
  const [hovered, setHovered] = useState<number | null>(null);
  const { ref, onMouseDown } = useDragScroll();

  const hoveredCol = hovered !== null ? hovered % INSPIRATION_COLS : -1;
  const hoveredRow = hovered !== null ? Math.floor(hovered / INSPIRATION_COLS) : -1;
  const cols = Array.from({ length: INSPIRATION_COLS }, (_, c) =>
    c === hoveredCol ? "4fr" : "1fr",
  ).join(" ");
  const rows = Array.from({ length: INSPIRATION_ROWS }, (_, r) =>
    r === hoveredRow ? "4fr" : "1fr",
  ).join(" ");

  return (
    <>
      <div
        ref={ref}
        onMouseDown={onMouseDown}
        className="md:hidden overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
        data-signal50-inspirations=""
      >
        <div className="flex w-max gap-4 pr-[20%]">
          {INSPIRATIONS.map((src, i) => (
            <div key={src} className="h-[112px] w-[112px] shrink-0 overflow-hidden rounded-sm">
              <img
                src={src}
                alt={`Signal 50 visual inspiration ${i + 1}`}
                className="h-full w-full object-cover pointer-events-none"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      <div
        className="relative hidden md:block w-full aspect-[5/4] shrink-0 overflow-hidden"
        data-signal50-inspirations=""
        onMouseLeave={() => setHovered(null)}
      >
        <div
          className="absolute inset-0 grid min-h-0 min-w-0 gap-4 h-full w-full"
          style={{
            gridTemplateColumns: hovered !== null ? cols : "1fr 1fr 1fr 1fr 1fr",
            gridTemplateRows: hovered !== null ? rows : "1fr 1fr 1fr 1fr",
            transition: "grid-template-columns 0.35s ease, grid-template-rows 0.35s ease",
          }}
        >
          {INSPIRATIONS.map((src, i) => (
            <div
              key={src}
              className="relative min-h-0 min-w-0 overflow-hidden rounded-sm"
              onMouseEnter={() => setHovered(i)}
            >
              <img
                src={src}
                alt={`Signal 50 visual inspiration ${i + 1}`}
                loading="lazy"
                className={`h-full w-full object-cover cursor-pointer transition-opacity duration-300 ${
                  hovered === i
                    ? "opacity-100"
                    : hovered !== null
                      ? "opacity-50"
                      : "opacity-100"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const LOGO_INSPIRATION_COLS = 5;
const LOGO_INSPIRATION_ROWS = 2;

/** 2×5 logo moodboard: smaller square tiles across full content width (cols 3–7).
 * Hover expands in place like Lumina (4fr / 1fr). */
function LogoInspirationsGallery() {
  const [hovered, setHovered] = useState<number | null>(null);
  const { ref, onMouseDown } = useDragScroll();

  const hoveredCol = hovered !== null ? hovered % LOGO_INSPIRATION_COLS : -1;
  const hoveredRow = hovered !== null ? Math.floor(hovered / LOGO_INSPIRATION_COLS) : -1;
  const cols = Array.from({ length: LOGO_INSPIRATION_COLS }, (_, c) =>
    c === hoveredCol ? "4fr" : "1fr",
  ).join(" ");
  const rows = Array.from({ length: LOGO_INSPIRATION_ROWS }, (_, r) =>
    r === hoveredRow ? "4fr" : "1fr",
  ).join(" ");

  return (
    <>
      <div
        ref={ref}
        onMouseDown={onMouseDown}
        className="md:hidden overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
        data-signal50-logo-inspirations=""
      >
        <div className="flex w-max gap-3 pr-[20%]">
          {LOGO_INSPIRATIONS.map((src, i) => (
            <div key={src} className="h-[96px] w-[96px] shrink-0 overflow-hidden rounded-sm">
              <img
                src={src}
                alt={`Signal 50 logo inspiration ${i + 1}`}
                className="h-full w-full object-cover pointer-events-none"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      <div
        className="relative hidden md:block w-full aspect-[5/2] shrink-0 overflow-hidden"
        data-signal50-logo-inspirations=""
        onMouseLeave={() => setHovered(null)}
      >
        <div
          className="absolute inset-0 grid min-h-0 min-w-0 gap-3 h-full w-full sm:gap-4"
          style={{
            gridTemplateColumns: hovered !== null ? cols : "1fr 1fr 1fr 1fr 1fr",
            gridTemplateRows: hovered !== null ? rows : "1fr 1fr",
            transition: "grid-template-columns 0.35s ease, grid-template-rows 0.35s ease",
          }}
        >
          {LOGO_INSPIRATIONS.map((src, i) => (
            <div
              key={src}
              className="relative min-h-0 min-w-0 overflow-hidden rounded-sm"
              onMouseEnter={() => setHovered(i)}
            >
              <img
                src={src}
                alt={`Signal 50 logo inspiration ${i + 1}`}
                loading="lazy"
                className={`h-full w-full object-cover cursor-pointer transition-opacity duration-300 ${
                  hovered === i
                    ? "opacity-100"
                    : hovered !== null
                      ? "opacity-50"
                      : "opacity-100"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

interface Signal50Props {
  onSelectSection: (id: string) => void;
  onReady?: () => void;
}

export default function Signal50({ onSelectSection, onReady }: Signal50Props) {
  const readyFired = useRef(false);

  const signalReady = useCallback(() => {
    if (readyFired.current) return;
    readyFired.current = true;
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    signalReady();
  }, [signalReady]);

  return (
    <div className="flex flex-col">
      {/* Hero + project intro */}
      <div className="min-h-screen flex flex-col">
        <ProjectHeroVideo
          src={HERO_VIDEO}
          fillViewport
          shellFillClass={SIGNAL50_VIDEO_SKELETON_CLASS}
        />

        <section className="flex-1 flex flex-col justify-start md:justify-center">
          <PageGrid className={sectionPageGridStretchClass}>
            {/* Row 1: title + subtitle */}
            <div
              className={`col-span-8 md:col-start-2 md:col-span-6 flex min-w-0 flex-col ${gapSubtitleClass} ${sectionColumnPaddingClass} pb-0`}
            >
              <h3 className={projectHeroNameClass}>Signal 50</h3>
              <p className={`${subTitleClass} leading-[1.5]`}>{SIGNAL50_SUBTITLE}</p>
            </div>

            {/* Row 2: tag pills */}
            <div className="col-span-8 md:col-start-2 md:col-span-6 flex flex-wrap items-center gap-y-3 gap-x-8 md:gap-x-12 py-4">
              {SIGNAL50_INTRO_TAGS.map((label) => (
                <span
                  key={label}
                  className={`${smallTitleClass} inline-flex border border-[#2200b8] px-3 py-1`}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Row 3: Brief / Concept / Tools */}
            <div className="[grid-column:1/-1] md:[grid-column:2/8] flex flex-col md:flex-row md:justify-between gap-y-6 gap-x-[var(--grid-gutter)]">
              <IntroToggle label="Brief" className="md:w-2/6 md:shrink-0">
                <p className={bodyTextClass}>{SIGNAL50_BRIEF}</p>
              </IntroToggle>
              <IntroToggle label="Concept" className="md:w-2/6 md:shrink-0">
                <p className={bodyTextClass}>{SIGNAL50_CONCEPT}</p>
              </IntroToggle>
              <IntroToggle label="Tools" className="md:shrink-0">
                <ul className={`${bodyTextClass} list-none space-y-1`}>
                  {SIGNAL50_TOOLS.map((tool) => (
                    <li key={tool}>{tool}</li>
                  ))}
                </ul>
              </IntroToggle>
            </div>

            {/* Overview showreel — cols 2–7 */}
            <div
              className={`col-span-8 md:col-start-2 md:col-end-8 mt-6 md:mt-10 ${sectionColumnPaddingClass} pt-0`}
              data-signal50-showreel=""
            >
              <ShowreelVideo
                src={SHOWREEL_VIDEO}
                poster={signal50VideoPoster(SHOWREEL_VIDEO_ID, SHOWREEL_POSTER_AT)}
                className={`w-full aspect-video rounded-sm ${SIGNAL50_VIDEO_SKELETON_CLASS}`}
              />
            </div>
          </PageGrid>
        </section>
      </div>

      <div className="w-full border-t border-[#2200b8]" />

      {/* Brand Identity */}
      <section>
        <MobileStickyTitle>Brand Identity</MobileStickyTitle>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className={TITLE_COL_DESKTOP_CLASS}>
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Brand Identity</h2>
          </div>

          <div
            className={`col-span-8 md:col-start-3 md:col-span-5 ${sectionColumnPaddingClass}`}
          >
            <img
              src={BRAND_IDENTITY_IMAGE}
              alt="Signal 50 brand identity overview"
              className="h-auto w-full object-contain"
              loading="lazy"
            />
          </div>
        </PageGrid>
      </section>

      <div className="w-full border-t border-[#2200b8]" />

      {/* Visual Language */}
      <section>
        <MobileStickyTitle>Visual Language</MobileStickyTitle>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className={TITLE_COL_DESKTOP_CLASS}>
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Visual Language</h2>
          </div>

          <div
            className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col ${gapContentClass} ${sectionColumnPaddingClass}`}
          >
            <div className={`flex flex-col ${gapSubtitleClass}`}>
              <h3 className={subTitleClass}>Inspirations</h3>
              <p className={`${bodyTextClass} lg:max-w-[80%]`}>{INSPIRATIONS_BODY}</p>
              <InspirationsGallery />
            </div>

            <div className={`flex flex-col ${gapContentClass}`} data-signal50-color-palette="">
              <h3 className={subTitleClass}>Color Palette & Typography</h3>
              <Signal50PaletteAndTypography />
              <div className={`flex flex-col ${gapIntroClass}`}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-[var(--grid-gutter)] gap-y-4 cursor-default">
                  {DECADE_VIDEOS.map((vid) => (
                    <Signal50AutoLoopVideo
                      key={vid}
                      src={cloudinaryUrl(vid, { resourceType: "video" })}
                      className="w-full rounded-sm aspect-[3/5]"
                    />
                  ))}
                </div>
                <p className={`${bodyTextClass} lg:max-w-[80%]`}>{COLOR_PALETTE_BODY}</p>
              </div>
            </div>

            <div className={`flex flex-col ${gapContentClass}`}>
              <div className={`flex flex-col ${gapSubtitleClass}`}>
                <h3 className={subTitleClass}>Logo</h3>
                <div className={`flex flex-col ${gapSubtitleClass}`}>
                  <h4 className={smallTitleClass}>Inspirations</h4>
                  <p className={`${bodyTextClass} lg:max-w-[80%]`}>{LOGO_INSPIRATIONS_BODY}</p>
                  <LogoInspirationsGallery />
                </div>
              </div>

              <div className={`flex flex-col ${gapSubtitleClass}`}>
                <h4 className={smallTitleClass}>Initial Sketches</h4>
                <p className={`${bodyTextClass} lg:max-w-[80%]`}>
                  Started with raw hand-drawn sketches to capture a gritty, underground 80s aesthetic
                  with a bold, rock-and-roll edge.
                </p>
                <LogoSketchesGallery />
              </div>

              <div className={`flex flex-col ${gapSubtitleClass}`}>
                <h4 className={smallTitleClass}>Final Logo</h4>
                <p className={`${bodyTextClass} lg:max-w-[80%]`}>
                  Developed and refined the chosen sketch into the final logotype.
                </p>
                <FinalLogoProcess />
                <div
                  className="flex w-full aspect-[16/10] items-center justify-center rounded-sm p-8 sm:p-12"
                  style={{ backgroundColor: SIGNAL50_BLACK }}
                  data-signal50-final-logo=""
                >
                  <img
                    src={FINAL_LOGO_WHITE}
                    alt="Signal 50 final logo — white lockup"
                    className="max-h-full max-w-[min(100%,420px)] object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            <div className={`flex flex-col ${gapSubtitleClass}`} data-signal50-grid-system="">
              <h3 className={subTitleClass}>Grid System</h3>
              <p className={`${bodyTextClass} lg:max-w-[80%]`}>{GRID_SYSTEM_BODY}</p>
              {/* Nested 5-col track ≈ page cols 3 | 4–7: smaller square inspo + gaps, column matches video height */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-x-[var(--grid-gutter)] gap-y-4 md:items-stretch">
                <div
                  className="md:col-span-1 flex flex-col items-center justify-between gap-4 self-stretch"
                  data-signal50-grid-inspirations=""
                >
                  {GRID_INSPIRATIONS.map((src, i) => (
                    <div
                      key={src}
                      className="relative w-[72%] aspect-square shrink-0 overflow-hidden rounded-sm bg-transparent"
                    >
                      <img
                        src={src}
                        alt={`Signal 50 grid inspiration ${i + 1}`}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
                <Signal50AutoLoopVideo
                  src={GRID_SYSTEM_VIDEO}
                  className={`md:col-span-4 w-full aspect-video rounded-sm ${SIGNAL50_VIDEO_SKELETON_CLASS}`}
                  ariaLabel="Signal 50 grid system motion"
                  gridVideo
                />
              </div>
            </div>
          </div>
        </PageGrid>
      </section>

      <div className="w-full border-t border-[#2200b8]" />

      {/* Deliverables */}
      <section>
        <MobileStickyTitle>Deliverables</MobileStickyTitle>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className={TITLE_COL_DESKTOP_CLASS}>
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Deliverables</h2>
          </div>

          <div
            className={`col-span-8 md:col-start-3 md:col-span-5 flex min-w-0 flex-col ${gapContentClass} ${sectionColumnPaddingClass}`}
            data-signal50-motion-assets=""
          >
            {MOTION_ASSETS.map((item) => {
              const isCommercial = item.title === "Logo ID (Commercial Promo)";
              return (
                <div
                  key={item.title}
                  className={`flex min-w-0 flex-col ${isCommercial ? gapIntroClass : gapSubtitleClass}`}
                  data-signal50-motion-asset={item.title}
                >
                  <div className={`flex min-w-0 flex-col ${gapSubtitleClass}`}>
                    <h3 className={subTitleClass}>{item.title}</h3>
                    {isCommercial && (
                      <>
                        <p className={`${bodyTextClass} lg:max-w-[80%]`}>{COMMERCIAL_PROMO_BODY}</p>
                        <h4 className={smallTitleClass}>Source Frames</h4>
                        <div className="min-w-0 overflow-hidden">
                          <CommercialStoryboardCarousel />
                        </div>
                      </>
                    )}
                  </div>
                  <MotionAssetVideo
                    src={cloudinaryUrl(item.video, { resourceType: "video" })}
                    poster={signal50VideoPoster(item.video, item.posterAt)}
                    className={`w-full aspect-video rounded-sm ${SIGNAL50_VIDEO_SKELETON_CLASS}`}
                  />
                </div>
              );
            })}
            <div
              className="group relative w-full aspect-video overflow-hidden rounded-sm bg-black cursor-pointer"
              data-signal50-stage-mockup=""
            >
              <img
                src={STAGE_MOCKUP_REST}
                alt="Signal 50 stage mockup"
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-0"
              />
              <img
                src={STAGE_MOCKUP_HOVER}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
              />
            </div>
          </div>
        </PageGrid>
      </section>

      <ProjectNav currentProject="signal50" onSelectSection={onSelectSection} />
    </div>
  );
}
