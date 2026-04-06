import { useEffect, useRef, useCallback, useState } from "react";

import {
  stickyTitleClass,
  projectNameClass,
  subTitleClass,
  smallTitleClass,
  bodyTextClass,
} from "../lib/typography";
import {
  sectionPageGridStretchClass,
  sectionColumnPaddingClass,
} from "../lib/sectionLayout";
import { PageGrid } from "../components/PageGrid";
import { ProjectNav } from "../components/ProjectNav";
import { DragCarousel, PlaceholderCard } from "./lumina/DragCarousel";
import { AreaGates } from "./lumina/AreaGates";
import { FbxModelViewer } from "./lumina/FbxModelViewer";
import { RandomSoundPlayer } from "./lumina/RandomSoundPlayer";
import { ColorPaletteGrid } from "./lumina/ColorPaletteGrid";
import { AutoPlayVideo } from "./lumina/AutoPlayVideo";
import { VisualStyleGallery } from "./lumina/VisualStyleGallery";
import { MuteProvider, MuteButton } from "./lumina/MuteContext";
import { cloudinaryUrl } from "../lib/cloudinary";

const COVER_VIDEO = cloudinaryUrl("main_menu_cropped_k9egsm.mp4", { resourceType: "video" });
const MUSHROOM_IMG = cloudinaryUrl("pink_mushroom_big_w7mnyr_zlet1k.png");
const MIA_GLB = cloudinaryUrl("Meshy_AI_Red_Haired_Doll_0404113848_texture_ktgehj_zxovsf.glb", { raw: true });

/* ─── Sticky title column (reusable pattern from PackUp) ─── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex md:flex-col md:items-start pb-4 md:pb-8">
      <h2 className={`${stickyTitleClass} leading-none -mt-1`}>{children}</h2>
    </div>
  );
}

function ContentColumn({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-12 md:gap-16 ${sectionColumnPaddingClass}`}
    >
      {children}
    </div>
  );
}

function Divider() {
  return <div className="w-full h-px bg-[#2200b8]" />;
}

/* ─── Expandable prompt component for character creation ─── */
function ExpandablePrompt() {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left cursor-pointer"
    >
      <p className="font-['Bricolage_Grotesque'] font-normal text-[14px] text-[#2200b8] tracking-[0.42px]">
        {open ? (
          <>
            <span className="underline">Prompt</span>:{" "}
            <span className="font-light lowercase">
              "A stylized 3D game character model in a perfect full frontal
              T-pose view. The character is a mischievous water sprite with soft
              lavender skin and a rosy tint, large pointy ears, and is barefoot.
              Her deep magenta hair is tied up tightly in a practical high bun,
              clear of her neck. She is wearing a ragged, cut-edge crop top and a
              matching flowing, asymmetric skirt made of organic fabric in
              blended shades of pink and violet, with light blue swirls accenting
              the edges. Isolated on a solid black background with flat, even
              lighting for modeling reference. Hand-painted texture style."
            </span>
          </>
        ) : (
          "Prompt"
        )}
      </p>
    </button>
  );
}

function CoverVideo() {
  return <AutoPlayVideo src={COVER_VIDEO} className="w-full" />;
}

/* ═══════════════════════════════════════════════════════════════
   LUMINA FOREST PAGE
   ═══════════════════════════════════════════════════════════════ */

interface LuminaForestProps {
  onSelectSection: (id: string) => void;
  onReady?: () => void;
}

export default function LuminaForest({
  onSelectSection,
  onReady,
}: LuminaForestProps) {
  const readyFired = useRef(false);

  const signalReady = useCallback(() => {
    if (readyFired.current) return;
    readyFired.current = true;
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    signalReady();
  }, [signalReady]);

  return (
    <MuteProvider>
    <div className="flex flex-col">
      <MuteButton />
      {/* ════════════════════════════════════════════════════════
          HERO + CONCEPT  (min-h-screen)
          ════════════════════════════════════════════════════════ */}
      <div className="min-h-screen flex flex-col">
        {/* Hero Video Banner — placeholder */}
        <div className="w-full shrink-0 overflow-hidden bg-[#d9d9d9] h-[280px] md:h-[420px] flex items-center justify-center">
          <span className="text-[#999] text-lg font-['Bricolage_Grotesque'] select-none">
            Hero Video Placeholder
          </span>
        </div>

        <Divider />

        {/* Concept Section */}
        <section className="flex-1 flex flex-col justify-center">
          <PageGrid className={sectionPageGridStretchClass}>
            <SectionTitle>Concept</SectionTitle>

            <ContentColumn>
              {/* Title + subtitle + body + mushroom */}
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 flex flex-col gap-2">
                  <h3 className="font-['Bricolage_Grotesque'] font-bold text-[36px] text-[#2200b8] tracking-[1.5px] leading-[1.5]">
                    Lumina Forest
                  </h3>
                  <p className="font-['Bricolage_Grotesque'] font-normal text-[25px] text-[#2200b8] tracking-[1.5px] leading-[1.5]">
                    Explore a mystical world where shadows meet glow
                  </p>
                  <p className="font-['Bricolage_Grotesque'] font-light text-[18px] text-[#2200b8] tracking-[0.54px] leading-[1.5]">
                    Trapped within the mystical Lumina Forest, Mia must
                    reactivate the ancient portal to return home. To power the
                    gateway, she must retrieve three magical mushrooms by
                    overcoming the unique trials set by the forest's mysterious
                    guardians.
                  </p>
                </div>
                <img
                  src={MUSHROOM_IMG}
                  alt="Pink mushroom"
                  className="shrink-0 w-[80px] h-[75px] md:w-[100px] md:h-[94px] object-contain self-start"
                />
              </div>

              {/* Cover video — auto-plays when scrolled into view */}
              <CoverVideo />
            </ContentColumn>
          </PageGrid>
        </section>
      </div>

      <Divider />

      {/* ════════════════════════════════════════════════════════
          GAME STRUCTURE
          ════════════════════════════════════════════════════════ */}
      <section>
        <PageGrid className={sectionPageGridStretchClass}>
          <SectionTitle>Game Structure</SectionTitle>

          <ContentColumn>
            {/* ── Player ── */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 flex flex-col gap-4">
                  <h3 className="font-['Bricolage_Grotesque'] font-semibold text-[28px] text-[#2200b8] tracking-[1.4px]">Player</h3>
                  <p className="font-['Bricolage_Grotesque'] font-light text-[18px] text-[#2200b8] tracking-[0.54px] leading-[1.5]">
                    Mia is a lost girl who has wandered into the depths of the
                    mystical Lumina Forest. Her mission is to find the three
                    magical mushrooms and activate the portal that will finally
                    lead her back home.
                  </p>
                </div>
                <FbxModelViewer
                  url={MIA_GLB}
                  label="Mia"
                  transparent
                  className="shrink-0 w-[220px] h-[220px] md:w-[280px] md:h-[280px] self-start"
                />
              </div>

              <DragCarousel>
                {["girl1_w4xrix.mp4", "girl3_wor2gy.mp4", "girlrun_zzplzi.mp4"].map((vid) => (
                  <AutoPlayVideo
                    key={vid}
                    src={cloudinaryUrl(vid, { resourceType: "video" })}
                    className="w-[420px] md:w-[600px] h-[260px] md:h-[375px] shrink-0"
                  />
                ))}
              </DragCarousel>
            </div>

            {/* ── Areas ── */}
            <AreaGates />

            {/* ── Survival & Goals ── */}
            <div className="flex flex-col gap-6">
              <h3 className={subTitleClass}>Survival &amp; Goals</h3>

              <div className="flex flex-col gap-3">
                <div>
                  <p className={smallTitleClass}>Win</p>
                  <p className={bodyTextClass}>
                    Success is achieved by collecting all three magical mushrooms
                    and unlocking the final portal home.
                  </p>
                </div>
                <div>
                  <p className={smallTitleClass}>Lives</p>
                  <p className={bodyTextClass}>
                    The player starts with 3 life cycles (hearts).
                  </p>
                </div>
                <div>
                  <p className={smallTitleClass}>Lose</p>
                  <p className={bodyTextClass}>
                    Each collision with an obstacle reduces one life. Losing all
                    lives requires the player to lose the game.
                  </p>
                </div>
              </div>

              <DragCarousel>
                <AutoPlayVideo
                  src={cloudinaryUrl("lose_kf22fk_si13hr.mp4", { resourceType: "video" })}
                  className="w-[420px] md:w-[600px] h-[260px] md:h-[375px] shrink-0"
                />
                <AutoPlayVideo
                  src={cloudinaryUrl("win_neldwk_jmn0de.mp4", { resourceType: "video" })}
                  className="w-[420px] md:w-[600px] h-[260px] md:h-[375px] shrink-0"
                />
              </DragCarousel>
            </div>

            {/* ── Collectibles & Power-ups ── */}
            <div className="flex flex-col gap-6">
              <h3 className={subTitleClass}>Collectibles &amp; Power-ups</h3>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex gap-4 items-start">
                  <div className="w-[80px] h-[80px] bg-[#0d0439] rounded-[11px] shrink-0 flex items-center justify-center p-2">
                    <img
                      src={cloudinaryUrl("Heal_Mushroom_big_br83jq_guge4y.png")}
                      alt="Healing Mushroom"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className={smallTitleClass}>Healing Mushrooms</p>
                    <p className={bodyTextClass}>
                      Grant the player an extra life cycle to help them continue
                      their journey.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-[80px] h-[80px] bg-[#0d0439] rounded-[11px] shrink-0 flex items-center justify-center p-2">
                    <img
                      src={cloudinaryUrl("fireflies_big_ylnjqs_d0s6t3.png")}
                      alt="Fireflies"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className={smallTitleClass}>Fireflies</p>
                    <p className={bodyTextClass}>
                      Enhance the player's light, helping them navigate the dark
                      environment more effectively.
                    </p>
                  </div>
                </div>
              </div>

              <DragCarousel>
                <AutoPlayVideo
                  src={cloudinaryUrl("healing_mushroom_o6ijeb_rwwvoy.mp4", { resourceType: "video" })}
                  className="w-[420px] md:w-[600px] h-[260px] md:h-[375px] shrink-0"
                />
                <AutoPlayVideo
                  src={cloudinaryUrl("fireflies_ramsl3_e5d8qj.mp4", { resourceType: "video" })}
                  className="w-[420px] md:w-[600px] h-[260px] md:h-[375px] shrink-0"
                />
              </DragCarousel>
            </div>
          </ContentColumn>
        </PageGrid>
      </section>

      <Divider />

      {/* ════════════════════════════════════════════════════════
          DESIGN
          ════════════════════════════════════════════════════════ */}
      <section>
        <PageGrid className={sectionPageGridStretchClass}>
          <SectionTitle>Design</SectionTitle>

          <ContentColumn>
            {/* Intro text (before sub-title) */}
            <p className={`${smallTitleClass} leading-[1.5]`}>
              An immersive experience that pulls the player into an enchanted
              realm, where the freedom to wander and discover meets a compelling
              goal and a series of obstacles to overcome.
            </p>

            {/* ── Visual Style ── */}
            <div className="flex flex-col gap-4">
              <h3 className={subTitleClass}>Visual Style</h3>
              <p className={bodyTextClass}>
                A mix of Realistic Environment and Stylized 3D Objects, creating
                a fairytale world that balances dark mystery with childhood
                innocence.
              </p>
              <VisualStyleGallery />
            </div>

            {/* ── GameObjects ── */}
            <div className="flex flex-col gap-4">
              <p className={bodyTextClass}>
                I combined collected environmental assets (trees, plants, and
                stones) with custom-made objects I created specifically to fit
                each unique game zone.
              </p>
              <h3 className={smallTitleClass}>GameObjects</h3>
              <DragCarousel>
                {[
                  "gmobjct_yellowarch_hnehz5_bczq7t.png",
                  "gmobjct_greenarch_wyteim_atgikp.png",
                  "gmobjct_pinkarch_tnze8t_nrhupy.png",
                  "gmobjct_fairyhouse_magnnn_otaoue.png",
                  "gmobjct_stonegate_ohgjcj_bkpauk.png",
                  "gmobjct_swamptree_fliqcl_mexet4.png",
                  "gmobjct_bridge_unk2np_g1673z.png",
                  "gmobjct_magicstamp_r3oh4z_uqlfto.png",
                  "gmobjct_riverlog_fanjla_revyi2.png",
                  "gmobjct_lilyflower_j4wbyc_rgq5b5.png",
                  "gmobjct_lilypad_lvuml2_axhlht.png",
                ].map((img) => (
                  <img
                    key={img}
                    src={cloudinaryUrl(img)}
                    alt=""
                    className="h-[160px] md:h-[210px] w-auto rounded-[14px] object-cover shrink-0 pointer-events-none"
                  />
                ))}
              </DragCarousel>
            </div>

            {/* ── Characters ── */}
            <div className="flex flex-col gap-4">
              <h3 className={smallTitleClass}>Characters</h3>
              <DragCarousel>
                {[
                  "mia_player_img_gkju7e_xh0gzf.png",
                  "fairy1_img_z0fzur_rbgdjf.png",
                  "fairy2_img_ua4lym_jjxn69.png",
                  "fairy3_img_sts9sz_wda0lh.png",
                  "troll_img_rbpcej_bfzpz0.png",
                  "elf_img_w4j7sd_c9tsqg.png",
                ].map((img) => (
                  <img
                    key={img}
                    src={cloudinaryUrl(img)}
                    alt=""
                    className="h-[240px] md:h-[340px] w-auto rounded-[12px] object-cover shrink-0 pointer-events-none"
                  />
                ))}
              </DragCarousel>
            </div>

            {/* ── Color Palette & Lighting ── */}
            <div className="flex flex-col gap-6">
              <h3 className={subTitleClass}>Color Palette &amp; Lighting</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                <div className="flex flex-col gap-2">
                  <p className={smallTitleClass}>Dark Environment</p>
                  <p className={bodyTextClass}>
                    Cool, dark tones create a mysterious forest atmosphere
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className={smallTitleClass}>Vibrant Objectives</p>
                  <p className={bodyTextClass}>
                    Glowing neon elements highlight goals and provide a magical
                    feel against the darkness.
                  </p>
                </div>
              </div>

              <p className={bodyTextClass}>
                This color choice balances dark lighting with neon glows to evoke
                a sense of childhood wonder and safety, creating an environment
                that feels simultaneously threatening and inviting.
              </p>

              <div className="flex flex-col lg:flex-row gap-8 lg:items-stretch">
                <ColorPaletteGrid className="lg:h-[360px] shrink-0" />
                <img
                  src={cloudinaryUrl("gates_tipi8p_ab0otx.jpg")}
                  alt=""
                  className="w-full lg:flex-1 h-[260px] lg:h-[360px] rounded-[12px] object-cover min-w-0"
                />
              </div>
            </div>

            {/* ── UI Design ── */}
            <div className="flex flex-col gap-6">
              <h3 className={subTitleClass}>UI Design</h3>
              <p className={bodyTextClass}>
                I designed the UI to continue the game's hybrid theme, blending
                dark forest elements with a childhood aesthetic
              </p>

              <div className="flex flex-col gap-4">
                <p className={smallTitleClass}>Elements</p>
                <p className={bodyTextClass}>
                  Text frames and buttons feature a dark forest style with
                  organic motifs. In addition, I created a custom cursor with two
                  states — normal and interaction modes, appearing only when the
                  player can interact with buttons.
                </p>
                <div className="flex flex-col md:flex-row gap-6 md:gap-20 items-center md:items-start justify-center my-6">
                  <div className="flex flex-col gap-4 items-center md:items-start">
                    <img
                      src={cloudinaryUrl("button_1_qu0rtf.png")}
                      alt=""
                      className="h-[50px] md:h-[70px] w-auto object-contain"
                    />
                    <div className="flex gap-4">
                      <img
                        src={cloudinaryUrl("cursur_1_vysh1r.png")}
                        alt=""
                        className="h-[50px] md:h-[70px] w-auto object-contain"
                      />
                      <img
                        src={cloudinaryUrl("click_cursur_1_fcide4.png")}
                        alt=""
                        className="h-[50px] md:h-[70px] w-auto object-contain"
                      />
                    </div>
                  </div>
                  <img
                    src={cloudinaryUrl("text_box_1_xik35k.png")}
                    alt=""
                    className="h-[140px] md:h-[180px] w-auto object-contain"
                  />
                </div>
                <AutoPlayVideo
                  src={cloudinaryUrl("story_oyobf7_tcitnq.mp4", { resourceType: "video" })}
                  className="w-full h-[320px] md:h-[480px]"
                />
              </div>
            </div>

            {/* ── Sprites ── */}
            <div className="flex flex-col gap-4">
              <p className={smallTitleClass}>sprites</p>
              <p className={bodyTextClass}>
                I created all the game sprites in a uniform illustrated style,
                ensuring a consistent and cohesive visual language throughout the
                project.
              </p>
              <div className="flex flex-col gap-0">
                <DragCarousel className="bg-[#0d0439] rounded-[7px] px-4 py-4 md:px-6 md:py-5">
                  {[
                    "sprite_yellow_mushroom_wbx2er_wrvtic.png",
                    "sprite_blue_mushroom_edj95u_aewdfw.png",
                    "sprite_pink_mushroom_pbseb2_asriqy.png",
                    "sprite_arch_yellow_xqjimj_uegueb.png",
                    "sprite_arch_yellow-1_e6buys_imudta.png",
                    "sprite_arch_yellow-2_cezz5w_gvvsds.png",
                    "sprite_Portal_1_mbkfc6_of3hsv.png",
                    "sprite_Heart_life_qhp8sb_msqgyy.png",
                    "sprite_fireflies_y3w1yo_chekri.png",
                    "sprite_heal_Mushroom_nyc3bl_sq7gsb.png",
                    "sprite_poisonmushroom_o2zidl_x3dfo1.png",
                    "sprite_swamp_ju4zed_owwkf5.png",
                    "sprite_log_mzfgs4_ohynjg.png",
                  ].map((img) => (
                    <img
                      key={img}
                      src={cloudinaryUrl(img)}
                      alt=""
                      className="h-[60px] md:h-[100px] w-auto object-contain shrink-0 pointer-events-none select-none"
                      draggable={false}
                    />
                  ))}
                </DragCarousel>
                <div className="flex justify-between mt-2">
                  <img
                    src={cloudinaryUrl("mushroom_bar_oguwty_jgnf9j.png")}
                    alt=""
                    className="h-[60px] md:h-[90px] max-w-[48%] w-auto object-contain"
                  />
                  <img
                    src={cloudinaryUrl("life_bar_kcunbr_k0mr8d.png")}
                    alt=""
                    className="h-[60px] md:h-[90px] max-w-[48%] w-auto object-contain"
                  />
                </div>
              </div>
            </div>

            {/* ── Typography ── */}
            <div className="flex flex-col gap-4">
              <p className={smallTitleClass}>Typography</p>
              <p className={bodyTextClass}>
                I selected a font inspired by Tim Burton's Alice in Wonderland to
                reinforce the dark forest atmosphere and overall magical
                aesthetic.
              </p>

              <div className="flex flex-col items-center gap-6 md:gap-8">
                <div className="bg-[#0d0439] rounded-[8px] px-4 py-2 md:px-6 md:py-3">
                  <img
                    src={cloudinaryUrl("LuMina_FoRest_logo_ca5aur_yat0j0.png")}
                    alt=""
                    className="h-[24px] md:h-[35px] w-auto object-contain"
                  />
                </div>
                <div className="flex flex-wrap gap-6 md:gap-8 justify-center">
                  {[
                    "btn_start_pwwpbq_v1vjfe.png",
                    "btn_quit_dxbnl3_dd4nyu.png",
                    "btn_tutorial_vxwliu_ya4myf.png",
                  ].map((img) => (
                    <img
                      key={img}
                      src={cloudinaryUrl(img)}
                      alt=""
                      className="h-[50px] md:h-[70px] w-auto object-contain"
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-6 md:gap-8 justify-center">
                  {[
                    "btn_resume_yuquf7_usjwdz.png",
                    "btn_mainmenu_pvgedf_znnfwn.png",
                  ].map((img) => (
                    <img
                      key={img}
                      src={cloudinaryUrl(img)}
                      alt=""
                      className="h-[50px] md:h-[70px] w-auto object-contain"
                    />
                  ))}
                </div>
              </div>
            </div>
          </ContentColumn>
        </PageGrid>
      </section>

      <Divider />

      {/* ════════════════════════════════════════════════════════
          AI INTEGRATION
          ════════════════════════════════════════════════════════ */}
      <section>
        <PageGrid className={sectionPageGridStretchClass}>
          <SectionTitle>AI Integration</SectionTitle>

          <ContentColumn>
            <p className={`${smallTitleClass} leading-[1.5]`}>
              I utilized various AI tools to create a comprehensive and immersive
              gaming experience.
            </p>

            {/* ── GameObjects (AI) ── */}
            <div className="flex flex-col gap-6">
              <h3 className={smallTitleClass}>GameObjects</h3>
              <p className={bodyTextClass}>
                For Game Objects, I used{" "}
                <span className="font-medium">
                  Nano Banana, Meshy 3D, and Adobe Mixamo.
                </span>{" "}
                I generated 3D-styled asset images using Nano Banana, converted
                them into functional 3D objects with Meshy 3D, and animated the
                characters using Adobe Mixamo.
              </p>

              {/* Column labels — desktop only */}
              <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] gap-6">
                <p className={bodyTextClass}>
                  3D styled images created with Nano Banana
                </p>
                <div className="w-[100px]" />
                <p className={bodyTextClass}>3D models created with Meshy</p>
              </div>

              {/* Fairyhouse: Nano Banana → Meshy 3D */}
              <p className={`${bodyTextClass} lg:hidden`}>Nano Banana</p>
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 lg:gap-6 items-center">
                <img
                  src={cloudinaryUrl("img_3dfairyhouse_rrswv7_xjnf70.png")}
                  alt=""
                  className="w-full h-[160px] lg:h-[210px] object-contain rounded-[8px]"
                />
                <svg width="100" height="12" viewBox="0 0 100 12" fill="none" className="self-center hidden lg:block">
                  <line x1="0" y1="6" x2="90" y2="6" stroke="#2200b8" strokeWidth="1.5" />
                  <polygon points="90,2 100,6 90,10" fill="#2200b8" />
                </svg>
                <svg width="12" height="32" viewBox="0 0 12 32" fill="none" className="self-center mx-auto lg:hidden">
                  <line x1="6" y1="0" x2="6" y2="24" stroke="#2200b8" strokeWidth="1.5" />
                  <polygon points="2,24 6,32 10,24" fill="#2200b8" />
                </svg>
                <p className={`${bodyTextClass} lg:hidden`}>Meshy 3D</p>
                <FbxModelViewer
                  url={cloudinaryUrl("Meshy_AI_Enchanted_Treehouse_0404113704_texture_fm05fe_dsjaxg.glb", { raw: true })}
                  label="Treehouse 3D"
                  transparent
                  className="h-[200px] lg:h-[300px] lg:-ml-10"
                />
              </div>

              {/* Bridge: Nano Banana → Meshy 3D */}
              <p className={`${bodyTextClass} lg:hidden mt-4`}>Nano Banana</p>
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 lg:gap-6 items-center">
                <img
                  src={cloudinaryUrl("img_3dbridge_e0qvcp_bhzymp.png")}
                  alt=""
                  className="w-full h-[160px] lg:h-[210px] object-contain rounded-[8px]"
                />
                <svg width="100" height="12" viewBox="0 0 100 12" fill="none" className="self-center hidden lg:block">
                  <line x1="0" y1="6" x2="90" y2="6" stroke="#2200b8" strokeWidth="1.5" />
                  <polygon points="90,2 100,6 90,10" fill="#2200b8" />
                </svg>
                <svg width="12" height="32" viewBox="0 0 12 32" fill="none" className="self-center mx-auto lg:hidden">
                  <line x1="6" y1="0" x2="6" y2="24" stroke="#2200b8" strokeWidth="1.5" />
                  <polygon points="2,24 6,32 10,24" fill="#2200b8" />
                </svg>
                <p className={`${bodyTextClass} lg:hidden`}>Meshy 3D</p>
                <FbxModelViewer
                  url={cloudinaryUrl("Meshy_AI_Enchanted_Forest_Brid_0404114828_texture-v7_xhyovc_t49axu.glb", { raw: true })}
                  label="Bridge 3D"
                  transparent
                  className="h-[200px] lg:h-[300px]"
                />
              </div>
            </div>

            {/* ── Character Creation Process ── */}
            <div className="flex flex-col gap-8">
              <h3 className={smallTitleClass}>Character Creation Process</h3>

              {/* Step 1: ChatGPT prompt */}
              <div className="flex flex-col gap-4">
                <p className={bodyTextClass}>
                  I began by crafting and iteratively refining prompts with
                  ChatGPT to achieve the precise visual outcome I envisioned.
                </p>
                <ExpandablePrompt />
                <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    "elf01_cviril_cmgv5b.png",
                    "elf02_uw9evg_qzddr5.png",
                    "elf03_oyqaxc_jid2ih.png",
                    "elf04_olbnzi_ynzzcf.png",
                    "elf05_eyqjle_omxseb.png",
                    "elf06_vezcyy_k9nchs.png",
                  ].map((file) => (
                    <img
                      key={file}
                      src={cloudinaryUrl(file)}
                      alt=""
                      className="w-full h-auto object-contain rounded-[14px]"
                    />
                  ))}
                </div>
              </div>

              {/* Step 2: Meshy 3D */}
              <div className="flex flex-col gap-4">
                <p className={bodyTextClass}>
                  The final image was then processed through Meshy 3D to generate
                  a functional 3D model.
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 lg:gap-6 items-center">
                  <img
                    src={cloudinaryUrl("elf_final_estugk_rty43d.png")}
                    alt=""
                    className="w-full h-[300px] lg:h-[400px] object-contain rounded-[12px]"
                  />
                  <svg width="100" height="12" viewBox="0 0 100 12" fill="none" className="self-center hidden lg:block">
                    <line x1="0" y1="6" x2="90" y2="6" stroke="#2200b8" strokeWidth="1.5" />
                    <polygon points="90,2 100,6 90,10" fill="#2200b8" />
                  </svg>
                  <svg width="12" height="32" viewBox="0 0 12 32" fill="none" className="self-center mx-auto lg:hidden">
                    <line x1="6" y1="0" x2="6" y2="24" stroke="#2200b8" strokeWidth="1.5" />
                    <polygon points="2,24 6,32 10,24" fill="#2200b8" />
                  </svg>
                  <FbxModelViewer
                    url={cloudinaryUrl("Meshy_AI_Floral_Sprite_0404113616_texture_b4ydnh_a5ywwl.glb", { raw: true })}
                    label="Elf 3D"
                    transparent
                    className="h-[300px] lg:h-[400px]"
                  />
                </div>
              </div>

              {/* Step 3: Mixamo */}
              <div className="flex flex-col gap-4">
                <p className={bodyTextClass}>
                  Finally, I imported the model into Adobe Mixamo to rig and
                  animate the character, bringing it to life.
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 lg:gap-6 items-center">
                  <AutoPlayVideo
                    src={cloudinaryUrl("elf_mixamo_animation_kdqgg6_hlbivj.mp4", { resourceType: "video" })}
                    className="w-full h-[300px] lg:h-[400px] rounded-[12px] object-cover"
                    alwaysMuted
                  />
                  <svg width="100" height="12" viewBox="0 0 100 12" fill="none" className="self-center hidden lg:block">
                    <line x1="0" y1="6" x2="90" y2="6" stroke="#2200b8" strokeWidth="1.5" />
                    <polygon points="90,2 100,6 90,10" fill="#2200b8" />
                  </svg>
                  <svg width="12" height="32" viewBox="0 0 12 32" fill="none" className="self-center mx-auto lg:hidden">
                    <line x1="6" y1="0" x2="6" y2="24" stroke="#2200b8" strokeWidth="1.5" />
                    <polygon points="2,24 6,32 10,24" fill="#2200b8" />
                  </svg>
                  <AutoPlayVideo
                    src={cloudinaryUrl("elfanimation_rhrtu4_xifrcc.mp4", { resourceType: "video" })}
                    className="w-full h-[300px] lg:h-[400px] rounded-[12px] object-cover"
                    alwaysMuted
                  />
                </div>
              </div>
            </div>

            {/* ── AI Tools Details ── */}
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {/* UI */}
                <div className="flex flex-col gap-2">
                  <p className={smallTitleClass}>UI</p>
                  <p className={bodyTextClass}>
                    All UI elements were generated using{" "}
                    <span className="font-medium">Nano Banana</span> and
                    subsequently refined in Photoshop to ensure color consistency
                    and stylistic precision.
                  </p>
                </div>

                {/* Sound */}
                <div className="flex flex-col gap-4">
                  <p className={smallTitleClass}>Sound</p>
                  <p className={bodyTextClass}>
                    Sound effects were created using{" "}
                    <span className="font-medium">Kling</span> and{" "}
                    <span className="font-medium">Stable Audio</span>.
                  </p>
                  <RandomSoundPlayer sounds={[
                    cloudinaryUrl("Elf_Giggle_qluq1h_ru2heu.mp3", { resourceType: "video" }),
                    cloudinaryUrl("Elf_Speak_tbjnmu_kate5r.mp3", { resourceType: "video" }),
                    cloudinaryUrl("Fairies_whispering_3_z9jc3w_vg78nl.wav", { resourceType: "video" }),
                    cloudinaryUrl("Fairy_giggle_mkdl9z_ip1lm9.mp3", { resourceType: "video" }),
                    cloudinaryUrl("Fairy_Speak_4_sgkqdg_e638rp.mp3", { resourceType: "video" }),
                    cloudinaryUrl("Fairy_Whisper_NEW_wvp6pd_niny2q.mp3", { resourceType: "video" }),
                    cloudinaryUrl("Grumphy_Troll_Yelling_jieytp_an5nlh.mp3", { resourceType: "video" }),
                    cloudinaryUrl("Locked_Area_zv847c_gz7ism.mp3", { resourceType: "video" }),
                    cloudinaryUrl("ouch_SFX_e7lsn6_rrtvc5.mp3", { resourceType: "video" }),
                    cloudinaryUrl("Voice_Over_Story_5_mgf5xc_cvmiti.mp3", { resourceType: "video" }),
                    cloudinaryUrl("Water_Enter_SFX_uollls_fapqkv.wav", { resourceType: "video" }),
                    cloudinaryUrl("YOU_DID_IT_SFX_rallzr_tipkfz.mp3", { resourceType: "video" }),
                    cloudinaryUrl("YOU_LOSE_SFX_idbboz_p3hpxt.mp3", { resourceType: "video" }),
                  ]} />
                </div>
              </div>

              {/* Scripts */}
              <div className="flex flex-col gap-4">
                <p className={smallTitleClass}>Scripts</p>
                <p className={bodyTextClass}>
                  As part of the game development I have integrated scripts developed using{" "}
                  <span className="font-medium">ChatGPT</span> and{" "}
                  <span className="font-medium">Gemini</span>:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="font-['Bricolage_Grotesque'] font-normal text-[14px] text-[#2200b8] tracking-[0.5px]">
                        Life Events &amp; Hearts
                      </p>
                      <p className={bodyTextClass}>
                        Modified a standard health bar system into a 3-life
                        mechanic and linked it to visual heart sprites.
                      </p>
                    </div>
                    <div>
                      <p className="font-['Bricolage_Grotesque'] font-normal text-[14px] text-[#2200b8] tracking-[0.5px]">
                        Life Events with Checkpoint
                      </p>
                      <p className={bodyTextClass}>
                        Respawns the player at a designated point after taking
                        damage.
                      </p>
                    </div>
                    <div>
                      <p className="font-['Bricolage_Grotesque'] font-normal text-[14px] text-[#2200b8] tracking-[0.5px]">
                        Light Growth + Light Collectible
                      </p>
                      <p className={bodyTextClass}>
                        Increases the player's point light intensity by
                        collecting fireflies.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="font-['Bricolage_Grotesque'] font-normal text-[14px] text-[#2200b8] tracking-[0.5px]">
                        Fairy Float
                      </p>
                      <p className={bodyTextClass}>
                        An animation script for fairies, enabling floating
                        movement across the X, Y, and Z axes.
                      </p>
                    </div>
                    <div>
                      <p className="font-['Bricolage_Grotesque'] font-normal text-[14px] text-[#2200b8] tracking-[0.5px]">
                        Log Movement
                      </p>
                      <p className={bodyTextClass}>
                        Handles the movement of logs along the X-axis.
                      </p>
                    </div>
                    <div>
                      <p className="font-['Bricolage_Grotesque'] font-normal text-[14px] text-[#2200b8] tracking-[0.5px]">
                        Cinemachine Shake
                      </p>
                      <p className={bodyTextClass}>
                        Triggers camera shakes whenever the player is hit.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ContentColumn>
        </PageGrid>
      </section>

      {/* ── Project Navigation ── */}
      <ProjectNav currentProject="lumina" onSelectSection={onSelectSection} />
    </div>
    </MuteProvider>
  );
}
