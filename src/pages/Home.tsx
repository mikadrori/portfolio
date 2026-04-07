import { Hero } from "../components/Hero";
import { type ProjectId } from "../components/CategoryCubes";

interface HomeProps {
  onSelectProject: (id: ProjectId) => void;
  animationKey?: number;
}

export const Home = ({ onSelectProject, animationKey }: HomeProps) => {
  return (
    <>
      <Hero onSelectProject={onSelectProject} animationKey={animationKey} />
      <div className="w-full border-t border-[#2200b8]" />
    </>
  );
};
