import { NameAnimation } from "./NameAnimation";
import { PortfolioIntro } from "./PortfolioIntro";
import { CategoryCubes, type ProjectId } from "./CategoryCubes";
import { PageGrid } from "./PageGrid";

interface HeroProps {
  onSelectProject: (id: ProjectId) => void;
  animationKey?: number;
}

export const Hero = ({ onSelectProject, animationKey }: HeroProps) => {
  return (
    <section className="min-h-[calc(100vh-56px)] md:min-h-[calc(100vh-72px)] flex items-center py-12 md:py-16 lg:py-20 overflow-x-clip">
      <PageGrid className="items-center">
        <div className="col-span-8 2xl:col-start-2 2xl:col-end-5 flex flex-col gap-3 md:gap-4 items-center 2xl:items-start order-1">
          <p className="font-['Bricolage_Grotesque'] font-light text-[clamp(32px,6vw,80px)] text-[#2200b8] leading-none tracking-[5px]">
            Hi,
          </p>
          <div className="flex items-end gap-[clamp(12px,1.5vw,24px)] flex-nowrap">
            <p className="font-['Bricolage_Grotesque'] font-light text-[clamp(32px,6vw,80px)] text-[#2200b8] leading-none tracking-[5px]">
              I'm
            </p>
            <NameAnimation />
          </div>
          <PortfolioIntro />
        </div>
        <div className="col-span-8 2xl:col-start-5 2xl:col-end-9 flex justify-center order-2">
          <CategoryCubes onSelectProject={onSelectProject} animationKey={animationKey} />
        </div>
      </PageGrid>
    </section>
  );
};
