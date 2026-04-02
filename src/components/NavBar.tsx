import React, { useState } from "react";
import { PageGrid } from "./PageGrid";
import { cloudinaryUrl } from "../lib/cloudinary";

const ICON_CUBE_BLUE = cloudinaryUrl("Icon_cube_blue_uu5vvu.svg");
const ICON_CUBE_PINK = cloudinaryUrl("Icon_cube_pink_h27sxm.svg");

const linkClass =
  "inline-block font-['Bricolage_Grotesque'] font-light text-base md:text-lg text-[#2200b8] tracking-[1.1px] no-underline transition-all duration-200 ease-out hover:text-[#ff0090] hover:underline hover:font-medium hover:translate-x-0.5 cursor-pointer";

interface NavBarProps {
  onSelectSection: (id: string | null) => void;
}

export const NavBar = ({ onSelectSection }: NavBarProps) => {
  const [logoHovered, setLogoHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelectSection(null);
  };

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    onSelectSection("about");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#fcf7ee] border-b border-[#2200b8]">
      <PageGrid className="items-center min-h-[56px] md:min-h-[72px] py-3">
        <button
          type="button"
          className="col-start-1 col-end-2 flex md:hidden items-center justify-center w-9 h-9 bg-transparent border-none cursor-pointer"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2200b8" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>

        <a
          href="#"
          className="col-start-1 col-end-2 hidden md:flex items-center"
          aria-label="Scroll to top"
          onClick={handleLogoClick}
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
        >
          <img
            src={logoHovered ? ICON_CUBE_PINK : ICON_CUBE_BLUE}
            alt=""
            className="w-10 h-10 object-contain"
          />
        </a>

        <div className="col-start-4 col-end-6 hidden md:flex gap-10 md:gap-14 items-center justify-center">
          <a href="#" className={linkClass} onClick={handleHomeClick}>
            home
          </a>
          <a href="#" className={linkClass} onClick={handleAboutClick}>
            about me
          </a>
        </div>

        <span className="col-start-7 col-end-9 font-['Permanent_Marker'] text-xl md:text-2xl text-[#ff0090] tracking-[1.5px] justify-self-end select-none whitespace-nowrap">
          mika drori
        </span>
      </PageGrid>

      {menuOpen && (
        <div className="md:hidden border-t border-[#2200b8] bg-[#fcf7ee]">
          <div className="flex flex-col gap-4 px-[var(--grid-margin)] py-4">
            <a
              href="#"
              className={linkClass}
              onClick={(e) => {
                e.preventDefault();
                setMenuOpen(false);
                onSelectSection(null);
              }}
            >
              home
            </a>
            <a href="#" className={linkClass} onClick={handleAboutClick}>
              about me
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
