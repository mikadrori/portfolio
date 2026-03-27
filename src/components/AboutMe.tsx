import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PageGrid } from "./PageGrid";

const BG_IMAGE = "/assets/me-optimized.png";

const BIO_PARAGRAPHS = [
  "As a designer, I'm always looking for that delicate balance between order and colorful chaos.",
  "My process always starts with a pencil, paper, and hand-drawn sketches. I believe the hand conveys a certain emotion that a computer just can't replicate.",
  "On a daily basis, you'll find me blending illustrations, textures, and personal typography into the digital world, while listening to Shlomo Artzi or Aviv Geffen (depending on the mood).",
  "I can get lost for hours in color palettes; it's my favorite part of the process. I'm constantly searching for inspiration in my surroundings, and aiming to create design that leaves a mark.",
  "Outside the studio, I'm all about sunsets, picnics, and raw fish dinners. I can't start my morning without something sweet and pretty much love every dessert that exists.",
];

const btnClass =
  "flex items-center justify-center w-[180px] md:w-[210px] h-[75px] text-[#fcf7ee] font-['Bricolage_Grotesque'] font-light text-xl md:text-[25px] no-underline tracking-[0.5px] transition-colors";

export const AboutMe = (_props: { onSelectSection: (id: string) => void }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <section
      className="relative w-full min-h-screen flex items-start bg-cover pt-8 md:pt-12 pb-16 md:pb-20"
      style={{
        backgroundImage: `url(${BG_IMAGE})`,
        backgroundPosition: "center 38%",
      }}
    >
      <PageGrid className="relative z-10 items-start gap-6 w-full">
        <h2 className="col-span-8 col-start-2 col-end-4 md:col-end-3 font-['Permanent_Marker'] text-[24px] md:text-[28px] text-[#ff0090] md:mb-0 mt-[-8px] tracking-[2px] uppercase whitespace-nowrap">
          about me
        </h2>
        <p className="col-span-8 md:col-start-2 md:col-end-5 font-['Bricolage_Grotesque'] text-base md:text-[18px] text-[#2200b8] -mt-4">
          I'm Mika, a 25-year-old Visual <br /> Communication student at HIT 3rd year,
          <br />
          Based in Ramat-Gan.
        </p>
        <div className="col-span-8 md:col-start-3 md:col-end-7 max-h-[87px] md:max-h-[87px] overflow-y-auto scrollbar-hide -mt-3 space-y-1">
          {BIO_PARAGRAPHS.map((para, i) => (
            <p
              key={i}
              className="font-['Bricolage_Grotesque'] font-light text-sm md:text-base text-[#2200b8] leading-[1.4] text-justify"
            >
              {para}
            </p>
          ))}
        </div>
        <div
          className="col-span-8 md:col-start-8 md:col-end-9 flex flex-col gap-3 items-center md:items-end justify-self-center md:justify-self-end"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <AnimatePresence mode="wait">
            {!hovered ? (
              <motion.a
                key="default"
                href="mailto:Mikammm12@gmail.com"
                className={`${btnClass} bg-[#ff0090]`}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Contact me!
              </motion.a>
            ) : (
              <motion.div
                key="expanded"
                className="flex flex-col gap-3 items-end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex gap-3">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${btnClass} bg-[#2200b8]`}
                  >
                    LinkedIn
                  </a>
                  <a
                    href="mailto:Mikammm12@gmail.com"
                    className={`${btnClass} bg-[#ff0090]`}
                  >
                    Contact me!
                  </a>
                </div>
                <a
                  href="mailto:Mikammm12@gmail.com"
                  className={`${btnClass} bg-[#2200b8]`}
                >
                  Email
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PageGrid>
    </section>
  );
};
