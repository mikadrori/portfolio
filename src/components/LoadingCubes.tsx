import { cloudinaryUrl } from "../lib/cloudinary";

const ICON_CUBE_BLUE = cloudinaryUrl("Icon_cube_blue_uu5vvu_tv1dmc.svg");
const ICON_CUBE_PINK = cloudinaryUrl("Icon_cube_pink_h27sxm_dwf2dv.svg");

export function LoadingCubes({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <style>{`
        @keyframes cubeSpin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes cubeSwap {
          0%, 42%  { opacity: 1; }
          50%, 92% { opacity: 0; }
          100%     { opacity: 1; }
        }
        .cube-spinner {
          animation: cubeSpin 6s linear infinite;
        }
        .cube-blue {
          animation: cubeSwap 1s ease-in-out infinite;
        }
        .cube-pink {
          opacity: 0;
          animation: cubeSwap 1s ease-in-out infinite;
          animation-delay: -0.5s;
        }
      `}</style>
      <div className="cube-spinner" style={{ width: 48, height: 48 }}>
        <div className="relative w-full h-full">
          <img
            src={ICON_CUBE_BLUE}
            alt=""
            className="cube-blue absolute inset-0 w-full h-full object-contain"
          />
          <img
            src={ICON_CUBE_PINK}
            alt=""
            className="cube-pink absolute inset-0 w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
