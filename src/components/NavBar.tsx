import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PageGrid } from "./PageGrid";
import { cloudinaryUrl } from "../lib/cloudinary";

const ICON_CUBE_BLUE = cloudinaryUrl("Icon_cube_blue_uu5vvu_tv1dmc.svg");
const ICON_CUBE_PINK = cloudinaryUrl("Icon_cube_pink_h27sxm_dwf2dv.svg");

const linkClass =
  "font-['Bricolage_Grotesque'] font-light text-[length:var(--text-nav-link)] text-[#2200b8] tracking-[1.1px] no-underline transition-all duration-200 ease-out hover:text-[#ff0090] hover:underline hover:font-medium hover:translate-x-0.5 cursor-pointer";

interface NavBarProps {
  onNavIntent: (target: "home" | "about") => void;
}

export const NavBar = ({ onNavIntent }: NavBarProps) => {
  const [logoHovered, setLogoHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#fcf7ee] border-b border-[#2200b8]">
      <PageGrid className="items-center min-h-[56px] md:min-h-[72px] py-3">
        <button
          type="button"
          className="col-start-1 col-end-2 flex lg:hidden items-center justify-center w-9 h-9 bg-transparent border-none cursor-pointer"
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
          className="col-start-1 col-end-2 hidden lg:flex items-center"
          aria-label="Scroll to top"
          onClick={handleLogoClick}
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
        >
          <img
            src={logoHovered ? ICON_CUBE_PINK : ICON_CUBE_BLUE}
            alt=""
            className="w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 object-contain"
          />
        </a>

        <Link
          to="/"
          className={`col-start-4 col-end-5 hidden lg:inline-block justify-self-end mr-4 ${linkClass}`}
          onClick={() => onNavIntent("home")}
        >
          home
        </Link>
        <Link
          to="/about"
          className={`col-start-5 col-end-6 hidden lg:inline-block justify-self-start ml-4 ${linkClass}`}
          onClick={() => onNavIntent("about")}
        >
          about me
        </Link>

        <div className="col-start-7 col-end-9 flex items-center justify-end gap-2">
          <div id="navbar-mute-slot" className="lg:hidden flex items-center" />
          <span className="font-['Permanent_Marker'] text-[length:var(--text-nav-logo)] text-[#ff0090] tracking-[1.5px] select-none whitespace-nowrap">
            mika drori
          </span>
        </div>
      </PageGrid>

      {menuOpen && (
        <div className="lg:hidden border-t border-[#2200b8] bg-[#fcf7ee]">
          <div className="flex flex-col gap-4 px-[var(--grid-margin)] py-4">
            <Link
              to="/"
              className={linkClass}
              onClick={() => {
                setMenuOpen(false);
                onNavIntent("home");
              }}
            >
              home
            </Link>
            <Link
              to="/about"
              className={linkClass}
              onClick={() => {
                setMenuOpen(false);
                onNavIntent("about");
              }}
            >
              about me
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
