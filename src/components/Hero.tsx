import { NameAnimation } from "./NameAnimation";
import { PortfolioIntro } from "./PortfolioIntro";
import { CategoryCubes, type ProjectId } from "./CategoryCubes";
import { PageGrid } from "./PageGrid";
import { gapHeroTightClass } from "../lib/spacing";

interface HeroProps {
  onSelectProject: (id: ProjectId) => void;
  animationKey?: number;
}

export const Hero = ({ onSelectProject, animationKey }: HeroProps) => {
  return (
    <section className="min-h-[calc(100vh-56px)] md:min-h-[calc(100vh-72px)] flex items-start lg:items-center pt-20 pb-8 lg:py-12 overflow-x-clip">
      <PageGrid className="items-center gap-y-8 lg:gap-y-[var(--grid-gutter)]">
        <div className={`col-span-8 lg:col-start-2 lg:col-end-5 flex flex-col ${gapHeroTightClass} items-center lg:items-start order-2 lg:order-1`}>
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
        <div className="col-span-8 lg:col-start-5 lg:col-end-9 flex justify-center order-1 lg:order-2">
          <CategoryCubes onSelectProject={onSelectProject} animationKey={animationKey} />
        </div>
      </PageGrid>
    </section>
  );
};
