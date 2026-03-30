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
const HERO_VIDEO = cloudinaryUrl("MuchiwazePromoVID_uvefuw.mp4", { resourceType: "video", quality: Q });
const HERO_POSTER = cloudinaryUrl("MuchiwazeMockup_iq8vqk.jpg", { quality: Q, width: 1920 });

// Concept
const APP_ICON = cloudinaryUrl("MuchiwazeAppICON_bkdvdb.svg");
const MOCKUP = cloudinaryUrl("MuchiwazeMockup_iq8vqk.jpg", { quality: Q, width: 1920 });

// Research – phone mockup video
const VID_OPENING = cloudinaryUrl("MuchiVIDopening_sueisa.mp4", { resourceType: "video", quality: Q });

// Design – Sketches
const SKETCHES_1 = cloudinaryUrl("MuchiSketches1_o2jeoj.png", { quality: Q });
const SKETCHES_2 = cloudinaryUrl("MuchiSketches2_mnwjpn.png", { quality: Q });

// Design – Inspirations
const INSPIRATIONS = [
  cloudinaryUrl("MuchiInsparationIMG01_nd5ais.png", { quality: Q }),
  cloudinaryUrl("MuchiInsparationIMG02_cnsupq.png", { quality: Q }),
  cloudinaryUrl("MuchiInsparationIMG03_q2fxyh.png", { quality: Q }),
  cloudinaryUrl("MuchiInsparationIMG04_kp56fy.png", { quality: Q }),
  cloudinaryUrl("MuchiInsparationIMG05_lm9vrr.png", { quality: Q }),
  cloudinaryUrl("MuchiInsparationIMG06_hdgriu.png", { quality: Q }),
  cloudinaryUrl("MuchiInsparationIMG07_iwejtc.png", { quality: Q }),
  cloudinaryUrl("MuchiInsparationIMG08_gim7st.png", { quality: Q }),
  cloudinaryUrl("MuchiInsparationIMG09_gjlh17.png", { quality: Q }),
  cloudinaryUrl("MuchiInsparationIMG10_a5rxl3.png", { quality: Q }),
  cloudinaryUrl("MuchiInsparationIMG11_plp9qz.png", { quality: Q }),
  cloudinaryUrl("MuchiInsparationIMG12_ary2qu.png", { quality: Q }),
];

// Design – Icon options
const ICONS_OPT1 = cloudinaryUrl("MuchiIconsOpt1_ub84yi.svg");
const ICONS_OPT2 = cloudinaryUrl("MuchiIconsOpt2_vmt6hx.svg");
const ICONS_OPT3 = cloudinaryUrl("MuchiIconsOpt3_f2swgb.svg");

// Design – Final icons
const ICONS_FINAL = cloudinaryUrl("MuchiICONSfinal_gmklkg.svg");

// Design – Icon videos
const VID_ALL_ICONS = cloudinaryUrl("MuchiVIDAllIcons_lcznmk.mp4", { resourceType: "video", quality: Q });
const VID_ROBBERY = cloudinaryUrl("MuchiVIDrobbery_btjeld.mp4", { resourceType: "video", quality: Q });
const VID_BRIBE = cloudinaryUrl("MuchiVIDbribe_fxyugg.mp4", { resourceType: "video", quality: Q });
const VID_HOSTEL = cloudinaryUrl("MuchiVIDhostelICON_jtltrh.mp4", { resourceType: "video", quality: Q });
const VID_CHABAD = cloudinaryUrl("MuchiVIDchabadICON_whz3pu.mp4", { resourceType: "video", quality: Q });
const VID_MUNCH = cloudinaryUrl("MuchiVIDmunchICONS_zigxms.mp4", { resourceType: "video", quality: Q });
const VID_PARTY = cloudinaryUrl("MuchiVIDpartyICON_kqrh0g.mp4", { resourceType: "video", quality: Q });
const VID_WEED = cloudinaryUrl("MuchiVIDweedICON_njjzfr.mp4", { resourceType: "video", quality: Q });

// Avatars
const AVATARS_SVG = cloudinaryUrl("MuchiAvatars_wzsbcn.svg");
const VID_AVATARS = cloudinaryUrl("MuchiVIDAvatars_yq5kk4.mp4", { resourceType: "video", quality: Q });

// Screens
const SCREENS = [
  cloudinaryUrl("MuchiScreen01_llhzt4.png", { quality: Q }),
  cloudinaryUrl("MuchiScreen02_ilzr62.png", { quality: Q }),
  cloudinaryUrl("MuchiScreen03_ectwrb.png", { quality: Q }),
  cloudinaryUrl("MuchiScreen04_gqn0ci.png", { quality: Q }),
  cloudinaryUrl("MuchiScreen05_od0z9x.png", { quality: Q }),
  cloudinaryUrl("MuchiScreen06_b25jnq.png", { quality: Q }),
  cloudinaryUrl("MuchiScreen07_uohyvy.png", { quality: Q }),
  cloudinaryUrl("MuchiScreen08_qrslgx.png", { quality: Q }),
  cloudinaryUrl("MuchiScreen09_o13np9.png", { quality: Q }),
  cloudinaryUrl("MuchiScreen10_uqksuj.png", { quality: Q }),
  cloudinaryUrl("MuchiScreen11_r5kvtc.png", { quality: Q }),
  cloudinaryUrl("MuchiScreen12_ipiqkc.png", { quality: Q }),
  cloudinaryUrl("MuchiScreen13_kzugef.png", { quality: Q }),
  cloudinaryUrl("MuchiScreen14_wsxhpp.png", { quality: Q }),
];

const TRAVEL_ESSENTIALS = [
  "Robbery Alert", "Police Alert (Bribe)", "Travel Partner", "Lookout Point",
  "Chabad House", "Laundry", "Hostel", "Trek Route",
  "ATM", "Weed", "Munch", "Airport",
  "Market", "Party",
];

const ICON_VIDEOS = [
  { src: VID_ROBBERY, label: "Robbery Alert" },
  { src: VID_BRIBE, label: "Police Alert" },
  { src: VID_HOSTEL, label: "Hostel" },
  { src: VID_CHABAD, label: "Chabad House" },
  { src: VID_MUNCH, label: "Munch" },
  { src: VID_PARTY, label: "Party" },
  { src: VID_WEED, label: "Weed" },
];

function InspirationsCarousel() {
  const { ref, onMouseDown } = useDragScroll();

  return (
    <div ref={ref} onMouseDown={onMouseDown} className="overflow-x-auto scrollbar-hide cursor-grab">
      <div className="flex gap-3 md:gap-4 w-max pr-[20%]">
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
      <div className="flex gap-6 md:gap-14 w-max pr-[20%]">
        {SCREENS.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`MuchiWaze screen ${i + 1}`}
            className="h-[320px] md:h-[510px] w-auto rounded-sm pointer-events-none"
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
        <div className="w-full h-[300px] md:h-[500px] shrink-0 overflow-hidden">
          <video
            src={HERO_VIDEO}
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
              {/* Intro + Icon */}
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 flex flex-col gap-2">
                  <h3 className={`${projectNameClass} leading-[1.5]`}>MuchiWaze</h3>
                  <p className={`${smallTitleClass} leading-[1.5]`}>
                    A &lsquo;Waze&rsquo; based mini-app for Muchilers.
                    <br />
                    Everything a Muchiler needs!
                  </p>
                  <p className={bodyTextClass}>
                    MuchiWaze is a navigation mini-app designed for Israeli backpackers traveling through
                    South America. Inspired by Waze, it focuses on real-time alerts and points of interest
                    tailored to the unique needs of long-term, low-budget travelers.
                  </p>
                  <p className={`${bodyTextClass} mt-4 italic`}>
                    This project focuses on icon design and visual language.
                  </p>
                  <p className={`${bodyTextClass} mt-2 text-[12px] opacity-70`}>
                    * Muchiler (from the Spanish Mochila): A term for backpackers in Latin America,
                    widely used by Israelis on their post-army trip for long-term, low-budget, and authentic travel.
                  </p>
                </div>
                <div className="flex justify-center md:justify-start shrink-0">
                  <img
                    src={APP_ICON}
                    alt="MuchiWaze app icon"
                    className="w-[120px] md:w-[140px] rounded-[22px] object-cover"
                  />
                </div>
              </div>

              {/* Mockup image */}
              <img
                src={MOCKUP}
                alt="MuchiWaze app mockup"
                className="w-full rounded-sm"
                loading="lazy"
              />
            </div>
          </PageGrid>
        </section>
      </div>

      {/* ── Divider ── */}
      <div className="w-full h-px bg-[#2200b8]" />

      {/* ── Research Section ── */}
      <section>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Research</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-12 md:gap-16 ${sectionColumnPaddingClass}`}>
            {/* What a Muchiler needs */}
            <div className="flex flex-col gap-6">
              <h3 className={subTitleClass}>What a Muchiler needs?</h3>
              <p className={bodyTextClass}>
                I started by asking: What does the Israeli traveler in South America really need?
                What does their daily routine look like? Inspired by Waze, I focused on real-time
                alerts and points of interest, leading to a list of travel essentials:
              </p>

              <div className="grid grid-cols-4 gap-3 md:gap-4">
                {TRAVEL_ESSENTIALS.map((item) => (
                  <div key={item} className="flex flex-col items-center text-center gap-1">
                    <p className={`${bodyTextClass} text-[12px] md:text-[13px]`}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Phone mockup video */}
            <div className="flex justify-center">
              <div className="w-[220px] md:w-[280px]">
                <video
                  src={VID_OPENING}
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

      {/* ── Design Section ── */}
      <section>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Design</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-16 md:gap-20 ${sectionColumnPaddingClass}`}>
            {/* First Sketches */}
            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>First Sketches</h3>
              <p className={bodyTextClass}>
                I narrowed this list and started sketching.
              </p>
            </div>

            {/* Option 1 – circular sketches */}
            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>Option 1</h3>
              <div ref={sketch1Drag.ref} onMouseDown={sketch1Drag.onMouseDown} className="overflow-x-auto scrollbar-hide cursor-grab">
                <img src={SKETCHES_1} alt="Option 1 — circular icon sketches" className="h-[150px] md:h-[200px] w-auto max-w-none pointer-events-none" loading="lazy" />
              </div>
            </div>

            {/* Option 2 – geometric/diamond sketches */}
            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>Option 2</h3>
              <div ref={sketch2Drag.ref} onMouseDown={sketch2Drag.onMouseDown} className="overflow-x-auto scrollbar-hide cursor-grab">
                <img src={SKETCHES_2} alt="Option 2 — geometric icon sketches" className="h-[150px] md:h-[200px] w-auto max-w-none pointer-events-none" loading="lazy" />
              </div>
            </div>

            <p className={bodyTextClass}>
              I simplified imagery into South American ethnic shapes — squares, triangles, and
              diamonds — inspired by the region&rsquo;s architecture, textiles, and traditional art.
            </p>

            {/* Color Palette */}
            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>Color Palette</h3>
              <div className="flex gap-2 flex-wrap">
                {["#590A19", "#C90000", "#DE2467", "#1F7537", "#04CEA5", "#FFC73B", "#590A19"].map((hex, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="w-[80px] md:w-[100px] h-[80px] md:h-[100px] rounded-md" style={{ backgroundColor: hex }} />
                    <p className={`${bodyTextClass} text-[11px]`}>{hex}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className={bodyTextClass}>
              I drew inspiration from Latin American landscapes, using my own travel photos to
              create a rich palette that captures the region&rsquo;s true atmosphere.
            </p>

            {/* Inspirations */}
            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>Inspirations</h3>
            </div>

            <div className="overflow-hidden">
              <InspirationsCarousel />
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

            {/* Final Design */}
            <div className="flex flex-col gap-6">
              <h3 className={subTitleClass}>Final Design</h3>
              <p className={bodyTextClass}>
                I combined both options — using the illustrations from the first and the geometric
                background from the second, and created the final icons.
              </p>
            </div>

            {/* Icons */}
            <div className="flex flex-col gap-6">
              <h3 className={subTitleClass}>Icons</h3>

              <img src={ICONS_FINAL} alt="Final MuchiWaze icons" className="w-full" loading="lazy" />

              {/* Icon videos grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                {ICON_VIDEOS.map((vid) => (
                  <div key={vid.label} className="flex flex-col items-center gap-2">
                    <video
                      src={vid.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="h-auto max-w-full rounded-lg"
                      style={{ background: "none" }}
                    />
                  </div>
                ))}
              </div>

              {/* All icons video */}
              <div className="flex justify-center">
                <div className="w-[220px] md:w-[280px]">
                  <video
                    src={VID_ALL_ICONS}
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

            {/* Avatars */}
            <div className="flex flex-col gap-6">
              <h3 className={subTitleClass}>Avatars</h3>
              <p className={bodyTextClass}>
                As a continuation, I designed 5 profile avatars of common Israeli traveler types
                for the user to choose from.
              </p>

              <img src={AVATARS_SVG} alt="MuchiWaze profile avatars" className="w-full" loading="lazy" />

              <div className="flex justify-center">
                <div className="w-[220px] md:w-[280px]">
                  <video
                    src={VID_AVATARS}
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

      {/* ── Next Project ── */}
      <ProjectNav currentProject="muchiwaze" onSelectSection={onSelectSection} />
    </div>
  );
}
