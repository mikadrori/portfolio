import { NameAnimation } from "./NameAnimation";
import { PortfolioIntro } from "./PortfolioIntro";
import { CategoryCubes } from "./CategoryCubes";
import { PageGrid } from "./PageGrid";

export const Hero = () => {
  return (
    <section className="min-h-[calc(100vh-56px)] md:min-h-[calc(100vh-72px)] flex items-center py-12 md:py-16 lg:py-20">
      <PageGrid className="items-start md:items-center">
        <div className="col-span-8 md:col-start-2 md:col-end-5 flex flex-col gap-3 md:gap-4 order-1">
          <p className="font-['Bricolage_Grotesque'] font-light text-[40px] md:text-[60px] lg:text-[80px] text-[#2200b8] leading-none tracking-[5px]">
            Hi,
          </p>
          <div className="flex items-end gap-4 md:gap-6 flex-wrap">
            <p className="font-['Bricolage_Grotesque'] font-light text-[40px] md:text-[60px] lg:text-[80px] text-[#2200b8] leading-none tracking-[5px]">
              I'm
            </p>
            <NameAnimation />
          </div>
          <PortfolioIntro />
        </div>
        <div className="col-span-8 md:col-start-6 md:col-end-9 flex justify-center md:justify-start order-2">
          <CategoryCubes />
        </div>
      </PageGrid>
    </section>
  );
};
