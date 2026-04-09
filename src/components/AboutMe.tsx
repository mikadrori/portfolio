import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { PageGrid } from "./PageGrid";
import { Footer } from "./Footer";
import { cloudinaryUrl } from "../lib/cloudinary";
import { sectionTitleCoreClass, bodyTextClass, smallTitleClass } from "../lib/typography";
import { aboutPtClass, gapAboutXClass, gapAboutYClass } from "../lib/spacing";

const BG_IMAGE = cloudinaryUrl("mememe_ukfgg9_vfttwe.png", { quality: "auto:best", width: 1920 });

/** Matches section cream so the fade reads as “more below” over the photo/top tint. */
const SCROLL_FADE =
  "pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-9 bg-gradient-to-t from-[#fcf7ee] via-[#fcf7ee]/65 to-transparent transition-opacity duration-200 ease-out";

const BIO_PARAGRAPHS = [
  "As a designer, I'm always looking for that delicate balance between order and colorful chaos.",
  "My process always starts with a pencil, paper, and hand-drawn sketches. I believe the hand conveys a certain emotion that a computer just can't replicate.",
  "On a daily basis, you'll find me blending illustrations, textures, and personal typography into the digital world, while listening to Shlomo Artzi or Aviv Geffen (depending on the mood).",
  "I can get lost for hours in color palettes; it's my favorite part of the process. I'm constantly searching for inspiration in my surroundings, and aiming to create design that leaves a mark.",
  "Outside the studio, I'm all about sunsets, picnics, and raw fish dinners. I can't start my morning without something sweet and pretty much love every dessert that exists.",
];

function ScrollMoreFade({
  scrollClassName,
  wrapperClassName = "",
  children,
}: {
  scrollClassName: string;
  wrapperClassName?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [showFade, setShowFade] = useState(false);

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    if (!mobile) {
      setShowFade(false);
      return;
    }
    const hasOverflow = el.scrollHeight > el.clientHeight + 1;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 4;
    setShowFade(hasOverflow && !nearBottom);
  }, []);

  useLayoutEffect(() => {
    sync();
  }, [sync]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => sync());
    ro.observe(el);
    el.addEventListener("scroll", sync, { passive: true });
    const mq = window.matchMedia("(max-width: 767px)");
    mq.addEventListener("change", sync);
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", sync);
      mq.removeEventListener("change", sync);
    };
  }, [sync]);

  return (
    <div className={`relative min-h-0 ${wrapperClassName}`.trim()}>
      <div ref={ref} className={scrollClassName}>
        {children}
      </div>
      <div
        aria-hidden
        className={`${SCROLL_FADE} md:hidden ${showFade ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

const introClassMerged =
  `w-full self-start mt-1 md:mt-0 ${smallTitleClass} leading-[1.6] max-md:leading-[1.88]`;

const introClassDesktop = `w-full self-start ${smallTitleClass} leading-[1.6] max-md:leading-[1.88] xl:col-start-3 xl:col-end-8 xl:row-start-1 xl:mt-1`;

const bioPClass = `${bodyTextClass} leading-[1.4] max-md:leading-[1.65] text-justify [text-wrap:pretty]`;

function IntroLines() {
  return (
    <>
      I'm Mika, a 25-year-old Visual <br />
      Communication student at HIT 3rd year,
      <br />
      Based in Ramat-Gan.
    </>
  );
}

function BioParagraphs() {
  return (
    <>
      {BIO_PARAGRAPHS.map((para, i) => (
        <p key={i} className={bioPClass}>
          {para}
        </p>
      ))}
    </>
  );
}

export const AboutMe = ({ onReady }: { onSelectSection: (id: string) => void; onReady?: () => void }) => {
  useEffect(() => {
    onReady?.();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      className="relative w-full h-[calc(100dvh-56px)] md:h-[calc(100dvh-72px)] overflow-hidden bg-cover max-md:bg-[length:100%_auto] max-md:bg-bottom"
      style={{
        backgroundImage: `url(${BG_IMAGE})`,
        backgroundPosition: "center 80%",
      }}
    >
      <PageGrid className={`relative z-10 items-start ${gapAboutXClass} ${gapAboutYClass} w-full ${aboutPtClass} pb-24`}>
        <h2 className={`col-span-8 md:col-span-2 md:col-start-1 md:row-start-1 self-start ${sectionTitleCoreClass} uppercase whitespace-nowrap`}>
          about me
        </h2>

        {/* Below xl: intro + bio in one scroll; gradient hint only on mobile */}
        <div className="col-span-8 md:col-start-3 md:col-end-8 md:row-start-1 xl:hidden">
          <ScrollMoreFade
            scrollClassName={[
              "scrollbar-hide mt-1 flex flex-col gap-2 overflow-y-auto overflow-x-hidden",
              "max-md:max-h-[min(152px,44dvh)] md:max-lg:max-h-[88px] lg:max-xl:max-h-[calc(87px+1rem)]",
            ].join(" ")}
          >
            <p className={introClassMerged}>
              <IntroLines />
            </p>
            <BioParagraphs />
          </ScrollMoreFade>
        </div>

        {/* xl+: intro row + bio scroll (hard mid-line clip on web, no gradient) */}
        <div className="hidden xl:contents">
          <p className={introClassDesktop}>
            <IntroLines />
          </p>
          <ScrollMoreFade
            wrapperClassName="w-full xl:col-start-3 xl:col-end-8 xl:row-start-2"
            scrollClassName={[
              "scrollbar-hide mt-1 flex w-full flex-col gap-1 overflow-x-hidden xl:mt-1 xl:overflow-y-auto",
              "xl:text-[length:var(--text-body)] xl:font-light xl:leading-[1.4] xl:max-h-[calc(5lh+0.5lh)]",
            ].join(" ")}
          >
            <BioParagraphs />
          </ScrollMoreFade>
        </div>
      </PageGrid>
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <Footer />
      </div>
    </section>
  );
};
