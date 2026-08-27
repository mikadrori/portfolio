import { cloudinaryUrl, cloudinaryVideoThumbnail } from "./cloudinary";
import type { ProjectId } from "../components/CategoryCubes";

export type SneakPeekProjectId = Extract<
  ProjectId,
  "lumina" | "ogen" | "packup" | "nabat" | "signal50"
>;

/**
 * Display hint controls how the image is rendered:
 * - "wide": landscape mockups/iPads — wider box, shorter height
 * - "tall": portrait phone screens, posters — allowed more height (center zone only)
 * - "icon": app icons, small logos — rendered small and square-ish
 * - "normal": default (screenshots, environments) — balanced sizing
 */
export type DisplayHint = "wide" | "tall" | "icon" | "normal" | "ipad";

export interface SneakPeekEntry {
  src: string;
  hint: DisplayHint;
}

function img(publicId: string, width = 500): string {
  return cloudinaryUrl(encodeURI(publicId), { width, quality: "auto" });
}

const OGEN: SneakPeekEntry[] = [
  { src: img("OGEN/System_Mockup_Night_zezhb6.png", 700), hint: "normal" },
  { src: img("OGEN/System_Mockup_cta3cf.png", 700), hint: "normal" },
  { src: img("OGEN/Dashboard_mockup_im7u1v.png", 700), hint: "ipad" },
  { src: img("OGEN/Screen_Dashboard_NEW_oofb59.png"), hint: "normal" },
  { src: img("OGEN/Screen_Dashboard_vur6vl.png"), hint: "normal" },
  { src: img("OGEN/Screen_Login_dme8ua.png"), hint: "normal" },
  { src: img("OGEN/Screen_Anchor_zgdfi7.png"), hint: "normal" },
  { src: img("OGEN/Screen_Reports_ndg0sv.png"), hint: "normal" },
];

const NABAT: SneakPeekEntry[] = [
  { src: img("Nabat/Visual Language/Nabat_LogoColors-103_vhyzcw.png"), hint: "normal" },
  { src: img("Nabat/Visual Language/Nabat_LogoColors-104_odzkr2.png"), hint: "normal" },
  { src: img("Nabat/Visual Language/Nabat_LogoColors-105_cf8vtw.png"), hint: "normal" },
  { src: img("Nabat/Visual Language/Nabat_LogoColors-106_ckpikp.png"), hint: "normal" },
  { src: img("Nabat/JPEG/Nabat_PackageIMG_11_epwf3b.jpg", 700), hint: "normal" },
  { src: img("Nabat/JPEG/Nabat_PackageIMG_12_a3f6zm.jpg", 700), hint: "normal" },
  { src: `https://res.cloudinary.com/dmrtjbfbb/video/upload/so_5,c_crop,g_center,ar_16:10/f_jpg,q_auto,w_500/Nabat/Nabat_nabatwebsiteVID_jbcith.jpg`, hint: "normal" },
  { src: img("Nabat/Posters/Nabat_poster-01_ndqqhd.png", 600), hint: "tall" },
  { src: img("Nabat/Posters/Nabat_poster-02_fo9hp4.png", 600), hint: "tall" },
  { src: img("Nabat/Posters/Nabat_poster-03_wo7gav.png", 600), hint: "tall" },
  { src: img("Nabat/Posters/Nabat_poster-04_tr6lts.png", 600), hint: "tall" },
];

const SIGNAL50: SneakPeekEntry[] = [
  { src: img("Signal50/signal50_mockup_1_rselkx.png", 600), hint: "normal" },
  { src: img("Signal50/signal50_mockup_2_wn8ml5.png", 600), hint: "normal" },
  { src: img("Signal50/signal50_AiFrame_1_nvc47m.jpg"), hint: "normal" },
  { src: img("Signal50/signal50_AiFrame_4_stffjc.jpg"), hint: "normal" },
  { src: img("Signal50/signal50_AiFrame_6_hkg7p0.jpg"), hint: "normal" },
  { src: img("Signal50/signal50_AiFrame_8_ufwozw.jpg"), hint: "normal" },
  // Showreel — 2 frames
  { src: cloudinaryVideoThumbnail("Signal50/signal50_ShowreelVID_en96qk.mp4", 3, 500), hint: "normal" },
  { src: cloudinaryVideoThumbnail("Signal50/signal50_ShowreelVID_en96qk.mp4", 12, 500), hint: "normal" },
  // Stage — 2 frames
  { src: cloudinaryVideoThumbnail("Signal50/signal50_stageVID_msii0s.mp4", 5, 500), hint: "normal" },
  { src: cloudinaryVideoThumbnail("Signal50/signal50_stageVID_msii0s.mp4", 12, 500), hint: "normal" },
  // Nominee — 2 frames
  { src: cloudinaryVideoThumbnail("Signal50/signal50_NomineeVID_sv6304.mp4", 8, 500), hint: "normal" },
  { src: cloudinaryVideoThumbnail("Signal50/signal50_NomineeVID_sv6304.mp4", 18, 500), hint: "normal" },
  // Winner — 2 frames
  { src: cloudinaryVideoThumbnail("Signal50/signal50_winnerVID_grqbpk.mp4", 5, 500), hint: "normal" },
  { src: cloudinaryVideoThumbnail("Signal50/signal50_winnerVID_grqbpk.mp4", 12, 500), hint: "normal" },
  // Decades — 1 frame each
  { src: cloudinaryVideoThumbnail("Signal50/shortvid_70_1_btz0jy.mp4", 1, 500), hint: "normal" },
  { src: cloudinaryVideoThumbnail("Signal50/shortvid_80_1_snsj6s.mp4", 1, 500), hint: "normal" },
  { src: cloudinaryVideoThumbnail("Signal50/shortvid_90_1_fdxy3q.mp4", 1, 500), hint: "normal" },
  { src: cloudinaryVideoThumbnail("Signal50/shortvid_00_1_ubtoko.mp4", 1, 500), hint: "normal" },
  { src: cloudinaryVideoThumbnail("Signal50/shortvid_10_1_qp87qq.mp4", 1, 500), hint: "normal" },
];

const PACKUP: SneakPeekEntry[] = [
  { src: img("packup_mockup_bmbgji_cc3cah.png", 700), hint: "wide" },
  { src: img("PackUpscreen01_wtwc56_zzhc41.png"), hint: "tall" },
  { src: img("PackUpscreen02_a3xf44_d3tfl2.png"), hint: "tall" },
  { src: img("PackUpscreen03_hjg0yu_vz5cas.png"), hint: "tall" },
  { src: img("PackUpscreen04_zc0lbt_lv8uoh.png"), hint: "tall" },
  { src: img("PackUpscreen05_xqg302_fn4bvy.png"), hint: "tall" },
  { src: img("PackUpscreen06_qzy1tt_rnem4o.png"), hint: "tall" },
  { src: img("PackUpscreen07_nqdxjc_hmrtdy.png"), hint: "tall" },
  { src: img("PackUpscreen08_go56fz_tnsuvx.png"), hint: "tall" },
];

const LUMINA: SneakPeekEntry[] = [
  { src: img("gates_tipi8p_ab0otx.jpg"), hint: "normal" },
  { src: img("fairymaze1_hpnn8s_iyckpo.jpg"), hint: "normal" },
  { src: img("swamp2_oqflgy_c9hr7v.jpg"), hint: "normal" },
  { src: img("river_view_v85kxl_y46dq9.jpg"), hint: "normal" },
  { src: img("portalwin_aneuma_hio0nf.jpg"), hint: "normal" },
  { src: img("start_d6hknt_ebrz5b.jpg"), hint: "normal" },
  { src: img("run1_mlpq80_zomihb.jpg"), hint: "normal" },
];

export const SNEAK_PEEK_POOL: Record<SneakPeekProjectId, SneakPeekEntry[]> = {
  lumina: LUMINA,
  ogen: OGEN,
  packup: PACKUP,
  nabat: NABAT,
  signal50: SIGNAL50,
};

export function pickRandomSneakPeek(
  projectId: SneakPeekProjectId,
  excludeSrc?: string | null,
): SneakPeekEntry | null {
  const pool = SNEAK_PEEK_POOL[projectId];
  if (!pool.length) return null;
  if (pool.length === 1) return pool[0];
  const candidates = excludeSrc ? pool.filter((e) => e.src !== excludeSrc) : pool;
  const list = candidates.length ? candidates : pool;
  return list[Math.floor(Math.random() * list.length)] ?? null;
}
