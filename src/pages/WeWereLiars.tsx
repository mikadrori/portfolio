import { useState, useEffect, useRef, useCallback } from "react";


import { cloudinaryUrl } from "../lib/cloudinary";
import { stickyTitleClass, sectionTitleClass, projectNameClass, subTitleClass, smallTitleClass, bodyTextClass } from "../lib/typography";
import { PageGrid } from "../components/PageGrid";
import { ProjectNav } from "../components/ProjectNav";

const Q = "auto:best";

const HERO_VIDEO = cloudinaryUrl("WLLpromoVID_s8x1if.mp4", { resourceType: "video", quality: Q });
const HERO_POSTER = cloudinaryUrl("WLLpromoVID_s8x1if.jpg", { quality: Q, width: 1920 });
const BOOK_COVER = cloudinaryUrl("WWLbook_z0ojgt.png", { quality: Q });
const FINAL_INTRO_VIDEO = cloudinaryUrl("WLLfinalintro_ag05ys.mp4", { resourceType: "video", quality: Q });
const FINAL_INTRO_POSTER = cloudinaryUrl("WWLtypocadence_1_gsc0qn.jpg", { quality: Q, width: 1280 });
const STORYBOARD = cloudinaryUrl("WLLstoryboard_zeemra.png", { quality: Q });

const TYPO_CHARACTERS = [
  { name: "cadence", ids: ["WWLtypocadence_1_gsc0qn.jpg", "WWLtypocadence_2_hsd8ix.jpg", "WWLtypocadence_3_hxwlgw.jpg"] },
  { name: "jhonny", ids: ["WWLtypojhonny_1_x3qec5.jpg", "WWLtypojhonny_2_iaenvq.jpg", "WWLtypojhonny_3_yirz0w.jpg"] },
  { name: "gat", ids: ["WWLtypoGat_1_cahhoq.jpg", "WWLtypoGat_2_ixlu44.jpg", "WWLtypoGat_3_z3txqf.jpg"] },
  { name: "myren", ids: ["WWLtypomyren_1_d10pcc.jpg", "WWLtypomyren_2_yfgqyh.jpg", "WWLtypomyren_3_gi0zu1.jpg"] },
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


function TypographyCarousel() {
  const [variantIdx, setVariantIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setVariantIdx((i) => (i + 1) % 3);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-[48px] md:gap-[100px] w-max pr-[30%]">
        {TYPO_CHARACTERS.map((char) => (
          <div key={char.name} className="w-[70vw] md:w-[800px] aspect-[898/505] shrink-0 overflow-hidden rounded-sm">
            <img
              src={cloudinaryUrl(char.ids[variantIdx], { quality: Q })}
              alt={`${char.name} typography variant ${variantIdx + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
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
          <PageGrid className="items-start py-12 md:py-16">
            <div className="col-span-8 md:col-span-1 md:col-start-1 flex items-start">
              <h2 className={`${sectionTitleClass} leading-[1.5]`}>
                Concept
              </h2>
            </div>
            <div className="col-span-8 md:col-span-4 md:col-start-3 flex flex-col gap-2">
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
            <div className="col-span-4 md:col-span-1 md:col-start-7 flex justify-center md:justify-start">
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
        <PageGrid className="items-start py-8 md:py-12">
          <div className="col-span-8 md:col-span-1 md:col-start-1">
            <h2 className={stickyTitleClass}>FINAL INTRO</h2>
          </div>
          <div className="col-span-8 md:col-span-5 md:col-start-3 py-4 md:py-8">
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

      {/* DESIGN Section */}
      <section>
        <PageGrid className="items-start py-8 md:py-12">
          <div className="col-span-8 md:col-span-1 md:col-start-1">
            <h2 className={`${sectionTitleClass} leading-none md:-mt-[4px]`}>
              Design
            </h2>
          </div>

          <div className="col-span-8 md:col-span-4 md:col-start-3 flex flex-col gap-16 md:gap-24">
            {/* Initial Story Board */}
            <div className="flex flex-col gap-6">
              <h3 className={`${subTitleClass} leading-none`}>Initial Story Board</h3>
              <div className="overflow-x-auto scrollbar-hide">
                <img
                  src={STORYBOARD}
                  alt="Initial storyboard sketches"
                  className="h-[120px] md:h-[160px] w-auto max-w-none"
                  loading="lazy"
                />
              </div>
              <p className={bodyTextClass}>
                My first thought was sea, waves, fire, and smoke. While I initially considered including characters,
                I later chose to represent them only through hints—a photo, decorative objects, and a hand.
              </p>
            </div>

            {/* Visual Elements */}
            <div className="flex flex-col gap-6">
              <h3 className={subTitleClass}>Visual Elements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
                <div className="flex flex-col gap-8">
                  {VISUAL_ELEMENTS_LEFT.map((el) => (
                    <div key={el.title}>
                      <p className={`${smallTitleClass} leading-[1.5]`}>
                        {el.title}
                      </p>
                      <p className={bodyTextClass}>{el.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-8">
                  {VISUAL_ELEMENTS_RIGHT.map((el) => (
                    <div key={el.title}>
                      <p className={`${smallTitleClass} leading-[1.5]`}>
                        {el.title}
                      </p>
                      <p className={bodyTextClass}>{el.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="flex flex-col gap-6">
              <h3 className={subTitleClass}>Typography</h3>
              <p className={bodyTextClass}>
                To evoke memory loss, I used blur and glare on the text. The titles appear and disappear, creating
                a sense of uncertainty - as if they are "there but not really there."
              </p>
            </div>
          </div>
        </PageGrid>

        {/* Typography carousel - starts at col 3, clips at right */}
        <PageGrid>
          <div className="col-span-8 md:col-span-7 md:col-start-3 overflow-hidden">
            <TypographyCarousel />
          </div>
        </PageGrid>

        {/* Video & Editing */}
        <PageGrid className="items-start py-8 md:py-12">
          <div className="col-span-8 md:col-span-4 md:col-start-3 flex flex-col gap-6">
            <h3 className={subTitleClass}>Video & Editing</h3>
            <p className={bodyTextClass}>
              I combined stock footage, a Veo-generated video, and my own shots. To ensure a uniform look, I
              used smooth, blurry transitions to create a sense of flow and lack of clarity.
            </p>
          </div>
        </PageGrid>
      </section>

      {/* Next Project */}
      <ProjectNav currentProject="wwl" onSelectSection={onSelectSection} />
    </div>
  );
}
