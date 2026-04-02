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

// Hero
const HERO_VIDEO = cloudinaryUrl("PackupVIDpromo_trvywi.mp4", { resourceType: "video", quality: Q });
const HERO_POSTER = cloudinaryUrl("PackUpMockUp_ztxwa9.jpg", { quality: Q, width: 1920 });

// Concept
const APP_ICON = cloudinaryUrl("PackupAppICON_ep0ejq.svg");

// Research graphs
const GRAPH1 = cloudinaryUrl("graph1_z2lpge.svg");
const GRAPH2 = cloudinaryUrl("graph2_l6fhaj.svg");

// Statistics
const STAT1 = cloudinaryUrl("statics1_snyvm8.svg");
const STAT2 = cloudinaryUrl("statics2_dwsd4i.svg");

// User Persona
const PERSONA_BG = cloudinaryUrl("UserPersonaBKG_pqd8ko.svg");
const PERSONA_IMG = cloudinaryUrl("UserPersonaIMG_packup.jpg", { quality: Q, width: 400 });

// Design section
const ORDER_STATUS_BAR = cloudinaryUrl("OrderStatusBar_rrqn2n.svg");
const ORDER_STATUS_LINE = cloudinaryUrl("OrderStatusLinebar_xr5mib.svg");
const FILTER_OPEN = cloudinaryUrl("Filteropen_ibmkpd.svg");
const FILTER_CLOSED = cloudinaryUrl("Filterclosed_ekw7qs.svg");

const VID_SIGNIN = cloudinaryUrl("PackUpVIDsignin_o6bh9a.mp4", { resourceType: "video", quality: Q });
const VID_HOMEPAGE = cloudinaryUrl("PackUpVIDhomepage_ct4q7z.mp4", { resourceType: "video", quality: Q });
const VID_ORDERPAGE = cloudinaryUrl("PackUpVIDorderpage_prbhjs.mp4", { resourceType: "video", quality: Q });
const VID_PICKUP = cloudinaryUrl("PackUpVIDpickupchange_iph9hh.mp4", { resourceType: "video", quality: Q });

// Flow
const USER_FLOW = cloudinaryUrl("PackupUserFlow_uba12t.svg");
const VID_PROTOTYPE = cloudinaryUrl("PackUpVIDPrototype_kpxxrh.mp4", { resourceType: "video", quality: Q });

// Screens
const SCREENS = [
  cloudinaryUrl("PackUpscreen01_wtwc56.png", { quality: Q }),
  cloudinaryUrl("PackUpscreen02_a3xf44.png", { quality: Q }),
  cloudinaryUrl("PackUpscreen03_hjg0yu.png", { quality: Q }),
  cloudinaryUrl("PackUpscreen04_zc0lbt.png", { quality: Q }),
  cloudinaryUrl("PackUpscreen05_xqg302.png", { quality: Q }),
  cloudinaryUrl("PackUpscreen06_qzy1tt.png", { quality: Q }),
  cloudinaryUrl("PackUpscreen07_nqdxjc.png", { quality: Q }),
  cloudinaryUrl("PackUpscreen08_go56fz.png", { quality: Q }),
];

// Style Guide
const TYPO_SVG = cloudinaryUrl("PackUpTypo_b6j9xk.svg");
const BTNS_SVG = cloudinaryUrl("PackUpBTNS_dznpuj.svg");
const COLOR_PALETTE = cloudinaryUrl("PackUpColorPalette_gb2gji.svg");

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
      <div className="flex gap-6 md:gap-14 w-max pr-[20%]">
        {SCREENS.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Pack Up screen ${i + 1}`}
            className="h-[320px] md:h-[510px] w-auto rounded-sm pointer-events-none"
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
        <div className="w-full shrink-0 overflow-hidden">
          <video
            src={HERO_VIDEO}
            poster={HERO_POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-auto"
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
              {/* Intro + Icon */}
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 flex flex-col gap-2">
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
                    className="w-[120px] md:w-[140px] rounded-[10px] object-cover"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
                <div className="flex flex-col gap-2">
                  <h4 className={subTitleClass}>The Challenge</h4>
                  <p className={bodyTextClass}>
                    Tracking multiple orders across emails and messages is overwhelming, leading to lost
                    packages and stress.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className={subTitleClass}>The Solution</h4>
                  <p className={bodyTextClass}>
                    A centralized platform that organizes all domestic and international orders into a
                    seamless, real-time experience.
                  </p>
                </div>
              </div>

              {/* Phone video demos */}
              <div className="grid grid-cols-3 gap-4 md:gap-8">
                {[VID_HOMEPAGE, VID_SIGNIN, VID_ORDERPAGE, ].map((src, i) => (
                  <video
                    key={i}
                    src={src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-auto rounded-lg"
                    style={{ background: "none" }}
                  />
                ))}
              </div>
            </div>
          </PageGrid>
        </section>
      </div>

      {/* ── Divider ── */}
      <div className="w-full h-px bg-[#2200b8]" />

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
            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>User Segmentation</h3>
              <p className={bodyTextClass}>
                To validate the problem, I conducted a survey among 140 participants (primarily
                women, ages 21–25) to analyze their online shopping habits and delivery frustrations.
              </p>
            </div>

            {/* Demographic Graphs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <img src={GRAPH1} alt="Gender distribution: 76.6% women" className="w-full" loading="lazy" />
              <img src={GRAPH2} alt="Age distribution: 71.4% ages 21-26" className="w-full" loading="lazy" />
            </div>

            {/* Key Statistics */}
            <div className="flex flex-col gap-6">
              <h3 className={subTitleClass}>Key Statistics</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <img src={STAT1} alt="40% statistic chart" className="w-[200px] md:w-[240px] mx-auto md:mx-0" loading="lazy" />
                <img src={STAT2} alt="65% statistic chart" className="w-[200px] md:w-[240px] mx-auto md:mx-0" loading="lazy" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
                {KEY_STATS.map((stat) => (
                  <div key={stat.num} className="flex flex-col gap-1">
                    <p className="font-['Bricolage_Grotesque'] font-light text-[80px] md:text-[100px] text-[#2200b8] leading-none opacity-20">
                      {stat.num}
                    </p>
                    <p className={smallTitleClass}>{stat.title}</p>
                    <p className={bodyTextClass}>{stat.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* User Persona */}
            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>User Persona</h3>
              <p className={smallTitleClass}>The Overwhelmed Shopper</p>

              <div
                className="relative rounded-[20px] overflow-hidden p-6 md:p-8"
                style={{ backgroundImage: `url(${PERSONA_BG})`, backgroundSize: "cover", backgroundPosition: "center" }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Photo + Bio */}
                  <div className="flex flex-col gap-3 md:w-1/3">
                    <div className="w-[160px] overflow-hidden rounded-[16px] border-4 border-[#8093f1]">
                      <div className="bg-[#8093f1] px-3 py-1">
                        <p className="font-['Bricolage_Grotesque'] font-medium text-[16px] text-white tracking-[1px] text-center">
                          Lia Tzur, 21
                        </p>
                      </div>
                      <img
                        src={PERSONA_IMG}
                        alt="Lia Tzur, user persona"
                        className="w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <p className={bodyTextClass}>
                      A 21-year-old IDF veteran working part-time to save for a trip abroad. She uses
                      online shopping as an escape from a busy schedule, often overspending instead of
                      saving.
                    </p>
                  </div>

                  {/* Pains */}
                  <div className="flex flex-col gap-2 md:w-1/3">
                    <div className="bg-[#8093f1] rounded-md px-4 py-2">
                      <p className="font-['Bricolage_Grotesque'] font-semibold text-[14px] text-white tracking-[1px]">
                        Pains
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {PERSONA_PAINS.map((pain, i) => (
                        <p key={i} className={bodyTextClass}>{pain}</p>
                      ))}
                    </div>
                  </div>

                  {/* Goals */}
                  <div className="flex flex-col gap-2 md:w-1/3">
                    <div className="bg-[#8093f1] rounded-md px-4 py-2">
                      <p className="font-['Bricolage_Grotesque'] font-semibold text-[14px] text-white tracking-[1px]">
                        Goals
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {PERSONA_GOALS.map((goal, i) => (
                        <p key={i} className={bodyTextClass}>{goal}</p>
                      ))}
                    </div>
                  </div>
                </div>

                <p className={`${bodyTextClass} italic mt-6 text-center`}>
                  "I order so much that sometimes I have no idea what I even bought until it actually
                  arrives."
                </p>
              </div>
            </div>
          </div>
        </PageGrid>
      </section>

      {/* ── Divider ── */}
      <div className="w-full h-px bg-[#2200b8]" />

      {/* ── Design Section ── */}
      <section>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Design</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-16 md:gap-20 ${sectionColumnPaddingClass}`}>
            <h3 className={subTitleClass}>Main Features</h3>

            {/* Feature 1: Unified Order Dashboard */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="md:w-1/2 flex flex-col gap-2">
                  <h4 className={smallTitleClass}>{FEATURES[0].title}</h4>
                  <p className={bodyTextClass}>{FEATURES[0].desc}</p>
                </div>
                <div className="md:w-1/2 flex justify-center">
                  <video
                    src={VID_HOMEPAGE}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-auto max-w-full"
                    style={{ background: "none" }}
                  />
                </div>
              </div>
            </div>

            {/* Feature 2: Order Status Visualization */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="md:w-1/2 flex justify-center">
                  <video
                    src={VID_ORDERPAGE}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-auto max-w-full"
                    style={{ background: "none" }}
                  />
                </div>
                <div className="md:w-1/2 flex flex-col gap-4">
                  <h4 className={smallTitleClass}>{FEATURES[1].title}</h4>
                  <p className={bodyTextClass}>{FEATURES[1].desc}</p>
                  <div className="flex gap-4 items-start">
                    <img src={ORDER_STATUS_BAR} alt="Order status bar" className="w-[140px] md:w-[180px]" loading="lazy" />
                    <img src={ORDER_STATUS_LINE} alt="Order status line bar" className="w-[100px] md:w-[120px]" loading="lazy" />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Advanced Order History */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="md:w-1/2 flex flex-col gap-4">
                  <h4 className={smallTitleClass}>{FEATURES[2].title}</h4>
                  <p className={bodyTextClass}>{FEATURES[2].desc}</p>
                  <div className="flex gap-4 items-start">
                    <img src={FILTER_CLOSED} alt="Filter closed state" className="w-[140px] md:w-[160px]" loading="lazy" />
                    <img src={FILTER_OPEN} alt="Filter open state" className="w-[140px] md:w-[160px]" loading="lazy" />
                  </div>
                </div>
                <div className="md:w-1/2 flex justify-center">
                  <video
                    src={VID_HOMEPAGE}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-auto max-w-full"
                    style={{ background: "none" }}
                  />
                </div>
              </div>
            </div>

            {/* Feature 4: Quick Location Management */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="md:w-1/2 flex justify-center">
                  <video
                    src={VID_PICKUP}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-auto max-w-full"
                    style={{ background: "none" }}
                  />
                </div>
                <div className="md:w-1/2 flex flex-col gap-2">
                  <h4 className={smallTitleClass}>{FEATURES[3].title}</h4>
                  <p className={bodyTextClass}>{FEATURES[3].desc}</p>
                </div>
              </div>
            </div>
          </div>
        </PageGrid>
      </section>

      {/* ── Divider ── */}
      <div className="w-full h-px bg-[#2200b8]" />

      {/* ── Flow Section ── */}
      <section>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Flow</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-12 md:gap-16 ${sectionColumnPaddingClass}`}>
            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>User Flow</h3>
              <img src={USER_FLOW} alt="Pack Up user flow diagram" className="w-full" loading="lazy" />
            </div>

            <div className="flex justify-center">
              <div className="w-[220px] md:w-[280px]">
                <video
                  src={VID_PROTOTYPE}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-auto max-w-full"
                  style={{ background: "none" }}
                />
              </div>
            </div>
          </div>
        </PageGrid>
      </section>

      {/* ── Divider ── */}
      <div className="w-full h-px bg-[#2200b8]" />

      {/* ── Screens Carousel ── */}
      <section>
        <PageGrid className={sectionPageGridClass}>
          <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
            <h3 className={subTitleClass}>Screens</h3>
          </div>
          <div className={`col-span-8 md:col-start-3 md:col-span-6 ${sectionColumnPaddingClass}`}>
            <ScreensCarousel />
          </div>
        </PageGrid>
      </section>

      {/* ── Divider ── */}
      <div className="w-full h-px bg-[#2200b8]" />

      {/* ── Style Guide Section ── */}
      <section>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>
              Style Guide
            </h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-12 md:gap-16 ${sectionColumnPaddingClass}`}>
            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>Typography</h3>
              <img src={TYPO_SVG} alt="Pack Up typography — Ploni font" className="w-full max-w-[600px]" loading="lazy" />
            </div>

            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>Buttons</h3>
              <img src={BTNS_SVG} alt="Pack Up button styles" className="w-full max-w-[600px]" loading="lazy" />
            </div>

            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>Color Palette</h3>
              <img src={COLOR_PALETTE} alt="Pack Up color palette" className="w-full max-w-[500px]" loading="lazy" />
            </div>
          </div>
        </PageGrid>
      </section>

      {/* ── Next Project ── */}
      <ProjectNav currentProject="packup" onSelectSection={onSelectSection} />
    </div>
  );
}
