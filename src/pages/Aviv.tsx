import { useEffect, useRef, useCallback } from "react";

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
import { PageGrid } from "../components/PageGrid";
import { ProjectNav } from "../components/ProjectNav";
import { useDragScroll } from "../hooks/useDragScroll";

const Q = "auto:best";

// ─── Videos ───
const VID_SPLASH = cloudinaryUrl("AvivSplashVID_elnjry.mp4", { resourceType: "video", quality: Q });
const VID_YARKON = cloudinaryUrl("AvivYarkonVID_sse3jw.mp4", { resourceType: "video", quality: Q });
const VID_LONDON = cloudinaryUrl("AvivLondonVID_gfexod.mp4", { resourceType: "video", quality: Q });
const VID_KINNERET = cloudinaryUrl("AvivKinneretVID_omezd8.mp4", { resourceType: "video", quality: Q });
const VID_ARAD = cloudinaryUrl("AvivAradVId_tjpqy8.mp4", { resourceType: "video", quality: Q });
const VID_FLOWER_NAV = cloudinaryUrl("AvivNavigationflrVID_g5wfhy.mp4", { resourceType: "video", quality: Q });
const VID_WEATHER_TOGGLE = cloudinaryUrl("AvivWeatherToggleVId_ghczg7.mp4", { resourceType: "video", quality: Q });
const VID_RECOMMENDATIONS = cloudinaryUrl("AvivRecomenndationsVID_i4u4nk.mp4", { resourceType: "video", quality: Q });
const VID_CONFESSIONS_PROMO = cloudinaryUrl("AvivConfessionPromoVID_fvsgfz.mp4", { resourceType: "video", quality: Q });
const VID_CONFESSIONS = cloudinaryUrl("AvivVideoConffessions_wv2jyo.mp4", { resourceType: "video", quality: Q });

// ─── Hero ───
const HERO_POSTER = cloudinaryUrl("AvivAppMockup01_rzlm2p.png", { quality: Q, width: 1920 });

// ─── Concept ───
const APP_ICON = cloudinaryUrl("AvivClodyNowAPPICON_wcyxqx.png", { quality: Q });
const MOCKUPS_CLOUDY_NOW = cloudinaryUrl("AvivMockupsCloudyNow_vubtjf.png", { quality: Q, width: 1200 });

// ─── App Mockups ───
const APP_MOCKUP_01 = cloudinaryUrl("AvivAppMockup01_rzlm2p.png", { quality: Q, width: 1200 });
const APP_MOCKUP_02 = cloudinaryUrl("AvivAppMockup02_bnab5u.png", { quality: Q, width: 1200 });
const APP_MOCKUP_03 = cloudinaryUrl("AvivAppMockup03_jiumrl.png", { quality: Q, width: 1200 });

// ─── App Sketches ───
const APP_SKETCHES = [
  cloudinaryUrl("AvivAppSketch1_lyksbf.png", { quality: Q }),
  cloudinaryUrl("AvivAppSketch2_m0i1mk.png", { quality: Q }),
  cloudinaryUrl("AvivAppSketch3_jhom22.png", { quality: Q }),
  cloudinaryUrl("AvivAppSketch4_lzf1vk.png", { quality: Q }),
  cloudinaryUrl("AvivAppSketch5_juurdv.png", { quality: Q }),
  cloudinaryUrl("AvivAppSketch6_x2h9hk.png", { quality: Q }),
  cloudinaryUrl("AvivAppSketch6_2_u3ap6k.png", { quality: Q }),
  cloudinaryUrl("AvivAppSketch7_roa8ol.png", { quality: Q }),
];

// ─── Weather Elements (SVG) ───
const MOON_SVG = cloudinaryUrl("AvivMoon_aqvyc3.svg");
const CLOUD_SVG = cloudinaryUrl("AvivCloud_gvc2x9.svg");
const LIGHTNING_SVG = cloudinaryUrl("AvivLighting_v3sgzu.svg");
const SUN_SVG = cloudinaryUrl("AvivSun_kimgxp.svg");

// ─── Weather Icons (SVG) ───
const CLOUDY_ICON = cloudinaryUrl("AvivCloudyICON_molkdd.svg");
const PARTLY_CLOUDY_ICON = cloudinaryUrl("AvivPartlyCloudyICON_owplg9.png", { quality: Q });
const RAIN_ICON = cloudinaryUrl("AvivRainICON_zonwil.svg");
const SUNNY_ICON = cloudinaryUrl("AvivSunnyICON_er6pze.svg");

// ─── Navigation / Feature SVGs ───
const NAV_FLOWER_SVG = cloudinaryUrl("AvivNavigatonFlower_jzcjpr.svg");
const WEATHER_TOGGLE_SVG = cloudinaryUrl("AvivWeatherToggle_vwks2j.svg");
const DAILY_REC_BTN = cloudinaryUrl("AvivDailyRecommendationBTN_ivqbyx.svg");

// ─── Color Palettes ───
const COLOR_PALETTE_1 = cloudinaryUrl("AvivColorPallete_ngiivo.svg");
const COLOR_PALETTE_2 = cloudinaryUrl("AvivColorPallete2_y1vu3w.svg");

// ─── Typography ───
const SIMPLER_FONT = cloudinaryUrl("AvivSimplerFONT_fswh09.svg");
const TYPO_SKETCHES_CLOUDY = cloudinaryUrl("AvivSketchesTypographyCloudyNow_q4qbx5.png", { quality: Q });

// ─── Phone Screens ───
const SCREEN_YARKON = cloudinaryUrl("AvivScreenYarkon_leqktu.png", { quality: Q });
const SCREEN_LONDON = cloudinaryUrl("AvivScreenLondon_vjapde.png", { quality: Q });
const SCREEN_KINNERET = cloudinaryUrl("AvivScreenKinneret_f4va5f.png", { quality: Q });
const SCREEN_ARAD = cloudinaryUrl("AvivScreenArad_vq7gkb.png", { quality: Q });

// ─── Research ───
const AVIV_IMAGE = cloudinaryUrl("Aviv_Image_wte5yu.png", { quality: Q });
const AVIV_IMAGE_2 = cloudinaryUrl("AvivImage2_zpzrxi.png", { quality: Q });

// ─── User Flow ───
const USER_FLOW = cloudinaryUrl("AvivUserFLOW_ztnjuj.svg");

// ─── Confessions Mockup ───
const CONFESSIONS_MOCKUP = cloudinaryUrl("AvivConffesionMKUP_pq46dc.png", { quality: Q, width: 1920 });

// ─── Confessions Sketches ───
const CNFSN_SKETCHES = [
  cloudinaryUrl("AvivCNFSNSketch1_hfevu5.png", { quality: Q }),
  cloudinaryUrl("AvivCNFSNsketch2_gdr2ms.png", { quality: Q }),
  cloudinaryUrl("AvivCNFSNSketch3_fauns5.png", { quality: Q }),
  cloudinaryUrl("AvivCNFSNSketch4_sszvor.png", { quality: Q }),
  cloudinaryUrl("AvivCNFSNSketch5_iayrur.png", { quality: Q }),
];

// ─── Confessions Typography ───
const CNFSN_TYPO = [
  cloudinaryUrl("AvivCNFSNtypo1_kjp8ja.png", { quality: Q }),
  cloudinaryUrl("AvivCNFSNtypo2_i5rhhc.png", { quality: Q }),
  cloudinaryUrl("AvivCNFSNtypo3_bvbuvx.png", { quality: Q }),
  cloudinaryUrl("AvivCNFSNtypo4_awizvf.png", { quality: Q }),
  cloudinaryUrl("AvivCNFSNtypo5_1_ge28a1.png", { quality: Q }),
  cloudinaryUrl("AvivCNFSNtypo5_2_xth9ho.png", { quality: Q }),
  cloudinaryUrl("AvivCNFSNtypo6_t7bmmg.png", { quality: Q }),
];
const CNFSN_TYPO_SKETCH = cloudinaryUrl("AvivCNFSNtypoSketch_s70a9v.png", { quality: Q });

// ─── Desktop Screens ───
const DESKTOP_SCREENS = [
  cloudinaryUrl("AvivDesktopScreen01_okscom.png", { quality: Q }),
  cloudinaryUrl("AvivDesktopScreen02_lz3h3h.png", { quality: Q }),
  cloudinaryUrl("AvivDesktopScreen03_jjmtwi.png", { quality: Q }),
  cloudinaryUrl("AvivDesktopScreen04_yzzdsk.png", { quality: Q }),
  cloudinaryUrl("AvivDesktopScreen05_u27bsc.png", { quality: Q }),
];

// ─── Buttons (SVG) ───
const BTN_X = cloudinaryUrl("AvivsBTNX_ybyiwj.svg");
const BTN_SEND = cloudinaryUrl("AvivsBTNsend_maaby1.svg");
const BTN_PAPER = cloudinaryUrl("AvivsBTNpaper_hmjrhs.svg");
const BTN_FULL_HRT = cloudinaryUrl("AvivsBTNfullhrt_jdqhuz.svg");
const BTN_BROKEN_HRT = cloudinaryUrl("AvivsBTNbrokenhrt_br77lg.svg");

// ─── Secondary Buttons (SVG) ───
const BTN_ARROW_PLUS = cloudinaryUrl("AvivBTNarrowplus_cjikr8.svg");
const BTN_ARROW = cloudinaryUrl("AvivBTNarrow_irf0wn.svg");
const BTN_FLOWER = cloudinaryUrl("AvivBTNflower_qfj9ca.svg");
const BTN_ARROW_PROFILE = cloudinaryUrl("AvivBTNarrowprofile_nlrfwt.svg");
const BTN_START = cloudinaryUrl("AvivBTNstart_qwvyxt.svg");

// ─── Profile Icons (SVG) ───
const PRF_ICONS = [
  cloudinaryUrl("AvivPRFicons01_vt2nnh.svg"),
  cloudinaryUrl("AvivPRFicons02_sgmai5.svg"),
  cloudinaryUrl("AvivPRFicons03_d9znav.svg"),
  cloudinaryUrl("AvivPRFicons04_leswyq.svg"),
  cloudinaryUrl("AvivPRFicons05_t7ob72.svg"),
];

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

function DesktopScreensCarousel() {
  const { ref, onMouseDown } = useDragScroll();
  return (
    <div ref={ref} onMouseDown={onMouseDown} className="overflow-x-auto scrollbar-hide cursor-grab">
      <div className="flex gap-6 md:gap-10 w-max pr-[20%]">
        {DESKTOP_SCREENS.map((src, i) => (
          <img key={i} src={src} alt={`Desktop screen ${i + 1}`} className="h-[280px] md:h-[420px] w-auto rounded-sm pointer-events-none" loading="lazy" />
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
  const { ref, onMouseDown } = useDragScroll();
  return (
    <div ref={ref} onMouseDown={onMouseDown} className="overflow-x-auto scrollbar-hide cursor-grab">
      <div className="flex gap-4 md:gap-6 w-max pr-[20%]">
        <img src={CNFSN_TYPO_SKETCH} alt="Typography sketch" className="h-[180px] md:h-[260px] w-auto rounded-sm pointer-events-none" loading="lazy" />
        <img src={TYPO_SKETCHES_CLOUDY} alt="Cloudy Now typography sketch" className="h-[180px] md:h-[260px] w-auto rounded-sm pointer-events-none" loading="lazy" />
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
        <div className="w-full h-[300px] md:h-[500px] shrink-0 overflow-hidden">
          <video
            src={VID_CONFESSIONS_PROMO}
            poster={HERO_POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full h-px shrink-0 bg-[#2200b8]" />

        {/* Concept Section */}
        <section className="flex-1 flex flex-col justify-center">
          <PageGrid className={sectionPageGridStretchClass}>
            <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
              <h2 className={`${stickyTitleClass} leading-[1.5]`}>Concept</h2>
            </div>

            <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-12 md:gap-16 ${sectionColumnPaddingClass}`}>
              {/* Moonlight Atmosphere intro */}
              <div className="flex flex-col gap-4">
                <h3 className={`${projectNameClass} leading-[1.5]`}>Moonlight Atmosphere</h3>
                <p className={bodyTextClass}>
                  A cohesive design evolution inspired by Aviv Geffen, translating character research
                  into a seamless UX/UI journey — including a mobile weather app and an immersive
                  desktop experience.
                </p>
                <p className={`${bodyTextClass} italic`}>
                  These projects focus on creating immersive UX/UI experiences.
                </p>
              </div>

              {/* Laptop mockup */}
              <div className="flex justify-center">
                <img
                  src={APP_MOCKUP_01}
                  alt="Moonlight Atmosphere laptop mockup"
                  className="w-full rounded-sm"
                  loading="lazy"
                />
              </div>

              {/* Cloudy Now sub-section */}
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 flex flex-col gap-2">
                  <h3 className={`${subTitleClass} leading-[1.5]`}>Cloudy Now</h3>
                  <p className={`${smallTitleClass} leading-[1.5]`}>
                    עכשיו מעונן
                  </p>
                  <p className={bodyTextClass}>
                    A dynamic weather experience inspired by the visual and emotional world of Aviv Geffen.
                  </p>
                  <p className={bodyTextClass}>
                    The app draws from Geffen&rsquo;s intense use of weather as a tool for emotional
                    expression in his lyrics. The concept captures the tension between the raw
                    vulnerability of the &lsquo;Flower Children&rsquo; era and a dark, deep melancholy,
                    reflecting the complex duality of Geffen&rsquo;s artistic persona.
                  </p>
                </div>
                <div className="flex justify-center md:justify-start shrink-0">
                  <img
                    src={APP_ICON}
                    alt="Cloudy Now app icon"
                    className="w-[120px] md:w-[140px] rounded-[22px] object-cover"
                  />
                </div>
              </div>

              {/* Phone mockup + App Mockups */}
              <img
                src={MOCKUPS_CLOUDY_NOW}
                alt="Cloudy Now app mockups"
                className="w-full rounded-sm"
                loading="lazy"
              />

              <img
                src={APP_MOCKUP_02}
                alt="Cloudy Now mockup 2"
                className="w-full rounded-sm"
                loading="lazy"
              />

              <img
                src={APP_MOCKUP_03}
                alt="Cloudy Now mockup 3"
                className="w-full rounded-sm"
                loading="lazy"
              />
            </div>
          </PageGrid>
        </section>
      </div>

      {/* ── Divider ── */}
      <div className="w-full h-px bg-[#2200b8]" />

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
              <div className="flex justify-center">
                <div className="w-[220px] md:w-[280px]">
                  <video
                    src={VID_SPLASH}
                    autoPlay muted loop playsInline
                    className="h-auto max-w-full"
                    style={{ background: "none" }}
                  />
                </div>
              </div>
            </div>

            {/* Key Features */}
            <h3 className={subTitleClass}>Key Features</h3>

            {/* Feature 1: Interactive Flower Scroll */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="md:w-1/2 flex flex-col gap-2">
                  <h4 className={smallTitleClass}>Interactive Flower Scroll</h4>
                  <p className={bodyTextClass}>
                    The core element — Users rotate a flower icon to navigate through key milestones
                    in Aviv&rsquo;s career.
                  </p>
                  <img src={NAV_FLOWER_SVG} alt="Navigation flower" className="w-[120px] md:w-[160px] mt-4" loading="lazy" />
                </div>
                <div className="md:w-1/2 flex justify-center">
                  <video
                    src={VID_FLOWER_NAV}
                    autoPlay muted loop playsInline
                    className="h-auto max-w-full"
                    style={{ background: "none" }}
                  />
                </div>
              </div>
            </div>

            {/* Feature 2: Dual-View Toggle */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="md:w-1/2 flex justify-center">
                  <video
                    src={VID_WEATHER_TOGGLE}
                    autoPlay muted loop playsInline
                    className="h-auto max-w-full"
                    style={{ background: "none" }}
                  />
                </div>
                <div className="md:w-1/2 flex flex-col gap-2">
                  <h4 className={smallTitleClass}>Dual-View Toggle</h4>
                  <p className={bodyTextClass}>
                    A bottom toggle for hourly and weekly forecasts, offering full data within a clean,
                    minimal interface.
                  </p>
                  <img src={WEATHER_TOGGLE_SVG} alt="Weather toggle" className="w-[160px] md:w-[200px] mt-4" loading="lazy" />
                </div>
              </div>
            </div>

            {/* Feature 3: Contextual Recommendations */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="md:w-1/2 flex flex-col gap-4">
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
                  <img src={DAILY_REC_BTN} alt="Daily recommendation button" className="w-[120px] md:w-[140px] mt-2" loading="lazy" />
                </div>
                <div className="md:w-1/2 flex justify-center">
                  <video
                    src={VID_RECOMMENDATIONS}
                    autoPlay muted loop playsInline
                    className="h-auto max-w-full"
                    style={{ background: "none" }}
                  />
                </div>
              </div>
            </div>

            {/* Weather Elements & Animation */}
            <div className="flex flex-col gap-6">
              <h3 className={subTitleClass}>Weather Elements &amp; Animation</h3>
              <p className={bodyTextClass}>
                Aviv Geffen often uses weather as a metaphor for emotions in his lyrics. In his world,
                the Moon is the central, cherished symbol, while the Sun is secondary, harsh, and
                burning. I drew inspiration from 4 of Aviv&rsquo;s songs to create the visual elements
                for each weather screen.
              </p>

              {/* 4 weather screen videos */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { src: SCREEN_YARKON, vid: VID_YARKON, label: "Yarkon" },
                  { src: SCREEN_LONDON, vid: VID_LONDON, label: "London" },
                  { src: SCREEN_KINNERET, vid: VID_KINNERET, label: "Kinneret" },
                  { src: SCREEN_ARAD, vid: VID_ARAD, label: "Arad" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-2">
                    <video
                      src={item.vid}
                      autoPlay muted loop playsInline
                      className="h-auto max-w-full"
                      style={{ background: "none" }}
                    />
                  </div>
                ))}
              </div>

              {/* Weather element frames */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
                <div className="flex flex-col items-center gap-2">
                  <img src={MOON_SVG} alt="Moon" className="w-[80px] md:w-[100px]" loading="lazy" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <img src={CLOUD_SVG} alt="Cloud" className="w-[80px] md:w-[100px]" loading="lazy" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <img src={LIGHTNING_SVG} alt="Lightning" className="w-[60px] md:w-[80px]" loading="lazy" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <img src={SUN_SVG} alt="Sun" className="w-[80px] md:w-[100px]" loading="lazy" />
                </div>
              </div>

              {/* Weather icons bar */}
              <div className="flex gap-6 items-center justify-center mt-4">
                <img src={CLOUDY_ICON} alt="Cloudy" className="h-[40px] md:h-[50px] w-auto" loading="lazy" />
                <img src={PARTLY_CLOUDY_ICON} alt="Partly cloudy" className="h-[40px] md:h-[50px] w-auto" loading="lazy" />
                <img src={RAIN_ICON} alt="Rain" className="h-[40px] md:h-[50px] w-auto" loading="lazy" />
                <img src={SUNNY_ICON} alt="Sunny" className="h-[40px] md:h-[50px] w-auto" loading="lazy" />
              </div>
            </div>
          </div>
        </PageGrid>
      </section>

      {/* ── Divider ── */}
      <div className="w-full h-px bg-[#2200b8]" />

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
      <div className="w-full h-px bg-[#2200b8]" />

      {/* ── Style Guide (Part 1) ── */}
      <section>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Style Guide</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-12 md:gap-16 ${sectionColumnPaddingClass}`}>
            {/* Color Palette */}
            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>Color Palette</h3>
              <p className={bodyTextClass}>
                I chose Dark Mode as a foundation to create an atmospheric environment, with a palette
                carefully selected to reflect the layers of Aviv Geffen&rsquo;s identity.
              </p>
              <img src={COLOR_PALETTE_1} alt="Cloudy Now color palette" className="w-full max-w-[520px]" loading="lazy" />
            </div>

            {/* Typography */}
            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>Typography</h3>
              <p className={bodyTextClass}>
                The typographic choices reflect Aviv Geffen&rsquo;s duality, creating a tension between
                raw expression and refined simplicity.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <h4 className={smallTitleClass}>Custom Hand-Drawn Typography</h4>
                  <p className={bodyTextClass}>
                    A custom-made, rebellious font that serves as the raw heart of the design.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className={smallTitleClass}>Secondary Typography</h4>
                  <p className={bodyTextClass}>
                    A clean, delicate font that ensures readability and balances the bold hand-drawn elements.
                  </p>
                  <img src={SIMPLER_FONT} alt="Simpler font" className="w-full max-w-[260px] mt-2" loading="lazy" />
                </div>
              </div>
            </div>

            {/* Typography Sketches */}
            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>Typography Sketches</h3>
            </div>
            <div className="overflow-hidden">
              <CnfsnTypoSketchesCarousel />
            </div>

            {/* Icons */}
            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>Icons</h3>
              <div className="flex gap-4 items-center justify-center flex-wrap">
                <img src={CLOUDY_ICON} alt="Cloudy" className="h-[50px] md:h-[60px] w-auto" loading="lazy" />
                <img src={PARTLY_CLOUDY_ICON} alt="Partly cloudy" className="h-[50px] md:h-[60px] w-auto" loading="lazy" />
                <img src={RAIN_ICON} alt="Rain" className="h-[50px] md:h-[60px] w-auto" loading="lazy" />
                <img src={SUNNY_ICON} alt="Sunny" className="h-[50px] md:h-[60px] w-auto" loading="lazy" />
              </div>
            </div>
          </div>
        </PageGrid>
      </section>

      {/* ═══════════════════════════════════════════════
          PART 2 — MOONLIGHT CONFESSIONS (Desktop)
          ═══════════════════════════════════════════════ */}

      {/* ── Divider ── */}
      <div className="w-full h-px bg-[#2200b8]" />

      {/* ── Concept (Part 2) ── */}
      <section>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
            <h2 className={`${stickyTitleClass} leading-[1.5]`}>Concept</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-12 md:gap-16 ${sectionColumnPaddingClass}`}>
            <div className="flex flex-col gap-4">
              <h3 className={`${subTitleClass} leading-[1.5]`}>Moonlight Confessions</h3>
              <p className={`${smallTitleClass} leading-[1.5]`}>וידויים לאור הירח</p>
              <p className={bodyTextClass}>
                As an extension, I developed a desktop experience for Aviv Geffen&rsquo;s fanbase,
                &ldquo;The Moonlight Children.&rdquo; An anonymous, protected space for emotional
                release. The intuitive &lsquo;infinite space&rsquo; connects isolated voices into a
                powerful collective experience.
              </p>
            </div>

            {/* Desktop mockup */}
            <img
              src={CONFESSIONS_MOCKUP}
              alt="Moonlight Confessions desktop mockup"
              className="w-full rounded-sm"
              loading="lazy"
            />

            {/* Confessions promo video */}
            <div className="w-full overflow-hidden rounded-sm">
              <video
                src={VID_CONFESSIONS}
                autoPlay muted loop playsInline
                className="w-full h-auto"
              />
            </div>
          </div>
        </PageGrid>
      </section>

      {/* ── Divider ── */}
      <div className="w-full h-px bg-[#2200b8]" />

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

              {/* Feature cards with descriptions and mockups */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <h4 className={smallTitleClass}>Free-Roaming Scroll</h4>
                  <p className={bodyTextClass}>
                    Users can scroll in any direction, creating a sense of wandering through an endless space.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className={smallTitleClass}>Confession Writing</h4>
                  <p className={bodyTextClass}>
                    A space for sharing feelings and releasing emotional burdens, letting users let
                    their thoughts set free to the world.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className={smallTitleClass}>Seamless Reading</h4>
                  <p className={bodyTextClass}>
                    Once a confession is opened, users can easily swipe or click the button to keep
                    reading through other stories continuously.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className={smallTitleClass}>My Confessions</h4>
                  <p className={bodyTextClass}>
                    A private archive to revisit your past thoughts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PageGrid>
      </section>

      {/* ── Divider ── */}
      <div className="w-full h-px bg-[#2200b8]" />

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

            {/* Large desktop mockup */}
            <img
              src={DESKTOP_SCREENS[0]}
              alt="Moonlight Confessions desktop view"
              className="w-full rounded-sm"
              loading="lazy"
            />
          </div>
        </PageGrid>
      </section>

      {/* ── Divider ── */}
      <div className="w-full h-px bg-[#2200b8]" />

      {/* ── Screens Carousel (Part 2) ── */}
      <section>
        <PageGrid className={sectionPageGridClass}>
          <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
            <h3 className={subTitleClass}>Screens</h3>
          </div>
          <div className={`col-span-8 md:col-start-3 md:col-span-6 ${sectionColumnPaddingClass}`}>
            <DesktopScreensCarousel />
          </div>
        </PageGrid>
      </section>

      {/* ── Divider ── */}
      <div className="w-full h-px bg-[#2200b8]" />

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
      <div className="w-full h-px bg-[#2200b8]" />

      {/* ── Style Guide (Part 2) ── */}
      <section>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Style Guide</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-12 md:gap-16 ${sectionColumnPaddingClass}`}>
            {/* Color Palette (Part 2) */}
            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>Color Palette</h3>
              <p className={bodyTextClass}>
                I kept the original palette but replaced the red with a yellowish-white, like aged
                paper, to evoke a deeper sense of melancholy and nostalgia.
              </p>
              <img src={COLOR_PALETTE_2} alt="Confessions color palette" className="w-full max-w-[520px]" loading="lazy" />
            </div>

            {/* Typography (Part 2) */}
            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>Typography</h3>
              <p className={bodyTextClass}>
                The core typography remains a central hand-drawn font, but I replaced the bold style
                with a thinner, more delicate hand to evoke a more sensitive and vulnerable feel.
              </p>
            </div>
            <div className="overflow-hidden">
              <TypoSketchesCarousel />
            </div>

            {/* Typography Sketches */}
            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>Typography Sketches</h3>
            </div>
            <div className="overflow-hidden">
              <CnfsnTypoSketchesCarousel />
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
                <div className="flex gap-4 items-center flex-wrap">
                  <img src={BTN_X} alt="Close button" className="h-[30px] md:h-[34px] w-auto" loading="lazy" />
                  <img src={BTN_BROKEN_HRT} alt="Broken heart button" className="h-[50px] md:h-[60px] w-auto" loading="lazy" />
                  <img src={BTN_FULL_HRT} alt="Full heart button" className="h-[50px] md:h-[60px] w-auto" loading="lazy" />
                  <img src={BTN_PAPER} alt="Paper button" className="h-[50px] md:h-[60px] w-auto" loading="lazy" />
                  <img src={BTN_SEND} alt="Send button" className="h-[50px] md:h-[60px] w-auto" loading="lazy" />
                </div>
              </div>

              {/* Secondary Buttons */}
              <div className="flex flex-col gap-4">
                <h4 className={smallTitleClass}>Secondary Buttons</h4>
                <div className="flex gap-4 items-center flex-wrap">
                  <img src={BTN_FLOWER} alt="Flower button" className="h-[60px] md:h-[70px] w-auto" loading="lazy" />
                  <img src={BTN_ARROW_PLUS} alt="Arrow plus button" className="h-[50px] md:h-[60px] w-auto" loading="lazy" />
                  <img src={BTN_ARROW_PROFILE} alt="Arrow profile button" className="h-[50px] md:h-[60px] w-auto" loading="lazy" />
                  <img src={BTN_ARROW} alt="Arrow button" className="h-[50px] md:h-[60px] w-auto" loading="lazy" />
                  <img src={BTN_START} alt="Start button" className="h-[50px] md:h-[60px] w-auto" loading="lazy" />
                </div>
              </div>

              {/* User Profile Picture Icons */}
              <div className="flex flex-col gap-4">
                <h4 className={smallTitleClass}>Users Profile Picture Icons</h4>
                <div className="flex gap-4 items-center flex-wrap">
                  {PRF_ICONS.map((src, i) => (
                    <img key={i} src={src} alt={`Profile icon ${i + 1}`} className="h-[50px] md:h-[60px] w-auto" loading="lazy" />
                  ))}
                </div>
                <p className={`${bodyTextClass} italic mt-2`}>
                  Inspired by Aviv&rsquo;s world of imagery.
                </p>
              </div>
            </div>

            {/* Icons Sketches */}
            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>Icons Sketches</h3>
            </div>
            <div className="overflow-hidden">
              <ConfessionSketchesCarousel />
            </div>
          </div>
        </PageGrid>
      </section>

      {/* ── Next Project ── */}
      <ProjectNav currentProject="aviv" onSelectSection={onSelectSection} />
    </div>
  );
}
