import { useState } from "react";
import { PageGrid } from "./PageGrid";

const ICON_CUBE_BLUE = "/svg/Icon%20cube%20blue.svg";
const ICON_CUBE_PINK = "/svg/Icon%20cube%20pink.svg";

const linkClass =
  "inline-block font-['Bricolage_Grotesque'] font-light text-base md:text-lg text-[#2200b8] tracking-[1.1px] no-underline transition-all duration-200 ease-out hover:text-[#ff0090] hover:underline hover:font-medium hover:translate-x-0.5";

export const NavBar = () => {
  const [logoHovered, setLogoHovered] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full min-h-[56px] md:min-h-[72px] bg-[#fcf7ee] flex items-center py-3 border-b border-[#2200b8]">
      <PageGrid className="items-center">
        <a
          href="/"
          className="col-start-1 col-end-2 flex items-center"
          aria-label="Home"
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
        >
          <img
            src={logoHovered ? ICON_CUBE_PINK : ICON_CUBE_BLUE}
            alt=""
            className="w-9 h-9 md:w-10 md:h-10 object-contain"
          />
        </a>
        <div className="col-start-4 col-end-6 flex gap-10 md:gap-14 items-center justify-center">
          <a href="/" className={linkClass}>
            home
          </a>
          <a href="/#about" className={linkClass}>
            about me
          </a>
        </div>
        <a
          href="#"
          className="col-start-7 col-end-9 font-['Permanent_Marker'] text-xl md:text-2xl text-[#ff0090] tracking-[1.5px] justify-self-end cursor-pointer no-underline transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff0090] focus-visible:ring-offset-2 rounded"
          aria-label="Navigate"
        >
          mika drori
        </a>
      </PageGrid>
    </nav>
  );
};
