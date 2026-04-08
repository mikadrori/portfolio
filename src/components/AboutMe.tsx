import { useEffect } from "react";
import { PageGrid } from "./PageGrid";
import { Footer } from "./Footer";
import { cloudinaryUrl } from "../lib/cloudinary";
import { sectionTitleCoreClass, bodyTextClass, smallTitleClass } from "../lib/typography";
import { aboutPtClass, gapAboutXClass, gapAboutYClass } from "../lib/spacing";

const BG_IMAGE = cloudinaryUrl("mememe_ukfgg9_vfttwe.png", { quality: "auto:best", width: 1920 });

const BIO_PARAGRAPHS = [
  "As a designer, I'm always looking for that delicate balance between order and colorful chaos.",
  "My process always starts with a pencil, paper, and hand-drawn sketches. I believe the hand conveys a certain emotion that a computer just can't replicate.",
  "On a daily basis, you'll find me blending illustrations, textures, and personal typography into the digital world, while listening to Shlomo Artzi or Aviv Geffen (depending on the mood).",
  "I can get lost for hours in color palettes; it's my favorite part of the process. I'm constantly searching for inspiration in my surroundings, and aiming to create design that leaves a mark.",
  "Outside the studio, I'm all about sunsets, picnics, and raw fish dinners. I can't start my morning without something sweet and pretty much love every dessert that exists.",
];

export const AboutMe = ({ onReady }: { onSelectSection: (id: string) => void; onReady?: () => void }) => {
  useEffect(() => { onReady?.(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      className="relative w-full h-[calc(100dvh-56px)] md:h-[calc(100dvh-72px)] overflow-hidden bg-cover"
      style={{
        backgroundImage: `url(${BG_IMAGE})`,
        backgroundPosition: "center 80%",
      }}
    >
      <PageGrid className={`relative z-10 items-start ${gapAboutXClass} ${gapAboutYClass} w-full ${aboutPtClass} pb-24`}>
        <h2 className={`col-span-8 md:col-span-2 md:col-start-1 md:row-start-1 self-start ${sectionTitleCoreClass} uppercase whitespace-nowrap`}>
          about me
        </h2>
        <p className={`col-span-8 md:col-start-3 md:col-end-6 md:row-start-1 self-start mt-1 ${smallTitleClass} leading-[1.6]`}>
          I'm Mika, a 25-year-old Visual <br />
          Communication student at HIT 3rd year,
          <br />
          Based in Ramat-Gan.
        </p>
        <div className="col-span-8 md:col-start-4 md:col-end-8 md:row-start-2 max-h-[87px] overflow-y-auto scrollbar-hide mt-1 space-y-1">
          {BIO_PARAGRAPHS.map((para, i) => (
            <p
              key={i}
              className={`${bodyTextClass} leading-[1.4] text-justify`}
            >
              {para}
            </p>
          ))}
        </div>
      </PageGrid>
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <Footer />
      </div>
    </section>
  );
};
