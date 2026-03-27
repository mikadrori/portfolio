import { Hero } from "../components/Hero";
import { type ProjectId } from "../components/CategoryCubes";

interface HomeProps {
  onSelectProject: (id: ProjectId) => void;
}

export const Home = ({ onSelectProject }: HomeProps) => {
  return (
    <>
      <Hero onSelectProject={onSelectProject} />
      <div className="w-full h-px bg-[#2200b8]" />
    </>
  );
};
