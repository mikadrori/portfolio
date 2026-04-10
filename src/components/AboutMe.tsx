import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { PageGrid } from "./PageGrid";
import { Footer } from "./Footer";
import { cloudinaryUrl } from "../lib/cloudinary";
import { sectionTitleCoreClass, bodyTextClass, subTitleClass } from "../lib/typography";
import { aboutPtClass, gapAboutXClass, gapAboutYClass } from "../lib/spacing";

const BG_IMAGE_MOBILE = cloudinaryUrl("mememe_ukfgg9_vfttwe.png", { quality: "auto:best", width: 1920 });
const BG_IMAGE_WEB = cloudinaryUrl("meforweb_qu9fex.png", { quality: "auto:best", width: 1920 });

/** Matches section cream so the fade reads as “more below” over the photo/top tint. */
const SCROLL_FADE =
  "pointer-events-none absolute inset-x-0 -bottom-2 z-[1] h-14 bg-gradient-to-t from-[#fcf7ee] from-30% via-[#fcf7ee]/90 via-60% to-transparent transition-opacity duration-200 ease-out";

const BIO_PARAGRAPHS: ReactNode[] = [
  "As a designer, I'm always looking for that delicate balance between order and colorful chaos. my process always starts with a pencil, paper, and hand-drawn sketches. I believe the hand conveys a certain emotion that a computer just can't replicate.",
  "On a daily basis, you'll find me blending illustrations, textures, and personal typography into the digital world, while listening to Shlomo Artzi or Aviv Geffen (depending on the mood).",
  "I can get lost for hours in color palettes; it's my favorite part of the process. I'm constantly searching for inspiration in my surroundings, and aiming to create design that leaves a mark.",
  <>When I’m not designing, you’ll likely find me renovating furniture or working on my latest DIY home project. I’ve always loved working with my hands and the feeling of making things myself. my favorite foods are raw fish and pretty much any dessert that exists.</>,
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
  "w-full self-start mt-1 md:mt-0 font-['Bricolage_Grotesque'] font-semibold text-[length:var(--text-subtitle)] text-[#2200b8] tracking-[1.4px] leading-[1.6] max-md:leading-[1.4]";

const introClassDesktop = "w-full self-start font-['Bricolage_Grotesque'] font-semibold text-[length:var(--text-subtitle)] text-[#2200b8] tracking-[1.4px] leading-[1.6] max-md:leading-[1.88] lg:col-start-3 lg:col-end-7 lg:row-start-1 lg:mt-1";

const bioPClass = `${bodyTextClass} leading-[1.4] max-md:leading-[1.65] text-left [text-wrap:pretty]`;

function IntroLines() {
  return (
    <>
      I'm Mika, <br /> a 25-year-old Visual
      Communication <br /> student at HIT 3rd year, based in Ramat-Gan.
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
      className="relative w-full h-[calc(100dvh-56px)] md:h-[calc(100dvh-72px)] overflow-hidden"
    >
      {/* Mobile bg */}
      <div
        className="absolute inset-0 bg-no-repeat bg-[length:220%_auto] bg-[position:center_bottom] md:hidden"
        style={{ backgroundImage: `url(${BG_IMAGE_MOBILE})` }}
      />
      {/* Web (md+) bg */}
      <div
        className="absolute inset-0 hidden bg-no-repeat bg-cover bg-[position:center_90%] md:block"
        style={{ backgroundImage: `url(${BG_IMAGE_WEB})` }}
      />
      <PageGrid className={`relative z-10 items-start ${gapAboutXClass} ${gapAboutYClass} w-full ${aboutPtClass} pb-24`}>
        <h2 className={`col-span-8 md:col-span-2 md:col-start-1 md:row-start-1 self-start ${sectionTitleCoreClass} uppercase whitespace-nowrap`}>
          about me
        </h2>

        {/* Below lg: intro outside scroll, bio in scroll */}
        <div className="col-span-8 md:col-start-3 md:col-end-7 md:row-start-1 lg:hidden flex flex-col gap-4 md:gap-2 mt-1">
          <p className={introClassMerged}>
            <IntroLines />
          </p>
          <div
            className={[
              "scrollbar-hide flex flex-col gap-3 overflow-y-auto overflow-x-hidden",
              "max-md:max-h-[calc(6.1lh+0.1rem)] md:max-lg:max-h-[3.3lh]",
              "text-[length:var(--text-body)] font-light leading-[1.65] md:leading-[1.4]",
            ].join(" ")}
          >
            <BioParagraphs />
          </div>
        </div>

        {/* lg+: intro row + bio scroll (hard mid-line clip on web, no gradient) */}
        <div className="hidden lg:contents">
          <p className={introClassDesktop}>
            <IntroLines />
          </p>
          <ScrollMoreFade
            wrapperClassName="w-full lg:col-start-3 lg:col-end-6 lg:row-start-2"
            scrollClassName={[
              "scrollbar-hide mt-1 flex w-full flex-col gap-2 overflow-x-hidden lg:mt-2 lg:overflow-y-auto",
              "lg:text-[length:var(--text-body)] lg:font-light lg:leading-[1.4] lg:max-h-[calc(7lh+0.5em)] xl:max-h-[calc(8lh+0.5em)]",
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
