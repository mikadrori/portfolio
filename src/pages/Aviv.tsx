import { useEffect, useLayoutEffect, useRef, useCallback, useState } from "react";
import { motion } from "motion/react";

import { cloudinaryUrl } from "../lib/cloudinary";
import {
  stickyTitleClass,
  subTitleClass,
  smallTitleClass,
  bodyTextClass,
} from "../lib/typography";
import {
  sectionPageGridClass,
  sectionPageGridStretchClass,
  sectionColumnPaddingClass,
} from "../lib/sectionLayout";
import { PageGrid } from "../components/PageGrid";
import { PROJECT_HERO_VIDEO_SHELL_CLASS } from "../components/ProjectHeroVideo";
import { ProjectNav } from "../components/ProjectNav";
import { useDragScroll } from "../hooks/useDragScroll";

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
const HERO_POSTER = cloudinaryUrl("AvivAppMockup01_f2fycm_wbwgb7.png", { quality: Q });

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
const LIGHTNING_SVG = cloudinaryUrl("Lightning1-1_a9mh7u_khybzp.svg");
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
const DAILY_REC_BTN = cloudinaryUrl("recommendation_btn1_u3mqqi_wymqbe.svg");
const DAILY_REC_BTN_2 = cloudinaryUrl("recommendation_btn2_nshv27_s2gb4z.svg");

// ─── Weather Element Hover SVGs ───
const MOON_SVG_HOVER = cloudinaryUrl("Moon2_rdaedi_euakka.svg");
const CLOUD_SVG_HOVER = cloudinaryUrl("Cloud2_dm0fk0_rukznf.png");
const LIGHTNING_SVG_HOVER = cloudinaryUrl("Lightning1_cx3byk_aqesw4.svg");
const SUN_SVG_HOVER = cloudinaryUrl("Sun2_cmz0th_qsotqh.svg");

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

// ─── Viewport-lazy video (always muted, loop, play/pause on visibility) ───

interface ViewportVideoProps {
  src: string;
  className?: string;
  threshold?: number;
}

function ViewportVideo({ src, className = "", threshold = 0.5 }: ViewportVideoProps) {
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
          muted
          loop
          playsInline
          preload="metadata"
          className={`w-full h-full object-cover block transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
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

// ─── Recommendation Button (toggle between two versions) ───

function RecButton() {
  const [active, setActive] = useState(false);

  return (
    <button onClick={() => setActive((prev) => !prev)} className="relative cursor-pointer w-[140px] md:w-[180px]">
      <img
        src={DAILY_REC_BTN}
        alt="Daily recommendation button"
        className="w-full"
        draggable={false}
      />
      <motion.img
        src={DAILY_REC_BTN_2}
        alt="Daily recommendation button active"
        className="w-full absolute inset-0"
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
        draggable={false}
      />
    </button>
  );
}

// ─── Weather Element (hover swap + scale) ───

function WeatherElement({ src, hover, label, height }: { src: string; hover: string; label: string; height: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex items-center justify-center overflow-visible"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={hovered ? hover : src}
        alt={label}
        className={`${height} w-auto object-contain transition-transform duration-300 ease-out ${hovered ? "scale-[1.15]" : "scale-100"}`}
        loading="lazy"
      />
    </div>
  );
}

// ─── Weather Toggle (daily / weekly) ───

function WeatherToggle() {
  const [mode, setMode] = useState<"daily" | "weekly">("daily");

  return (
    <div className="relative mt-4 w-full max-w-[434px] inline-block">
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

  return (
    <motion.div
      className="flex items-center justify-center cursor-grab active:cursor-grabbing select-none mt-4"
      animate={{ rotate: rotation }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      onPointerDown={(e) => {
        dragStartX.current = e.clientX;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
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
    <div ref={ref} onMouseDown={onMouseDown} className="overflow-x-auto scrollbar-hide cursor-grab">
      <div className="flex gap-4 md:gap-6 w-max pr-[20%]">
        {APP_SKETCHES.map((src, i) => (
          <img key={i} src={src} alt={`App sketch ${i + 1}`} className="h-[200px] md:h-[300px] w-auto rounded-sm pointer-events-none" loading="lazy" />
        ))}
      </div>
    </div>
  );
}

function ConfessionSketchesCarousel() {
  const { ref, onMouseDown } = useDragScroll();
  return (
    <div ref={ref} onMouseDown={onMouseDown} className="overflow-x-auto scrollbar-hide cursor-grab">
      <div className="flex gap-4 md:gap-6 w-max pr-[20%]">
        {CNFSN_SKETCHES.map((src, i) => (
          <img key={i} src={src} alt={`Confessions sketch ${i + 1}`} className="h-[180px] md:h-[260px] w-auto rounded-sm pointer-events-none" loading="lazy" />
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

function KeyFeaturesCarousel() {
  const { ref, onMouseDown } = useDragScroll();
  return (
    <div ref={ref} onMouseDown={onMouseDown} className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing">
      <div className="flex gap-6 md:gap-8 w-max pr-[20%]">
        {KEY_FEATURES.map((feat) => (
          <div key={feat.title} className="flex flex-col gap-4 w-[85vw] md:w-[600px] shrink-0">
            <div className="flex flex-col gap-2 min-h-[90px] md:min-h-[100px]">
              <h4 className={smallTitleClass}>{feat.title}</h4>
              <p className={bodyTextClass}>{feat.desc}</p>
            </div>
            <ViewportVideo
              src={feat.video}
              className="w-full aspect-video rounded-[16px] bg-black"
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
      <div className="flex w-max gap-6 pr-[20%] md:gap-14">
        {DESKTOP_SCREENS.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Desktop screen ${i + 1}`}
            className="h-[240px] w-auto rounded-sm pointer-events-none md:h-[380px]"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}

function TypoSketchesCarousel() {
  const { ref, onMouseDown } = useDragScroll();
  return (
    <div ref={ref} onMouseDown={onMouseDown} className="overflow-x-auto scrollbar-hide cursor-grab">
      <div className="flex gap-4 md:gap-6 w-max pr-[20%]">
        {CNFSN_TYPO.map((src, i) => (
          <img key={i} src={src} alt={`Typography sample ${i + 1}`} className="h-[120px] md:h-[180px] w-auto rounded-sm pointer-events-none" loading="lazy" />
        ))}
      </div>
    </div>
  );
}

function CnfsnTypoSketchesCarousel() {
  const { ref, onMouseDown } = useDragScroll("y");
  return (
    <div ref={ref} onMouseDown={onMouseDown} className="overflow-y-auto scrollbar-hide rounded-[20px] max-h-[150px] md:max-h-[150px] cursor-grab active:cursor-grabbing">
      <img src={TYPO_SKETCHES_CLOUDY} alt="Cloudy Now typography sketches" className="w-full pointer-events-none" loading="lazy" />
    </div>
  );
}

function CnfsnTypoVerticalScroll() {
  const { ref, onMouseDown } = useDragScroll("y");
  return (
    <div ref={ref} onMouseDown={onMouseDown} className="overflow-y-auto scrollbar-hide rounded-[20px] max-h-[200px] md:max-h-[280px] cursor-grab active:cursor-grabbing">
      <div className="flex flex-col gap-4 p-4">
        {CNFSN_TYPO.map((src, i) => (
          <img key={i} src={src} alt={`Typography sample ${i + 1}`} className="w-full rounded-sm pointer-events-none" loading="lazy" />
        ))}
      </div>
    </div>
  );
}

function CnfsnTypoSketchScroll() {
  const { ref, onMouseDown } = useDragScroll("both");
  return (
    <div ref={ref} onMouseDown={onMouseDown} className="overflow-auto scrollbar-hide rounded-[20px] bg-white h-[180px] md:h-[220px] w-[min(95%,700px)] cursor-grab active:cursor-grabbing">
      <img src={CNFSN_TYPO_SKETCH} alt="Typography sketches" style={{ width: 1200, minWidth: 1200 }} className="pointer-events-none" loading="lazy" />
    </div>
  );
}

function IconsSketchScroll() {
  const { ref, onMouseDown } = useDragScroll("both");
  return (
    <div ref={ref} onMouseDown={onMouseDown} className="overflow-auto scrollbar-hide rounded-[20px] bg-white h-[180px] md:h-[220px] w-[min(95%,700px)] cursor-grab active:cursor-grabbing">
      <img src={ICONS_SKETCH} alt="Icons sketches" style={{ width: 1200, minWidth: 1200 }} className="pointer-events-none" loading="lazy" />
    </div>
  );
}

function AvivColorPalette() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollUpRef = useRef(false);
  const [, scrollTick] = useState(0);

  useLayoutEffect(() => {
    scrollTick((n) => n + 1);
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      scrollUpRef.current = y < lastY;
      lastY = y;
      scrollTick((n) => n + 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const el = containerRef.current;
  let showBars = false;
  if (el) {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const overlap = Math.min(r.bottom, vh) - Math.max(r.top, 0);
    const ratio = overlap / Math.max(r.height, 1);
    const scrollingUp = scrollUpRef.current;
    const threshold = scrollingUp ? 0.5 : 0.18;
    showBars = ratio > threshold;
  }

  return (
    <div
      ref={containerRef}
      className="flex aspect-[3/4] w-full max-h-[min(52vw,400px)] items-stretch justify-center gap-[7%] md:gap-[9%]"
      role="img"
      aria-label="Cloudy Now color palette: #FADC98, #FFFFFF, #918DDB, #EF0034, #1B1F2A"
    >
      {AVIV_PALETTE_BARS.map((bar) => (
        <div
          key={bar.hex}
          className="relative flex h-full min-h-0 w-[17%] max-w-[54px] min-w-[28px] flex-col justify-end self-stretch"
        >
          <span
            className={`pointer-events-none absolute left-1/2 z-10 whitespace-nowrap font-['Bricolage_Grotesque'] text-[10px] font-medium tracking-[0.08em] md:text-[11px] ${bar.labelClass}`}
            style={{
              bottom: "calc(0.75rem + 1rem)",
              transform: "translateX(-50%) rotate(90deg)",
            }}
          >
            {bar.hex}
          </span>
          <div
            className="relative w-full overflow-visible"
            style={{ height: `calc(${bar.heightPct}% + 4rem)` }}
          >
            <motion.div
              className={`h-full w-full rounded-t-[999px] shadow-[0_0_5px_rgba(0,0,0,0.18)] ${bar.hex === "FFFFFF" ? "ring-1 ring-[#2200b8]/10" : ""}`}
              style={{
                backgroundColor: bar.fill,
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
  const scrollUpRef = useRef(false);
  const [, scrollTick] = useState(0);

  useLayoutEffect(() => {
    scrollTick((n) => n + 1);
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      scrollUpRef.current = y < lastY;
      lastY = y;
      scrollTick((n) => n + 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const el = containerRef.current;
  let showBars = false;
  if (el) {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const overlap = Math.min(r.bottom, vh) - Math.max(r.top, 0);
    const ratio = overlap / Math.max(r.height, 1);
    const scrollingUp = scrollUpRef.current;
    const threshold = scrollingUp ? 0.5 : 0.18;
    showBars = ratio > threshold;
  }

  return (
    <div
      ref={containerRef}
      className="flex aspect-[3/4] w-full max-h-[min(52vw,400px)] items-stretch justify-center gap-[7%] md:gap-[9%]"
      role="img"
      aria-label="Confessions color palette: #FADC98, #918DDB, #FFFFFF, #FFF5E1, #1B1F2A"
    >
      {AVIV_PALETTE_BARS_2.map((bar) => (
        <div
          key={bar.hex}
          className="relative flex h-full min-h-0 w-[17%] max-w-[54px] min-w-[28px] flex-col justify-end self-stretch"
        >
          <span
            className={`pointer-events-none absolute left-1/2 z-10 whitespace-nowrap font-['Bricolage_Grotesque'] text-[10px] font-medium tracking-[0.08em] md:text-[11px] ${bar.labelClass}`}
            style={{
              bottom: "calc(0.75rem + 1rem)",
              transform: "translateX(-50%) rotate(90deg)",
            }}
          >
            {bar.hex}
          </span>
          <div
            className="relative w-full overflow-visible"
            style={{ height: `calc(${bar.heightPct}% + 4rem)` }}
          >
            <motion.div
              className={`h-full w-full rounded-t-[999px] shadow-[0_0_5px_rgba(0,0,0,0.18)] ${bar.hex === "FFFFFF" || bar.hex === "FFF5E1" ? "ring-1 ring-[#2200b8]/10" : ""}`}
              style={{
                backgroundColor: bar.fill,
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
      <div className="min-h-screen flex flex-col">
        {/* Hero Video Banner */}
        <div className={PROJECT_HERO_VIDEO_SHELL_CLASS}>
          <ViewportVideo src={HERO_VIDEO_LOCAL} className="w-full" threshold={0.2} />
        </div>

        <div className="w-full border-t border-[#2200b8]" />

        {/* Concept Section */}
        <section className="flex-1 flex flex-col justify-center">
          <PageGrid className={sectionPageGridStretchClass}>
            <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-6 md:gap-8 ${sectionColumnPaddingClass}`}>
              {/* Moonlight Atmosphere intro */}
              <div className="flex flex-col gap-2">
                <h3 className="font-['Bricolage_Grotesque'] font-bold text-[36px] text-[#2200b8] tracking-[1.5px] leading-[1.5]">
                  Moonlight Atmosphere
                </h3>
                <p className="font-['Bricolage_Grotesque'] font-normal text-[25px] text-[#2200b8] tracking-[0.75px] leading-[1.5]">
                  A cohesive design evolution inspired by Aviv Geffen.
                </p>
                <p className="font-['Bricolage_Grotesque'] font-normal text-[25px] text-[#2200b8] tracking-[0.75px] leading-[1.5]">
                  translating character research into a seamless UX/UI journey&mdash;{" "}
                  <span className="font-semibold">
                    including a mobile weather app and an immersive desktop experience.
                  </span>
                </p>
                <p className="font-['Bricolage_Grotesque'] font-light text-[18px] text-[#2200b8] tracking-[0.9px] leading-[1.5] italic mt-2">
                  These projects focus on creating immersive UX/UI experiences.
                </p>
              </div>

              {/* Phone mockup + Laptop mockup side by side */}
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-[120px] md:w-[18%] shrink-0">
                  <ViewportVideo
                    src={VID_YARKON}
                    className="w-full rounded-[37px]"
                  />
                </div>
                <div className="md:w-[75%]">
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
        <PageGrid className={sectionPageGridStretchClass}>
          <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
            <h2 className={`${stickyTitleClass} leading-[1.5]`}>Concept</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-12 md:gap-16 ${sectionColumnPaddingClass}`}>
            {/* Cloudy Now — text + phone mockup */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 flex flex-col gap-4 min-w-0">
                <img
                  src={APP_ICON}
                  alt="Cloudy Now app icon"
                  className="w-[100px] md:w-[136px] rounded-[22px] object-cover"
                  loading="lazy"
                />
                <h3 className="font-['Bricolage_Grotesque'] font-semibold text-[28px] text-[#2200b8] tracking-[1.5px] leading-[1.5]">
                  <span>Cloudy Now</span>
                  {"  "}
                  <span className="font-['Varela_Round'] font-normal">עכשיו מעונן</span>
                </h3>
                <p className="font-['Bricolage_Grotesque'] font-normal text-[22px] text-[#2200b8] tracking-[0.66px] leading-[1.5]">
                  A dynamic weather experience inspired by the visual and emotional world of Aviv Geffen.
                </p>
                <p className="font-['Bricolage_Grotesque'] font-light text-[18px] text-[#2200b8] tracking-[0.54px] leading-[1.5]">
                  The app draws from Geffen&rsquo;s intense use of weather as a tool for emotional
                  expression in his lyrics. The concept captures the tension between the raw
                  vulnerability of the &lsquo;Flower Children&rsquo; era and a dark, deep melancholy,
                  reflecting the complex duality of Geffen&rsquo;s artistic persona.
                </p>
              </div>
              <div className="shrink-0 w-[180px] md:w-[260px] self-start">
                <ViewportVideo
                  src={SPLASH_VIDEO_LOCAL}
                  className="w-full rounded-[37px]"
                />
              </div>
            </div>

            {/* Auto-cycling mockup slideshow */}
            <MockupSlideshow />

            {/* Weather screen images */}
            <div className="flex justify-between w-full">
              <img src={SCREEN_KINNERET} alt="Kinneret weather screen" className="w-[20%] rounded-sm" loading="lazy" />
              <img src={SCREEN_YARKON} alt="Yarkon weather screen" className="w-[20%] rounded-sm" loading="lazy" />
              <img src={SCREEN_LONDON} alt="London weather screen" className="w-[20%] rounded-sm" loading="lazy" />
              <img src={SCREEN_ARAD} alt="Arad weather screen" className="w-[20%] rounded-sm" loading="lazy" />
            </div>
          </div>
        </PageGrid>
      </section>

      {/* ── Divider ── */}
      <div className="w-full border-t border-[#2200b8]" />

      {/* ── Design Section (Part 1) ── */}
      <section>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Design</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-16 md:gap-20 ${sectionColumnPaddingClass}`}>
            {/* Initial Concept & Ideation */}
            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>Initial Concept &amp; Ideation</h3>
              <p className={bodyTextClass}>
                My vision was to merge weather-inspired elements as a tribute to Aviv&rsquo;s lyrics
                with &lsquo;Flower Children&rsquo; imagery, creating a dark and mysterious atmosphere.
              </p>
              <div className="flex gap-8 md:gap-16 flex-wrap">
                {["Dark", "Contrast", "Bold", "Glow"].map((word) => (
                  <p key={word} className={`${smallTitleClass} italic`}>{word}</p>
                ))}
              </div>
            </div>

            {/* First Sketches */}
            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>First Sketches</h3>
            </div>
            <div className="overflow-hidden">
              <AppSketchesCarousel />
            </div>

            {/* Final Design */}
            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>Final Design</h3>
              <p className={bodyTextClass}>
                The final design focuses on the experience by removing unnecessary info, creating a
                simple and immersive layout that spotlights weather elements and floral motifs.
              </p>
            </div>

            {/* Key Features */}
            <h3 className={subTitleClass}>Key Features</h3>

            {/* Feature 1: Interactive Flower Scroll */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-[40%] flex flex-col justify-between min-h-0">
                <div className="flex flex-col gap-2">
                  <h4 className={smallTitleClass}>Interactive Flower Scroll</h4>
                  <p className={bodyTextClass}>
                    The core element — Users rotate a flower icon to navigate through key milestones
                    in Aviv&rsquo;s career.
                  </p>
                </div>
                <InteractiveFlower />
              </div>
              <div className="md:w-[30%] shrink-0">
                <ViewportVideo
                  src={VID_FLOWER_NAV}
                  className="w-full rounded-[37px]"
                />
              </div>
            </div>

            {/* Feature 2: Dual-View Toggle */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-[30%] shrink-0">
                <ViewportVideo
                  src={VID_WEATHER_TOGGLE}
                  className="w-full rounded-[37px]"
                />
              </div>
              <div className="md:w-[40%] flex flex-col gap-2">
                <h4 className={smallTitleClass}>Dual-View Toggle</h4>
                <p className={bodyTextClass}>
                  A bottom toggle for hourly and weekly forecasts, offering full data within a clean,
                  minimal interface.
                </p>
                <WeatherToggle />
              </div>
            </div>

            {/* Feature 3: Contextual Recommendations */}
            <div className="flex flex-col md:flex-row gap-8 md:items-center">
              <div className="shrink-0 self-end md:self-auto">
                <RecButton />
              </div>
              <div className="md:w-[30%] shrink-0">
                <ViewportVideo
                  src={VID_RECOMMENDATIONS}
                  className="w-full rounded-[37px]"
                />
              </div>
              <div className="md:w-[40%] flex flex-col gap-4">
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
            <div className="flex flex-col gap-6">
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

              {/* Hebrew song titles + weather screen videos */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                {[
                  { txt: TXT_KINNERET, vid: VID_KINNERET, label: "Kinneret" },
                  { txt: TXT_YARKON, vid: VID_YARKON, label: "Yarkon" },
                  { txt: TXT_LONDON, vid: VID_LONDON, label: "London" },
                  { txt: TXT_ARAD, vid: VID_ARAD, label: "Arad" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-3">
                    <img
                      src={item.txt}
                      alt={`${item.label} song title`}
                      className="h-[60px] md:h-[80px] w-auto object-contain"
                      loading="lazy"
                    />
                    <ViewportVideo
                      src={item.vid}
                      className="w-full rounded-[37px]"
                    />
                  </div>
                ))}
              </div>

              {/* Weather element frames with hover */}
              <div className="flex justify-between items-center mt-4">
                {[
                  { src: MOON_SVG, hover: MOON_SVG_HOVER, label: "Moon", height: "h-[150px] md:h-[190px]" },
                  { src: CLOUD_SVG, hover: CLOUD_SVG_HOVER, label: "Cloud", height: "h-[80px] md:h-[100px]" },
                  { src: LIGHTNING_SVG, hover: LIGHTNING_SVG_HOVER, label: "Lightning", height: "h-[170px] md:h-[220px]" },
                  { src: SUN_SVG, hover: SUN_SVG_HOVER, label: "Sun", height: "h-[135px] md:h-[170px]" },
                ].map((el) => (
                  <WeatherElement key={el.label} {...el} />
                ))}
              </div>

            </div>
          </div>
        </PageGrid>
      </section>

      {/* ── Divider ── */}
      <div className="w-full border-t border-[#2200b8]" />

      {/* ── Research Section (Part 1) ── */}
      <section>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Research</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-12 md:gap-16 ${sectionColumnPaddingClass}`}>
            {/* Aviv Geffen bio */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <img src={AVIV_IMAGE} alt="Aviv Geffen" className="w-full rounded-sm" loading="lazy" />
              </div>
              <div className="md:w-1/2 flex flex-col gap-2">
                <h3 className={subTitleClass}>Aviv Geffen</h3>
                <p className={bodyTextClass}>
                  Aviv Geffen is a major Israeli musician who rose to fame in the 90s. Known for his
                  raw, provocative style, he became the voice of Israel&rsquo;s &ldquo;Moonlight
                  Children&rdquo; generation.
                </p>
              </div>
            </div>

            {/* Principles / Musical Themes / Visual Identity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col gap-2">
                <h4 className={smallTitleClass}>Principles</h4>
                <p className={bodyTextClass}>Voice: Social change.</p>
                <p className={bodyTextClass}>Peace: Generation&rsquo;s cry.</p>
                <p className={bodyTextClass}>Reality: Seeking different.</p>
              </div>
              <div className="flex flex-col gap-2">
                <h4 className={smallTitleClass}>Musical Themes</h4>
                <p className={bodyTextClass}>Struggles: Heartbreak &amp; family.</p>
                <p className={bodyTextClass}>Depths: Death &amp; depression.</p>
                <p className={bodyTextClass}>Outlook: Hope &amp; future.</p>
              </div>
              <div className="flex flex-col gap-2">
                <h4 className={smallTitleClass}>Visual Identity</h4>
                <p className={bodyTextClass}>Soft: &ldquo;Moonlight Children&rdquo; aesthetic.</p>
                <p className={bodyTextClass}>Edge: Dark, rebellious rock&amp;roll.</p>
                <p className={bodyTextClass}>Duality: Soft meets raw.</p>
              </div>
            </div>

            {/* A man of contrasts */}
            <div className="flex flex-col gap-2">
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
        <PageGrid className={sectionPageGridStretchClass}>
          <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Style Guide</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-12 md:gap-16 ${sectionColumnPaddingClass}`}>
            {/* Color Palette — two-column: text left, bars right */}
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
              <div className="flex flex-col gap-4 md:w-[55%]">
                <h3 className={subTitleClass}>Color Palette</h3>
                <p className={bodyTextClass}>
                  I chose Dark Mode as a foundation to create an atmospheric environment, with a palette
                  carefully selected to reflect the layers of Aviv Geffen&rsquo;s identity.
                </p>
                <div className="flex flex-col gap-4 mt-2">
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
              <div className="md:w-[45%] flex items-end">
                <AvivColorPalette />
              </div>
            </div>

            {/* Typography */}
            <div className="flex flex-col gap-6">
              <h3 className={subTitleClass}>Typography</h3>
              <p className={bodyTextClass}>
                The typographic choices reflect Aviv Geffen&rsquo;s duality, creating a tension between
                raw expression and refined simplicity.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-2">
                <div className="flex flex-col gap-3">
                  <h4 className={smallTitleClass}>Custom Hand-Drawn Typography</h4>
                  <p className={bodyTextClass}>
                    A custom-made, rebellious font that serves as the raw heart of the design.
                  </p>
                  <HandDrawnTypoCarousel />
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className={smallTitleClass}>Secondary Typography</h4>
                  <p className={bodyTextClass}>
                    A clean, delicate font that ensures readability and balances the bold hand-drawn elements.
                  </p>
                  <img src={SIMPLER_FONT} alt="Simpler font" className="w-full max-w-[260px] mt-4" loading="lazy" />
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
        <img
          src={CONFESSIONS_MOCKUP}
          alt="Moonlight Confessions desktop mockup"
          className="w-full"
          loading="lazy"
        />

        <PageGrid className={sectionPageGridStretchClass}>
          <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
            <h2 className={`${stickyTitleClass} leading-[1.5]`}>Concept</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-12 md:gap-16 ${sectionColumnPaddingClass}`}>
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 md:items-center">
              <div className="flex flex-col gap-4 md:w-[32%] shrink-0">
                <h3 className={`${subTitleClass} leading-[1.5]`}>Moonlight Confessions</h3>
                <p className={`${subTitleClass} font-['Varela_Round'] font-normal leading-[1.5]`}>וידויים לאור הירח</p>
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
              <div className="md:w-[68%]">
                <LaptopMockup />
              </div>
            </div>

            <div className="w-full max-w-[85%] aspect-video">
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
        <PageGrid className={sectionPageGridStretchClass}>
          <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Design</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-16 md:gap-20 ${sectionColumnPaddingClass}`}>
            {/* Initial Concept & Ideation */}
            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>Initial Concept &amp; Ideation</h3>
              <p className={bodyTextClass}>
                I wanted to create an endless space that feels like a field of stars, where each light
                represents an exposed soul in a nostalgic tribute to the &ldquo;Moonlight
                Children&rdquo; era.
              </p>
              <div className="flex gap-8 md:gap-16 flex-wrap">
                {["Dark", "Melancholic", "Nostalgic", "Glow"].map((word) => (
                  <p key={word} className={`${smallTitleClass} italic`}>{word}</p>
                ))}
              </div>
            </div>

            {/* First Sketches */}
            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>First Sketches</h3>
            </div>
            <div className="overflow-hidden">
              <ConfessionSketchesCarousel />
            </div>

            {/* Final Design */}
            <div className="flex flex-col gap-4">
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

          <div className="col-span-8 md:col-start-3 md:col-span-6 overflow-hidden">
            <KeyFeaturesCarousel />
          </div>
        </PageGrid>
      </section>

      {/* ── Divider ── */}
      <div className="w-full border-t border-[#2200b8]" />

      {/* ── Flow Section (Part 2) ── */}
      <section>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Flow</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-12 md:gap-16 ${sectionColumnPaddingClass}`}>
            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>User Flow</h3>
              <img src={USER_FLOW} alt="Moonlight Confessions user flow" className="w-full" loading="lazy" />
            </div>

            <LaptopMockup />

            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>Screens</h3>
            </div>
          </div>

          <div className="col-span-8 md:col-start-3 md:col-span-6 overflow-hidden">
            <DesktopScreensCarousel />
          </div>
        </PageGrid>
      </section>

      {/* ── Divider ── */}
      <div className="w-full border-t border-[#2200b8]" />

      {/* ── Research Section (Part 2) ── */}
      <section>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Research</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-12 md:gap-16 ${sectionColumnPaddingClass}`}>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <img src={AVIV_IMAGE_2} alt="The Moonlight Children" className="w-full rounded-sm" loading="lazy" />
              </div>
              <div className="md:w-1/2 flex flex-col gap-2">
                <h3 className={subTitleClass}>The Moonlight Children</h3>
                <p className={`${smallTitleClass} leading-[1.5]`}>ילדי אור הירח</p>
                <p className={bodyTextClass}>
                  A dedicated youth subculture from the early 90s, inspired by Geffen&rsquo;s raw
                  lyrics and social messages, forming a powerful community across Israel.
                </p>
              </div>
            </div>

            <p className={bodyTextClass}>
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
        <PageGrid className={sectionPageGridStretchClass}>
          <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Style Guide</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-12 md:gap-16 ${sectionColumnPaddingClass}`}>
            {/* Color Palette (Part 2) — horizontal: text left, bars right */}
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
              <div className="flex flex-col gap-4 md:w-[55%]">
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
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
              <div className="flex flex-col gap-4 md:w-[40%] shrink-0">
                <h3 className={subTitleClass}>Typography</h3>
                <p className={bodyTextClass}>
                  The core typography remains a central hand-drawn font, but I replaced the bold style
                  with a thinner, more delicate hand to evoke a more sensitive and vulnerable feel.
                </p>
              </div>
              <div className="md:w-[60%]">
                <CnfsnTypoVerticalScroll />
              </div>
            </div>

            {/* Typography Sketches (Part 2) — both-axis scroll */}
            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>Typography Sketches</h3>
              <CnfsnTypoSketchScroll />
            </div>

            {/* Icons & Buttons */}
            <div className="flex flex-col gap-6">
              <h3 className={subTitleClass}>Icons &amp; Buttons</h3>
              <p className={bodyTextClass}>
                Consistent with the typography, I hand-drew all icons and buttons to maintain a
                unified manual style.
              </p>

              {/* Main Buttons */}
              <div className="flex flex-col gap-4">
                <h4 className={smallTitleClass}>Main Buttons</h4>
                <div className="flex gap-10 items-center flex-wrap">
                  <img src={BTN_FLOWER} alt="Flower button" className="h-[80px] md:h-[100px] w-auto" loading="lazy" />
                  <img src={BTN_ARROW_PLUS} alt="Plus button" className="h-[70px] md:h-[85px] w-auto" loading="lazy" />
                  <img src={BTN_ARROW_PROFILE} alt="Profile button" className="h-[70px] md:h-[85px] w-auto" loading="lazy" />
                  <img src={BTN_ARROW} alt="Arrow button" className="h-[70px] md:h-[85px] w-auto" loading="lazy" />
                  <img src={BTN_START} alt="Start button" className="h-[70px] md:h-[85px] w-auto" loading="lazy" />
                </div>
              </div>

              {/* Secondary Buttons */}
              <div className="flex flex-col gap-4">
                <h4 className={smallTitleClass}>Secondary Buttons</h4>
                <div className="flex gap-10 items-center flex-wrap">
                  <img src={BTN_X} alt="Close button" className="h-[44px] md:h-[52px] w-auto" loading="lazy" />
                  <img src={BTN_BROKEN_HRT} alt="Broken heart button" className="h-[70px] md:h-[85px] w-auto" loading="lazy" />
                  <img src={BTN_FULL_HRT} alt="Full heart button" className="h-[70px] md:h-[85px] w-auto" loading="lazy" />
                  <img src={BTN_PAPER} alt="Paper button" className="h-[70px] md:h-[85px] w-auto" loading="lazy" />
                  <img src={BTN_SEND} alt="Send button" className="h-[70px] md:h-[85px] w-auto" loading="lazy" />
                </div>
              </div>

              {/* User Profile Picture Icons */}
              <div className="flex flex-col gap-4">
                <h4 className={smallTitleClass}>Users Profile Picture Icons</h4>
                <div className="flex gap-10 items-center flex-wrap">
                  {PRF_ICONS.map((src, i) => (
                    <img key={i} src={src} alt={`Profile icon ${i + 1}`} className="h-[70px] md:h-[85px] w-auto" loading="lazy" />
                  ))}
                </div>
                <p className={`${bodyTextClass} italic mt-2`}>
                  Inspired by Aviv&rsquo;s world of imagery.
                </p>
              </div>
            </div>

            {/* Icons Sketches — both-axis scroll */}
            <div className="flex flex-col gap-4">
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
