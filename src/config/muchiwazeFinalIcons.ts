import { cloudinaryUrl } from "../lib/cloudinary";

/**
 * MuchiWaze — Final Design → Icons (5 columns: 1–2–1–2–1).
 *
 * Edit `FINAL_ICON_SIZES` to change each icon independently. Use Tailwind
 * `max-w-[…]` utilities; optional breakpoints: `sm:max-w-[…] md:max-w-[…] lg:max-w-[…]`.
 * Icons keep aspect ratio (`object-contain` in the page component).
 *
 * Optional `offsetClass` per icon: e.g. `-mt-2` moves up 0.5rem (Tailwind spacing).
 */

export const FINAL_ICON_SIZE_DEFAULT =
  "max-w-[60px] sm:max-w-[80px] md:max-w-[96px] lg:max-w-[100px] xl:max-w-[104px] 2xl:max-w-[112px]";

/** One entry per icon — adjust any value without touching the layout below. */
export const FINAL_ICON_SIZES = {
  hostel: FINAL_ICON_SIZE_DEFAULT,
  munch:  "max-w-[60px] sm:max-w-[80px] md:max-w-[96px] lg:max-w-[97px] xl:max-w-[101px] 2xl:max-w-[109px]",
  bribe: FINAL_ICON_SIZE_DEFAULT,
  chabad:  "max-w-[60px] sm:max-w-[80px] md:max-w-[96px] lg:max-w-[104px] xl:max-w-[109px] 2xl:max-w-[117px]",
  weed: FINAL_ICON_SIZE_DEFAULT,
  robbery: FINAL_ICON_SIZE_DEFAULT,
  party: "max-w-[60px] sm:max-w-[80px] md:max-w-[96px] lg:max-w-[110px] xl:max-w-[115px] 2xl:max-w-[123px]",
} as const;

export type FinalDesignIconAsset = {
  src: string;
  alt: string;
  sizeClass: string;
  /** Tailwind utilities to nudge position (e.g. `-mt-2` = 0.5rem up). */
  offsetClass?: string;
};

export type FinalDesignCol =
  | ({ layout: "single" } & FinalDesignIconAsset)
  | {
      layout: "stack";
      top: FinalDesignIconAsset;
      bottom: FinalDesignIconAsset;
    };

export const FINAL_DESIGN_ICON_COLUMNS: FinalDesignCol[] = [
  {
    layout: "single",
    src: cloudinaryUrl("hostel_icon_u1zksb.svg"),
    alt: "Hostel",
    sizeClass: FINAL_ICON_SIZES.hostel,
  },
  {
    layout: "stack",
    top: {
      src: cloudinaryUrl("munch_icon_ukb2yp.svg"),
      alt: "Munch",
      sizeClass: FINAL_ICON_SIZES.munch,
      offsetClass: "mt-[0.05rem]",
    },
    bottom: {
      src: cloudinaryUrl("bribe_icon_rqtufa.svg"),
      alt: "Police alert",
      sizeClass: FINAL_ICON_SIZES.bribe,
    },
  },
  {
    layout: "single",
    src: cloudinaryUrl("chabad_icon_bjpydu.svg"),
    alt: "Chabad House",
    sizeClass: FINAL_ICON_SIZES.chabad,
  },
  {
    layout: "stack",
    top: {
      src: cloudinaryUrl("weed_icon_aazyi4.svg"),
      alt: "Weed",
      sizeClass: FINAL_ICON_SIZES.weed,
    },
    bottom: {
      src: cloudinaryUrl("robbery_icon_msuw87.svg"),
      alt: "Robbery alert",
      sizeClass: FINAL_ICON_SIZES.robbery,
      offsetClass: "-mt-3",
    },
  },
  {
    layout: "single",
    src: cloudinaryUrl("party_icon_fukpld.svg"),
    alt: "Party",
    sizeClass: FINAL_ICON_SIZES.party,
    offsetClass: "-mt-3",
  },
];
