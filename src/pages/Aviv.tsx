import { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "motion/react";

import { cloudinaryUrl } from "../lib/cloudinary";
import {
  stickyTitleClass,
  projectNameClass,
  subTitleClass,
  smallTitleClass,
  bodyTextClass,
} from "../lib/typography";
import {
  sectionPageGridClass,
  sectionPageGridStretchClass,
  sectionColumnPaddingClass,
} from "../lib/sectionLayout";
import {
  gapContentClass,
  gapContentLgClass,
  gapHeroTightClass,
  gapIntroClass,
  gapScreenRowClass,
  gapSplitClass,
  gapSubtitleClass,
  gapThumbClass,
  gapTightStripClass,
  radiusPhoneLargeClass,
  radiusPhoneMediumClass,
  radiusPhoneSmallClass,
  radiusPhoneXsClass,
} from "../lib/spacing";
import { PageGrid } from "../components/PageGrid";
import { MobileStickyTitle, TITLE_COL_DESKTOP_CLASS } from "../components/MobileStickyTitle";
import { ProjectHeroVideo, PROJECT_HERO_VIDEO_SHELL_CLASS } from "../components/ProjectHeroVideo";
import { ProjectNav } from "../components/ProjectNav";
import { useDragScroll } from "../hooks/useDragScroll";
import { usePaletteBarsReveal } from "../hooks/usePaletteBarsReveal";

const Q = "auto:best";

// ─── Videos ───
const VID_YARKON = cloudinaryUrl("AvivYarkonVID_a4xfcu_jo4k4e.mp4", { resourceType: "video", quality: Q });
const VID_LONDON = cloudinaryUrl("AvivLondonVID_vuhvsu_wwikzn.mp4", { resourceType: "video", quality: Q });
const VID_KINNERET = cloudinaryUrl("AvivKinneretVID_qaoohu_bebd3j.mp4", { resourceType: "video", quality: Q });
const VID_ARAD = cloudinaryUrl("AvivAradVId_m7g5vv_nhd5kb.mp4", { resourceType: "video", quality: Q });
const VID_FLOWER_NAV = cloudinaryUrl("AvivNavigationflrVID_csziwc_v60mlr.mp4", { resourceType: "video", quality: Q });
const VID_WEATHER_TOGGLE = cloudinaryUrl("AvivWeatherToggleVId_myol9c_q5yenz.mp4", { resourceType: "video", quality: Q });
const VID_RECOMMENDATIONS = cloudinaryUrl("AvivRecomenndationsVID_zwewvy_frlyxn.mp4", { resourceType: "video", quality: Q });
const VID_CONFESSIONS_PROMO = cloudinaryUrl("AvivConfessionPromoVID_aonwpa.mp4", { resourceType: "video", quality: Q });
const VID_FEAT_OPENING = cloudinaryUrl("OpeaningVID_hfeqwz_rrawpe.mp4", { resourceType: "video", quality: Q });
const VID_FEAT_WRITING = cloudinaryUrl("ConffesionWritingVID_g07a1h_xl8kkg.mp4", { resourceType: "video", quality: Q });
const VID_FEAT_READING = cloudinaryUrl("ConfessionsReadVID_xqhfhu_e6woin.mp4", { resourceType: "video", quality: Q });
const VID_FEAT_MY_CONFESSIONS = cloudinaryUrl("MyConfessionsVID_x6oqfy_ysc29x.mp4", { resourceType: "video", quality: Q });


// ─── Hero ───
const HERO_VIDEO_LOCAL = cloudinaryUrl("AvivVideoConffessions_qnockg.mp4", { resourceType: "video", quality: Q });
const HERO_POSTER = cloudinaryUrl("herobanner_skeleton_moonlight_pvl3nu.png", { quality: Q });

// ─── Laptop Mockup ───
const LAPTOP_FRAME = cloudinaryUrl("laptop_background4vid_c4wggn.png", { quality: Q });
const LAPTOP_SCREEN_VIDEO = cloudinaryUrl("LandingPageVID_v5kfo6_ub6zqx.mp4", { resourceType: "video", quality: Q });

// ─── Concept Splash ───
const SPLASH_VIDEO_LOCAL = cloudinaryUrl("AvivSplashVID_fweccx_cpzzvd.mp4", { resourceType: "video", quality: Q });

// ─── Concept ───
const APP_ICON = cloudinaryUrl("AvivClodyNowAPPICON_fud50k_wqp1uq.png", { quality: Q });
const MOCKUPS_CLOUDY_NOW = cloudinaryUrl("AvivMockupsCloudyNow_devoll_ydssnx.png", { quality: Q });

// ─── App Mockups ───
const APP_MOCKUP_01 = cloudinaryUrl("AvivAppMockup01_f2fycm_wbwgb7.png", { quality: Q });
const APP_MOCKUP_02 = cloudinaryUrl("AvivAppMockup02_xpdcjn_dai3nq.png", { quality: Q });
const APP_MOCKUP_03 = cloudinaryUrl("AvivAppMockup03_ri0els_s2gmhl.png", { quality: Q });

// ─── App Sketches ───
const APP_SKETCHES = [
  cloudinaryUrl("AvivAppSketch1_f6icr8_uhatvz.png", { quality: Q }),
  cloudinaryUrl("AvivAppSketch2_siuscr_bj2lc2.png", { quality: Q }),
  cloudinaryUrl("AvivAppSketch3_wob0of_jqeqqy.png", { quality: Q }),
  cloudinaryUrl("AvivAppSketch4_ndxogs_rnsvmx.png", { quality: Q }),
  cloudinaryUrl("AvivAppSketch5_gqavue_vh4bz6.png", { quality: Q }),
  cloudinaryUrl("AvivAppSketch6_cpodic_enwmsa.png", { quality: Q }),
  cloudinaryUrl("AvivAppSketch6_2_q3yrn9_gkvf6a.png", { quality: Q }),
  cloudinaryUrl("AvivAppSketch7_dcmoft_syn9an.png", { quality: Q }),
];

// ─── Weather Elements (SVG) ───
const MOON_SVG = cloudinaryUrl("Moon1_prb2q8_wpvtpj.svg");
const CLOUD_SVG = cloudinaryUrl("Cloud1_hclcuw_x4uvwk.png");
const LIGHTNING_SVG = cloudinaryUrl("Lightning1_qhayao.svg");
const SUN_SVG = cloudinaryUrl("Sun1_h0j8wr_e8t9m9.svg");

// ─── Weather Icons (SVG) ───
const CLOUDY_ICON = cloudinaryUrl("cloudy_icon_ufgdxn_p83aax.png");
const PARTLY_CLOUDY_ICON = cloudinaryUrl("partlysunny_icon_hrxjfr_op9py4.png", { quality: Q });
const RAIN_ICON = cloudinaryUrl("rainy_icon_l3ijyy_oi5ltf.png");
const SUNNY_ICON = cloudinaryUrl("sunny_icon_mzxlq1_ybbl9z.png");

// ─── Navigation / Feature SVGs ───
const NAV_FLOWER_SVG = cloudinaryUrl("flower1_afuol0_ke3qlp.png");
const WEATHER_TOGGLE_SVG = cloudinaryUrl("toggle_daily_mpnmsz_i4r67y.svg");
const WEATHER_TOGGLE_WEEKLY_SVG = cloudinaryUrl("toggle_weekly_dtykrp_pd5xhn.svg");
const DAILY_REC_BTN = cloudinaryUrl("RecommendatinBTN1_t12uad.png", { quality: Q });
const DAILY_REC_BTN_2 = cloudinaryUrl("RecommendatinBTN2_hgiody.png", { quality: Q });

// ─── Weather element hover assets (cloud + lightning crossfade) ───
const CLOUD_SVG_HOVER = cloudinaryUrl("Cloud2_dm0fk0_rukznf.png");
const LIGHTNING_SVG_HOVER = cloudinaryUrl("Lightning2_wvrkby.svg");

// ─── Hebrew Song Title Images ───
const TXT_KINNERET = cloudinaryUrl("TXTMoonLight_wcjhps_sx3y7m.png");
const TXT_YARKON = cloudinaryUrl("TXTCloudyNow_vworxo_wrhywo.png");
const TXT_LONDON = cloudinaryUrl("TXTRain_whbnf5_w1iuf4.png");
const TXT_ARAD = cloudinaryUrl("TXTSun_2_rleq1n_izhk3e.png");


// ─── Hand-Drawn Typography Images ───
const HAND_DRAWN_TYPO = [
  cloudinaryUrl("Kinneret_hjhyse_xttd2n.png"),
  cloudinaryUrl("YarkonPark_sh27jr_aefqo0.png"),
  cloudinaryUrl("London_dmiq4w_cgevzx.png"),
  cloudinaryUrl("Arad_fkkuii_svrq0f.png"),
  cloudinaryUrl("22_xxxd1x_yyx3uu.png"),
  cloudinaryUrl("20_srsb00_nzuota.png"),
  cloudinaryUrl("14_evkx8s_y4sxvm.png"),
  cloudinaryUrl("28_qcxg3c_wrvyss.png"),
];

// ─── Color Palettes ───
const AVIV_PALETTE_BARS = [
  { fill: "#FADC98", hex: "FADC98", heightPct: 25, labelClass: "text-[#6b6b6b]" },
  { fill: "#FFFFFF", hex: "FFFFFF", heightPct: 45, labelClass: "text-[#6b6b6b]" },
  { fill: "#918DDB", hex: "918DDB", heightPct: 65, labelClass: "text-white" },
  { fill: "#EF0034", hex: "EF0034", heightPct: 85, labelClass: "text-white" },
  { fill: "#1B1F2A", hex: "1B1F2A", heightPct: 100, labelClass: "text-white" },
] as const;

const AVIV_PALETTE_BARS_2 = [
  { fill: "#FADC98", hex: "FADC98", heightPct: 18, labelClass: "text-[#6b6b6b]" },
  { fill: "#918DDB", hex: "918DDB", heightPct: 54, labelClass: "text-white" },
  { fill: "#FFFFFF", hex: "FFFFFF", heightPct: 63, labelClass: "text-[#6b6b6b]" },
  { fill: "#FFF5E1", hex: "FFF5E1", heightPct: 80, labelClass: "text-[#6b6b6b]" },
  { fill: "#1B1F2A", hex: "1B1F2A", heightPct: 100, labelClass: "text-white" },
] as const;

const ICONS_SKETCH = cloudinaryUrl("aviv_icons_sketch_cfbffk.png", { quality: Q });

// ─── Typography ───
const SIMPLER_FONT = cloudinaryUrl("AvivSimplerFONT_foekup_w9stzz.svg");
const TYPO_SKETCHES_CLOUDY = cloudinaryUrl("AvivSketchesTypographyCloudyNow_bzjvz3_jkm3ph.png", { quality: Q });

// ─── Phone Screens ───
const SCREEN_YARKON = cloudinaryUrl("AvivScreenYarkon_vlbdxg_gjvugt.png", { quality: Q });
const SCREEN_LONDON = cloudinaryUrl("AvivScreenLondon_nuqxpn_ahva8t.png", { quality: Q });
const SCREEN_KINNERET = cloudinaryUrl("AvivScreenKinneret_zummr2_z7dxnf.png", { quality: Q });
const SCREEN_ARAD = cloudinaryUrl("AvivScreenArad_ouyorj_s4qyro.png", { quality: Q });

const phoneScreenHoverClass =
  "w-[20%] shrink-0 transition-transform duration-300 ease-in hover:-translate-y-6";

// ─── Research ───
const AVIV_IMAGE = cloudinaryUrl("Aviv_Image_ugmujh_bmleri.png", { quality: Q });
const AVIV_IMAGE_2 = cloudinaryUrl("AvivImage2_phmgvt_egugvg.png", { quality: Q });

// ─── User Flow ───
const USER_FLOW = cloudinaryUrl("AvivUserFLOW_wqlgc8_jlbjjh.svg");

// ─── Confessions Mockup ───
const CONFESSIONS_MOCKUP = cloudinaryUrl("AvivConffesionMKUP_qffpsy_wms0fv.png", { quality: Q });

// ─── Confessions Sketches ───
const CNFSN_SKETCHES = [
  cloudinaryUrl("AvivCNFSNSketch1_sqiiqp_wtw8yb.png", { quality: Q }),
  cloudinaryUrl("AvivCNFSNsketch2_ynzmey_brh6ew.png", { quality: Q }),
  cloudinaryUrl("AvivCNFSNSketch3_qbncqb_xr1url.png", { quality: Q }),
  cloudinaryUrl("AvivCNFSNSketch4_oozbch_gjmx3b.png", { quality: Q }),
  cloudinaryUrl("AvivCNFSNSketch5_stver5_zunfju.png", { quality: Q }),
];

// ─── Confessions Typography ───
const CNFSN_TYPO = [
  cloudinaryUrl("AvivCNFSNtypo1_gkqlzj_xsihd6.png", { quality: Q }),
  cloudinaryUrl("AvivCNFSNtypo2_tw91f6_mazrcm.png", { quality: Q }),
  cloudinaryUrl("AvivCNFSNtypo3_wvwwyz_upqm2e.png", { quality: Q }),
  cloudinaryUrl("AvivCNFSNtypo4_ejbdps_cewyzd.png", { quality: Q }),
  cloudinaryUrl("AvivCNFSNtypo5_1_tissyd_jgqk0p.png", { quality: Q }),
  cloudinaryUrl("AvivCNFSNtypo5_2_ibz9n3_l6z57x.png", { quality: Q }),
  cloudinaryUrl("AvivCNFSNtypo6_rpjvt1_v9qfdq.png", { quality: Q }),
];
const CNFSN_TYPO_SKETCH = cloudinaryUrl("AvivCNFSNtypoSketch_qmyail_if2qcq.png", { quality: Q });

// ─── Desktop Screens ───
const DESKTOP_SCREENS = [
  cloudinaryUrl("AvivDesktopScreen01_gw4nek_zjywkh.png", { quality: Q }),
  cloudinaryUrl("AvivDesktopScreen02_q3gnwx_pmsjv5.png", { quality: Q }),
  cloudinaryUrl("AvivDesktopScreen03_e2qnt0_tp20i5.png", { quality: Q }),
  cloudinaryUrl("AvivDesktopScreen04_rjjf7p_xc9bjm.png", { quality: Q }),
  cloudinaryUrl("AvivDesktopScreen05_tkytzj_ltb0lj.png", { quality: Q }),
];

// ─── Buttons (SVG) ───
const BTN_X = cloudinaryUrl("AvivsBTNX_arvrp6_piwjmh.svg");
const BTN_SEND = cloudinaryUrl("AvivsBTNsend_rgf42g_nsgb8y.svg");
const BTN_PAPER = cloudinaryUrl("AvivsBTNpaper_cd3axy_usyark.svg");
const BTN_FULL_HRT = cloudinaryUrl("AvivsBTNfullhrt_o3zygy_ajj8h0.svg");
const BTN_BROKEN_HRT = cloudinaryUrl("AvivsBTNbrokenhrt_aarwlm_qum3qu.svg");

// ─── Secondary Buttons (SVG) ───
const BTN_ARROW_PLUS = cloudinaryUrl("AvivBTNarrowplus_f5mitp_dip0nn.svg");
const BTN_ARROW = cloudinaryUrl("AvivBTNarrow_vcc51d_nvqnfj.svg");
const BTN_FLOWER = cloudinaryUrl("AvivBTNflower_k3co1g_ydoo4g.svg");
const BTN_ARROW_PROFILE = cloudinaryUrl("AvivBTNarrowprofile_dncyax_wfin0t.svg");
const BTN_START = cloudinaryUrl("AvivBTNstart_zfzsvt_gc7yep.svg");

// ─── Profile Icons (SVG) ───
const PRF_ICONS = [
  cloudinaryUrl("AvivPRFicons01_sk0igu_lfafif.svg"),
  cloudinaryUrl("AvivPRFicons02_u8ojcb_zgfup7.svg"),
  cloudinaryUrl("AvivPRFicons03_lgfrt8_gfp9g4.svg"),
  cloudinaryUrl("AvivPRFicons04_g2tsae_e4efk5.svg"),
  cloudinaryUrl("AvivPRFicons05_zvui9u_gqmv2v.svg"),
];

/** Style Guide — Icons & Buttons: equal row width, icons aligned in shared columns */
const iconButtonsRowClass =
  "grid w-full min-w-0 grid-cols-5 items-center justify-items-center gap-x-2 sm:gap-x-4 md:gap-x-6";

// ─── Viewport-lazy video (always muted, loop, play/pause on visibility) ───

interface ViewportVideoProps {
  src: string;
  className?: string;
  threshold?: number;
  poster?: string;
  /** Native aspect ratio (letterboxed width); matches LuminaForest AutoPlayVideo + nativeFit. */
  nativeFit?: boolean;
}

function ViewportVideo({ src, poster, className = "", threshold = 0.5, nativeFit = false }: ViewportVideoProps) {
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
    if (!v) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          v.play().catch(() => {});
        } else if (!v.paused) {
          v.pause();
        }
      },
      { threshold },
    );
    observer.observe(v);
    return () => observer.disconnect();
  }, [visible, threshold]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {!loaded && <div className="absolute inset-0 skeleton-shimmer-primary z-10" />}
      {visible && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          className={`w-full block transition-opacity duration-300 ${nativeFit ? "h-auto" : "h-full object-cover"} ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoadedData={() => setLoaded(true)}
        />
      )}
    </div>
  );
}

// ─── Laptop with live video screen ───

function LaptopMockup() {
  return (
    <div className="relative w-full">
      {/* Frame image — establishes size, bezel visible around the video */}
      <img
        src={LAPTOP_FRAME}
        alt=""
        className="w-full h-auto"
      />
      {/* Video — on top, precisely covering only the screen rectangle */}
      <div
        className="absolute overflow-hidden rounded-[4px]"
        style={{ left: "14%", top: "10%", width: "72%", height: "72%" }}
      >
        <ViewportVideo
          src={LAPTOP_SCREEN_VIDEO}
          className="w-full h-full"
          threshold={0.3}
        />
      </div>
    </div>
  );
}

// ─── Mockup Slideshow ───

const MOCKUP_SLIDES = [APP_MOCKUP_01, APP_MOCKUP_02, APP_MOCKUP_03];
const SLIDE_INTERVAL_MS = 2500;
const SLIDE_FADE_S = 1;

function MockupSlideshow() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((prev) => (prev + 1) % MOCKUP_SLIDES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full aspect-[1152/432] overflow-hidden rounded-sm">
      {MOCKUP_SLIDES.map((src, i) => (
        <motion.img
          key={i}
          src={src}
          alt={`App mockup ${i + 1}`}
          animate={{ opacity: i === idx ? 1 : 0 }}
          transition={{ duration: SLIDE_FADE_S, ease: [0.22, 0.61, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          loading="lazy"
        />
      ))}
    </div>
  );
}

// ─── Recommendation Button (auto-looping crossfade between two versions) ───

const REC_BTN_CROSSFADE_S = 4;
const REC_BTN_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

function RecButton() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const ms = Math.round(REC_BTN_CROSSFADE_S * 1000);
    const id = window.setInterval(() => {
      setActive((prev) => !prev);
    }, ms);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative w-[140px] md:w-[120px] xl:w-[180px]">
      <img
        src={DAILY_REC_BTN}
        alt="Daily recommendation button"
        className="w-full"
        draggable={false}
      />
      <motion.img
        src={DAILY_REC_BTN_2}
        alt=""
        aria-hidden
        className="w-full absolute inset-0 -top-1"
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: REC_BTN_CROSSFADE_S, ease: REC_BTN_EASE }}
        draggable={false}
      />
    </div>
  );
}

// ─── Weather elements row: pure CSS transitions for smooth GPU-accelerated hover ───

const WEATHER_ICON_CLASS =
  "h-20 w-auto max-h-[100px] object-contain md:h-28 md:max-h-[140px] will-change-transform";

const WEATHER_CELL_CLASS =
  "flex items-center justify-center overflow-visible";

function WeatherElementsDesktop() {
  useEffect(() => {
    [CLOUD_SVG_HOVER, LIGHTNING_SVG_HOVER].forEach((s) => {
      const i = new Image();
      i.src = s;
    });
  }, []);

  return (
    <div className="hidden md:grid mt-6 grid-cols-4 gap-4">
      {/* Moon — starts bigger, grows more + rotate 360deg */}
      <div className={WEATHER_CELL_CLASS}>
        <img
          src={MOON_SVG}
          alt="Moon"
          className={`${WEATHER_ICON_CLASS} scale-[1.6] transition-transform duration-500 ease-in hover:scale-[2.5] hover:rotate-[360deg]`}
        />
      </div>

      {/* Cloud — crossfade */}
      <div className={`${WEATHER_CELL_CLASS} group`}>
        <div className="relative h-28 w-28 scale-[1.3]">
          <img
            src={CLOUD_SVG}
            alt="Cloud"
            className="absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ease-in-out group-hover:opacity-0"
          />
          <img
            src={CLOUD_SVG_HOVER}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-contain opacity-0 scale-[1.35] transition-opacity duration-500 ease-in-out group-hover:opacity-100"
          />
        </div>
      </div>

      {/* Lightning — crossfade + grow on hover */}
      <div className={`${WEATHER_CELL_CLASS} group`}>
        <div className="relative h-36 w-28 scale-[1.3] transition-transform duration-500 ease-in-out group-hover:scale-[1.5]">
          <img
            src={LIGHTNING_SVG}
            alt="Lightning"
            className="absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ease-in group-hover:opacity-0"
          />
          <img
            src={LIGHTNING_SVG_HOVER}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-300 ease-in group-hover:opacity-100"
          />
        </div>
      </div>

      {/* Sun — scale up + rotate -90deg left */}
      <div className={WEATHER_CELL_CLASS}>
        <img
          src={SUN_SVG}
          alt="Sun"
          className={`${WEATHER_ICON_CLASS} scale-[1.7] transition-transform duration-300 ease-in hover:scale-[2.1] hover:-rotate-90`}
        />
      </div>
    </div>
  );
}

function MobileWeatherIcon({ type }: { type: "moon" | "cloud" | "lightning" | "sun" }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (type === "cloud" || type === "lightning") {
      const hover = type === "cloud" ? CLOUD_SVG_HOVER : LIGHTNING_SVG_HOVER;
      const i = new Image();
      i.src = hover;
    }
  }, [type]);

  const toggle = () => setActive((p) => !p);

  if (type === "moon") {
    return (
      <div className={WEATHER_CELL_CLASS} onClick={toggle}>
        <img
          src={MOON_SVG}
          alt="Moon"
          className={`h-24 w-auto object-contain transition-transform duration-500 ease-in ${active ? "scale-[2] rotate-[360deg]" : "scale-[1.4]"}`}
        />
      </div>
    );
  }

  if (type === "cloud") {
    return (
      <div className={WEATHER_CELL_CLASS} onClick={toggle}>
        <div className="relative h-24 w-24 scale-[1.3]">
          <img
            src={CLOUD_SVG}
            alt="Cloud"
            className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ease-in-out ${active ? "opacity-0" : ""}`}
          />
          <img
            src={CLOUD_SVG_HOVER}
            alt=""
            aria-hidden
            className={`absolute inset-0 h-full w-full object-contain scale-[1.35] transition-opacity duration-500 ease-in-out ${active ? "opacity-100" : "opacity-0"}`}
          />
        </div>
      </div>
    );
  }

  if (type === "lightning") {
    return (
      <div className={`${WEATHER_CELL_CLASS} mt-4`} onClick={toggle}>
        <div className={`relative h-28 w-24 scale-[1.3] transition-transform duration-500 ease-in-out ${active ? "scale-[1.5]" : ""}`}>
          <img
            src={LIGHTNING_SVG}
            alt="Lightning"
            className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ease-in ${active ? "opacity-0" : ""}`}
          />
          <img
            src={LIGHTNING_SVG_HOVER}
            alt=""
            aria-hidden
            className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ease-in ${active ? "opacity-100" : "opacity-0"}`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={WEATHER_CELL_CLASS} onClick={toggle}>
      <img
        src={SUN_SVG}
        alt="Sun"
        className={`h-24 w-auto object-contain transition-transform duration-300 ease-in ${active ? "scale-[1.8] -rotate-90" : "scale-[1.4]"}`}
      />
    </div>
  );
}

// ─── Weather Toggle (daily / weekly) ───

function WeatherToggle() {
  const [mode, setMode] = useState<"daily" | "weekly">("daily");

  return (
    <div className="relative mt-4 w-full max-w-[320px] md:max-w-[434px] mx-auto md:mx-0 inline-block">
      <img
        src={mode === "daily" ? WEATHER_TOGGLE_SVG : WEATHER_TOGGLE_WEEKLY_SVG}
        alt={`Weather toggle — ${mode}`}
        className="w-full block"
        draggable={false}
      />
      {/* Click zones cover only the bottom toggle bar (RTL: left = weekly, right = daily) */}
      <button
        className="absolute bottom-0 left-0 w-1/2"
        style={{ height: "17%", cursor: mode === "weekly" ? "default" : "pointer" }}
        onClick={() => setMode("weekly")}
        aria-label="Switch to weekly"
      />
      <button
        className="absolute bottom-0 right-0 w-1/2"
        style={{ height: "17%", cursor: mode === "daily" ? "default" : "pointer" }}
        onClick={() => setMode("daily")}
        aria-label="Switch to daily"
      />
    </div>
  );
}

// ─── Interactive Flower (drag to rotate 90°) ───

function InteractiveFlower() {
  const [rotation, setRotation] = useState(0);
  const dragStartX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={containerRef}
      className="flex items-center justify-center cursor-grab active:cursor-grabbing select-none mt-4 touch-none"
      animate={{ rotate: rotation }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      onPointerDown={(e) => {
        dragStartX.current = e.clientX;
        containerRef.current?.setPointerCapture(e.pointerId);
      }}
      onPointerUp={(e) => {
        const dx = e.clientX - dragStartX.current;
        if (Math.abs(dx) > 10) {
          setRotation((prev) => prev + (dx > 0 ? 90 : -90));
        }
      }}
    >
      <img
        src={NAV_FLOWER_SVG}
        alt="Navigation flower"
        className="w-full max-w-[320px] md:max-w-[400px] pointer-events-none"
        draggable={false}
      />
    </motion.div>
  );
}

// ─── Carousels ───

function AppSketchesCarousel() {
  const { ref, onMouseDown } = useDragScroll();
  return (
    <div ref={ref} onMouseDown={onMouseDown} className="overflow-x-auto scrollbar-hide cursor-grab h-[200px] md:h-[220px] xl:h-[300px]">
      <div className={`flex items-center ${gapHeroTightClass} w-max pr-[20%] h-full`}>
        {APP_SKETCHES.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`App sketch ${i + 1}`}
            className={`w-auto rounded-sm pointer-events-none ${i < 2 ? "max-h-full" : i >= 6 ? "max-h-[45%]" : "max-h-[65%]"}`}
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}

function ConfessionSketchesCarousel() {
  const { ref, onMouseDown } = useDragScroll();
  return (
    <div ref={ref} onMouseDown={onMouseDown} className="overflow-x-auto scrollbar-hide cursor-grab">
      <div className={`flex items-center ${gapHeroTightClass} w-max pr-[20%]`}>
        {CNFSN_SKETCHES.map((src, i) => (
          <img key={i} src={src} alt={`Confessions sketch ${i + 1}`} className="max-h-[110px] md:max-h-[160px] lg:max-h-[120px] xl:max-h-[160px] w-auto rounded-sm pointer-events-none" loading="lazy" />
        ))}
      </div>
    </div>
  );
}

const KEY_FEATURES = [
  { title: "Free-Roaming Scroll", desc: "Users can scroll in any direction, creating a sense of wandering through an endless space.", video: VID_FEAT_OPENING },
  { title: "Confession Writing", desc: "A space for sharing feelings and releasing emotional burdens, letting users let their thoughts set free to the world.", video: VID_FEAT_WRITING },
  { title: "Seamless Reading", desc: "Once a confession is opened, users can easily swipe or click the button to keep reading through other stories continuously.", video: VID_FEAT_READING },
  { title: "My Confessions", desc: "A private archive to revisit your past thoughts.", video: VID_FEAT_MY_CONFESSIONS },
] as const;

/** Same slide width as LuminaForest DragCarousel + AutoPlayVideo feature strips */
const keyFeatureSlideClass =
  "w-[85vw] md:w-[calc((100vw-2*var(--grid-margin)-var(--grid-gutter))/2)] shrink-0";

function KeyFeaturesCarousel() {
  const { ref, onMouseDown } = useDragScroll();
  return (
    <div ref={ref} onMouseDown={onMouseDown} className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing">
      <div className={`flex ${gapTightStripClass} w-max`}>
        {KEY_FEATURES.map((feat) => (
          <div key={feat.title} className={`flex flex-col gap-4 ${keyFeatureSlideClass}`}>
            <div className={`flex flex-col ${gapSubtitleClass} min-h-[110px] md:min-h-[100px]`}>
              <h4 className={smallTitleClass}>{feat.title}</h4>
              <p className={bodyTextClass}>{feat.desc}</p>
            </div>
            <ViewportVideo
              src={feat.video}
              nativeFit
              className="w-full rounded-[8px] bg-black"
              threshold={0.95}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function DesktopScreensCarousel() {
  const { ref, onMouseDown } = useDragScroll();
  return (
    <div ref={ref} onMouseDown={onMouseDown} className="overflow-x-auto scrollbar-hide cursor-grab">
      <div className="flex w-max">
        {DESKTOP_SCREENS.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Desktop screen ${i + 1}`}
            className="h-[280px] w-auto rounded-sm pointer-events-none md:h-[440px]"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}

function CnfsnTypoSketchesCarousel() {
  const { ref, onMouseDown } = useDragScroll("both");
  return (
    <div ref={ref} onMouseDown={onMouseDown} className="overflow-auto scrollbar-hide rounded-[20px] max-h-[130px] md:max-h-[120px] cursor-grab active:cursor-grabbing">
      <img src={TYPO_SKETCHES_CLOUDY} alt="Cloudy Now typography sketches" className="w-[160%] min-w-[160%] md:w-full md:min-w-0 lg:w-[75%] xl:w-full pointer-events-none" loading="lazy" />
    </div>
  );
}

function CnfsnTypoVerticalScroll() {
  const { ref, onMouseDown } = useDragScroll("y");
  return (
    <div ref={ref} onMouseDown={onMouseDown} className="overflow-y-auto scrollbar-hide rounded-[20px] max-h-[200px] md:max-h-[230px] cursor-grab active:cursor-grabbing">
      <div className="flex flex-col items-center gap-4 p-4">
        {CNFSN_TYPO.map((src, i) => (
          <img key={i} src={src} alt={`Typography sample ${i + 1}`} className={`rounded-sm pointer-events-none ${i === 1 ? "w-[50%]" : i === 6 ? "w-[65%]" : "w-full"}`} loading="lazy" />
        ))}
      </div>
    </div>
  );
}

function BothAxisSketchScroll({ src, alt }: { src: string; alt: string }) {
  const { ref, onMouseDown } = useDragScroll("both");

  const centerScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const maxX = Math.max(0, el.scrollWidth - el.clientWidth);
    const maxY = Math.max(0, el.scrollHeight - el.clientHeight);
    el.scrollLeft = maxX / 2;
    el.scrollTop = maxY / 2;
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => centerScroll());
    ro.observe(el);
    return () => ro.disconnect();
  }, [centerScroll]);

  return (
    <div ref={ref} onMouseDown={onMouseDown} className="overflow-auto scrollbar-hide rounded-[20px] bg-white h-[120px] md:h-[140px] w-full cursor-grab active:cursor-grabbing">
      <img
        src={src}
        alt={alt}
        className="pointer-events-none w-[900px] min-w-[900px] lg:w-[700px] lg:min-w-[700px] xl:w-[900px] xl:min-w-[900px]"
        loading="lazy"
        onLoad={centerScroll}
      />
    </div>
  );
}

function CnfsnTypoSketchScroll() {
  return <BothAxisSketchScroll src={CNFSN_TYPO_SKETCH} alt="Typography sketches" />;
}

function IconsSketchScroll() {
  return <BothAxisSketchScroll src={ICONS_SKETCH} alt="Icons sketches" />;
}

function AvivColorPalette() {
  const containerRef = useRef<HTMLDivElement>(null);
  const showBars = usePaletteBarsReveal(containerRef);

  return (
    <div
      ref={containerRef}
      className="flex aspect-[3/4] w-full max-h-[min(72vw,400px)] md:max-h-[min(52vw,400px)] items-stretch justify-end gap-[6%] md:gap-[7%] md:translate-x-[20%]"
      role="img"
      aria-label="Cloudy Now color palette: #FADC98, #FFFFFF, #918DDB, #EF0034, #1B1F2A"
    >
      {AVIV_PALETTE_BARS.map((bar) => (
        <div
          key={bar.hex}
          className="relative flex h-full min-h-0 w-[24%] max-w-[74px] min-w-[36px] flex-col justify-end self-stretch"
        >
          <motion.span
            className={`pointer-events-none absolute left-1/2 z-10 whitespace-nowrap font-['Bricolage_Grotesque'] text-[10px] font-medium tracking-[0.08em] md:text-[11px] ${bar.labelClass}`}
            style={{
              bottom: "calc(0.75rem + 1rem)",
              transform: "translateX(-50%) rotate(90deg)",
            }}
            initial={{ opacity: 0 }}
            animate={showBars ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {bar.hex}
          </motion.span>
          <div
            className="relative w-full overflow-visible"
            style={{ height: `calc(${bar.heightPct}% + 4rem)` }}
          >
            <motion.div
              className="absolute inset-0 rounded-t-[999px] blur-[6px]"
              style={{
                background: "linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, transparent 100%)",
                transformOrigin: "center bottom",
              }}
              initial={{ scaleY: 0 }}
              animate={showBars ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <motion.div
              className="relative h-full w-full rounded-t-[999px]"
              style={{
                background: `linear-gradient(to bottom, ${bar.fill} 50%, transparent 100%)`,
                transformOrigin: "center bottom",
              }}
              initial={{ scaleY: 0 }}
              animate={showBars ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function AvivColorPalette2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const showBars = usePaletteBarsReveal(containerRef);

  return (
    <div
      ref={containerRef}
      className="flex aspect-[3/4] w-full max-h-[min(72vw,400px)] md:max-h-[min(52vw,400px)] items-stretch justify-end gap-[6%] md:gap-[7%]"
      role="img"
      aria-label="Confessions color palette: #FADC98, #918DDB, #FFFFFF, #FFF5E1, #1B1F2A"
    >
      {AVIV_PALETTE_BARS_2.map((bar) => (
        <div
          key={bar.hex}
          className="relative flex h-full min-h-0 w-[24%] max-w-[74px] min-w-[36px] flex-col justify-end self-stretch"
        >
          <motion.span
            className={`pointer-events-none absolute left-1/2 z-10 whitespace-nowrap font-['Bricolage_Grotesque'] text-[10px] font-medium tracking-[0.08em] md:text-[11px] ${bar.labelClass}`}
            style={{
              bottom: "calc(0.75rem + 1rem)",
              transform: "translateX(-50%) rotate(90deg)",
            }}
            initial={{ opacity: 0 }}
            animate={showBars ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {bar.hex}
          </motion.span>
          <div
            className="relative w-full overflow-visible"
            style={{ height: `calc(${bar.heightPct}% + 4rem)` }}
          >
            <motion.div
              className="absolute inset-0 rounded-t-[999px] blur-[6px]"
              style={{
                background: "linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, transparent 100%)",
                transformOrigin: "center bottom",
              }}
              initial={{ scaleY: 0 }}
              animate={showBars ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <motion.div
              className="relative h-full w-full rounded-t-[999px]"
              style={{
                background: `linear-gradient(to bottom, ${bar.fill} 50%, transparent 100%)`,
                transformOrigin: "center bottom",
              }}
              initial={{ scaleY: 0 }}
              animate={showBars ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function HandDrawnTypoCarousel() {
  const { ref, onMouseDown } = useDragScroll();
  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      className="bg-[#1B1F2A] rounded-[16px] overflow-hidden cursor-grab active:cursor-grabbing mt-2"
      style={{ height: 120 }}
    >
      <div className="flex items-center gap-[28px] h-full px-5 w-max">
        {HAND_DRAWN_TYPO.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Hand-drawn typography sample ${i + 1}`}
            className="h-[60px] w-auto object-contain pointer-events-none"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}

interface AvivProps {
  onSelectSection: (id: string) => void;
  onReady?: () => void;
}

export default function Aviv({ onSelectSection, onReady }: AvivProps) {
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
      {/* ═══════════════════════════════════════════════
          PART 1 — CLOUDY NOW (Weather App)
          ═══════════════════════════════════════════════ */}

      {/* ── Hero + Concept = min 100vh ── */}
      <div className="md:min-h-screen flex flex-col">
        {/* Hero Video Banner */}
        <ProjectHeroVideo src={HERO_VIDEO_LOCAL} poster={HERO_POSTER} />

        {/* Concept Section */}
        <section className="flex-1 flex flex-col justify-start md:justify-center">
          <PageGrid className={sectionPageGridStretchClass}>
            <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col ${gapIntroClass} ${sectionColumnPaddingClass}`}>
              {/* Moonlight Atmosphere intro */}
              <div className="flex flex-col gap-2">
                <h3 className={`${projectNameClass} leading-[1.5]`}>
                  Moonlight Atmosphere
                </h3>
                <p className={`${smallTitleClass} leading-[1.5]`}>
                  A cohesive design evolution inspired by Aviv Geffen.
                </p>
                <p className={`${smallTitleClass} leading-[1.5]`}>
                  translating character research into a seamless UX/UI journey&mdash;{" "}
                  <span className="font-semibold">
                    including a mobile weather app and an immersive desktop experience.
                  </span>
                </p>
                <p className={`${bodyTextClass} italic mt-2`}>
                  These projects focus on creating immersive UX/UI experiences.
                </p>
              </div>

              {/* Phone mockup + Laptop mockup side by side */}
              <div className="flex flex-row gap-3 md:gap-8 items-center ml-[6%] md:ml-0">
                <div className="w-[88px] md:w-[25%] lg:w-[18%] shrink-0">
                  <ViewportVideo
                    src={VID_YARKON}
                    className={`w-full ${radiusPhoneXsClass}`}
                  />
                </div>
                <div className="flex-1 min-w-0 scale-[1.06] origin-left md:scale-100 md:w-[68%] lg:w-[75%]">
                  <LaptopMockup />
                </div>
              </div>
            </div>
          </PageGrid>
        </section>
      </div>

      {/* ── Divider ── */}
      <div className="w-full border-t border-[#2200b8]" />

      {/* ── Concept (Cloudy Now) ── */}
      <section>
        <MobileStickyTitle leading="leading-[1.5]">Concept</MobileStickyTitle>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className={TITLE_COL_DESKTOP_CLASS}>
            <h2 className={`${stickyTitleClass} leading-[1.5]`}>Concept</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col ${gapContentClass} ${sectionColumnPaddingClass}`}>
            {/* Cloudy Now — text + phone mockup */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 flex flex-col gap-4 min-w-0">
                <img
                  src={APP_ICON}
                  alt="Cloudy Now app icon"
                  className="w-[length:var(--media-app-icon)] rounded-[22px] object-cover"
                  loading="lazy"
                />
                <h3 className={`${subTitleClass} leading-[1.5] flex flex-wrap items-baseline gap-x-4 md:gap-x-6`}>
                  <span>Cloudy Now</span>
                  <span className="font-['Varela_Round'] font-bold">עכשיו מעונן</span>
                </h3>
                <p className={`${smallTitleClass} leading-[1.5]`}>
                  A dynamic weather experience inspired by the visual and emotional world of Aviv Geffen.
                </p>
                <div className="flex flex-row gap-4 md:block">
                  <p className={`${bodyTextClass} flex-1 min-w-0 md:w-full`}>
                    The app draws from Geffen&rsquo;s intense use of weather as a tool for emotional
                    expression in his lyrics. The concept captures the tension between the raw
                    vulnerability of the &lsquo;Flower Children&rsquo; era and a dark, deep melancholy,
                    reflecting the complex duality of Geffen&rsquo;s artistic persona.
                  </p>
                  <div className="shrink-0 w-[130px] self-start ml-auto md:hidden">
                    <ViewportVideo
                      src={SPLASH_VIDEO_LOCAL}
                      className={`w-full ${radiusPhoneMediumClass}`}
                    />
                  </div>
                </div>
              </div>
              <div className="hidden md:block shrink-0 md:w-[160px] lg:w-[180px] xl:w-[200px] 2xl:w-[260px] self-start">
                <ViewportVideo
                  src={SPLASH_VIDEO_LOCAL}
                  className={`w-full ${radiusPhoneMediumClass}`}
                />
              </div>
            </div>

            {/* Auto-cycling mockup slideshow */}
            <MockupSlideshow />

            {/* Weather screen images */}
            <div className="flex justify-between w-full">
              <div className={phoneScreenHoverClass}>
                <img src={SCREEN_KINNERET} alt="Kinneret weather screen" className="w-full rounded-sm" loading="lazy" />
              </div>
              <div className={phoneScreenHoverClass}>
                <img src={SCREEN_YARKON} alt="Yarkon weather screen" className="w-full rounded-sm" loading="lazy" />
              </div>
              <div className={phoneScreenHoverClass}>
                <img src={SCREEN_LONDON} alt="London weather screen" className="w-full rounded-sm" loading="lazy" />
              </div>
              <div className={phoneScreenHoverClass}>
                <img src={SCREEN_ARAD} alt="Arad weather screen" className="w-full rounded-sm" loading="lazy" />
              </div>
            </div>

          </div>
        </PageGrid>
      </section>

      {/* ── Divider ── */}
      <div className="w-full border-t border-[#2200b8]" />

      {/* ── Design Section (Part 1) ── */}
      <section>
        <MobileStickyTitle>Design</MobileStickyTitle>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className={TITLE_COL_DESKTOP_CLASS}>
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Design</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col ${gapContentLgClass} ${sectionColumnPaddingClass}`}>
            {/* Initial Concept & Ideation */}
            <div className={`flex flex-col ${gapSubtitleClass}`}>
              <h3 className={subTitleClass}>Initial Concept &amp; Ideation</h3>
              <p className={bodyTextClass}>
                My vision was to merge weather-inspired elements as a tribute to Aviv&rsquo;s lyrics
                with &lsquo;Flower Children&rsquo; imagery, creating a dark and mysterious atmosphere.
              </p>
              <div className={`flex flex-wrap items-baseline ${gapThumbClass}`}>
                {["Dark", "Contrast", "Bold", "Glow"].map((word) => (
                  <p key={word} className={`${smallTitleClass}`}>{word}</p>
                ))}
              </div>
            </div>

            {/* First Sketches */}
            <div className="flex flex-col gap-6">
              <h3 className={subTitleClass}>First Sketches</h3>
              <div className="overflow-hidden">
                <AppSketchesCarousel />
              </div>
            </div>

            {/* Final Design */}
            <div className={`flex flex-col ${gapSubtitleClass}`}>
              <h3 className={subTitleClass}>Final Design</h3>
              <p className={bodyTextClass}>
                The final design focuses on the experience by removing unnecessary info, creating a
                simple and immersive layout that spotlights weather elements and floral motifs.
              </p>
            </div>

            {/* Key Features */}
            <h3 className={subTitleClass}>Key Features</h3>

            {/* Feature 1: Interactive Flower Scroll */}
            <div className="flex flex-col md:flex-row gap-8 -mt-[calc(var(--gap-content-lg)*0.5)] md:mt-0">
              <div className={`flex flex-col ${gapSubtitleClass} order-1 md:hidden`}>
                <h4 className={smallTitleClass}>Interactive Flower Scroll</h4>
                <p className={bodyTextClass}>
                  The core element — Users rotate a flower icon to navigate through key milestones
                  in Aviv&rsquo;s career.
                </p>
              </div>
              <div className="md:w-[40%] flex flex-col justify-between min-h-0 order-3 md:order-none">
                <div className={`hidden md:flex flex-col ${gapSubtitleClass}`}>
                  <h4 className={smallTitleClass}>Interactive Flower Scroll</h4>
                  <p className={bodyTextClass}>
                    The core element — Users rotate a flower icon to navigate through key milestones
                    in Aviv&rsquo;s career.
                  </p>
                </div>
                <InteractiveFlower />
              </div>
              <div className="w-[55%] self-center md:w-[30%] shrink-0 order-2 md:order-none">
                <ViewportVideo
                  src={VID_FLOWER_NAV}
                  className={`w-full ${radiusPhoneLargeClass}`}
                />
              </div>
            </div>

            {/* Feature 2: Dual-View Toggle */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className={`flex flex-col ${gapSubtitleClass} order-1 md:hidden`}>
                <h4 className={smallTitleClass}>Dual-View Toggle</h4>
                <p className={bodyTextClass}>
                  A bottom toggle for hourly and weekly forecasts, offering full data within a clean,
                  minimal interface.
                </p>
              </div>
              <div className="w-[55%] self-center md:w-[30%] shrink-0 order-2 md:order-none">
                <ViewportVideo
                  src={VID_WEATHER_TOGGLE}
                  className={`w-full ${radiusPhoneLargeClass}`}
                />
              </div>
              <div className={`md:w-[40%] flex flex-col ${gapSubtitleClass} md:justify-center order-3 md:order-none`}>
                <div className="hidden md:block">
                  <h4 className={smallTitleClass}>Dual-View Toggle</h4>
                  <p className={`${bodyTextClass} mt-[length:var(--gap-subtitle)]`}>
                    A bottom toggle for hourly and weekly forecasts, offering full data within a clean,
                    minimal interface.
                  </p>
                </div>
                <WeatherToggle />
              </div>
            </div>

            {/* Feature 3: Contextual Recommendations */}
            <div className="flex flex-col md:flex-row gap-8 md:items-center">
              {/* Mobile: text first */}
              <div className={`flex flex-col ${gapSubtitleClass} order-1 md:hidden`}>
                <h4 className={smallTitleClass}>Contextual Recommendations</h4>
                <p className={bodyTextClass}>
                  Customized recommendations inspired by Aviv Geffen&rsquo;s persona
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 items-start">
                  <div>
                    <p className={`${bodyTextClass} font-normal`}>Walking Barefoot:</p>
                    <p className={bodyTextClass}>Weather-based advice on walking barefoot, an iconic Geffen trait.</p>
                  </div>
                  <div>
                    <p className={`${bodyTextClass} font-normal`}>Makeup Guide:</p>
                    <p className={bodyTextClass}>Recommends makeup styles (Full, Partial, or Minimal) based on the weather.</p>
                  </div>
                  <div className="col-span-2 w-[60%]">
                    <p className={`${bodyTextClass} font-normal`}>The Moon:</p>
                    <p className={bodyTextClass}>Tracks lunar phases and &ldquo;Moonlight&rdquo; motifs in his art.</p>
                  </div>
                </div>
              </div>
              {/* Mobile: vid left + svg right, centered; Desktop: svg standalone */}
              <div className="flex flex-row items-center gap-4 order-2 md:order-none md:block md:shrink-0 md:self-auto">
                <div className="w-[55%] shrink-0 md:hidden">
                  <ViewportVideo
                    src={VID_RECOMMENDATIONS}
                    className={`w-full ${radiusPhoneLargeClass}`}
                  />
                </div>
                <div className="shrink-0 md:ml-0">
                  <RecButton />
                </div>
              </div>
              {/* Desktop only: video */}
              <div className="hidden md:block md:w-[30%] shrink-0">
                <ViewportVideo
                  src={VID_RECOMMENDATIONS}
                  className={`w-full ${radiusPhoneLargeClass}`}
                />
              </div>
              {/* Desktop only: text */}
              <div className={`hidden md:flex md:w-[40%] md:ml-auto flex-col ${gapSubtitleClass} order-3 md:order-none`}>
                <h4 className={smallTitleClass}>Contextual Recommendations</h4>
                <p className={bodyTextClass}>
                  Customized recommendations inspired by Aviv Geffen&rsquo;s persona
                </p>
                <div className="flex flex-col gap-3">
                  <p className={bodyTextClass}>
                    <span className="font-normal">Walking Barefoot:</span> Weather-based advice on
                    walking barefoot, an iconic Geffen trait.
                  </p>
                  <p className={bodyTextClass}>
                    <span className="font-normal">Makeup Guide:</span> Recommends makeup styles
                    (Full, Partial, or Minimal) based on the weather.
                  </p>
                  <p className={bodyTextClass}>
                    <span className="font-normal">The Moon:</span> Tracks lunar phases and
                    &ldquo;Moonlight&rdquo; motifs in his art.
                  </p>
                </div>
              </div>
            </div>

            {/* Weather Elements & Animation */}
            <div className={`flex flex-col ${gapSubtitleClass}`}>
              <h3 className={subTitleClass}>Weather Elements &amp; Animation</h3>
              <p className={bodyTextClass}>
                Aviv Geffen often uses weather as a metaphor for emotions in his lyrics. In his world,
                the <span className="font-medium">Moon</span> is the central, cherished symbol, while the Sun is secondary, harsh, and
                burning.
              </p>
              <p className={bodyTextClass}>
                I drew inspiration from 4 of Aviv&rsquo;s songs to create the visual elements
                for each weather screen.
              </p>

              <div className="h-4 md:hidden" />

              {/* Hebrew song titles + weather screen videos + weather elements */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                {([
                  { txt: TXT_KINNERET, vid: VID_KINNERET, label: "Kinneret", weather: "moon" as const },
                  { txt: TXT_YARKON, vid: VID_YARKON, label: "Yarkon", weather: "cloud" as const },
                  { txt: TXT_LONDON, vid: VID_LONDON, label: "London", weather: "lightning" as const },
                  { txt: TXT_ARAD, vid: VID_ARAD, label: "Arad", weather: "sun" as const },
                ]).map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-3">
                    <img
                      src={item.txt}
                      alt={`${item.label} song title`}
                      className="h-[80px] md:h-[70px] xl:h-[110px] w-auto object-contain"
                      loading="lazy"
                    />
                    <ViewportVideo
                      src={item.vid}
                      className={`w-[85%] mx-auto ${radiusPhoneSmallClass}`}
                    />
                    <div className="md:hidden h-[100px] flex items-center justify-center">
                      <MobileWeatherIcon type={item.weather} />
                    </div>
                  </div>
                ))}
              </div>

              <WeatherElementsDesktop />
            </div>
          </div>
        </PageGrid>
      </section>

      {/* ── Divider ── */}
      <div className="w-full border-t border-[#2200b8]" />

      {/* ── Research Section (Part 1) ── */}
      <section>
        <MobileStickyTitle>Research</MobileStickyTitle>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className={TITLE_COL_DESKTOP_CLASS}>
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Research</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col ${gapContentClass} ${sectionColumnPaddingClass}`}>
            {/* Aviv Geffen bio */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2 order-2 md:order-none">
                <img src={AVIV_IMAGE} alt="Aviv Geffen" className="w-full rounded-sm" loading="lazy" />
              </div>
              <div className={`md:w-1/2 flex flex-col ${gapSubtitleClass} order-1 md:order-none`}>
                <h3 className={subTitleClass}>Aviv Geffen</h3>
                <p className={bodyTextClass}>
                  Aviv Geffen is a major Israeli musician who rose to fame in the 90s. Known for his
                  raw, provocative style, he became the voice of Israel&rsquo;s &ldquo;Moonlight
                  Children&rdquo; generation.
                </p>
              </div>
            </div>

            {/* Principles / Musical Themes / Visual Identity */}
            {/* Mobile: 2-col layout — left stacks Principles+Musical, right has Visual Identity centered */}
            <div className="flex flex-row gap-4 md:hidden">
              <div className="flex flex-col gap-4 w-1/2">
                <div className="flex flex-col gap-1">
                  <h4 className={`${smallTitleClass} mb-1`}>Principles</h4>
                  <p className={bodyTextClass}>Voice: Social change.</p>
                  <p className={bodyTextClass}>Peace: Generation&rsquo;s cry.</p>
                  <p className={bodyTextClass}>Reality: Seeking different.</p>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className={`${smallTitleClass} mb-1`}>Musical Themes</h4>
                  <p className={bodyTextClass}>Struggles: Heartbreak &amp; family.</p>
                  <p className={bodyTextClass}>Depths: Death &amp; depression.</p>
                  <p className={bodyTextClass}>Outlook: Hope &amp; future.</p>
                </div>
              </div>
              <div className="flex flex-col gap-1 w-1/2 justify-center">
                <h4 className={`${smallTitleClass} mb-1`}>Visual Identity</h4>
                <p className={bodyTextClass}>Soft: &ldquo;Moonlight Children&rdquo; aesthetic.</p>
                <p className={bodyTextClass}>Edge: Dark, rebellious rock&amp;roll.</p>
                <p className={bodyTextClass}>Duality: Soft meets raw.</p>
              </div>
            </div>
            {/* Desktop: 3-col grid */}
            <div className="hidden md:grid grid-cols-3 gap-8 md:-mt-[calc(var(--gap-content)*0.8)]">
              <div className="flex flex-col gap-1">
                <h4 className={`${smallTitleClass} mb-1`}>Principles</h4>
                <p className={bodyTextClass}>Voice: Social change.</p>
                <p className={bodyTextClass}>Peace: Generation&rsquo;s cry.</p>
                <p className={bodyTextClass}>Reality: Seeking different.</p>
              </div>
              <div className="flex flex-col gap-1">
                <h4 className={`${smallTitleClass} mb-1`}>Musical Themes</h4>
                <p className={bodyTextClass}>Struggles: Heartbreak &amp; family.</p>
                <p className={bodyTextClass}>Depths: Death &amp; depression.</p>
                <p className={bodyTextClass}>Outlook: Hope &amp; future.</p>
              </div>
              <div className="flex flex-col gap-1">
                <h4 className={`${smallTitleClass} mb-1`}>Visual Identity</h4>
                <p className={bodyTextClass}>Soft: &ldquo;Moonlight Children&rdquo; aesthetic.</p>
                <p className={bodyTextClass}>Edge: Dark, rebellious rock&amp;roll.</p>
                <p className={bodyTextClass}>Duality: Soft meets raw.</p>
              </div>
            </div>

            {/* A man of contrasts */}
            <div className={`flex flex-col ${gapSubtitleClass} md:max-w-[80%] -mt-[calc(var(--gap-content)*0.4)] md:-mt-[calc(var(--gap-content)*0.8)]`}>
              <h4 className={smallTitleClass}>A man of contrasts</h4>
              <p className={bodyTextClass}>
                Aviv Geffen embodies the tension between extreme fragility and bold defiance, creating
                a unique, provocative artistic identity.
              </p>
            </div>
          </div>
        </PageGrid>
      </section>

      {/* ── Divider ── */}
      <div className="w-full border-t border-[#2200b8]" />

      {/* ── Style Guide (Part 1) ── */}
      <section>
        <MobileStickyTitle>Style Guide</MobileStickyTitle>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className={TITLE_COL_DESKTOP_CLASS}>
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Style Guide</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col ${gapContentClass} ${sectionColumnPaddingClass}`}>
            {/* Color Palette — two-column: text left, bars right */}
            <div className="flex flex-col md:flex-row ${gapSplitClass}">
              <div className={`flex flex-col ${gapSubtitleClass} md:w-[55%]`}>
                <h3 className={subTitleClass}>Color Palette</h3>
                <p className={bodyTextClass}>
                  I chose Dark Mode as a foundation to create an atmospheric environment, with a palette
                  carefully selected to reflect the layers of Aviv Geffen&rsquo;s identity.
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-1 md:gap-4 mt-2">
                  <div>
                    <p className={smallTitleClass}>Black</p>
                    <p className={bodyTextClass}>Primary base, setting a deep and melancholic tone.</p>
                  </div>
                  <div>
                    <p className={smallTitleClass}>Red</p>
                    <p className={bodyTextClass}>Symbolizes rebellious spirit and provocative nature.</p>
                  </div>
                  <div>
                    <p className={smallTitleClass}>Bluish-Purple</p>
                    <p className={bodyTextClass}>Represents the sadness and melancholy in music.</p>
                  </div>
                  <div>
                    <p className={smallTitleClass}>White</p>
                    <p className={bodyTextClass}>Highlights sharp black-and-white duality</p>
                  </div>
                  <div>
                    <p className={smallTitleClass}>Gold</p>
                    <p className={bodyTextClass}>Represents glam-rock and theatrical stage presence.</p>
                  </div>
                </div>
              </div>
              <div className="md:w-[45%] flex items-end overflow-visible">
                <AvivColorPalette />
              </div>
            </div>

            {/* Typography */}
            <div className={`flex flex-col ${gapSubtitleClass}`}>
              <h3 className={subTitleClass}>Typography</h3>
              <p className={`${bodyTextClass} md:max-w-[80%]`}>
                The typographic choices reflect Aviv Geffen&rsquo;s duality, creating a tension between
                raw expression and refined simplicity.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-2">
                <div className={`flex flex-col ${gapSubtitleClass}`}>
                  <h4 className={smallTitleClass}>Custom Hand-Drawn Typography</h4>
                  <p className={bodyTextClass}>
                    A custom-made, rebellious font that serves as the raw heart of the design.
                  </p>
                  <HandDrawnTypoCarousel />
                </div>
                <div className={`flex flex-col ${gapSubtitleClass} md:pl-16`}>
                  <h4 className={smallTitleClass}>Secondary Typography</h4>
                  <p className={bodyTextClass}>
                    A clean, delicate font that ensures readability and balances the bold hand-drawn elements.
                  </p>
                  <img src={SIMPLER_FONT} alt="Simpler font" className="w-full max-w-[260px] mt-4 mx-auto md:mx-0" loading="lazy" />
                </div>
              </div>
            </div>

            {/* Typography Sketches */}
            <div className="flex flex-col gap-4 md:w-[80%]">
              <h3 className={subTitleClass}>Typography Sketches</h3>
              <CnfsnTypoSketchesCarousel />
            </div>

          </div>

          {/* Icons — columns 3–5 */}
          <div className={`col-span-8 md:col-start-3 md:col-span-3 flex flex-col gap-4 ${sectionColumnPaddingClass}`}>
            <h3 className={subTitleClass}>Icons</h3>
            <div className="bg-[#1B1F2A] rounded-[20px] flex items-center justify-evenly py-6 px-6 gap-4 w-full">
              <img src={RAIN_ICON} alt="Rain" className="h-[36px] md:h-[44px] w-auto" loading="lazy" />
              <img src={CLOUDY_ICON} alt="Cloudy" className="h-[36px] md:h-[44px] w-auto" loading="lazy" />
              <img src={PARTLY_CLOUDY_ICON} alt="Partly cloudy" className="h-[36px] md:h-[44px] w-auto" loading="lazy" />
              <img src={SUNNY_ICON} alt="Sunny" className="h-[36px] md:h-[44px] w-auto" loading="lazy" />
            </div>
          </div>
        </PageGrid>
      </section>

      {/* ═══════════════════════════════════════════════
          PART 2 — MOONLIGHT CONFESSIONS (Desktop)
          ═══════════════════════════════════════════════ */}

      {/* ── Divider ── */}
      <div className="w-full border-t border-[#2200b8]" />

      {/* ── Concept (Part 2) ── */}
      <section>
        {/* Full-width hero banner */}
        <div className={PROJECT_HERO_VIDEO_SHELL_CLASS}>
          <img
            src={CONFESSIONS_MOCKUP}
            alt="Moonlight Confessions desktop mockup"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <MobileStickyTitle leading="leading-[1.5]">Concept</MobileStickyTitle>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className={TITLE_COL_DESKTOP_CLASS}>
            <h2 className={`${stickyTitleClass} leading-[1.5]`}>Concept</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-2 flex flex-col ${gapSubtitleClass} ${sectionColumnPaddingClass} md:self-center`}>
            <h3 className={`${subTitleClass} leading-[1.5] flex flex-wrap items-baseline gap-x-4 md:gap-x-6`}>
              <span>Moonlight Confessions</span>
              <span className="font-['Varela_Round'] font-bold">וידויים לאור הירח</span>
            </h3>
            <p className={bodyTextClass}>
              As an extension, I developed a desktop experience for Aviv Geffen&rsquo;s fanbase,
              &ldquo;The Moonlight Children.&rdquo;
            </p>
            <p className={bodyTextClass}>
              An anonymous, protected space for emotional
              release. The intuitive &lsquo;infinite space&rsquo; connects isolated voices into a
              powerful collective experience.
            </p>
          </div>

          <div className="col-span-8 md:col-start-5 md:col-span-3 md:self-center md:w-[115%]">
            <LaptopMockup />
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 ${sectionColumnPaddingClass}`}>
            <div className="w-full aspect-video">
              <video
                src={VID_CONFESSIONS_PROMO}
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-contain bg-black rounded-sm"
              />
            </div>
          </div>
        </PageGrid>
      </section>

      {/* ── Divider ── */}
      <div className="w-full border-t border-[#2200b8]" />

      {/* ── Design Section (Part 2) ── */}
      <section>
        <MobileStickyTitle>Design</MobileStickyTitle>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className={TITLE_COL_DESKTOP_CLASS}>
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Design</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col ${gapContentLgClass} ${sectionColumnPaddingClass}`}>
            {/* Initial Concept & Ideation */}
            <div className={`flex flex-col ${gapSubtitleClass}`}>
              <h3 className={subTitleClass}>Initial Concept &amp; Ideation</h3>
              <p className={bodyTextClass}>
                I wanted to create an endless space that feels like a field of stars, where each light
                represents an exposed soul in a nostalgic tribute to the &ldquo;Moonlight
                Children&rdquo; era.
              </p>
              <div className={`flex flex-wrap items-baseline ${gapThumbClass}`}>
                {["Dark", "Melancholic", "Nostalgic", "Glow"].map((word) => (
                  <p key={word} className={`${smallTitleClass}`}>{word}</p>
                ))}
              </div>
            </div>

            {/* First Sketches */}
            <div className="flex flex-col gap-6">
              <h3 className={subTitleClass}>First Sketches</h3>
              <div className="overflow-hidden">
                <ConfessionSketchesCarousel />
              </div>
            </div>

            {/* Final Design */}
            <div className={`flex flex-col ${gapSubtitleClass}`}>
              <h3 className={subTitleClass}>Final Design</h3>
              <p className={bodyTextClass}>
                Continuing the Dark Mode atmosphere — The Moon is the heart of the site and the
                experience, symbolizing &ldquo;inner light&rdquo; and emotional release.
              </p>
            </div>

            {/* Key Features */}
            <div className="flex flex-col gap-6">
              <h3 className={subTitleClass}>Key Features</h3>
            </div>
          </div>

          <div className="col-span-8 md:col-start-3 md:col-span-5 overflow-hidden">
            <KeyFeaturesCarousel />
          </div>
        </PageGrid>
      </section>

      {/* ── Divider ── */}
      <div className="w-full border-t border-[#2200b8]" />

      {/* ── Flow Section (Part 2) ── */}
      <section>
        <MobileStickyTitle>Flow</MobileStickyTitle>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className={TITLE_COL_DESKTOP_CLASS}>
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Flow</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col ${gapContentClass} ${sectionColumnPaddingClass}`}>
            <div className="flex flex-col gap-4 md:max-w-[80%] md:ml-[4.5rem] lg:max-w-[95%] lg:ml-[-1rem]">
              <h3 className={subTitleClass}>User Flow</h3>
              <img src={USER_FLOW} alt="Moonlight Confessions user flow" className="w-full" loading="lazy" />
            </div>
          </div>

          <div className="col-span-8 md:col-start-3 md:col-span-5 flex justify-center -mt-8">
            <div className="w-full md:w-[115%]">
              <LaptopMockup />
            </div>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-6 ${sectionColumnPaddingClass}`}>
            <h3 className={subTitleClass}>Screens</h3>
            <div className="overflow-hidden -mt-10">
              <DesktopScreensCarousel />
            </div>
          </div>
        </PageGrid>
      </section>

      {/* ── Divider ── */}
      <div className="w-full border-t border-[#2200b8]" />

      {/* ── Research Section (Part 2) ── */}
      <section>
        <MobileStickyTitle>Research</MobileStickyTitle>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className={TITLE_COL_DESKTOP_CLASS}>
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Research</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col ${gapContentClass} ${sectionColumnPaddingClass}`}>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2 order-2 md:order-none">
                <img src={AVIV_IMAGE_2} alt="The Moonlight Children" className="w-full rounded-sm" loading="lazy" />
              </div>
              <div className={`md:w-1/2 flex flex-col ${gapSubtitleClass} order-1 md:order-none`}>
                <h3 className={`${subTitleClass} leading-[1.5] flex flex-wrap items-baseline gap-x-4 md:gap-x-6`}>
                  <span>The Moonlight Children</span>
                  <span className="font-['Varela_Round'] font-bold">ילדי אור הירח</span>
                </h3>
                <p className={bodyTextClass}>
                  A dedicated youth subculture from the early 90s, inspired by Geffen&rsquo;s raw
                  lyrics and social messages, forming a powerful community across Israel.
                </p>
              </div>
            </div>

            <p className={`${bodyTextClass} md:max-w-[80%] md:-mt-[calc(var(--gap-content)*0.4)]`}>
              Aviv became the voice of a generation that felt invisible, turning shame into pride.
              This website serves as a digital tribute to that powerful sense of belonging.
            </p>
          </div>
        </PageGrid>
      </section>

      {/* ── Divider ── */}
      <div className="w-full border-t border-[#2200b8]" />

      {/* ── Style Guide (Part 2) ── */}
      <section>
        <MobileStickyTitle>Style Guide</MobileStickyTitle>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className={TITLE_COL_DESKTOP_CLASS}>
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Style Guide</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col ${gapContentClass} ${sectionColumnPaddingClass}`}>
            {/* Color Palette (Part 2) — horizontal: text left, bars right */}
            <div className="flex flex-col md:flex-row ${gapSplitClass}">
              <div className={`flex flex-col ${gapSubtitleClass} md:w-[55%]`}>
                <h3 className={subTitleClass}>Color Palette</h3>
                <p className={bodyTextClass}>
                  I kept the original palette but replaced the red with a yellowish-white, like aged
                  paper, to evoke a deeper sense of melancholy and nostalgia.
                </p>
              </div>
              <div className="md:w-[45%] flex items-end">
                <AvivColorPalette2 />
              </div>
            </div>

            {/* Typography (Part 2) — horizontal: text left, vertical scroll right */}
            <div className="flex flex-col md:flex-row ${gapSplitClass}">
              <div className={`flex flex-col ${gapSubtitleClass} md:w-[40%] shrink-0`}>
                <h3 className={subTitleClass}>Typography</h3>
                <p className={bodyTextClass}>
                  The core typography remains a central hand-drawn font, but I replaced the bold style
                  with a thinner, more delicate hand to evoke a more sensitive and vulnerable feel.
                </p>
              </div>
              <div className="md:w-[55%] md:ml-auto">
                <CnfsnTypoVerticalScroll />
              </div>
            </div>

            {/* Typography Sketches (Part 2) — both-axis scroll */}
            <div className="flex flex-col gap-4 md:w-[80%]">
              <h3 className={subTitleClass}>Typography Sketches</h3>
              <CnfsnTypoSketchScroll />
            </div>

            {/* Icons & Buttons */}
            <div className={`flex flex-col ${gapSubtitleClass}`}>
              <h3 className={subTitleClass}>Icons &amp; Buttons</h3>
              <p className={bodyTextClass}>
                Consistent with the typography, I hand-drew all icons and buttons to maintain a
                unified manual style.
              </p>

              {/* Main Buttons */}
              <div className="flex flex-col gap-4">
                <h4 className={smallTitleClass}>Main Buttons</h4>
                <div className={iconButtonsRowClass}>
                  <img src={BTN_FLOWER} alt="Flower button" className="h-[80px] md:h-[100px] w-auto max-w-full object-contain" loading="lazy" />
                  <img src={BTN_ARROW_PLUS} alt="Plus button" className="h-[70px] md:h-[85px] w-auto max-w-full object-contain" loading="lazy" />
                  <img src={BTN_ARROW_PROFILE} alt="Profile button" className="h-[70px] md:h-[85px] w-auto max-w-full object-contain" loading="lazy" />
                  <img src={BTN_ARROW} alt="Arrow button" className="h-[70px] md:h-[85px] w-auto max-w-full object-contain" loading="lazy" />
                  <img src={BTN_START} alt="Start button" className="h-[70px] md:h-[85px] w-auto max-w-full object-contain" loading="lazy" />
                </div>
              </div>

              {/* Secondary Buttons */}
              <div className="flex flex-col gap-4 mt-6 md:mt-4">
                <h4 className={smallTitleClass}>Secondary Buttons</h4>
                <div className={iconButtonsRowClass}>
                  <img src={BTN_X} alt="Close button" className="h-[36px] md:h-[44px] w-auto max-w-full object-contain" loading="lazy" />
                  <img src={BTN_BROKEN_HRT} alt="Broken heart button" className="h-[56px] md:h-[68px] w-auto max-w-full object-contain" loading="lazy" />
                  <img src={BTN_FULL_HRT} alt="Full heart button" className="h-[56px] md:h-[68px] w-auto max-w-full object-contain" loading="lazy" />
                  <img src={BTN_PAPER} alt="Paper button" className="h-[56px] md:h-[68px] w-auto max-w-full object-contain" loading="lazy" />
                  <img src={BTN_SEND} alt="Send button" className="h-[56px] md:h-[68px] w-auto max-w-full object-contain" loading="lazy" />
                </div>
              </div>

              {/* User Profile Picture Icons */}
              <div className="flex flex-col gap-4 mt-6 md:mt-2">
                <h4 className={smallTitleClass}>Users Profile Picture Icons</h4>
                <div className={iconButtonsRowClass}>
                  {PRF_ICONS.map((src, i) => (
                    <img key={i} src={src} alt={`Profile icon ${i + 1}`} className="h-[92px] md:h-[112px] w-auto max-w-full object-contain" loading="lazy" />
                  ))}
                </div>
                <p className={`${bodyTextClass} -mt-1 md:mt-2`}>
                  Inspired by Aviv&rsquo;s world of imagery.
                </p>
              </div>
            </div>

            {/* Icons Sketches — both-axis scroll */}
            <div className="flex flex-col gap-4 md:w-[80%]">
              <h3 className={subTitleClass}>Icons Sketches</h3>
              <IconsSketchScroll />
            </div>
          </div>
        </PageGrid>
      </section>

      {/* ── Next Project ── */}
      <ProjectNav currentProject="aviv" onSelectSection={onSelectSection} />
    </div>
  );
}
