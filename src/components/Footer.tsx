import { PageGrid } from "./PageGrid";

export const Footer = () => {
  return (
    <footer className="w-full min-h-[70px] flex items-center justify-center border-t border-[#2200b8] py-4">
      <PageGrid className="items-center justify-items-center">
        <p className="col-span-8 font-['Bricolage_Grotesque'] text-lg md:text-[16px] text-[#2200b8] tracking-[1.1px] text-center">
          Hire Me!!! &nbsp;&gt;&gt;&gt;&nbsp; Mika Drori &nbsp;&gt;&gt;&gt;&nbsp;{" "}

          Mikammm12@gmail.com
          &nbsp;&gt;&gt;&gt;&nbsp; +972-050-898-9629
        </p>
      </PageGrid>
    </footer>
  );
};
