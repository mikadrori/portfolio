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
  sectionPageGridStretchClass,
  sectionColumnPaddingClass,
  extendContentToCol7Class,
} from "../lib/sectionLayout";
import {
  FINAL_DESIGN_ICON_COLUMNS,
  FINAL_ICON_SIZE_DEFAULT,
  type FinalDesignIconAsset,
} from "../config/muchiwazeFinalIcons";
import { PageGrid } from "../components/PageGrid";
import { ProjectHeroVideo } from "../components/ProjectHeroVideo";
import { ProjectNav } from "../components/ProjectNav";
import { useDragScroll } from "../hooks/useDragScroll";
import { usePaletteBarsReveal } from "../hooks/usePaletteBarsReveal";

const Q = "auto:best";

/** One radius per video group (same carousel = one constant), like PackUp. */
const CONCEPT_ALL_ICONS_VIDEO_RADIUS = "52px";
const RESEARCH_OPENING_VIDEO_RADIUS = "40px";
const FINAL_ICONS_CAROUSEL_VIDEO_RADIUS = "40px";
const AVATARS_PREVIEW_VIDEO_RADIUS = "55px";

// Hero
const HERO_VIDEO = cloudinaryUrl("MuchiwazePromoVID_uvefuw_rqb5tp.mp4", { resourceType: "video", quality: Q });
const HERO_POSTER = cloudinaryUrl("herobanner_skeleton_muchiwaze_a9sxeq.png", { quality: Q, width: 1920 });

// Concept — full mockup still (separate from video poster)
const MOCKUP_IMAGE = "/assets/muchiwazemockup_newcropped_llurh5.jpg";

// Concept
const APP_ICON = cloudinaryUrl("MuchiwazeAppICON_bkdvdb_q41i7g.svg");

// Research – phone mockup video
const VID_OPENING = cloudinaryUrl("MuchiVIDopening_uzqbyc_yx4qkz.mp4", { resourceType: "video", quality: Q });

// Design – Sketches
const SKETCHES_1 = cloudinaryUrl("MuchiSketches1_o2jeoj_zvcmb4.png", { quality: Q });
const SKETCHES_2 = cloudinaryUrl("MuchiSketches2_mnwjpn_qgqphb.png", { quality: Q });

// Design – Inspirations
const INSPIRATIONS = [
  cloudinaryUrl("MuchiInsparationIMG01_nd5ais_qci6s9.png", { quality: Q }),
  cloudinaryUrl("MuchiInsparationIMG02_cnsupq_ohorih.png", { quality: Q }),
  cloudinaryUrl("MuchiInsparationIMG03_q2fxyh_lrbnx9.png", { quality: Q }),
  cloudinaryUrl("MuchiInsparationIMG04_kp56fy_kq0kxw.png", { quality: Q }),
  cloudinaryUrl("MuchiInsparationIMG05_lm9vrr_pchc7w.png", { quality: Q }),
  cloudinaryUrl("MuchiInsparationIMG06_hdgriu_yvf2u7.png", { quality: Q }),
  cloudinaryUrl("MuchiInsparationIMG07_iwejtc_y5du3w.png", { quality: Q }),
  cloudinaryUrl("MuchiInsparationIMG08_gim7st_gmid5x.png", { quality: Q }),
  cloudinaryUrl("MuchiInsparationIMG09_gjlh17_yxutrw.png", { quality: Q }),
  cloudinaryUrl("MuchiInsparationIMG10_a5rxl3_r2t7gz.png", { quality: Q }),
  cloudinaryUrl("MuchiInsparationIMG11_plp9qz_bhtez9.png", { quality: Q }),
  cloudinaryUrl("MuchiInsparationIMG12_ary2qu_i9athb.png", { quality: Q }),
];

const MUCHI_COLOR_PALETTE = [
  "#590A19",
  "#C90000",
  "#DE2467",
  "#1F7537",
  "#04CEA5",
  "#FFC73B",
  "#FFEFBB",
] as const;

// Design – Icon options
const ICONS_OPT1 = cloudinaryUrl("MuchiIconsOpt1_ub84yi_ukwkvr.svg");
const ICONS_OPT2 = cloudinaryUrl("MuchiIconsOpt2_vmt6hx_zm37np.svg");
const ICONS_OPT3 = cloudinaryUrl("MuchiIconsOpt3_f2swgb_ozvj4q.svg");

// Design – Final icons: layout + per-icon sizes live in `src/config/muchiwazeFinalIcons.ts`
/** Keeps SVG aspect ratio (no stretching). */
const FINAL_ICON_IMG_BASE_CLASS = "h-auto w-full object-contain";

function FinalDesignIconImg({ src, alt, sizeClass, offsetClass }: FinalDesignIconAsset) {
  const size = sizeClass ?? FINAL_ICON_SIZE_DEFAULT;
  return (
    <motion.img
      src={src}
      alt={alt}
      className={`${FINAL_ICON_IMG_BASE_CLASS} ${size} cursor-default${offsetClass ? ` ${offsetClass}` : ""}`}
      loading="lazy"
      draggable={false}
      style={{ transformOrigin: "center bottom" }}
      whileHover={{ y: -10, scale: 1.12 }}
      transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
    />
  );
}

/** Same hover lift/scale as final icons; sizing comes from the grid cell. */
function AvatarShowcaseImg({ src, alt }: { src: string; alt: string }) {
  return (
    <motion.img
      src={src}
      alt={alt}
      className="h-auto w-full cursor-default object-contain"
      loading="lazy"
      draggable={false}
      style={{ transformOrigin: "center bottom" }}
      whileHover={{ y: -10, scale: 1.12 }}
      transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
    />
  );
}

// Design – Icon videos
const VID_ALL_ICONS = cloudinaryUrl("MuchiVIDAllIcons_bjnsjo_bxsr4z.mp4", { resourceType: "video", quality: Q });
const VID_ROBBERY = cloudinaryUrl("MuchiVIDrobbery_polqe9_uaec7f.mp4", { resourceType: "video", quality: Q });
const VID_BRIBE = cloudinaryUrl("MuchiVIDbribe_yamd4y_dhggtr.mp4", { resourceType: "video", quality: Q });
const VID_HOSTEL = cloudinaryUrl("MuchiVIDhostelICON_uni5ug_dkighx.mp4", { resourceType: "video", quality: Q });
const VID_CHABAD = cloudinaryUrl("MuchiVIDchabadICON_thybkb_ht8psc.mp4", { resourceType: "video", quality: Q });
const VID_MUNCH = cloudinaryUrl("MuchiVIDmunchICONS_rdkd3u_ua2gxx.mp4", { resourceType: "video", quality: Q });
const VID_PARTY = cloudinaryUrl("MuchiVIDpartyICON_oh2fez_spyvqy.mp4", { resourceType: "video", quality: Q });
const VID_WEED = cloudinaryUrl("MuchiVIDweedICON_lm3yvu_buk2qw.mp4", { resourceType: "video", quality: Q });

// Avatars — individual SVGs + profile-picker demo (cross layout matches Figma)
const VID_AVATARS = cloudinaryUrl("MuchiVIDAvatars_vuoyqw_fd3hc5.mp4", { resourceType: "video", quality: Q });

const AVATAR_SHOWCASE = [
  { id: "romantic", src: "/assets/avatar_girl1_ydtnjh.svg", gridArea: "a", alt: "The romantic" },
  { id: "southerner", src: "/assets/avatar_boy1_nyhror.svg", gridArea: "b", alt: "The southerner" },
  { id: "biker", src: "/assets/avatar_girl2_icj0vx.svg", gridArea: "c", alt: "The biker" },
  { id: "chill", src: "/assets/avatar_boy2_fnv9q2.svg", gridArea: "d", alt: "The chill traveler" },
  { id: "trailblazer", src: "/assets/avatar_girl3_tfhyys.svg", gridArea: "e", alt: "The trailblazer" },
] as const;

// Screens
const SCREENS = [
  cloudinaryUrl("MuchiScreen01_llhzt4_nxjtzq.png", { quality: Q }),
  cloudinaryUrl("MuchiScreen02_ilzr62_lhm5oh.png", { quality: Q }),
  cloudinaryUrl("MuchiScreen03_ectwrb_laqbns.png", { quality: Q }),
  cloudinaryUrl("MuchiScreen04_gqn0ci_tohygg.png", { quality: Q }),
  cloudinaryUrl("MuchiScreen05_od0z9x_ly0icg.png", { quality: Q }),
  cloudinaryUrl("MuchiScreen06_b25jnq_kyxgzx.png", { quality: Q }),
  cloudinaryUrl("MuchiScreen07_uohyvy_jdni2l.png", { quality: Q }),
  cloudinaryUrl("MuchiScreen08_qrslgx_yhhdpt.png", { quality: Q }),
  cloudinaryUrl("MuchiScreen09_o13np9_srob3e.png", { quality: Q }),
  cloudinaryUrl("MuchiScreen10_uqksuj_ptyfzd.png", { quality: Q }),
  cloudinaryUrl("MuchiScreen11_r5kvtc_qpwta2.png", { quality: Q }),
  cloudinaryUrl("MuchiScreen12_ipiqkc_cly6ro.png", { quality: Q }),
  cloudinaryUrl("MuchiScreen13_kzugef_mmkogs.png", { quality: Q }),
  cloudinaryUrl("MuchiScreen14_wsxhpp_mem7i2.png", { quality: Q }),
];

const TRAVEL_ESSENTIALS_ROWS = [
  ["Robbery Alert", "Police Alert (Bribe)", "Travel Partner", "Lookout Point"],
  ["Chabad House", "Laundry", "Hostel"],
  ["Trek Route", "ATM", "Weed", "Munch"],
  ["Airport", "Market", "Party"],
];

/** Space between each essentials row in Research. */
const TRAVEL_ESSENTIALS_ROWS_GAP_CLASS = "gap-y-8 md:gap-y-12";

/** Tighter row gap for Design “First Sketches” word list only. */
const DESIGN_SKETCHES_WORD_ROWS_GAP_CLASS = "gap-y-4 md:gap-y-6";

const SKETCHES_FILTERED_OUT = new Set([
  "Travel Partner", "Lookout Point", "Airport", "Market",
]);

const ICON_VIDEOS = [
  { src: VID_ROBBERY, label: "Robbery Alert" },
  { src: VID_BRIBE, label: "Police Alert" },
  { src: VID_HOSTEL, label: "Hostel" },
  { src: VID_CHABAD, label: "Chabad House" },
  { src: VID_MUNCH, label: "Munch" },
  { src: VID_PARTY, label: "Party" },
  { src: VID_WEED, label: "Weed" },
];

/** Bar height by index distance from hovered swatch (symmetric rings). */
const PALETTE_HOVER_HEIGHT_BY_DISTANCE = [
  "100%", // d=0
  "76%", // d=1 — wider steps between rings
  "54%", // d=2
  "38%", // d=3
  "26%", // d=4
  "18%", // d=5
  "12%", // d=6
] as const;

/** Scroll-reveal scaleY + distance-based hover (same height per |i − hovered|). */
function MuchiColorPalette() {
  const containerRef = useRef<HTMLDivElement>(null);
  const showBars = usePaletteBarsReveal(containerRef);
  const [hovered, setHovered] = useState<number | null>(null);

  const ariaLabel = `MuchiWaze color palette: ${MUCHI_COLOR_PALETTE.join(", ")}`;

  const barHeightPct = (i: number) => {
    if (!showBars) return "86%";
    if (hovered === null) return "86%";
    const d = Math.abs(i - hovered);
    return PALETTE_HOVER_HEIGHT_BY_DISTANCE[d];
  };

  return (
    <div
      ref={containerRef}
      className="grid w-full min-w-0 grid-cols-7 gap-3 md:gap-4"
      role="img"
      aria-label={ariaLabel}
      onMouseLeave={() => setHovered(null)}
    >
      {MUCHI_COLOR_PALETTE.map((hex, i) => (
        <div
          key={i}
          className="relative flex min-h-0 h-40 w-full flex-col justify-end overflow-hidden rounded-none sm:h-48 md:h-56"
          onMouseEnter={() => setHovered(i)}
        >
          <motion.div
            className="w-full shrink-0 rounded-none"
            style={{
              backgroundColor: hex,
              transformOrigin: "center bottom",
            }}
            initial={{ scaleY: 0 }}
            animate={{
              scaleY: showBars ? 1 : 0,
              height: barHeightPct(i),
            }}
            transition={{
              scaleY: { duration: 0.8, ease: "easeIn" },
              height: { duration: 0.35, ease: "easeIn" },
            }}
          />
          <span
            className={`pointer-events-none absolute bottom-2 left-2 z-10 font-['Bricolage_Grotesque'] font-light leading-none tracking-[0.7px] text-[clamp(9px,2.4vw,12px)] sm:text-xs ${
              hex === "#FFEFBB" ? "text-[#590A19]" : "text-white"
            }`}
          >
            {hex}
          </span>
        </div>
      ))}
    </div>
  );
}

function InspirationsCarousel() {
  const { ref, onMouseDown } = useDragScroll();

  return (
    <div ref={ref} onMouseDown={onMouseDown} className="overflow-x-auto scrollbar-hide cursor-grab">
      <div className="flex w-max gap-6 md:gap-14">
        {INSPIRATIONS.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Inspiration photo ${i + 1}`}
            className="h-[160px] md:h-[220px] w-auto rounded-sm pointer-events-none"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}

function ScreensCarousel() {
  const { ref, onMouseDown } = useDragScroll();

  return (
    <div ref={ref} onMouseDown={onMouseDown} className="overflow-x-auto scrollbar-hide cursor-grab">
      <div className="flex w-max gap-6 md:gap-14">
        {SCREENS.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`MuchiWaze screen ${i + 1}`}
            className="h-[240px] w-auto rounded-sm pointer-events-none md:h-[380px]"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}

interface MuchiWazeProps {
  onSelectSection: (id: string) => void;
  onReady?: () => void;
}

export default function MuchiWaze({ onSelectSection, onReady }: MuchiWazeProps) {
  const sketch1Drag = useDragScroll();
  const sketch2Drag = useDragScroll();
  const iconVideosDrag = useDragScroll();
  const readyFired = useRef(false);

  const signalReady = useCallback(() => {
    if (readyFired.current) return;
    readyFired.current = true;
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    let pending = 2;
    const onOne = () => {
      pending -= 1;
      if (pending <= 0) signalReady();
    };
    const preload = (src: string) => {
      const img = new Image();
      img.src = src;
      if (img.complete) onOne();
      else {
        img.onload = onOne;
        img.onerror = onOne;
      }
    };
    preload(HERO_POSTER);
    preload(MOCKUP_IMAGE);
  }, [signalReady]);

  return (
    <div className="flex flex-col">
      {/* ── Hero + Concept = min 100vh ── */}
      <div className="min-h-screen flex flex-col">
        {/* Hero Video Banner */}
        <ProjectHeroVideo src={HERO_VIDEO} poster={HERO_POSTER}/>

        {/* Concept — cols 3–5: text then mockup (mt-12 md:mt-16); phone cols 6–7 unchanged. */}
        <section className="flex-1 flex flex-col justify-center">
          <PageGrid className={sectionPageGridStretchClass}>
            <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
              <h2 className={`${stickyTitleClass} leading-[1.5]`}>Concept</h2>
            </div>

            <div className={`col-span-8 md:col-start-3 md:col-span-3 md:row-start-1 min-w-0 ${sectionColumnPaddingClass}`}>
              <div className="flex flex-col gap-2">
                <img
                  src={APP_ICON}
                  alt="MuchiWaze app icon"
                  className="w-[90px] md:w-[110px] rounded-[18px] mb-2"
                />
                <h3 className={`${projectNameClass} leading-[1.5]`}>MuchiWaze</h3>
                <p className={`${smallTitleClass} leading-[1.5]`}>
                  A &lsquo;Waze&rsquo; based mini-app for Muchilers.
                  <br />
                  Everything a Muchiler needs!
                </p>
                <p className={`${bodyTextClass} mt-4 italic`}>
                  This project focuses on icon design and visual language.
                </p>
                <p className={`${bodyTextClass} mt-2 text-[12px] opacity-70`}>
                  * Muchiler (from the Spanish Mochila): A term for backpackers in Latin America,
                  widely used by Israelis on their post-army trip for long-term, low-budget, and authentic travel.
                </p>
              </div>
              <div className="mt-8 flex justify-center md:hidden">
                <video
                  src={VID_OPENING}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-auto w-[180px] object-contain"
                  style={{ background: "none", borderRadius: CONCEPT_ALL_ICONS_VIDEO_RADIUS }}
                />
              </div>
              <img
                src={MOCKUP_IMAGE}
                alt="MuchiWaze app mockup"
                className="mt-4 md:mt-8 w-full rounded-sm"
                loading="lazy"
              />
            </div>

            <div
              className={`col-span-8 hidden min-w-0 md:col-start-6 md:col-span-2 md:row-start-1 md:flex md:items-center md:justify-end md:self-stretch ${sectionColumnPaddingClass}`}
            >
              <video
                src={VID_OPENING}
                autoPlay
                muted
                loop
                playsInline
                className="h-auto w-[180px] shrink-0 object-contain md:h-auto md:w-[288px] md:max-w-full"
                style={{ background: "none", borderRadius: CONCEPT_ALL_ICONS_VIDEO_RADIUS }}
              />
            </div>
          </PageGrid>
        </section>
      </div>

      {/* ── Divider ── */}
      <div className="w-full border-t border-[#2200b8]" />

      {/* ── Research Section — content cols 3–7: copy from col 3, video original 220px flush to col 7 end. */}
      <section>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Research</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-6 md:gap-8 ${sectionColumnPaddingClass}`}>
            <div className="flex flex-col md:flex-row gap-8 md:items-start">
              <div className="flex min-w-0 flex-1 flex-col gap-6">
                <h3 className={subTitleClass}>What a Muchiler needs?</h3>
                <p className={bodyTextClass}>
                  I started by asking: What does the Israeli traveler in South America really need?
                  What does their daily routine look like? Inspired by Waze, I focused on real-time
                  alerts and points of interest, leading to a list of travel essentials:
                </p>

                <div className={`flex flex-col ${TRAVEL_ESSENTIALS_ROWS_GAP_CLASS}`}>
                  {TRAVEL_ESSENTIALS_ROWS.map((row, ri) => (
                    <div key={ri} className={row.length === 4 ? "grid grid-cols-4" : "grid grid-cols-3 px-[12.5%]"}>
                      {row.map((item) => (
                        <p key={item} className={`${bodyTextClass} font-semibold text-center`}>{item}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex shrink-0 justify-center md:justify-end">
                <video
                  src={VID_ALL_ICONS}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-auto w-[220px]"
                  style={{ background: "none", borderRadius: RESEARCH_OPENING_VIDEO_RADIUS }}
                />
              </div>
            </div>
          </div>
        </PageGrid>
      </section>

      {/* ── Divider ── */}
      <div className="w-full border-t border-[#2200b8]" />

      {/* ── Design Section ── */}
      <section>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Design</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-4 flex flex-col gap-10 md:gap-14 ${sectionColumnPaddingClass}`}>
            {/* First Sketches */}
            <div className="flex flex-col gap-3">
              <h3 className={subTitleClass}>First Sketches</h3>
              <p className={bodyTextClass}>
                I narrowed this list and started sketching.
              </p>

              <div className={`flex flex-col ${DESIGN_SKETCHES_WORD_ROWS_GAP_CLASS}`}>
                {TRAVEL_ESSENTIALS_ROWS.map((row, ri) => (
                  <div key={ri} className={row.length === 4 ? "grid grid-cols-4" : "grid grid-cols-3 px-[12.5%]"}>
                    {row.map((item) => (
                      <p
                        key={item}
                        className={`${bodyTextClass} font-semibold text-center${
                          SKETCHES_FILTERED_OUT.has(item) ? " opacity-30" : ""
                        }`}
                      >{item}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Option 1 – circular sketches (title↔carousel gap matches Option 2) */}
            <div className="flex flex-col gap-2">
              <h3 className={smallTitleClass}>Option 1</h3>
              <div className={extendContentToCol7Class}>
                <div ref={sketch1Drag.ref} onMouseDown={sketch1Drag.onMouseDown} className="overflow-x-auto scrollbar-hide cursor-grab">
                  <img src={SKETCHES_1} alt="Option 1 — circular icon sketches" className="h-[112px] md:h-[148px] w-auto max-w-none pointer-events-none" loading="lazy" />
                </div>
              </div>
            </div>

            {/* Option 2 – geometric/diamond sketches */}
            <div className="flex flex-col gap-2">
              <h3 className={smallTitleClass}>Option 2</h3>
              <div className={extendContentToCol7Class}>
                <div ref={sketch2Drag.ref} onMouseDown={sketch2Drag.onMouseDown} className="overflow-x-auto scrollbar-hide cursor-grab">
                  <img src={SKETCHES_2} alt="Option 2 — geometric icon sketches" className="h-[112px] md:h-[148px] w-auto max-w-none pointer-events-none" loading="lazy" />
                </div>
              </div>
            </div>

            <p className={bodyTextClass}>
              I simplified imagery into South American ethnic shapes — squares, triangles, and
              diamonds — inspired by the region&rsquo;s architecture, textiles, and traditional art.
            </p>

            {/* Color Palette */}
            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>Color Palette</h3>
              <div className="flex flex-col gap-6">
                <p className={bodyTextClass}>
                  I drew inspiration from Latin American landscapes, using my own travel photos to
                  create a rich palette that captures the region&rsquo;s true atmosphere.
                </p>
                <MuchiColorPalette />
              </div>
            </div>

           

            {/* Inspirations */}
            <div className="flex flex-col gap-6">
              <h3 className={subTitleClass}>Inspirations</h3>
              <div className={`overflow-hidden ${extendContentToCol7Class}`}>
                <InspirationsCarousel />
              </div>
            </div>

            {/* Initial Design */}
            <div className="flex flex-col gap-6">
              <h3 className={subTitleClass}>Initial Design</h3>
              <p className={bodyTextClass}>
                I selected 7 key icons, and combined the shapes with my chosen colors to create the
                two options, adding one more version to the second option.
              </p>

              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <h4 className={smallTitleClass}>Option 1</h4>
                  <img src={ICONS_OPT1} alt="Icon option 1" className="w-full" loading="lazy" />
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className={smallTitleClass}>Option 2/a</h4>
                  <img src={ICONS_OPT2} alt="Icon option 2a" className="w-full" loading="lazy" />
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className={smallTitleClass}>Option 2/b</h4>
                  <img src={ICONS_OPT3} alt="Icon option 2b" className="w-full" loading="lazy" />
                </div>
              </div>
            </div>

            {/* Final Design — section title; Icons / Avatars use smallTitleClass (typography semi level) */}
            <div className="flex flex-col gap-6">
              <h3 className={subTitleClass}>Final Design</h3>
              <p className={bodyTextClass}>
                I combined both options — using the illustrations from the first and the geometric
                background from the second, and created the final icons.
              </p>

              <div className="flex flex-col gap-4">
                <h4 className={smallTitleClass}>Icons</h4>
                <div className={extendContentToCol7Class}>
                  <div className="grid w-full grid-cols-5 items-stretch gap-4 sm:gap-5 md:gap-8">
                    {FINAL_DESIGN_ICON_COLUMNS.map((col, i) => (
                      <div
                        key={i}
                        className={`flex min-w-0 flex-col items-center justify-center overflow-visible ${
                          col.layout === "stack" ? "gap-5 sm:gap-6 md:gap-10" : ""
                        }`}
                      >
                        {col.layout === "single" ? (
                          <FinalDesignIconImg
                            src={col.src}
                            alt={col.alt}
                            sizeClass={col.sizeClass}
                            offsetClass={col.offsetClass}
                          />
                        ) : (
                          <>
                            <FinalDesignIconImg
                              src={col.top.src}
                              alt={col.top.alt}
                              sizeClass={col.top.sizeClass}
                              offsetClass={col.top.offsetClass}
                            />
                            <FinalDesignIconImg
                              src={col.bottom.src}
                              alt={col.bottom.alt}
                              sizeClass={col.bottom.sizeClass}
                              offsetClass={col.bottom.offsetClass}
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={extendContentToCol7Class}>
                  <div
                    ref={iconVideosDrag.ref}
                    onMouseDown={iconVideosDrag.onMouseDown}
                    className="min-w-0 overflow-x-auto overflow-y-hidden scrollbar-hide cursor-grab touch-pan-x"
                  >
                    <div className="flex w-max gap-8 md:gap-20">
                      {ICON_VIDEOS.map((vid) => (
                        <video
                          key={vid.label}
                          src={vid.src}
                          autoPlay
                          muted
                          loop
                          playsInline
                          draggable={false}
                          className="h-[352px] w-auto shrink-0 pointer-events-none md:h-[496px]"
                          style={{
                            background: "none",
                            borderRadius: FINAL_ICONS_CAROUSEL_VIDEO_RADIUS,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-8 md:pt-10">
                <h4 className={smallTitleClass}>Avatars</h4>
                <p className={bodyTextClass}>
                  As a continuation, I designed 5 profile avatars of common Israeli traveler types
                  for the user to choose from — with a profile-picker flow in the app.
                </p>

                <div className={extendContentToCol7Class}>
                  <div className="flex flex-col items-stretch gap-1 lg:flex-row lg:items-center lg:gap-2">
                    <div
                      className="mx-auto grid w-full max-w-[min(100%,20rem)] grid-cols-3 grid-rows-3 justify-items-center gap-0 overflow-visible sm:max-w-[23.5rem] md:max-w-[25.5rem]"
                      style={{
                        gridTemplateAreas: `
                          "a . b"
                          ". c ."
                          "d . e"
                        `,
                      }}
                    >
                      {AVATAR_SHOWCASE.map((item) => (
                        <div
                          key={item.id}
                          className="flex w-full max-w-[6.25rem] items-center justify-center overflow-visible sm:max-w-[6.875rem] md:max-w-[7.5rem]"
                          style={{ gridArea: item.gridArea }}
                        >
                          <AvatarShowcaseImg src={item.src} alt={item.alt} />
                        </div>
                      ))}
                    </div>

                    <div className="flex min-w-0 flex-1 justify-center lg:justify-end">
                      <div className="w-full max-w-[220px] sm:max-w-[256px] md:max-w-[292px]">
                        <video
                          src={VID_AVATARS}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="h-auto w-full max-w-full"
                          style={{ background: "none", borderRadius: AVATARS_PREVIEW_VIDEO_RADIUS }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Screens — semi-title in content column (col 3), carousel to col 7 */}
            <div className="flex flex-col gap-4">
              <h4 className={smallTitleClass}>Screens</h4>
              <div className={extendContentToCol7Class}>
                <ScreensCarousel />
              </div>
            </div>
          </div>
        </PageGrid>
      </section>

      {/* ── Next Project ── */}
      <ProjectNav currentProject="muchiwaze" onSelectSection={onSelectSection} />
    </div>
  );
}
