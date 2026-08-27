import { useEffect, useRef, useState } from "react";
import { Hero } from "../components/Hero";
import { OrganicLiquidCursor } from "../components/OrganicLiquidCursor";
import { SneakPeekImage } from "../components/SneakPeekImage";
import { type ProjectId } from "../components/CategoryCubes";
import type { SneakPeekProjectId } from "../lib/sneakPeekPool";

interface HomeProps {
  onSelectProject: (id: ProjectId) => void;
  animationKey?: number;
  /** When false, the liquid trail is off (e.g. About has its own cursor / paint mode). */
  liquidCursorEnabled?: boolean;
}

function isSneakPeekProject(id: ProjectId | null): id is SneakPeekProjectId {
  return (
    id === "lumina" ||
    id === "ogen" ||
    id === "packup" ||
    id === "nabat" ||
    id === "signal50"
  );
}

export const Home = ({
  onSelectProject,
  animationKey,
  liquidCursorEnabled = true,
}: HomeProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [homeInView, setHomeInView] = useState(true);
  const [hoveredProject, setHoveredProject] = useState<SneakPeekProjectId | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setHomeInView(entry.isIntersecting),
      { threshold: 0, root: null, rootMargin: "0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative w-full h-[calc(100vh-56px)] md:h-[calc(100vh-72px)] overflow-hidden"
    >
      <OrganicLiquidCursor enabled={false} />
      <SneakPeekImage projectId={hoveredProject} />
      <Hero
        onSelectProject={onSelectProject}
        animationKey={animationKey}
        onCubeHoverChange={(id) =>
          setHoveredProject(isSneakPeekProject(id) ? id : null)
        }
      />
      <div className="w-full border-t border-[#2200b8]" />
    </div>
  );
};
