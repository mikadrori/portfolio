import { useEffect, useLayoutEffect, useRef, useCallback, useState } from "react";
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
import { PageGrid } from "../components/PageGrid";
import { ProjectHeroVideo } from "../components/ProjectHeroVideo";
import { ProjectNav } from "../components/ProjectNav";
import { useDragScroll } from "../hooks/useDragScroll";
import { usePaletteBarsReveal } from "../hooks/usePaletteBarsReveal";

const Q = "auto:best";

const CONCEPT_DEMOS_RADIUS = "37px";
/** Match Aviv weather-screen phones: lift on hover, ease-in */
const conceptPhoneHoverClass =
  "min-w-0 w-full flex justify-center transition-transform duration-300 ease-in hover:-translate-y-6";
const FEATURE1_VIDEO_RADIUS = "52px";
const FEATURE2_VIDEO_RADIUS = "52px";
const FEATURE3_VIDEO_RADIUS = "52px";
const FEATURE4_VIDEO_RADIUS = "52px";

// Hero
const HERO_VIDEO = cloudinaryUrl("PackupVIDpromo_trvywi_dijphf.mp4", { resourceType: "video", quality: Q });
const HERO_POSTER = cloudinaryUrl("herobanner_skeleton_packup_jxodtp.png", { quality: Q, width: 1920 });

// Concept
const APP_ICON = cloudinaryUrl("PackupAppICON_ep0ejq_fvv31d.svg");

// Research graphs
const GRAPH1 = cloudinaryUrl("graph-01_cwv5uf_ykm1wl.svg");
const GRAPH2 = cloudinaryUrl("graph-02_t23nki_rt7kxq.svg");

// User Persona
const PERSONA_IMG = cloudinaryUrl("user_persona_diypkk.png", { quality: Q, width: 400 });

// Design section
const ORDER_STATUS_BAR = cloudinaryUrl("OrderStatusBar_rrqn2n_cumehr.svg");
const ORDER_STATUS_LINE = cloudinaryUrl("OrderStatusLinebar_xr5mib_h2fvq8.svg");
const FILTER_OPEN = cloudinaryUrl("Filteropen_ibmkpd_xtbqfs.svg");
const FILTER_CLOSED = cloudinaryUrl("Filterclosed_ekw7qs_dor2uo.svg");

const VID_SIGNIN = cloudinaryUrl("PackUpVIDsignin_w4tloz_ptlsbb.mp4", { resourceType: "video", quality: Q });
const VID_HOMEPAGE = cloudinaryUrl("PackUpVIDhomepage_okxluu_qq8tqi.mp4", { resourceType: "video", quality: Q });
const VID_ORDERPAGE = cloudinaryUrl("PackUpVIDorderpage_vuruf7_eo3piz.mp4", { resourceType: "video", quality: Q });
const VID_PICKUP = cloudinaryUrl("PackUpVIDpickupchange_kzywgm_lzqqxn.mp4", { resourceType: "video", quality: Q });

// Flow
const USER_FLOW = cloudinaryUrl("PackupUserFlow_uba12t_lhwayf.svg");
const VID_PROTOTYPE = cloudinaryUrl("PackUpVIDPrototype_szonom_p784jg.mp4", { resourceType: "video", quality: Q });

// Screens
const SCREENS = [
  cloudinaryUrl("PackUpscreen01_wtwc56_zzhc41.png", { quality: Q }),
  cloudinaryUrl("PackUpscreen02_a3xf44_d3tfl2.png", { quality: Q }),
  cloudinaryUrl("PackUpscreen03_hjg0yu_vz5cas.png", { quality: Q }),
  cloudinaryUrl("PackUpscreen04_zc0lbt_lv8uoh.png", { quality: Q }),
  cloudinaryUrl("PackUpscreen05_xqg302_fn4bvy.png", { quality: Q }),
  cloudinaryUrl("PackUpscreen06_qzy1tt_rnem4o.png", { quality: Q }),
  cloudinaryUrl("PackUpscreen07_nqdxjc_hmrtdy.png", { quality: Q }),
  cloudinaryUrl("PackUpscreen08_go56fz_tnsuvx.png", { quality: Q }),
];

// Style Guide
const TYPO_SVG = cloudinaryUrl("PackUpTypo_b6j9xk_xkmzlb.svg");
const BTNS_SVG = cloudinaryUrl("PackUpBTNS_iggujw.svg");

const PALETTE_BARS = [
  { fill: "#695858", hex: "#695858", heightPct: 20, labelClass: "text-white" },
  { fill: "#514242", hex: "#514242", heightPct: 20, labelClass: "text-white" },
  { fill: "#8093F1", hex: "#8093F1", heightPct: 50, labelClass: "text-white" },
  {
    fill: "#FCFCFC",
    hex: "#FCFCFC",
    heightPct: 100,
    labelClass: "text-[#6b6b6b]",
  },
] as const;

function ColorPalette() {
  const containerRef = useRef<HTMLDivElement>(null);
  const showBars = usePaletteBarsReveal(containerRef);

  return (
    <div
      ref={containerRef}
      className="flex aspect-[3/4] w-full max-h-[min(52vw,400px)] -translate-x-5 -translate-y-12 items-stretch justify-center gap-[7%] md:gap-[9%]"
      role="img"
      aria-label="Pack Up color palette: #695858, #514242, #8093F1, #FCFCFC"
    >
      {PALETTE_BARS.map((bar) => (
        <div
          key={bar.hex}
          className="relative flex h-full min-h-0 w-[17%] max-w-[54px] min-w-[36px] flex-col justify-end self-stretch"
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
            style={{
              height:
                bar.hex === "#FCFCFC"
                  ? `calc(${bar.heightPct}% + 12rem)`
                  : `calc(${bar.heightPct}% + 6rem)`,
            }}
          >
            <motion.div
              className={`h-full w-full rounded-t-[999px] shadow-[0_0_5px_rgba(0,0,0,0.18)] ${bar.hex === "#FCFCFC" ? "ring-1 ring-[#2200b8]/10" : ""}`}
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

/** Semi-circular gauge (matches Pack Up stat SVGs): light track, #8093F1 fill, scroll-in animation. */
function GaugeChart({ targetPercent, ariaLabel }: { targetPercent: number; ariaLabel: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollUpRef = useRef(false);
  const [, scrollTick] = useState(0);

  const cx = 100;
  const cy = 92;
  const r = 72;
  const startX = cx - r;
  const startY = cy;
  const endX = cx + r;
  const endY = cy;
  const arcPath = `M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`;
  const arcLength = Math.PI * r;
  const strokeW = 14;
  const pad = strokeW / 2;
  /** Tight crop + xMin meet so the arc’s left edge lines up with body text (default xMidYMid centers the graphic). */
  const vbX = startX - pad;
  const vbY = cy - r - pad;
  const vbBottom = cy + 22 + 12;
  const vbH = vbBottom - vbY;
  const vbW = endX + pad + 12 - vbX;

  useLayoutEffect(() => {
    scrollTick((n) => n + 1);
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      scrollUpRef.current = window.scrollY < lastY;
      lastY = window.scrollY;
      scrollTick((n) => n + 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const el = containerRef.current;
  let active = false;
  if (el) {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const overlap = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
    const ratio = overlap / Math.max(rect.height, 1);
    const scrollingUp = scrollUpRef.current;
    const threshold = scrollingUp ? 0.5 : 0.18;
    active = ratio > threshold;
  }

  const fillFraction = active ? Math.min(100, Math.max(0, targetPercent)) / 100 : 0;
  const dashOffset = arcLength * (1 - fillFraction);

  return (
    <div ref={containerRef} className="w-full" role="img" aria-label={ariaLabel}>
      <svg
        viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
        preserveAspectRatio="xMinYMin meet"
        className="w-full h-auto block"
        aria-hidden
      >
        <path
          d={arcPath}
          fill="none"
          stroke="#E8EDF5"
          strokeWidth={strokeW}
          strokeLinecap="round"
        />
        <motion.path
          d={arcPath}
          fill="none"
          stroke="#8093F1"
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeDasharray={arcLength}
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          className="fill-[#514242] font-['Bricolage_Grotesque'] font-semibold"
          style={{ fontSize: 28 }}
        >
          {targetPercent}%
        </text>
        <text
          x={startX}
          y={cy + 22}
          textAnchor="middle"
          className="fill-[#514242] font-['Bricolage_Grotesque'] font-medium"
          style={{ fontSize: 15 }}
        >
          0
        </text>
        <text
          x={endX}
          y={cy + 22}
          textAnchor="middle"
          className="fill-[#514242] font-['Bricolage_Grotesque'] font-medium"
          style={{ fontSize: 15 }}
        >
          100
        </text>
      </svg>
    </div>
  );
}

const KEY_STATS = [
  {
    num: "1",
    title: "Order Confusion",
    desc: "40% of participants struggle to remember specific orders or arrival times when managing multiple packages.",
  },
  {
    num: "2",
    title: "Manual Tracking Habits",
    desc: "65% of users manually track orders via tracking numbers, indicating high involvement but an inefficient process.",
  },
  {
    num: "3",
    title: "High Notification Volume",
    desc: "The majority of users are frustrated by the overload of updates from global retailers like SHEIN, AliExpress, and Temu.",
  },
  {
    num: "4",
    title: "Fragmented Communication",
    desc: "Updates are scattered across Email, SMS, and Apps, making it difficult to locate specific shipment information.",
  },
];

const PERSONA_PAINS = [
  "Notification Overload: Managing fragmented updates across SMS and Email.",
  "Tracking Fatigue: The time-consuming effort of manual tracking.",
  "Lack of Clarity: Losing track of order details and arrival dates.",
];

const PERSONA_GOALS = [
  "Full Visibility: Easily track the volume and details of all orders in one place.",
  "Stay Updated: Monitor delivery status and arrival times in real-time.",
  "Order Awareness: Keep a clear record of purchases and better manage shopping habits.",
];

const FEATURES = [
  {
    title: "Unified Order Dashboard",
    desc: "A streamlined view of all active orders sorted by estimated arrival, with completed deliveries intelligently separated and highlighted for maximum clarity.",
  },
  {
    title: "Order Status Visualization",
    desc: "Each package includes a real-time progress bar, allowing users to see exactly where their order is in the shipping journey at a glance.",
  },
  {
    title: "Advanced Order History",
    desc: "A searchable archive with smart filters to sort orders by date, retailer, shipping method, or price.",
  },
  {
    title: "Quick Location Management",
    desc: "A seamless feature to quickly update or change the pickup point for orders currently in transit.",
  },
];

function ScreensCarousel() {
  const { ref, onMouseDown } = useDragScroll();

  return (
    <div ref={ref} onMouseDown={onMouseDown} className="overflow-x-auto scrollbar-hide cursor-grab">
      <div className="flex gap-6 md:gap-14 w-max">
        {SCREENS.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Pack Up screen ${i + 1}`}
            className="h-[240px] md:h-[380px] w-auto rounded-sm pointer-events-none"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}

interface PackUpProps {
  onSelectSection: (id: string) => void;
  onReady?: () => void;
}

export default function PackUp({ onSelectSection, onReady }: PackUpProps) {
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
      {/* ── Hero + Concept = min 100vh ── */}
      <div className="min-h-screen flex flex-col">
        {/* Hero Video Banner */}
        <ProjectHeroVideo src={HERO_VIDEO} poster={HERO_POSTER} />

        {/* Concept Section */}
        <section className="flex-1 flex flex-col justify-center">
          <PageGrid className={sectionPageGridStretchClass}>
            <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
              <h2 className={`${stickyTitleClass} leading-[1.5]`}>Concept</h2>
            </div>

            <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-12 md:gap-16 ${sectionColumnPaddingClass}`}>
              {/* Intro + Icon */}
              <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                <div className="flex-1 flex flex-col gap-2 md:max-w-[75%]">
                  <h3 className={`${projectNameClass} leading-[1.5]`}>Pack Up</h3>
                  <p className={`${smallTitleClass} leading-[1.5]`}>
                    The app that gets you organized!
                  </p>
                  <p className={bodyTextClass}>
                    As an online shopping addict, I've often faced a frustrating problem — I can't keep
                    track of everything I order. I have no idea what's arriving, where it's going, or
                    when it's due. That's why I chose to create Pack Up.
                  </p>
                  <p className={`${bodyTextClass} mt-4 italic`}>
                    This project focuses on user research and problem solving.
                  </p>
                </div>
                <div className="flex justify-center md:justify-start shrink-0">
                  <img
                    src={APP_ICON}
                    alt="Pack Up app icon"
                    className="w-[90px] md:w-[100px] object-contain"
                  />
                </div>
              </div>

              {/* Mockup image */}
              <img
                src={HERO_POSTER}
                alt="Pack Up app mockup showing three phone screens"
                className="w-full rounded-sm"
                loading="lazy"
              />

              {/* Challenge / Solution */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-x-[var(--grid-gutter)] gap-y-6">
                <div className="md:col-span-2 flex flex-col gap-1">
                  <h4 className={subTitleClass}>The Challenge</h4>
                  <p className={bodyTextClass}>
                    Tracking multiple orders across emails and messages is overwhelming, leading to lost
                    packages and stress.
                  </p>
                </div>
                <div className="hidden md:block md:col-start-3 md:col-span-1" aria-hidden />
                <div className="md:col-start-4 md:col-span-2 flex flex-col gap-1">
                  <h4 className={subTitleClass}>The Solution</h4>
                  <p className={bodyTextClass}>
                    A centralized platform that organizes all domestic and international orders into a
                    seamless, real-time experience.
                  </p>
                </div>
              </div>

            </div>

            {/* Phone video demos */}
            <div className={`col-span-8 md:col-start-3 md:col-span-5 grid grid-cols-3 gap-4 md:gap-16 ${sectionColumnPaddingClass}`}>
              {[VID_HOMEPAGE, VID_SIGNIN, VID_ORDERPAGE].map((src, i) => (
                <div key={i} className={conceptPhoneHoverClass}>
                  <video
                    src={src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-auto max-w-[200px]"
                    style={{ background: "none", borderRadius: CONCEPT_DEMOS_RADIUS }}
                  />
                </div>
              ))}
            </div>
          </PageGrid>
        </section>
      </div>

      {/* ── Divider ── */}
      <div className="w-full border-t border-[#2200b8]" />

      {/* ── User Research Section ── */}
      <section>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>
              User Research
            </h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-12 md:gap-16 ${sectionColumnPaddingClass}`}>
            {/* User Segmentation */}
            <div className="flex flex-col gap-1 md:w-[82%]">
              <h3 className={subTitleClass}>User Segmentation</h3>
              <p className={bodyTextClass}>
                To validate the problem, I conducted a survey among 140 participants (primarily women, ages 21–25) to analyze their online shopping habits and delivery frustrations.
              </p>
            </div>

            {/* Demographic Graphs */}
            <div className="grid grid-cols-2 gap-8 md:gap-20 md:w-[75%] md:mx-[3%] md:mt-[-1rem]">
              <img src={GRAPH1} alt="Gender distribution: 76.6% women" className="w-full" loading="lazy" />
              <img src={GRAPH2} alt="Age distribution: 71.4% ages 21-26" className="w-full" loading="lazy" />
            </div>

            {/* Key Statistics — 5-col sub-grid: stats 1+2 (2 cols each), gap col 3; stat 3+4 below without graphs */}
            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>Key Statistics</h3>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-y-10 md:gap-x-[var(--grid-gutter)] md:gap-y-12">
                {/* Stat 1: cols 1-2 */}
                <div className="md:col-span-2 flex flex-col gap-3">
                  <p className="font-['Bricolage_Grotesque'] font-light text-[80px] md:text-[100px] text-[#2200b8] leading-none opacity-20">
                    {KEY_STATS[0].num}
                  </p>
                  <div className="self-start w-full max-w-[220px]">
                    <GaugeChart targetPercent={40} ariaLabel="40% statistic gauge" />
                  </div>
                  <p className={smallTitleClass}>{KEY_STATS[0].title}</p>
                  <p className={bodyTextClass}>{KEY_STATS[0].desc}</p>
                </div>

                {/* Gap column 3 — empty on md */}
                <div className="hidden md:block md:col-start-3 md:col-span-1" aria-hidden />

                {/* Stat 2: cols 4-5 */}
                <div className="md:col-start-4 md:col-span-2 flex flex-col gap-3">
                  <p className="font-['Bricolage_Grotesque'] font-light text-[80px] md:text-[100px] text-[#2200b8] leading-none opacity-20">
                    {KEY_STATS[1].num}
                  </p>
                  <div className="self-start w-full max-w-[220px]">
                    <GaugeChart targetPercent={65} ariaLabel="65% statistic gauge" />
                  </div>
                  <p className={smallTitleClass}>{KEY_STATS[1].title}</p>
                  <p className={bodyTextClass}>{KEY_STATS[1].desc}</p>
                </div>

                {/* Stat 3: row 2, cols 1-2 */}
                <div className="md:col-span-2 md:col-start-1 md:row-start-2 flex flex-col gap-1">
                  <p className="font-['Bricolage_Grotesque'] font-light text-[80px] md:text-[100px] text-[#2200b8] leading-none opacity-20">
                    {KEY_STATS[2].num}
                  </p>
                  <p className={smallTitleClass}>{KEY_STATS[2].title}</p>
                  <p className={bodyTextClass}>{KEY_STATS[2].desc}</p>
                </div>

                {/* Stat 4: row 2, cols 4-5 (under stat 2) */}
                <div className="md:col-start-4 md:col-span-2 md:row-start-2 flex flex-col gap-1">
                  <p className="font-['Bricolage_Grotesque'] font-light text-[80px] md:text-[100px] text-[#2200b8] leading-none opacity-20">
                    {KEY_STATS[3].num}
                  </p>
                  <p className={smallTitleClass}>{KEY_STATS[3].title}</p>
                  <p className={bodyTextClass}>{KEY_STATS[3].desc}</p>
                </div>
              </div>
            </div>

            {/* User Persona */}
            <div className="flex flex-col gap-1">
              <h3 className={subTitleClass}>User Persona</h3>
              <p className={smallTitleClass}>The Overwhelmed Shopper</p>

              <div className="relative rounded-[20px] bg-[#8093f1] mt-3 p-6 md:py-8 md:px-0 shadow-[0_0_5px_rgba(0,0,0,0.15)] md:-mx-4 text-white overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-x-[var(--grid-gutter)] md:gap-y-6 md:items-stretch md:px-4">
                  {/* Photo — stretches to match text height */}
                  <div className="md:col-span-1 md:row-span-2 flex flex-col max-w-[200px] md:max-w-none mx-auto md:mx-0 md:h-full md:min-h-0">
                    <div className="flex flex-1 flex-col min-h-0 overflow-hidden rounded-[16px] border-4 border-white bg-white">
                      <div className="shrink-0 bg-white px-3 py-2">
                        <p className="font-['Bricolage_Grotesque'] font-semibold text-[20px] text-[#8093f1] tracking-[1px] text-center">
                          Lia Tzur, 21
                        </p>
                      </div>
                      <div className="min-h-[200px] flex-1 w-full overflow-hidden md:min-h-0">
                        <img
                          src={PERSONA_IMG}
                          alt="Lia Tzur, user persona"
                          className="h-full min-h-[220px] w-full object-cover object-center md:min-h-0"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Intro */}
                  <div className="md:col-span-4 md:col-start-2 md:row-start-1">
                    <p className="font-['Bricolage_Grotesque'] text-[17px] md:text-[19px] font-medium leading-relaxed text-white">
                      A 21-year-old IDF veteran working part-time to save for a trip abroad.<br />She uses
                      online shopping as an escape from a busy schedule, often overspending instead of
                      saving.
                    </p>
                  </div>

                  {/* Pains */}
                  <div className="md:col-span-2 md:col-start-2 md:row-start-2 flex flex-col gap-2">
                    <div className="rounded-md bg-white px-4 py-2 w-full">
                      <p className="font-['Bricolage_Grotesque'] font-semibold text-[18px] text-[#8093f1] tracking-[1px] text-center">
                        Pains
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {PERSONA_PAINS.map((pain, i) => {
                        const idx = pain.indexOf(": ");
                        const title = idx >= 0 ? pain.slice(0, idx + 1) : pain;
                        const rest = idx >= 0 ? pain.slice(idx + 2) : "";
                        return (
                          <p key={i} className="font-['Bricolage_Grotesque'] text-[15px] leading-relaxed text-white">
                            {idx >= 0 ? (<><span className="font-semibold">{title}</span> {rest}</>) : pain}
                          </p>
                        );
                      })}
                    </div>
                  </div>

                  {/* Goals */}
                  <div className="md:col-span-2 md:col-start-4 md:row-start-2 flex flex-col gap-2">
                    <div className="rounded-md bg-white px-4 py-2 w-full">
                      <p className="font-['Bricolage_Grotesque'] font-semibold text-[18px] text-[#8093f1] tracking-[1px] text-center">
                        Goals
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {PERSONA_GOALS.map((goal, i) => {
                        const idx = goal.indexOf(": ");
                        const title = idx >= 0 ? goal.slice(0, idx + 1) : goal;
                        const rest = idx >= 0 ? goal.slice(idx + 2) : "";
                        return (
                          <p key={i} className="font-['Bricolage_Grotesque'] text-[15px] leading-relaxed text-white">
                            {idx >= 0 ? (<><span className="font-semibold">{title}</span> {rest}</>) : goal}
                          </p>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quote — inside card */}
                  <div className="md:col-span-5 md:col-start-1 md:row-start-3 pt-4 mt-2 border-t border-white/30">
                    <p className="font-['Bricolage_Grotesque'] text-[22px] md:text-[26px] font-bold leading-snug text-white">
                      &ldquo;I order so much that sometimes I have no idea what I even bought until it actually
                      arrives.&rdquo;
                    </p>
                  </div>
                </div>
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

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-16 md:gap-20 ${sectionColumnPaddingClass}`}>
            <h3 className={`${subTitleClass} mb-[-2rem] md:mb-[-3rem]`}>Main Features</h3>

            {/* Feature 1: Unified Order Dashboard */}
            <div className="flex flex-col md:grid md:grid-cols-5 md:gap-[var(--grid-gutter)] md:items-center">
              <div className="md:col-start-2 md:col-span-2 flex flex-col gap-1 md:mr-[-1.5rem]">
                <h4 className={smallTitleClass}>{FEATURES[0].title}</h4>
                <p className={bodyTextClass}>{FEATURES[0].desc}</p>
              </div>
              <div className="md:col-start-4 md:col-span-2 flex justify-center mt-6 md:mt-0">
                <video
                  src={VID_HOMEPAGE}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-auto max-w-full max-h-[75vh]"
                  style={{ background: "none", borderRadius: FEATURE1_VIDEO_RADIUS }}
                />
              </div>
            </div>

            {/* Feature 2: Order Status Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-5 md:gap-x-[var(--grid-gutter)] gap-y-6 md:items-center">
              <div className="md:col-span-2 md:col-start-1 flex items-center justify-start">
                <video
                  src={VID_ORDERPAGE}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-auto max-w-full max-h-[75vh]"
                  style={{ background: "none", borderRadius: FEATURE2_VIDEO_RADIUS }}
                />
              </div>
              <div className="md:col-start-3 md:col-span-2 flex flex-col gap-1 md:justify-center md:self-center">
                <h4 className={smallTitleClass}>{FEATURES[1].title}</h4>
                <p className={bodyTextClass}>{FEATURES[1].desc}</p>
                <div className="flex gap-6 items-center mt-2">
                  <img src={ORDER_STATUS_BAR} alt="Order status bar" className="w-[200px] md:w-[250px] ml-[-0.5rem]" loading="lazy" />
                  <img src={ORDER_STATUS_LINE} alt="Order status line bar" className="w-[130px] md:w-[160px] ml-[3rem]" loading="lazy" />
                </div>
              </div>
            </div>

            {/* Feature 3: Advanced Order History */}
            <div className="grid grid-cols-1 md:grid-cols-5 md:gap-x-[var(--grid-gutter)] gap-y-6 md:items-center">
              <div className="md:col-start-1 md:col-span-3 flex flex-col gap-1">
                <h4 className={smallTitleClass}>{FEATURES[2].title}</h4>
                <p className={`${bodyTextClass} md:max-w-[80%]`}>{FEATURES[2].desc}</p>
                <div className="flex gap-4 items-center mt-[1rem]">
                  <img src={FILTER_CLOSED} alt="Filter closed state" className="w-[200px] md:w-[250px]" loading="lazy" />
                  <img src={FILTER_OPEN} alt="Filter open state" className="w-[200px] md:w-[250px]" loading="lazy" />
                </div>
              </div>
              <div className="md:col-start-4 md:col-span-2 flex justify-end">
                <video
                  src={VID_HOMEPAGE}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-auto max-w-full max-h-[75vh]"
                  style={{ background: "none", borderRadius: FEATURE3_VIDEO_RADIUS }}
                />
              </div>
            </div>

            {/* Feature 4: Quick Location Management */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-3/5 flex justify-center">
                  <video
                    src={VID_PICKUP}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-auto max-w-full max-h-[75vh]"
                    style={{ background: "none", borderRadius: FEATURE4_VIDEO_RADIUS }}
                  />
                </div>
                <div className="md:w-2/5 flex flex-col gap-1">
                  <h4 className={smallTitleClass}>{FEATURES[3].title}</h4>
                  <p className={bodyTextClass}>{FEATURES[3].desc}</p>
                </div>
              </div>
            </div>
          </div>
        </PageGrid>
      </section>

      {/* ── Divider ── */}
      <div className="w-full border-t border-[#2200b8]" />

      {/* ── Flow Section ── */}
      <section>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Flow</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-12 md:gap-16 ${sectionColumnPaddingClass}`}>
            <h3 className={subTitleClass}>User Flow</h3>

            <div className="grid grid-cols-1 md:grid-cols-6 md:gap-x-[var(--grid-gutter)] items-center">
              <div className="md:col-span-4 flex items-center md:pr-[6rem] ml-[-2rem]">
                <img src={USER_FLOW} alt="Pack Up user flow diagram" className="w-full" loading="lazy" />
              </div>
              <div className="md:col-span-2 flex items-center justify-center md:justify-end md:ml-[-4rem]">
                <video
                  src={VID_PROTOTYPE}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-auto max-w-full max-h-[75vh]"
                  style={{ background: "none", borderRadius: FEATURE1_VIDEO_RADIUS }}
                />
              </div>
            </div>

            <div>
              <h3 className={`${subTitleClass} mb-10`}>Screens</h3>
              <ScreensCarousel />
            </div>
          </div>
        </PageGrid>
      </section>

      {/* ── Divider ── */}
      <div className="w-full border-t border-[#2200b8]" />

      {/* ── Style Guide Section ── */}
      <section>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>
              Style Guide
            </h2>
          </div>

          <div
            className={`col-span-8 md:col-start-3 md:col-span-3 flex flex-col gap-16 md:gap-0 md:justify-between md:min-h-[70svh] ${sectionColumnPaddingClass}`}
          >
            <div className="flex flex-col gap-6">
              <h3 className={subTitleClass}>Typography</h3>
              <img src={TYPO_SVG} alt="Pack Up typography — Ploni font" className="w-full" loading="lazy" />
            </div>

            <div className="flex flex-col gap-6 md:mt-14">
              <h3 className={subTitleClass}>Buttons</h3>
              <img
                src={BTNS_SVG}
                alt="Pack Up button styles"
                className="w-[90%] md:ml-[calc(-55/655*90%)] md:w-[calc(90%+55/655*90%)] max-w-none"
                loading="lazy"
              />
            </div>
          </div>

          <div
            className={`col-span-8 md:col-start-6 md:col-span-3 flex flex-col gap-1 md:min-h-[70svh] ${sectionColumnPaddingClass}`}
          >
            <h3 className={subTitleClass}>Color Palette</h3>
            <div className="mt-auto w-[80%] md:ml-[calc(-54/615*80%)] md:w-[calc(80%+54/615*80%)] max-w-none">
              <ColorPalette />
            </div>
          </div>
        </PageGrid>
      </section>

      {/* ── Next Project ── */}
      <ProjectNav currentProject="packup" onSelectSection={onSelectSection} />
    </div>
  );
}
