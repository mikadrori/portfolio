import { useEffect, useRef, useCallback, useState, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

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
import { gapContentClass, gapSubtitleClass, gapIntroClass } from "../lib/spacing";
import { PageGrid } from "../components/PageGrid";
import { MobileStickyTitle, TITLE_COL_DESKTOP_CLASS } from "../components/MobileStickyTitle";
import { IntroToggle } from "../components/IntroToggle";
import { ProjectHeroVideo } from "../components/ProjectHeroVideo";
import { ProjectNav } from "../components/ProjectNav";
import { useDragScroll } from "../hooks/useDragScroll";
import { cloudinaryUrl } from "../lib/cloudinary";

const HERO_VIDEO = cloudinaryUrl("Nabat/Nabat_WebVID_aoxnae.mp4", {
  resourceType: "video",
});

const OVERVIEW_VIDEO = cloudinaryUrl("Nabat/Nabat_HeroVID_jg9xag.mp4", {
  resourceType: "video",
});

const MAKING_VIDEO = cloudinaryUrl("Nabat/Nabat_nabatmakingVID_rpkmzi.mp4", {
  resourceType: "video",
});

const CULTURE_VIDEO = cloudinaryUrl("Nabat/Nabat_nabatcaltureVID_s7xhnb.mp4", {
  resourceType: "video",
});

const CRYSTAL_FORMING_VIDEO = cloudinaryUrl("Nabat/Nabat_crystalformingVID_fmdfoz.mp4", {
  resourceType: "video",
});

const WEBSITE_VIDEO = cloudinaryUrl("Nabat/Nabat_nabatwebsiteVID_jbcith.mp4", {
  resourceType: "video",
});

const REELS_VIDEO = cloudinaryUrl("Nabat/Nabat_Reels_VID_Final_bsvywf.mp4", {
  resourceType: "video",
});
/** Side pillarbox only (~5–7% black each side). Stay inside the bar — do not clip site chrome. */
const WEBSITE_VIDEO_CROP_X = 5;

const WEBSITE_URL = "https://nabatcandy.vercel.app/";

const TYPOGRAPHY_SVG = cloudinaryUrl("Nabat/Nabat_typo_efshei.svg");
const TYPOGRAPHY_SVG_ASPECT = "762 / 321";

const NABAT_SUBTITLE = "As nature intended";

const NABAT_INTRO_TAGS = ["Brand Identity", "Packaging Design", "Solo Project"] as const;

const NABAT_BRIEF =
  'Designing a new brand identity and consumer experience centered around the theme of "Candy". The task was to build a strategic product concept, packaging, and digital system.';

const NABAT_CONCEPT =
  "NABAT reimagines sugar through its raw, crystalline origins. It transforms pure rock sugar into a premium sweet, shifting the narrative from guilt and restriction to a clean, guilt-free experience.";

const NABAT_TOOLS = [
  "Adobe Illustrator",
  "Adobe Photoshop",
  "Gemini",
  "Cursor",
  "Figma",
  "Adobe After Effects",
] as const;

const ORIGINS_BODY =
  "Nabat is traditional rock sugar from Persian culture and ancient Iran, historically used by physicians as a pure medicinal remedy.";

const CRYSTALLIZATION_BODY =
  "Crafted through a slow 15-day process, pure cane sugar syrup is naturally clarified and crystallized around sticks or threads.";

const HEALTH_BODY =
  "Its dense crystalline lattice dissolves gradually, delivering a gentle, pure sweetness that is easier on the body than processed sugar.";

const INSPIRATION_SHAPE = [
  cloudinaryUrl("Nabat/Nabat_inpoSHAPE_qwxeqm.png"),
  cloudinaryUrl("Nabat/Nabat_inpoSHAPE-1_tkeu1o.png"),
  cloudinaryUrl("Nabat/Nabat_inpoSHAPE-2_lsughy.png"),
  cloudinaryUrl("Nabat/Nabat_inpoSHAPE-3_g11nhd.png"),
  cloudinaryUrl("Nabat/Nabat_inpoSHAPE-4_huboup.png"),
  cloudinaryUrl("Nabat/Nabat_inpoSHAPE-5_jazptv.png"),
];

const INSPIRATION_FEEL = [
  cloudinaryUrl("Nabat/Nabat_inspoFELL_zegwrj.png"),
  cloudinaryUrl("Nabat/Nabat_inspoFELL-1_v2vmsb.png"),
  cloudinaryUrl("Nabat/Nabat_inspoFELL-2_pi6wfy.png"),
  cloudinaryUrl("Nabat/Nabat_inspoFELL-3_uz50zr.png"),
  cloudinaryUrl("Nabat/Nabat_inspoFELL-4_iduiyf.png"),
];

const INSPIRATION_COLOR = [
  cloudinaryUrl("Nabat/Nabat_inspoCOLOR-1_l7aqxi.png"),
  cloudinaryUrl("Nabat/Nabat_inspoCOLOR-2_gkx5ml.png"),
  cloudinaryUrl("Nabat/Nabat_inspoCOLOR-3_bhowaj.png"),
  cloudinaryUrl("Nabat/Nabat_inspoCOLOR-4_g4xpdc.png"),
  cloudinaryUrl("Nabat/Nabat_inspoCOLOR-5_zs0aoc.png"),
  cloudinaryUrl("Nabat/Nabat_inspoCOLOR-6_ndmcrk.png"),
  cloudinaryUrl("Nabat/Nabat_inspoCOLOR-7_ly19gd.png"),
];

const INSPIRATION_GROUPS = [
  {
    title: "Material & Form",
    body: "Crystalline and sharp shapes, transmitting confidence and stability.",
    images: INSPIRATION_SHAPE,
  },
  {
    title: "Feeling",
    body: "A natural, soothing feeling, evoking freedom and tranquility.",
    images: INSPIRATION_FEEL,
  },
  {
    title: "Color",
    body: "Natural colors taken from natural fabrics, sugar cane, roses, and saffron.",
    images: INSPIRATION_COLOR,
  },
] as const;

const CRYSTAL_IMAGES = [
  cloudinaryUrl("Nabat/Nabat_crystalinspoimage2_amilvd.jpg"),
  cloudinaryUrl("Nabat/Nabat_crystalinspoimage4_hmjzm3.jpg"),
  cloudinaryUrl("Nabat/Nabat_crystalinspoimage1_hqqzqt.jpg"),
];

/** Microscope stills: circular field + black side bars. % trimmed from each side. */
const CRYSTAL_IMAGE_CROP = { x: 26, y: 10 } as const;

const RESEARCH_SLIDES = [
  { title: "Origins & History", body: ORIGINS_BODY, video: CULTURE_VIDEO, label: "Nabat culture" },
  { title: "Crystallization Process", body: CRYSTALLIZATION_BODY, video: MAKING_VIDEO, label: "Nabat making process" },
  { title: "Health & Pure Structure", body: HEALTH_BODY, video: CRYSTAL_FORMING_VIDEO, label: "Nabat crystal forming" },
] as const;

const BRAND_IDENTITY_IMAGE = cloudinaryUrl("Nabat/Nabat_BrandIdentity_bbmdhj.png");

/** Visual Language assets live under `Nabat/Visual Language/` (encode space for local + CDN). */
const vl = (file: string, opts?: { width?: number }) =>
  cloudinaryUrl(encodeURI(`Nabat/Visual Language/${file}`), opts);

const LOGO_SKETCHES = [
  vl("Nabat_LogoSketch-29_pqe0yu.png"),
  vl("Nabat_LogoSketch-31_gyc0tp.png"),
  vl("Nabat_LogoSketch-33_zsxn6t.png"),
  vl("Nabat_LogoSketch-35_hb67nw.png"),
  vl("Nabat_LogoSketch-36_qucohd.png"),
] as const;

const LOGO_FINAL = vl("Nabat_LogoFinal_uucz3o.png");
const LOGO_MARK = vl("Nabat_LogoFinal_tvvfjc.png");
const LOGO_MARK_HOVER = vl("Nabat_LogoFinalHover_bwcrzi.png");

const LOGO_TYPOGRAPHY_OPTIONS = [
  vl("Nabat_LogoTypography-100_xbxsbh.png"),
  vl("Nabat_LogoTypography-101_g8wh1w.png"),
] as const;

const LOGO_TYPOGRAPHY_FINAL = vl("Nabat_LogoTypographyfinal_xitwx2.png");
/** Native export ratio — show full frame, no crop. */
const LOGO_TYPOGRAPHY_FINAL_ASPECT = "9043 / 2469";
/** Magnifier zoom relative to the full displayed image. */
const LOGO_TYPOGRAPHY_ZOOM = 3.2;
const LOGO_TYPOGRAPHY_LENS_PX = 180;

const LOGO_COLORS = [
  vl("Nabat_LogoColors-103_vhyzcw.png"),
  vl("Nabat_LogoColors-104_odzkr2.png"),
  vl("Nabat_LogoColors-105_cf8vtw.png"),
  vl("Nabat_LogoColors-106_ckpikp.png"),
] as const;

const LOGO_FULL = vl("Nabat_FullLogo_cynwhu.png");

const NABAT_PATTERNS = [
  vl("Nabat_Pattern-109_d1plze.png"),
  vl("Nabat_Pattern-113_xjtl2f.png"),
  vl("Nabat_Pattern-108_bzeygo.png"),
  vl("Nabat_Pattern-112_vhmuon.png"),
  vl("Nabat_Pattern-111_znpvej.png"),
  vl("Nabat_Pattern-110_foupec.png"),
] as const;
/** Trim artboard edge hairlines; keep displayed tiles 1:1. */
const NABAT_PATTERN_CROP = 22;

const NABAT_SHAPES = [
  vl("Nabat_shapes_1_ljiszb.png"),
  vl("Nabat_shapes_2_sh6ymd.png"),
  vl("Nabat_shapes_3_vlejdl.png"),
] as const;

/** Reduced package stills: Cloudinary `Nabat/JPEG/`, local mirror of `Packages/Reduced IMG/`. */
const pkg = (file: string, opts?: { width?: number }) =>
  cloudinaryUrl(encodeURI(`Nabat/JPEG/${file}`), { quality: "90", ...opts });

const PACKAGE_HERO_CYCLING = [
  pkg("Nabat_PackageIMG_11_epwf3b.jpg", { width: 2000 }),
  pkg("Nabat_PackageIMG_12_a3f6zm.jpg", { width: 2000 }),
  pkg("Nabat_PackageIMG_13_qegmbj.jpg", { width: 2000 }),
] as const;
const PACKAGE_CYCLING = [
  pkg("Nabat_PackageIMG_5_sbhlso.jpg", { width: 1400 }),
  pkg("Nabat_PackageIMG_8_m3849x.jpg", { width: 1400 }),
  pkg("Nabat_PackageIMG_6_xnm6gx.jpg", { width: 1400 }),
] as const;
const PKG_TOP_LEFT = pkg("Nabat_PackageIMG_7_qozlqf.jpg", { width: 1400 });
const PKG_TOP_CENTER = pkg("Nabat_PackageIMG_9_kglcdy.jpg", { width: 1400 });
const PKG_BOTTOM_LEFT = pkg("Nabat_PackageIMG_4_ijziaj.jpg", { width: 1400 });

/** Flat lightbox order: hero → side stills → single-package cycling. */
const PACKAGE_LIGHTBOX_IMAGES = [
  ...PACKAGE_HERO_CYCLING,
  PKG_TOP_LEFT,
  PKG_TOP_CENTER,
  PKG_BOTTOM_LEFT,
  ...PACKAGE_CYCLING,
] as const;

const PACKAGE_CYCLE_MS = 2000;
const PACKAGE_HERO_CYCLE_MS = 4500;
const PACKAGE_FADE_MS = 800;
const PACKAGE_SINGLE_DELAY_MS = 1200;

const NABAT_POSTER_FEATURED = cloudinaryUrl(
  "Nabat/products/Nabat_poster-04_tr6lts.png",
  { width: 1800 },
);
const NABAT_POSTERS_ROW = [
  cloudinaryUrl("Nabat/products/Nabat_poster-01_ndqqhd.png", { width: 1400 }),
  cloudinaryUrl("Nabat/products/Nabat_poster-03_wo7gav.png", { width: 1400 }),
  cloudinaryUrl("Nabat/products/Nabat_poster-02_fo9hp4.png", { width: 1400 }),
] as const;
const NABAT_POSTERS = [NABAT_POSTER_FEATURED, ...NABAT_POSTERS_ROW] as const;

/** 2 rows × (3 squares + 1 wide) from `Nabat_colorpallete`. */
const NABAT_PALETTE_ROWS = [
  ["#8FA68B", "#C48C9B", "#DA9F6D", "#E5E0D2"],
  ["#ACC6B4", "#DDA8BF", "#E6BC98", "#FDFAF1"],
] as const;

const NABAT_PALETTE_IVORY = "#FDFAF1";
const NABAT_PALETTE_IVORY_STROKE = "#E5E0D2";


function NabatLogoMarkHover() {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="grid grid-cols-3 items-center gap-x-[var(--grid-gutter)] gap-y-6">
      <div aria-hidden />
      <div
        className="relative flex cursor-pointer items-center justify-center py-2"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={LOGO_MARK}
          alt="Nabat logo mark"
          className="h-auto w-full max-w-[280px] object-contain"
          style={{
            opacity: hovered ? 0 : 1,
            transition: "opacity 0.15s ease",
          }}
          loading="lazy"
        />
        <img
          src={LOGO_MARK_HOVER}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 m-auto h-[88%] max-h-[88%] w-auto max-w-[280px] object-contain"
          style={{
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.15s ease",
          }}
        />
      </div>
      <div aria-hidden />
    </div>
  );
}

function NabatAutoLoopVideo({
  src: videoSrc,
  className = "",
  ariaLabel,
  cropX = 0,
  cropY = 0,
}: {
  src: string;
  className?: string;
  ariaLabel?: string;
  /** % trimmed from each side (black letterbox). */
  cropX?: number;
  cropY?: number;
}) {
  const [ready, setReady] = useState(false);
  const [loadSrc, setLoadSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cropped = cropX > 0 || cropY > 0;
  const innerW = 100 - cropX * 2;
  const innerH = 100 - cropY * 2;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadSrc(videoSrc);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [videoSrc]);

  useEffect(() => {
    const el = containerRef.current;
    const video = videoRef.current;
    if (!el || !video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadSrc]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-sm bg-[#fcf7ee] ${className}`}
      style={
        cropped
          ? { aspectRatio: `${innerW * 16} / ${innerH * 9}` }
          : undefined
      }
    >
      {!ready && (
        <div className="pointer-events-none absolute inset-0 bg-[#fcf7ee]" />
      )}
      {loadSrc && (
        <video
          src={loadSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className={
            cropped
              ? "absolute z-[1] max-w-none"
              : "relative z-[1] h-full w-full object-cover"
          }
          style={
            cropped
              ? {
                  width: `${(100 / innerW) * 100}%`,
                  height: `${(100 / innerH) * 100}%`,
                  left: `${(-cropX / innerW) * 100}%`,
                  top: `${(-cropY / innerH) * 100}%`,
                }
              : undefined
          }
          aria-label={ariaLabel}
          ref={(el) => {
            videoRef.current = el;
            if (el) {
              el.muted = true;
              el.defaultMuted = true;
            }
          }}
          onLoadedData={() => setReady(true)}
          onCanPlay={() => setReady(true)}
          onError={() => setReady(true)}
        />
      )}
    </div>
  );
}

/** Reels video with sound-on default, mute/pause overlay controls. */
function ReelsVideo({ src, className = "" }: { src: string; className?: string }) {
  const [ready, setReady] = useState(false);
  const [loadSrc, setLoadSrc] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<number>(0);
  const mutedRef = useRef(false);
  const pausedRef = useRef(false);

  const scheduleHide = useCallback(() => {
    clearTimeout(hideTimerRef.current);
    setShowControls(true);
    hideTimerRef.current = window.setTimeout(() => setShowControls(false), 2500);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadSrc(src);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [src]);

  useEffect(() => {
    const el = containerRef.current;
    const video = videoRef.current;
    if (!el || !video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !pausedRef.current) {
          video.muted = mutedRef.current;
          video.play().catch(() => {});
        } else if (!entry.isIntersecting) {
          video.pause();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadSrc]);

  useEffect(() => {
    scheduleHide();
    return () => clearTimeout(hideTimerRef.current);
  }, [scheduleHide]);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const next = !mutedRef.current;
    mutedRef.current = next;
    v.muted = next;
    setMuted(next);
    scheduleHide();
  }, [scheduleHide]);

  const togglePause = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.muted = mutedRef.current;
      v.play().catch(() => {});
      pausedRef.current = false;
      setPaused(false);
    } else {
      v.pause();
      pausedRef.current = true;
      setPaused(true);
    }
    scheduleHide();
  }, [scheduleHide]);

  const controlBtnClass =
    "flex items-center justify-center w-6 h-6 rounded-full bg-black/30 text-white/80 transition-opacity hover:bg-black/50";

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-sm bg-[#fcf7ee] ${className}`}
      onPointerEnter={scheduleHide}
      onPointerMove={scheduleHide}
    >
      {!ready && (
        <div className="pointer-events-none absolute inset-0 bg-[#fcf7ee]" />
      )}
      {loadSrc && (
        <video
          src={loadSrc}
          autoPlay
          loop
          playsInline
          preload="metadata"
          className="relative z-[1] h-full w-full object-cover"
          aria-label="Nabat packaging reels"
          ref={(el) => {
            videoRef.current = el;
            if (el) {
              el.muted = mutedRef.current;
            }
          }}
          onLoadedData={() => setReady(true)}
          onCanPlay={() => setReady(true)}
          onError={() => setReady(true)}
        />
      )}
      <div
        className={`absolute bottom-2 right-2 z-10 flex gap-1.5 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        <button type="button" onClick={togglePause} className={controlBtnClass} aria-label={paused ? "Play" : "Pause"}>
          {paused ? <Play size={12} /> : <Pause size={12} />}
        </button>
        <button type="button" onClick={toggleMute} className={controlBtnClass} aria-label={muted ? "Unmute" : "Mute"}>
          {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
        </button>
      </div>
    </div>
  );
}

/** Research: horizontal drag carousel of title + body + video cards. */
function ResearchCarousel() {
  const { ref, onMouseDown } = useDragScroll();

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
    >
      <div
        className={`flex w-max gap-[calc(var(--grid-gutter)*2)]`}
      >
        {RESEARCH_SLIDES.map((slide) => (
          <div
            key={slide.title}
            className="w-[85vw] md:w-[calc((100vw-2*var(--grid-margin)-var(--grid-gutter))/2)] shrink-0 flex flex-col gap-4"
          >
            <div className={`flex flex-col ${gapSubtitleClass}`}>
              <h3 className={subTitleClass}>{slide.title}</h3>
              <p className={bodyTextClass}>{slide.body}</p>
            </div>
            <NabatAutoLoopVideo
              src={slide.video}
              className="w-full aspect-video"
              ariaLabel={slide.label}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Signal 50–style 1-row hover-expand gallery: hovered column grows (4fr), siblings 1fr + dim. */
function InspirationRowGallery({
  images,
  label,
  cropX = 0,
  cropY = 0,
  /** Resting tile width ÷ height. `1` = square (default); `16/9` = landscape. */
  tileAspect = 1,
  gapClass = "gap-4",
}: {
  images: readonly string[];
  label: string;
  cropX?: number;
  cropY?: number;
  tileAspect?: number;
  gapClass?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const { ref, onMouseDown } = useDragScroll();
  const cols = images.length;
  const restCols = Array.from({ length: cols }, () => "1fr").join(" ");
  const hoverCols =
    hovered !== null
      ? Array.from({ length: cols }, (_, c) => (c === hovered ? "4fr" : "1fr")).join(" ")
      : restCols;
  const cropped = cropX > 0 || cropY > 0;
  const innerW = 100 - cropX * 2;
  const innerH = 100 - cropY * 2;
  const cropStyle = cropped
    ? {
        width: `${(100 / innerW) * 100}%`,
        height: `${(100 / innerH) * 100}%`,
        left: `${(-cropX / innerW) * 100}%`,
        top: `${(-cropY / innerH) * 100}%`,
        objectFit: "cover" as const,
      }
    : undefined;
  const mobileTileH = 112;
  const mobileTileW = Math.round(mobileTileH * tileAspect);

  return (
    <>
      <div
        ref={ref}
        onMouseDown={onMouseDown}
        className="md:hidden overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
      >
        <div className={`flex w-max ${gapClass} pr-[20%]`}>
          {images.map((src, i) => (
            <div
              key={src}
              className="relative shrink-0 overflow-hidden rounded-sm"
              style={{ height: mobileTileH, width: mobileTileW }}
            >
              <img
                src={src}
                alt={`${label} ${i + 1}`}
                className={
                  cropped
                    ? "absolute max-w-none pointer-events-none"
                    : "h-full w-full object-cover pointer-events-none"
                }
                style={cropStyle}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      <div
        className="relative hidden md:block w-full shrink-0 overflow-hidden"
        style={{ aspectRatio: `${cols * tileAspect} / 1` }}
        onMouseLeave={() => setHovered(null)}
      >
        <div
          className={`absolute inset-0 grid min-h-0 min-w-0 ${gapClass} h-full w-full`}
          style={{
            gridTemplateColumns: hovered !== null ? hoverCols : restCols,
            transition: "grid-template-columns 0.35s ease",
          }}
        >
          {images.map((src, i) => (
            <div
              key={src}
              className="relative min-h-0 min-w-0 overflow-hidden rounded-sm"
              onMouseEnter={() => setHovered(i)}
            >
              <img
                src={src}
                alt={`${label} ${i + 1}`}
                loading="lazy"
                className={`${
                  cropped ? "absolute max-w-none" : "h-full w-full object-cover"
                } cursor-pointer transition-opacity duration-300 ${
                  hovered === i
                    ? "opacity-100"
                    : hovered !== null
                      ? "opacity-50"
                      : "opacity-100"
                }`}
                style={cropStyle}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/** Cursor-follow magnifier for inspecting construction-grid lockups. */
function ZoomLensImage({
  src,
  alt,
  aspectRatio,
  zoom = LOGO_TYPOGRAPHY_ZOOM,
  lensPx = LOGO_TYPOGRAPHY_LENS_PX,
}: {
  src: string;
  alt: string;
  aspectRatio: string;
  zoom?: number;
  lensPx?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [cursor, setCursor] = useState({ px: 0, py: 0 });
  const [rect, setRect] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () =>
      setRect({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setCursor({ px: e.clientX - r.left, py: e.clientY - r.top });
  };

  const half = lensPx / 2;
  const bgW = rect.w * zoom;
  const bgH = rect.h * zoom;

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden rounded-sm"
      style={{ aspectRatio, cursor: active ? "none" : "crosshair" }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onMouseMove={onMove}
    >
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-contain object-center pointer-events-none"
        loading="lazy"
        draggable={false}
      />
      {active && rect.w > 0 && (
        <div
          className="pointer-events-none absolute z-10 hidden rounded-full border border-[#2200b8]/40 shadow-[0_0_0_1px_rgba(252,247,238,0.8)] md:block"
          style={{
            width: lensPx,
            height: lensPx,
            left: cursor.px - half,
            top: cursor.py - half,
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${bgW}px ${bgH}px`,
            backgroundPosition: `${half - cursor.px * zoom}px ${half - cursor.py * zoom}px`,
          }}
          aria-hidden
        />
      )}
    </div>
  );
}

/** Full-width 3×2 pattern gallery — edge crop, large gutters, grid-column hover expand. */
const PATTERN_GAP_PX = 40;

function PatternGallery({ images }: { images: readonly string[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tileH, setTileH] = useState<number | undefined>(undefined);
  const crop = NABAT_PATTERN_CROP;
  const scale = 100 / (100 - crop * 2);
  const rows = [images.slice(0, 3), images.slice(3, 6)] as const;

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      setTileH((w - PATTERN_GAP_PX * 2) / 3);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex w-full flex-col"
      style={{ gap: PATTERN_GAP_PX }}
      onMouseLeave={() => setHovered(null)}
    >
      {rows.map((row, ri) => {
        const rowStart = ri * 3;
        const rowHovered =
          hovered !== null && hovered >= rowStart && hovered < rowStart + 3;
        const cols = row
          .map((_, ci) =>
            rowHovered ? (hovered === rowStart + ci ? "4fr" : "1fr") : "1fr",
          )
          .join(" ");

        return (
          <div
            key={ri}
            className="grid w-full min-h-0"
            style={{
              gridTemplateColumns: cols,
              gap: PATTERN_GAP_PX,
              height: tileH,
              transition: "grid-template-columns 0.35s ease",
            }}
          >
            {row.map((src, ci) => {
              const idx = rowStart + ci;
              const isHovered = hovered === idx;
              const anyHovered = hovered !== null;
              return (
                <div
                  key={src}
                  className="relative min-h-0 min-w-0 overflow-hidden rounded-sm"
                  onMouseEnter={() => setHovered(idx)}
                >
                  <img
                    src={src}
                    alt={`Pattern ${idx + 1}`}
                    loading="lazy"
                    className={`absolute inset-0 max-w-none cursor-pointer transition-opacity duration-300 ${
                      isHovered
                        ? "opacity-100"
                        : anyHovered
                          ? "opacity-50"
                          : "opacity-100"
                    }`}
                    style={{
                      width: `${scale * 100}%`,
                      height: `${scale * 100}%`,
                      left: `${((1 - scale) / 2) * 100}%`,
                      top: `${((1 - scale) / 2) * 100}%`,
                      objectFit: "cover",
                    }}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Static 2-row swatch grid: 3 true squares + 1 wide cell (= 3 squares + 2 gaps).
 * All gutters equal. No hover.
 */
function NabatColorPalette() {
  const hexes = NABAT_PALETTE_ROWS.flat();
  return (
    <div
      className="grid w-full min-w-0 gap-4"
      style={{ gridTemplateColumns: "repeat(6, minmax(0, 1fr))" }}
      role="img"
      aria-label={`Nabat color palette: ${hexes.join(", ")}`}
    >
      {NABAT_PALETTE_ROWS.map((row) => (
        <div key={row.join("-")} className="contents">
          {row.slice(0, 3).map((hex) => (
            <div
              key={hex}
              className="aspect-square min-h-0 min-w-0 rounded-none"
              style={{ backgroundColor: hex }}
            />
          ))}
          <div
            className="col-span-3 min-h-0 min-w-0 rounded-none"
            style={{
              backgroundColor: row[3],
              boxShadow:
                row[3] === NABAT_PALETTE_IVORY
                  ? `inset 0 0 0 1px ${NABAT_PALETTE_IVORY_STROKE}`
                  : undefined,
            }}
          />
        </div>
      ))}
    </div>
  );
}

function NabatTypography() {
  return (
    <div
      className="w-full min-w-0 overflow-hidden"
      style={{ aspectRatio: TYPOGRAPHY_SVG_ASPECT }}
    >
      <img
        src={TYPOGRAPHY_SVG}
        alt="Nabat typography"
        className="h-full w-full object-contain object-left"
        loading="lazy"
      />
    </div>
  );
}

/**
 * Same 5-col track as Visual Language content (page cols 3–7):
 * palette → end of col 5, typography SVG on cols 6–7.
 */
function NabatPaletteAndTypography() {
  return (
    <div className="grid grid-cols-5 items-start gap-x-[var(--grid-gutter)]">
      <div className="col-span-3 min-w-0">
        <NabatColorPalette />
      </div>
      <div className="col-span-2 min-w-0">
        <NabatTypography />
      </div>
    </div>
  );
}

/** WWL dock-style hover: hovered sketch grows, peers shrink + dim. Full content width (cols 3–7). */
const SKETCH_IDLE_GAP = 16;
const SKETCH_HOVER_GAP = 28;
const SKETCH_HOVERED_SCALE = 1.35;
const SKETCH_PEER_SCALE = 0.92;

function LogoSketchStrip({ images }: { images: readonly string[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [thumbWidth, setThumbWidth] = useState<number | null>(null);
  const { ref: dragRef, onMouseDown } = useDragScroll();
  const count = images.length;

  useEffect(() => {
    const measure = () => {
      if (!stripRef.current) return;
      const containerW = stripRef.current.offsetWidth;
      const totalGaps = SKETCH_IDLE_GAP * (count - 1);
      setThumbWidth((containerW - totalGaps) / count);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [count]);

  const dockActive = hoveredIdx !== null;
  const gap = dockActive ? SKETCH_HOVER_GAP : SKETCH_IDLE_GAP;
  /** Fixed slot = max hover height so Final Logo never shifts; items grow from vertical center. */
  const stripSlot = thumbWidth
    ? thumbWidth * SKETCH_HOVERED_SCALE
    : undefined;
  const sketchMotion =
    "width 0.32s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease-out";

  return (
    <>
      <div
        ref={dragRef}
        onMouseDown={onMouseDown}
        className="md:hidden overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
      >
        <div className="flex w-max items-center gap-4 pr-[20%]">
          {images.map((src, i) => (
            <div key={src} className="h-28 w-28 shrink-0">
              <img
                src={src}
                alt={`Logo sketch ${i + 1}`}
                className="h-full w-full object-contain pointer-events-none"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      <div
        ref={stripRef}
        className="hidden w-full overflow-visible md:block"
        style={{ height: stripSlot }}
        onMouseLeave={() => setHoveredIdx(null)}
      >
        <div
          className="flex h-full items-center justify-between overflow-visible"
          style={{
            gap,
            transition: "gap 0.32s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {images.map((src, i) => {
            const isHovered = hoveredIdx === i;
            const isDimmed = dockActive && !isHovered;
            return (
              <div
                key={src}
                className="shrink-0 cursor-pointer"
                style={{
                  width: thumbWidth
                    ? dockActive
                      ? isHovered
                        ? thumbWidth * SKETCH_HOVERED_SCALE
                        : thumbWidth * SKETCH_PEER_SCALE
                      : thumbWidth
                    : undefined,
                  opacity: isDimmed ? 0.5 : 1,
                  transition: sketchMotion,
                }}
                onMouseEnter={() => setHoveredIdx(i)}
              >
                <img
                  src={src}
                  alt={`Logo sketch ${i + 1}`}
                  className="aspect-square w-full object-contain pointer-events-none"
                  loading="lazy"
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function PackageCycler({
  images,
  cover = false,
  initialDelay = 0,
  cycleMs = PACKAGE_CYCLE_MS,
  onOpen,
}: {
  images: readonly string[];
  cover?: boolean;
  /** ms before the first tick so hero / single do not switch in sync */
  initialDelay?: number;
  cycleMs?: number;
  onOpen?: (src: string) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [mounted, setMounted] = useState<Set<number>>(() => new Set([0]));
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;

    let intervalId = 0;
    const startId = window.setTimeout(() => {
      const nextIdx = 1 % images.length;
      setMounted((s) => (s.has(nextIdx) ? s : new Set(s).add(nextIdx)));

      intervalId = window.setInterval(() => {
        if (!visibleRef.current) return;

        setActiveIndex((prev) => {
          setPrevIndex(prev);
          const next = (prev + 1) % images.length;
          const upcoming = (next + 1) % images.length;
          setMounted((s) =>
            s.has(upcoming) ? s : new Set(s).add(upcoming),
          );
          return next;
        });
      }, cycleMs);
    }, Math.max(0, initialDelay - 1000));

    return () => {
      window.clearTimeout(startId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [images.length, initialDelay, cycleMs]);

  const fitClass = cover ? "object-cover" : "object-contain";

  return (
    <div
      ref={containerRef}
      className="relative h-full min-h-0 w-full cursor-pointer overflow-hidden rounded-sm bg-[#f3eee4]"
      onClick={() => onOpen?.(images[activeIndex])}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onKeyDown={
        onOpen
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpen(images[activeIndex]);
              }
            }
          : undefined
      }
      aria-label="Open package image"
    >
      <img
        src={images[prevIndex]}
        alt=""
        aria-hidden
        className={`pointer-events-none absolute inset-0 h-full w-full ${fitClass} object-center`}
        decoding="async"
      />
      {images.map((src, idx) =>
        mounted.has(idx) ? (
          <img
            key={src}
            src={src}
            alt={`Nabat package color option ${idx + 1}`}
            className={`pointer-events-none absolute inset-0 h-full w-full ${fitClass} object-center transition-opacity ease-in-out ${
              idx === activeIndex ? "opacity-100 z-[1]" : "opacity-0 z-0"
            }`}
            style={{ transitionDuration: `${PACKAGE_FADE_MS}ms` }}
            decoding="async"
          />
        ) : null,
      )}
    </div>
  );
}

const LIGHTBOX_ZOOM_MIN = 1;
const LIGHTBOX_ZOOM_MAX = 2;
const LIGHTBOX_ZOOM_STEP = 0.25;

function LightboxIcon({
  children,
  className = "h-5 w-5",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

function PackageLightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: {
  images: readonly string[];
  index: number;
  onClose: () => void;
  onIndexChange: (next: number) => void;
}) {
  const [zoom, setZoom] = useState(LIGHTBOX_ZOOM_MIN);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  const clampPan = useCallback((x: number, y: number, z: number) => {
    const vp = viewportRef.current;
    const img = imgRef.current;
    if (!vp || !img || !img.naturalWidth || z <= LIGHTBOX_ZOOM_MIN) {
      return { x: 0, y: 0 };
    }
    const vw = vp.clientWidth;
    const vh = vp.clientHeight;
    const fit = Math.min(vw / img.naturalWidth, vh / img.naturalHeight);
    const baseW = img.naturalWidth * fit;
    const baseH = img.naturalHeight * fit;
    const maxX = Math.max(0, (baseW * z - vw) / 2);
    const maxY = Math.max(0, (baseH * z - vh) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    setZoom(LIGHTBOX_ZOOM_MIN);
    setPan({ x: 0, y: 0 });
  }, [index]);

  useEffect(() => {
    setPan((p) => clampPan(p.x, p.y, zoom));
  }, [zoom, clampPan]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && zoom <= LIGHTBOX_ZOOM_MIN) {
        onIndexChange((index - 1 + images.length) % images.length);
      }
      if (e.key === "ArrowRight" && zoom <= LIGHTBOX_ZOOM_MIN) {
        onIndexChange((index + 1) % images.length);
      }
      // When zoomed: arrow keys travel inside the image
      if (zoom > LIGHTBOX_ZOOM_MIN) {
        const step = 80;
        if (e.key === "ArrowLeft") setPan((p) => clampPan(p.x + step, p.y, zoom));
        if (e.key === "ArrowRight") setPan((p) => clampPan(p.x - step, p.y, zoom));
        if (e.key === "ArrowUp") setPan((p) => clampPan(p.x, p.y + step, zoom));
        if (e.key === "ArrowDown") setPan((p) => clampPan(p.x, p.y - step, zoom));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length, onClose, onIndexChange, zoom, clampPan]);

  const applyZoom = (next: number) => {
    const z = Math.min(LIGHTBOX_ZOOM_MAX, Math.max(LIGHTBOX_ZOOM_MIN, next));
    setZoom(z);
    if (z <= LIGHTBOX_ZOOM_MIN) setPan({ x: 0, y: 0 });
    else setPan((p) => clampPan(p.x, p.y, z));
  };

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheelNative = (e: globalThis.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -LIGHTBOX_ZOOM_STEP * 0.5 : LIGHTBOX_ZOOM_STEP * 0.5;
      setZoom((z) => {
        const next = Math.min(LIGHTBOX_ZOOM_MAX, Math.max(LIGHTBOX_ZOOM_MIN, z + delta));
        if (next <= LIGHTBOX_ZOOM_MIN) setPan({ x: 0, y: 0 });
        else setPan((p) => clampPan(p.x, p.y, next));
        return next;
      });
    };
    el.addEventListener("wheel", onWheelNative, { passive: false });
    return () => el.removeEventListener("wheel", onWheelNative);
  }, [clampPan]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (zoom <= LIGHTBOX_ZOOM_MIN) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    dragRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || zoom <= LIGHTBOX_ZOOM_MIN) return;
    const next = {
      x: dragRef.current.panX + (e.clientX - dragRef.current.x),
      y: dragRef.current.panY + (e.clientY - dragRef.current.y),
    };
    setPan(clampPan(next.x, next.y, zoom));
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    dragRef.current = null;
    setDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
      role="dialog"
      aria-modal="true"
      aria-label="Package image viewer"
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute right-4 top-4 z-[2] flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
        aria-label="Close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <LightboxIcon>
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
        </LightboxIcon>
      </button>

      <button
        type="button"
        className="absolute left-3 top-1/2 z-[2] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 md:left-6"
        aria-label="Previous image"
        onClick={(e) => {
          e.stopPropagation();
          onIndexChange((index - 1 + images.length) % images.length);
        }}
      >
        <LightboxIcon className="h-6 w-6">
          <path d="M15 18l-6-6 6-6" />
        </LightboxIcon>
      </button>
      <button
        type="button"
        className="absolute right-3 top-1/2 z-[2] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 md:right-6"
        aria-label="Next image"
        onClick={(e) => {
          e.stopPropagation();
          onIndexChange((index + 1) % images.length);
        }}
      >
        <LightboxIcon className="h-6 w-6">
          <path d="M9 18l6-6-6-6" />
        </LightboxIcon>
      </button>

      <div
        className="absolute bottom-6 left-1/2 z-[2] flex -translate-x-1/2 items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 disabled:opacity-40"
          aria-label="Zoom out"
          disabled={zoom <= LIGHTBOX_ZOOM_MIN}
          onClick={() => applyZoom(zoom - LIGHTBOX_ZOOM_STEP)}
        >
          <LightboxIcon>
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
            <path d="M8 11h6" />
          </LightboxIcon>
        </button>
        <span className="min-w-[3rem] text-center text-sm text-white/80 tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 disabled:opacity-40"
          aria-label="Zoom in"
          disabled={zoom >= LIGHTBOX_ZOOM_MAX}
          onClick={() => applyZoom(zoom + LIGHTBOX_ZOOM_STEP)}
        >
          <LightboxIcon>
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
            <path d="M11 8v6" />
            <path d="M8 11h6" />
          </LightboxIcon>
        </button>
      </div>

      {/* Viewport: pan stays inside; drag = travel within the zoomed image */}
      <div
        ref={viewportRef}
        className="absolute inset-12 overflow-hidden md:inset-16"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          cursor: zoom > LIGHTBOX_ZOOM_MIN ? (dragging ? "var(--cursor-grabbing)" : "var(--cursor-grab)") : "var(--cursor-default)",
          touchAction: "none",
        }}
      >
        <img
          ref={imgRef}
          src={images[index]}
          alt={`Package image ${index + 1} of ${images.length}`}
          className="pointer-events-none absolute left-1/2 top-1/2 max-h-full max-w-full select-none object-contain"
          style={{
            transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            willChange: "transform",
          }}
          draggable={false}
          onLoad={() => setPan((p) => clampPan(p.x, p.y, zoom))}
        />
      </div>
    </div>
  );
}

function PackagingGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openSrc = useCallback((src: string) => {
    const idx = PACKAGE_LIGHTBOX_IMAGES.indexOf(src as (typeof PACKAGE_LIGHTBOX_IMAGES)[number]);
    setLightboxIndex(idx >= 0 ? idx : 0);
  }, []);

  const openIndex = useCallback((idx: number) => {
    setLightboxIndex(idx);
  }, []);

  return (
    <div className={`flex w-full min-w-0 flex-col ${gapSubtitleClass}`}>
      {/* Hero — cycles IMG 11 / 12 / 13 */}
      <div className="relative w-full cursor-pointer overflow-hidden rounded-sm bg-[#f3eee4] aspect-[2/1]">
        <PackageCycler
          images={PACKAGE_HERO_CYCLING}
          cover
          initialDelay={0}
          cycleMs={PACKAGE_HERO_CYCLE_MS}
          onOpen={openSrc}
        />
      </div>

      {/* Mobile: stacked */}
      <div className="md:hidden flex flex-col gap-[var(--grid-gutter)]">
        <ReelsVideo src={REELS_VIDEO} className="w-full aspect-[9/16]" />
        <div className="aspect-[3/4] cursor-pointer">
          <PackageCycler
            images={PACKAGE_CYCLING}
            initialDelay={PACKAGE_SINGLE_DELAY_MS}
            onOpen={openSrc}
          />
        </div>
        <div className="grid grid-cols-2 gap-[var(--grid-gutter)]">
          <button
            type="button"
            className="relative cursor-pointer overflow-hidden rounded-sm bg-[#f3eee4] aspect-square"
            onClick={() => openIndex(3)}
            aria-label="Open green package image"
          >
            <img src={PKG_TOP_LEFT} alt="Nabat green package from above" className="absolute inset-0 h-full w-full object-cover pointer-events-none" loading="lazy" decoding="async" />
          </button>
          <button
            type="button"
            className="relative cursor-pointer overflow-hidden rounded-sm bg-[#f3eee4] aspect-[2/3]"
            onClick={() => openIndex(4)}
            aria-label="Open glass jar image"
          >
            <img src={PKG_TOP_CENTER} alt="Nabat glass jar display" className="absolute inset-0 h-full w-full object-cover pointer-events-none" loading="lazy" decoding="async" />
          </button>
          <button
            type="button"
            className="relative cursor-pointer overflow-hidden rounded-sm bg-[#f3eee4] aspect-square"
            onClick={() => openIndex(5)}
            aria-label="Open pink package image"
          >
            <img src={PKG_BOTTOM_LEFT} alt="Nabat pink package" className="absolute inset-0 h-full w-full object-cover pointer-events-none" loading="lazy" decoding="async" />
          </button>
        </div>
      </div>

      {/* Desktop: reels video left | side stills center | cycling single package right */}
      <div
        className="hidden md:grid gap-[var(--grid-gutter)]"
        style={{ gridTemplateColumns: "1.7fr 1fr 1fr 1.7fr", gridTemplateRows: "1fr 1fr" }}
      >
        <ReelsVideo src={REELS_VIDEO} className="min-h-0 min-w-0 row-span-2 h-full" />
        <button
          type="button"
          className="relative min-h-0 min-w-0 cursor-pointer overflow-hidden rounded-sm bg-[#f3eee4]"
          onClick={() => openIndex(3)}
          aria-label="Open green package image"
        >
          <img src={PKG_TOP_LEFT} alt="Nabat green package from above" className="absolute inset-0 h-full w-full object-cover pointer-events-none" loading="lazy" decoding="async" />
        </button>
        <button
          type="button"
          className="relative min-h-0 min-w-0 cursor-pointer overflow-hidden rounded-sm bg-[#f3eee4]"
          onClick={() => openIndex(4)}
          aria-label="Open glass jar image"
        >
          <img src={PKG_TOP_CENTER} alt="Nabat glass jar display" className="absolute inset-0 h-full w-full object-cover pointer-events-none" loading="lazy" decoding="async" />
        </button>
        <div className="relative min-h-0 min-w-0 cursor-pointer overflow-hidden rounded-sm bg-[#f3eee4] row-span-2">
          <PackageCycler
            images={PACKAGE_CYCLING}
            cover
            initialDelay={PACKAGE_SINGLE_DELAY_MS}
            onOpen={openSrc}
          />
        </div>
        <button
          type="button"
          className="relative min-h-0 min-w-0 cursor-pointer overflow-hidden rounded-sm bg-[#f3eee4] col-span-2"
          onClick={() => openIndex(5)}
          aria-label="Open pink package image"
        >
          <img src={PKG_BOTTOM_LEFT} alt="Nabat pink package" className="absolute inset-0 h-full w-full object-cover pointer-events-none" loading="lazy" decoding="async" />
        </button>
      </div>

      {lightboxIndex !== null && (
        <PackageLightbox
          images={PACKAGE_LIGHTBOX_IMAGES}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </div>
  );
}

function PostersGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div className={`flex w-full min-w-0 flex-col ${gapSubtitleClass}`}>
      {/* Featured poster — centered, larger */}
      <button
        type="button"
        className="mx-auto w-full max-w-[42%] cursor-pointer overflow-hidden rounded-sm bg-[#f3eee4]"
        onClick={() => setLightboxIndex(0)}
        aria-label="Open featured Nabat poster"
      >
        <img
          src={NABAT_POSTER_FEATURED}
          alt="Nabat poster featured"
          className="h-auto w-full object-contain pointer-events-none"
          loading="lazy"
          decoding="async"
        />
      </button>

      {/* Three posters in a row */}
      <div className="grid grid-cols-3 gap-[var(--grid-gutter)]">
        {NABAT_POSTERS_ROW.map((src, i) => (
          <button
            type="button"
            key={src}
            className="min-w-0 cursor-pointer overflow-hidden rounded-sm bg-[#f3eee4]"
            onClick={() => setLightboxIndex(i + 1)}
            aria-label={`Open Nabat poster ${i + 2}`}
          >
            <img
              src={src}
              alt={`Nabat poster ${i + 2}`}
              className="h-auto w-full object-contain pointer-events-none"
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <PackageLightbox
          images={NABAT_POSTERS}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </div>
  );
}

interface NabatProps {
  onSelectSection: (id: string) => void;
  onReady?: () => void;
}

export default function Nabat({ onSelectSection, onReady }: NabatProps) {
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
      <div className="min-h-screen flex flex-col">
        <ProjectHeroVideo
          src={HERO_VIDEO}
          sizeToMedia
          shellFillClass="bg-[#fcf7ee]"
        />

        <section className="flex-1 flex flex-col justify-start md:justify-center">
          <PageGrid className={sectionPageGridStretchClass}>
            <div
              className={`[grid-column:1/-1] md:[grid-column:2/8] flex min-w-0 flex-col ${gapSubtitleClass} ${sectionColumnPaddingClass} pb-0`}
            >
              <h3 className={projectHeroNameClass}>NABAT</h3>
              <p className={`${subTitleClass} leading-[1.5]`}>{NABAT_SUBTITLE}</p>
            </div>

            <div className="[grid-column:1/-1] md:[grid-column:2/8] flex flex-wrap items-center gap-y-3 gap-x-8 md:gap-x-12 py-4">
              {NABAT_INTRO_TAGS.map((label) => (
                <span
                  key={label}
                  className={`${smallTitleClass} inline-flex border border-[#2200b8] px-3 py-1`}
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="[grid-column:1/-1] md:[grid-column:2/8] flex flex-col md:flex-row md:justify-between gap-y-6 gap-x-[var(--grid-gutter)]">
              <IntroToggle label="Brief" className="md:w-2/6 md:shrink-0">
                <p className={bodyTextClass}>{NABAT_BRIEF}</p>
              </IntroToggle>
              <IntroToggle label="Concept" className="md:w-2/6 md:shrink-0">
                <p className={bodyTextClass}>{NABAT_CONCEPT}</p>
              </IntroToggle>
              <IntroToggle label="Tools" className="md:shrink-0">
                <ul className={`${bodyTextClass} list-none space-y-1`}>
                  {NABAT_TOOLS.map((tool) => (
                    <li key={tool}>{tool}</li>
                  ))}
                </ul>
              </IntroToggle>
            </div>

            <div
              className={`[grid-column:1/-1] md:[grid-column:2/8] mt-6 md:mt-10 ${sectionColumnPaddingClass} pt-0`}
            >
              <NabatAutoLoopVideo
                src={OVERVIEW_VIDEO}
                className="w-full aspect-video"
                ariaLabel="Nabat overview"
              />
            </div>
          </PageGrid>
        </section>
      </div>

      <div className="w-full border-t border-[#2200b8]" />

      <section>
        <MobileStickyTitle>Research</MobileStickyTitle>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className={TITLE_COL_DESKTOP_CLASS}>
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Research</h2>
          </div>

          <div
            className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col ${gapContentClass} ${sectionColumnPaddingClass}`}
          >
            <ResearchCarousel />

            <InspirationRowGallery
              images={CRYSTAL_IMAGES}
              label="Crystal forming"
              cropX={CRYSTAL_IMAGE_CROP.x}
              cropY={CRYSTAL_IMAGE_CROP.y}
              tileAspect={16 / 9}
            />
          </div>
        </PageGrid>
      </section>

      <div className="w-full border-t border-[#2200b8]" />

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
              alt="Nabat brand identity overview"
              className="h-auto w-full object-contain"
              loading="lazy"
            />
          </div>
        </PageGrid>
      </section>

      <div className="w-full border-t border-[#2200b8]" />

      <section>
        <MobileStickyTitle>Visual Language</MobileStickyTitle>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className={TITLE_COL_DESKTOP_CLASS}>
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Visual Language</h2>
          </div>

          <div
            className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col ${gapContentClass} ${sectionColumnPaddingClass}`}
          >
            <div className={`flex flex-col ${gapIntroClass}`}>
              <h3 className={subTitleClass}>Inspirations</h3>
              <div className="flex flex-col gap-[calc(var(--gap-content)/1.5)]">
                {INSPIRATION_GROUPS.map((group) => (
                  <div key={group.title} className={`flex flex-col ${gapSubtitleClass}`}>
                    <h4 className={smallTitleClass}>{group.title}</h4>
                    <p className={`${bodyTextClass} lg:max-w-[80%]`}>{group.body}</p>
                    <InspirationRowGallery images={group.images} label={group.title} />
                  </div>
                ))}
              </div>
            </div>

            <div className={`flex flex-col ${gapSubtitleClass}`}>
              <h3 className={subTitleClass}>Color Palette & Typography</h3>
              <NabatPaletteAndTypography />
            </div>

            <div className={`flex flex-col ${gapIntroClass}`}>
              <h3 className={subTitleClass}>Logo</h3>

              <div className={`flex flex-col ${gapSubtitleClass}`}>
                <h4 className={smallTitleClass}>First Sketches</h4>
                <LogoSketchStrip images={LOGO_SKETCHES} />
              </div>

              <div className="grid w-full grid-cols-1 md:grid-cols-5 gap-x-[var(--grid-gutter)] gap-y-6 md:items-stretch">
                <div className={`md:col-span-2 flex min-h-0 flex-col ${gapSubtitleClass}`}>
                  <h4 className={smallTitleClass}>Final Logo</h4>
                  <div className="flex min-h-0 flex-1 items-center justify-center self-stretch">
                    <img
                      src={LOGO_FINAL}
                      alt="Nabat final logo"
                      className="h-full max-h-full w-auto max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div
                  className={`md:col-start-4 md:col-span-2 flex min-h-0 flex-col ${gapSubtitleClass}`}
                >
                  <h4 className={smallTitleClass}>Logotype Options</h4>
                  <div className="flex flex-col gap-3">
                    {LOGO_TYPOGRAPHY_OPTIONS.map((src, i) => (
                      <div
                        key={src}
                        className="overflow-hidden rounded-sm bg-[#ebe6dc]"
                      >
                        <img
                          src={src}
                          alt={`Logotype option ${i + 1}`}
                          className="h-auto w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`flex flex-col ${gapSubtitleClass}`}>
                <h4 className={smallTitleClass}>Final Logotype</h4>
                <ZoomLensImage
                  src={LOGO_TYPOGRAPHY_FINAL}
                  alt="Selected logotype with construction lines"
                  aspectRatio={LOGO_TYPOGRAPHY_FINAL_ASPECT}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {LOGO_COLORS.map((src, i) => (
                  <div key={src} className="min-w-0 overflow-hidden rounded-sm">
                    <img
                      src={src}
                      alt={`Logo color application ${i + 1}`}
                      className="h-auto w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>

              <div className="w-full overflow-hidden rounded-sm">
                <img
                  src={LOGO_FULL}
                  alt="Nabat full logo lockup"
                  className="h-auto w-full object-contain"
                  loading="lazy"
                />
              </div>
            </div>

            <div className={`flex flex-col ${gapIntroClass}`}>
              <div className={`flex flex-col ${gapSubtitleClass}`}>
                <h3 className={subTitleClass}>Shapes & Patterns</h3>
                <p className={`${bodyTextClass} lg:max-w-[80%]`}>
                  I deconstructed the logo into shapes and used them to create identifying forms and
                  patterns.
                </p>
              </div>

              <NabatLogoMarkHover />

              <div className="grid grid-cols-3 items-end gap-x-[var(--grid-gutter)] gap-y-6">
                {NABAT_SHAPES.map((src, i) => (
                  <div key={src} className="flex min-w-0 items-center justify-center">
                    <img
                      src={src}
                      alt={`Brand shape ${i + 1}`}
                      className="h-auto w-[90%] max-w-[220px] object-contain"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>

              <PatternGallery images={NABAT_PATTERNS} />
            </div>
          </div>
        </PageGrid>
      </section>

      <div className="w-full border-t border-[#2200b8]" />

      <section>
        <MobileStickyTitle>Deliverables</MobileStickyTitle>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className={TITLE_COL_DESKTOP_CLASS}>
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Deliverables</h2>
          </div>

          <div
            className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col ${gapContentClass} ${sectionColumnPaddingClass}`}
          >
            <div className={`flex min-w-0 flex-col ${gapSubtitleClass}`}>
              <h3 className={subTitleClass}>Packaging</h3>
              <PackagingGallery />
            </div>
            <div className={`flex min-w-0 flex-col ${gapSubtitleClass}`}>
              <h3 className={subTitleClass}>Posters</h3>
              <PostersGallery />
            </div>
            <div className={`flex min-w-0 flex-col ${gapSubtitleClass}`}>
              <h3 className={subTitleClass}>Website</h3>
              <a
                href={WEBSITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`${bodyTextClass} w-fit underline underline-offset-2 transition-colors hover:text-[#ff0090]`}
              >
                nabatcandy.vercel.app
              </a>
              <p className={bodyTextClass}>
                Using Cursor AI, I built a full e-commerce website that showcases
                products and brand accessories while telling the brand story.
              </p>
              <a
                href={WEBSITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <NabatAutoLoopVideo
                  src={WEBSITE_VIDEO}
                  className="w-full aspect-video"
                  ariaLabel="Nabat website screen recording"
                  cropX={WEBSITE_VIDEO_CROP_X}
                />
              </a>
            </div>
          </div>
        </PageGrid>
      </section>

      <ProjectNav currentProject="nabat" onSelectSection={onSelectSection} />
    </div>
  );
}
