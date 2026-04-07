import { PageGrid } from "./PageGrid";

const contactLinkClass =
  "inline-block no-underline text-inherit transition-all duration-200 ease-out hover:text-[#ff0090] hover:underline hover:font-medium hover:translate-x-0.5 cursor-pointer";

export const Footer = () => {
  return (
    <footer className="relative z-20 w-full min-h-[70px] flex items-center justify-center border-t border-[#2200b8] bg-[#fcf7ee] py-4">
      <PageGrid className="items-center justify-items-center">
        <p className="col-span-8 font-['Bricolage_Grotesque'] text-lg md:text-[16px] text-[#2200b8] tracking-[1.1px] text-center">
          Hire Me!!! &nbsp;&gt;&gt;&gt;&nbsp;{" "}
          <a
            href="https://www.linkedin.com/in/mika-drori-9b02253a2/"
            target="_blank"
            rel="noopener noreferrer"
            className={contactLinkClass}
          >
            Mika Drori
          </a>
          &nbsp;&nbsp;&gt;&gt;&gt;&nbsp;{" "}
          <a href="mailto:Mikammm12@gmail.com" className={contactLinkClass}>
            Mikammm12@gmail.com
          </a>
          &nbsp;&nbsp;&gt;&gt;&gt;&nbsp;{" "}
          <a
            href="https://wa.me/972508989629"
            target="_blank"
            rel="noopener noreferrer"
            className={contactLinkClass}
          >
            +972-050-898-9629
          </a>
        </p>
      </PageGrid>
    </footer>
  );
};
