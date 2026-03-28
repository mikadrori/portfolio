import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PageGrid } from "./PageGrid";
import { cloudinaryUrl } from "../lib/cloudinary";
import { sectionTitleClass, bodyTextClass } from "../lib/typography";
import { sectionPageGridPaddingClass } from "../lib/sectionLayout";

const BG_IMAGE = cloudinaryUrl("mememe_ukfgg9", { quality: "auto:best", width: 1920 });

const BIO_PARAGRAPHS = [
  "As a designer, I'm always looking for that delicate balance between order and colorful chaos.",
  "My process always starts with a pencil, paper, and hand-drawn sketches. I believe the hand conveys a certain emotion that a computer just can't replicate.",
  "On a daily basis, you'll find me blending illustrations, textures, and personal typography into the digital world, while listening to Shlomo Artzi or Aviv Geffen (depending on the mood).",
  "I can get lost for hours in color palettes; it's my favorite part of the process. I'm constantly searching for inspiration in my surroundings, and aiming to create design that leaves a mark.",
  "Outside the studio, I'm all about sunsets, picnics, and raw fish dinners. I can't start my morning without something sweet and pretty much love every dessert that exists.",
];

const btnClass =
  "flex items-center justify-center w-[180px] md:w-[210px] h-[75px] text-[#fcf7ee] font-['Bricolage_Grotesque'] font-light text-xl md:text-[25px] no-underline tracking-[0.5px] transition-colors";

export const AboutMe = ({ onReady }: { onSelectSection: (id: string) => void; onReady?: () => void }) => {
  const [hovered, setHovered] = useState(false);

  useEffect(() => { onReady?.(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      className="relative w-full min-h-screen flex items-start bg-cover"
      style={{
        backgroundImage: `url(${BG_IMAGE})`,
        backgroundPosition: "center 38%",
      }}
    >
      <PageGrid className={`relative z-10 items-start gap-6 w-full ${sectionPageGridPaddingClass}`}>
        <h2 className={`col-span-8 md:col-span-1 md:col-start-1 ${sectionTitleClass} md:mb-0 uppercase whitespace-nowrap`}>
          about me
        </h2>
        <p className={`col-span-8 md:col-start-3 md:col-end-6 ${bodyTextClass} -mt-4`}>
          I'm Mika, a 25-year-old Visual <br /> Communication student at HIT 3rd year,
          <br />
          Based in Ramat-Gan.
        </p>
        <div className="col-span-8 md:col-start-4 md:col-end-8 max-h-[87px] md:max-h-[87px] overflow-y-auto scrollbar-hide -mt-3 space-y-1">
          {BIO_PARAGRAPHS.map((para, i) => (
            <p
              key={i}
              className={`${bodyTextClass} text-sm md:text-base leading-[1.4] text-justify`}
            >
              {para}
            </p>
          ))}
        </div>

      </PageGrid>
    </section>
  );
};
