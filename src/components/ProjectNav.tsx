import { useState } from "react";
import { motion } from "motion/react";
import { PROJECT_ORDER, type ProjectId } from "./CategoryCubes";
import { cloudinaryUrl } from "../lib/cloudinary";
import { bodyTextClass } from "../lib/typography";

const CUBE_ICON_BLUE = cloudinaryUrl("Icon_cube_blue_uu5vvu_tv1dmc.svg");
const CUBE_ICON_PINK = cloudinaryUrl("Icon_cube_pink_h27sxm_dwf2dv.svg");

const PROJECT_LABELS: Record<ProjectId, string> = {
  lumina: "Lumina Forest",
  aviv: "Moonlight Atmosphere",
  packup: "Pack Up",
  muchiwaze: "MuchiWaze",
  wwl: "We Were Liars",
};

/** gap-5 (1.25rem) + extra slide; matches previous -translate-x-14 */
const LABEL_SLIDE_X = "-1.3rem";

const labelMotionTransition = {
  duration: 0.6,
  ease: [0.33, 0, 0.2, 1] as const,
};

interface ProjectNavProps {
  currentProject: ProjectId;
  onSelectSection: (id: string) => void;
}

export const ProjectNav = ({ currentProject, onSelectSection }: ProjectNavProps) => {
  const [hovered, setHovered] = useState(false);
  const currentIndex = PROJECT_ORDER.indexOf(currentProject);
  const nextProject = PROJECT_ORDER[(currentIndex + 1) % PROJECT_ORDER.length];

  return (
    <div
      className="mx-auto flex w-fit cursor-pointer items-center justify-center gap-3 py-8 md:translate-x-[0.5rem] xl:gap-5 xl:py-12"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelectSection(nextProject)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelectSection(nextProject); }}
    >
      <span className={`shrink-0 ${bodyTextClass} whitespace-nowrap md:w-auto w-[90px] text-right`}>next project</span>
      <img
        src={CUBE_ICON_PINK}
        alt=""
        className="h-6 w-6 shrink-0 object-contain md:hidden xl:h-9 xl:w-9"
      />
      <img
        src={hovered ? CUBE_ICON_PINK : CUBE_ICON_BLUE}
        alt=""
        className="hidden h-6 w-6 shrink-0 object-contain md:block xl:h-9 xl:w-9"
      />
      <span className={`shrink-0 whitespace-nowrap md:hidden ${bodyTextClass} w-[90px] text-left`}>
        {PROJECT_LABELS[nextProject]}
      </span>
      <motion.span
        className={`hidden shrink-0 whitespace-nowrap md:inline-block ${bodyTextClass}`}
        initial={false}
        animate={{
          x: hovered ? 0 : LABEL_SLIDE_X,
          opacity: hovered ? 1 : 0,
        }}
        transition={labelMotionTransition}
      >
        {PROJECT_LABELS[nextProject]}
      </motion.span>
    </div>
  );
};
