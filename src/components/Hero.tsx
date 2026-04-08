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
    <section className="min-h-[calc(100vh-56px)] md:min-h-[calc(100vh-72px)] flex items-start lg:items-center pt-20 md:pt-14 pb-8 lg:py-12 overflow-x-clip">
      <PageGrid className="items-center gap-y-8 lg:gap-y-[var(--grid-gutter)]">
        <div className="col-span-8 md:col-start-2 md:col-end-5 lg:col-start-2 lg:col-end-5 flex flex-col gap-1.5 items-center md:items-start order-2 md:order-1 lg:order-1">
          <div className="flex flex-col gap-0.5 items-center md:items-start">
            <p className="font-['Bricolage_Grotesque'] font-light text-[clamp(32px,6vw,80px)] text-[#2200b8] leading-none tracking-[5px] text-center md:text-left">
              Hi,
            </p>
            <div className="flex items-end gap-[clamp(8px,1.2vw,18px)] flex-nowrap justify-center md:justify-start">
              <p className="font-['Bricolage_Grotesque'] font-light text-[clamp(32px,6vw,80px)] text-[#2200b8] leading-none tracking-[5px]">
                I'm
              </p>
              <NameAnimation />
            </div>
          </div>
          <PortfolioIntro />
        </div>
        <div className="col-span-8 md:col-start-6 md:col-end-9 lg:col-start-5 lg:col-end-9 flex justify-center md:justify-center order-1 md:order-2 lg:order-2">
          <CategoryCubes onSelectProject={onSelectProject} animationKey={animationKey} />
        </div>
      </PageGrid>
    </section>
  );
};
