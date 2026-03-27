import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PROJECT_ORDER, type ProjectId } from "./CategoryCubes";
import { cloudinaryUrl } from "../lib/cloudinary";

const CUBE_ICON_BLUE = cloudinaryUrl("Button_cube_blue_gdvmqo.svg");
const CUBE_ICON_PINK = cloudinaryUrl("Button_cube_pink_pywiey.svg");

const PROJECT_LABELS: Record<ProjectId, string> = {
  lumina: "Lumina Forest",
  aviv: "Moonlight Atmosphere",
  packup: "Pack Up",
  muchiwaze: "MuchiWaze",
  wwl: "We Were Liars",
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
      className="w-full flex items-center justify-center py-12 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelectSection(nextProject)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelectSection(nextProject); }}
    >
      <div className="relative flex items-center justify-center">
        <img
          src={hovered ? CUBE_ICON_PINK : CUBE_ICON_BLUE}
          alt=""
          className="w-11 h-11 object-contain"
        />
        <span className="absolute right-full mr-5 font-['Bricolage_Grotesque'] font-light text-lg text-[#2200b8] tracking-[0.5px] whitespace-nowrap">
          next project
        </span>
        <AnimatePresence>
          {hovered && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute left-full ml-5 font-['Bricolage_Grotesque'] font-light text-lg text-[#2200b8] tracking-[0.9px] whitespace-nowrap"
            >
              {PROJECT_LABELS[nextProject]}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
