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
import {
  gapContentClass,
  gapIntroClass,
  gapSubtitleClass,
  radiusMediaLgClass,
  radiusMediaSmClass,
  radiusVideoInlineClass,
} from "../lib/spacing";
import { PageGrid } from "../components/PageGrid";
import { MobileStickyTitle, TITLE_COL_DESKTOP_CLASS } from "../components/MobileStickyTitle";
import { PROJECT_HERO_VIDEO_SHELL_CLASS } from "../components/ProjectHeroVideo";
import { ProjectNav } from "../components/ProjectNav";
import { DragCarousel, PlaceholderCard } from "./lumina/DragCarousel";
import { AreaGates } from "./lumina/AreaGates";
import { FbxModelViewer } from "./lumina/FbxModelViewer";
import { RandomSoundPlayer } from "./lumina/RandomSoundPlayer";
import { ColorPaletteGrid } from "./lumina/ColorPaletteGrid";
import { AutoPlayVideo, videoCornerClipInlineStyle } from "./lumina/AutoPlayVideo";
import { VisualStyleGallery } from "./lumina/VisualStyleGallery";
import { CloudinaryImage } from "./lumina/CloudinaryImage";
import { MuteProvider, MuteButton, useMute } from "./lumina/MuteContext";
import { cloudinaryUrl } from "../lib/cloudinary";

const HERO_VIDEO = cloudinaryUrl("herobanner_lumina_eq8woo.mp4", { resourceType: "video" });
const HERO_VIDEO_POSTER = cloudinaryUrl("herobanner_skeleton_lumina_xy4szf.png");
const COVER_VIDEO = cloudinaryUrl("main_menu_cropped_k9egsm.mp4", { resourceType: "video" });
const MUSHROOM_IMG = cloudinaryUrl("pink_mushroom_big_w7mnyr_zlet1k.png");

const LUMINA_CONCEPT_SUBTITLE_BEFORE = "Explore a mystical";
const LUMINA_CONCEPT_SUBTITLE_AFTER = "world where shadows meet glow";
const MIA_GLB = cloudinaryUrl("Meshy_AI_mia_player_0407135426_texture-v1_hqd2cz.glb", { raw: true });
const ELF_MIXAMO_VIDEO = cloudinaryUrl("elf_mixamo_animation_vhvtt5.mp4", { resourceType: "video" });

/* ─── Sticky title column (reusable pattern from PackUp) ─── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className={TITLE_COL_DESKTOP_CLASS}>
      <h2 className={`${stickyTitleClass} leading-none -mt-1`}>{children}</h2>
    </div>
  );
}

function ContentColumn({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col ${gapContentClass} ${sectionColumnPaddingClass}`}
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

function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { muted } = useMute();

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          v.play().catch(() => {});
        } else if (!v.paused) {
          v.pause();
        }
      },
      { threshold: 0 },
    );
    observer.observe(v);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={PROJECT_HERO_VIDEO_SHELL_CLASS}>
      <video
        ref={videoRef}
        src={HERO_VIDEO}
        poster={HERO_VIDEO_POSTER}
        muted={muted}
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}

function CoverVideo() {
  return <AutoPlayVideo src={COVER_VIDEO} className="w-full" alwaysMuted />;
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
    <div className="flex flex-col overflow-x-hidden">
      <MuteButton />
      {/* ════════════════════════════════════════════════════════
          HERO + CONCEPT  (min-h-screen)
          ════════════════════════════════════════════════════════ */}
      <div className="md:min-h-screen flex flex-col">
        {/* Hero Video Banner */}
        <HeroVideo />

        {/* Concept Section */}
        <section className="flex-1 flex flex-col justify-start md:justify-center">
          <MobileStickyTitle>Concept</MobileStickyTitle>
          <PageGrid className={sectionPageGridStretchClass}>
            <SectionTitle>Concept</SectionTitle>

            <ContentColumn>
              {/* Title + subtitle + body + mushroom */}
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 flex flex-col gap-2">
                  <h3 className={projectNameClass}>
                    Lumina Forest
                  </h3>
                  <div className={`flex flex-col ${gapSubtitleClass}`}>
                    <div className="flex items-start gap-3 md:hidden">
                      <p className={`${subTitleClass} flex-1 min-w-0`}>
                        {LUMINA_CONCEPT_SUBTITLE_BEFORE}{" "}
                        {LUMINA_CONCEPT_SUBTITLE_AFTER}
                      </p>
                      <CloudinaryImage
                        src={MUSHROOM_IMG}
                        alt=""
                        aria-hidden
                        wrapperClassName="shrink-0 self-center -translate-x-9 -translate-y-5"
                        className="w-[74px] h-[70px] object-contain"
                      />
                    </div>
                    <p className={`${subTitleClass} hidden md:block`}>
                      {LUMINA_CONCEPT_SUBTITLE_BEFORE}{" "}
                      {LUMINA_CONCEPT_SUBTITLE_AFTER}
                    </p>
                    <p className={bodyTextClass}>
                      Trapped within the mystical Lumina Forest, Mia must
                      reactivate the ancient portal to return home.
                      <br />To power the gateway, she must retrieve three magical mushrooms by
                      overcoming the unique trials set by the forest's mysterious
                      guardians.
                    </p>
                  </div>
                </div>
                <CloudinaryImage
                  src={MUSHROOM_IMG}
                  alt="Pink mushroom"
                  wrapperClassName="hidden shrink-0 self-center md:block md:mt-6"
                  className="w-[100px] h-[94px] object-contain"
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
        <MobileStickyTitle>Game Structure</MobileStickyTitle>
        <PageGrid className={sectionPageGridStretchClass}>
          <SectionTitle>Game Structure</SectionTitle>

          <ContentColumn>
            {/* ── Player ── */}
            <div className="flex flex-col">
              <div className="grid grid-cols-[3fr_2fr] gap-x-3 md:grid-cols-5 md:gap-x-[var(--grid-gutter)] items-start">
                <div
                  className={`flex flex-col ${gapSubtitleClass} md:col-span-3 min-w-0`}
                >
                  <h3 className={subTitleClass}>Player</h3>
                  <p className={`${bodyTextClass} mb-3`}>
                    Mia is a lost girl who has wandered into the depths of the
                    mystical Lumina Forest.
                    <br className="md:hidden" />
                    Her mission is to find the three
                    magical mushrooms and activate the portal that will finally
                    lead her back home.
                  </p>
                </div>
                <FbxModelViewer
                  url={MIA_GLB}
                  label="Mia"
                  transparent
                  className="mx-auto max-w-[length:var(--media-glb-max-w)] h-[length:var(--media-glb-h)] shrink-0 md:mx-0 md:col-span-2 self-start md:justify-self-end -mt-4 md:-mt-20"
                />
              </div>

              <DragCarousel className="mt-3 md:-mt-4">
                {["girl1_w4xrix.mp4", "girl3_wor2gy.mp4", "girlrun_zzplzi.mp4"].map((vid) => (
                  <AutoPlayVideo
                    key={vid}
                    src={cloudinaryUrl(vid, { resourceType: "video" })}
                    nativeFit
                    className="w-[85vw] md:w-[calc((100vw-2*var(--grid-margin)-var(--grid-gutter))/2)] shrink-0"
                  />
                ))}
              </DragCarousel>
            </div>
          </ContentColumn>

          {/* ── Areas ── */}
          <AreaGates />

          <ContentColumn>
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
                  nativeFit
                  className="w-[85vw] md:w-[calc((100vw-2*var(--grid-margin)-var(--grid-gutter))/2)] shrink-0"
                />
                <AutoPlayVideo
                  src={cloudinaryUrl("win_neldwk_jmn0de.mp4", { resourceType: "video" })}
                  nativeFit
                  className="w-[85vw] md:w-[calc((100vw-2*var(--grid-margin)-var(--grid-gutter))/2)] shrink-0"
                />
              </DragCarousel>
            </div>

            {/* ── Collectibles & Power-ups ── */}
            <div className="flex flex-col gap-6">
              <h3 className={subTitleClass}>Collectibles &amp; Power-ups</h3>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex gap-4 items-start">
                  <div className="w-[80px] h-[80px] bg-[#0d0439] rounded-[11px] shrink-0 flex items-center justify-center p-2">
                    <CloudinaryImage
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
                    <CloudinaryImage
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
                  nativeFit
                  className="w-[85vw] md:w-[calc((100vw-2*var(--grid-margin)-var(--grid-gutter))/2)] shrink-0"
                />
                <AutoPlayVideo
                  src={cloudinaryUrl("fireflies_ramsl3_e5d8qj.mp4", { resourceType: "video" })}
                  nativeFit
                  className="w-[85vw] md:w-[calc((100vw-2*var(--grid-margin)-var(--grid-gutter))/2)] shrink-0"
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
        <MobileStickyTitle>Design</MobileStickyTitle>
        <PageGrid className={sectionPageGridStretchClass}>
          <SectionTitle>Design</SectionTitle>

          <ContentColumn>
            {/* Intro: full content width (page cols 3–7); last word may extend past line box */}
            <p
              className={`${smallTitleClass} leading-[1.5] min-w-0`}
            >
              An immersive experience that pulls the player into an enchanted realm,
              where the freedom to wander and discover meets a compelling goal and a
              series of obstacles to{" "}
              <span className="whitespace-nowrap">overcome.</span>
            </p>

            {/* ── Visual Style ── */}
            <div className={`flex flex-col ${gapSubtitleClass}`}>
              <h3 className={subTitleClass}>Visual Style</h3>
              <div className="md:grid md:grid-cols-5 md:gap-x-[var(--grid-gutter)]">
                <p className={`${bodyTextClass} md:col-span-4 min-w-0 [text-wrap:pretty]`}>
                  A mix of Realistic Environment and Stylized 3D Objects, creating
                  a fairytale world that balances dark mystery with childhood
                  innocence.
                </p>
              </div>
              <VisualStyleGallery />
            </div>

            {/* ── GameObjects ── */}
            <div className={`flex flex-col ${gapSubtitleClass}`}>
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
                  <CloudinaryImage
                    key={img}
                    src={cloudinaryUrl(img)}
                    alt=""
                    className={`h-[length:var(--media-inline-figure-h)] w-auto ${radiusMediaLgClass} object-cover shrink-0 pointer-events-none`}
                  />
                ))}
              </DragCarousel>
            </div>

            {/* ── Characters ── */}
            <div className={`flex flex-col ${gapSubtitleClass}`}>
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
                  <CloudinaryImage
                    key={img}
                    src={cloudinaryUrl(img)}
                    alt=""
                    className={`h-[length:var(--media-flourish-h)] w-auto ${radiusVideoInlineClass} object-cover shrink-0 pointer-events-none`}
                  />
                ))}
              </DragCarousel>
            </div>

            {/* ── Color Palette & Lighting ── */}
            <div className="flex flex-col gap-6">
              <h3 className={subTitleClass}>Color Palette &amp; Lighting</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                <div className={`flex flex-col ${gapSubtitleClass}`}>
                  <p className={smallTitleClass}>Dark Environment</p>
                  <p className={bodyTextClass}>
                    Cool, dark tones create a mysterious forest atmosphere
                  </p>
                </div>
                <div className={`flex flex-col ${gapSubtitleClass}`}>
                  <p className={smallTitleClass}>Vibrant Objectives</p>
                  <p className={bodyTextClass}>
                    Glowing neon elements highlight goals and provide a magical
                    feel against the darkness.
                  </p>
                </div>
              </div>

              <p className={bodyTextClass}>
                This color choice balances dark lighting with neon glows to evoke
                a sense of childhood wonder and safety,<br/> creating an environment
                that feels simultaneously threatening and inviting.
              </p>

              <div className="flex flex-col lg:grid lg:grid-cols-[1fr_4fr] gap-[var(--grid-gutter)] lg:items-stretch">
                <ColorPaletteGrid className="shrink-0 lg:h-full" />
                <CloudinaryImage
                  src={cloudinaryUrl("gates_tipi8p_ab0otx.jpg")}
                  alt=""
                  className={`w-full h-auto ${radiusVideoInlineClass} object-contain min-w-0`}
                />
              </div>
            </div>

            {/* ── UI Design ── */}
            <div className="flex flex-col gap-6">
              <h3 className={subTitleClass}>UI Design</h3>
              <div className="md:grid md:grid-cols-5 md:gap-x-[var(--grid-gutter)]">
                <p
                  className={`${bodyTextClass} md:col-span-5 min-w-0`}
                >
                  I designed the UI to continue the game&apos;s hybrid theme, blending dark
                  forest elements with a childhood aesthetic.
                </p>
              </div>

              <div className={`flex flex-col ${gapSubtitleClass}`}>
                <p className={smallTitleClass}>Elements</p>
                <div className="lg:grid lg:grid-cols-5 lg:gap-x-[var(--grid-gutter)]">
                  <p className={`${bodyTextClass} lg:col-span-4 min-w-0 [text-wrap:pretty]`}>
                    Text frames and buttons feature a dark forest style with
                    organic motifs. In addition, I created a custom cursor with two
                    states — normal and interaction modes, appearing only when the
                    player can interact with buttons.
                  </p>
                </div>
                {/* Button frame + cursors | text box — stacked until lg */}
                <div className="my-6 grid w-full min-w-0 grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-x-[var(--grid-gutter)] lg:items-start">
                  <div className="mx-auto flex w-full min-w-0 max-w-full flex-col-reverse gap-4 lg:flex-col lg:col-span-2 lg:mx-0">
                    <CloudinaryImage
                      src={cloudinaryUrl("button_1_qu0rtf.png")}
                      alt=""
                      wrapperClassName="w-full min-w-0 lg:mt-8"
                      className="h-auto max-h-[96px] w-full object-contain object-center lg:object-left lg:max-h-[132px]"
                    />
                    <div className="flex w-full min-w-0 shrink-0 items-center justify-center gap-4 lg:grid lg:grid-cols-2 lg:gap-x-[var(--grid-gutter)] lg:justify-items-center">
                      <CloudinaryImage
                        src={cloudinaryUrl("cursur_1_vysh1r.png")}
                        alt=""
                        className="h-[50px] lg:h-[70px] w-auto object-contain shrink-0"
                      />
                      <CloudinaryImage
                        src={cloudinaryUrl("click_cursur_1_fcide4.png")}
                        alt=""
                        className="h-[58px] lg:h-[88px] w-auto object-contain shrink-0"
                      />
                    </div>
                  </div>
                  <CloudinaryImage
                    src={cloudinaryUrl("text_box_1_xik35k.png")}
                    alt=""
                    wrapperClassName="mx-auto min-w-0 w-full max-w-full lg:col-span-3 lg:mx-0"
                    className="h-[220px] w-full max-w-full object-contain lg:h-[280px]"
                  />
                </div>
                <AutoPlayVideo
                  src={cloudinaryUrl("story_oyobf7_tcitnq.mp4", { resourceType: "video" })}
                  nativeFit
                  className="w-full"
                />
              </div>
            </div>

            {/* ── Sprites ── */}
            <div className={`flex flex-col ${gapSubtitleClass}`}>
              <p className={smallTitleClass}>sprites</p>
              <div className="md:grid md:grid-cols-5 md:gap-x-[var(--grid-gutter)]">
                <p className={`${bodyTextClass} md:col-span-4 min-w-0 [text-wrap:pretty]`}>
                  I created all the game sprites in a uniform illustrated style,
                  ensuring a consistent and cohesive visual language throughout the
                  project.
                </p>
              </div>
              <div className="flex flex-col gap-0">
                <div className="w-full min-w-0 max-w-full overflow-hidden">
                  <DragCarousel
                    trailingScrollPadding={false}
                    className="w-fit max-w-full min-w-0 bg-[#0d0439] rounded-[7px] px-3 py-3 md:px-5 md:py-4"
                  >
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
                      <CloudinaryImage
                        key={img}
                        src={cloudinaryUrl(img)}
                        alt=""
                        className="h-[48px] md:h-[82px] w-auto object-contain shrink-0 pointer-events-none select-none"
                        draggable={false}
                      />
                    ))}
                  </DragCarousel>
                </div>
                {/* Mushroom: page cols 3–4 (grid 1–2) | gap col 5 (grid 3) | life: page 6–7 (grid 4–5) */}
                <div className="mt-3 grid w-full min-w-0 grid-cols-2 gap-4 md:grid-cols-5 md:gap-x-[var(--grid-gutter)] md:items-center">
                  <CloudinaryImage
                    src={cloudinaryUrl("mushroom_bar_oguwty_jgnf9j.png")}
                    alt=""
                    wrapperClassName="flex min-w-0 w-full justify-start md:col-start-1 md:col-span-2"
                    className="h-[88px] md:h-[136px] w-full max-w-full object-contain object-left"
                  />
                  <div
                    className="hidden min-h-0 md:col-start-3 md:col-span-1 md:block"
                    aria-hidden
                  />
                  <CloudinaryImage
                    src={cloudinaryUrl("life_bar_kcunbr_k0mr8d.png")}
                    alt=""
                    wrapperClassName="flex min-w-0 w-full justify-start md:col-start-4 md:col-span-2"
                    className="h-[88px] md:h-[136px] w-full max-w-full object-contain object-left"
                  />
                </div>
              </div>
            </div>

            {/* ── Typography ── */}
            <div className={`flex flex-col ${gapSubtitleClass} overflow-hidden md:overflow-visible`}>
              <p className={smallTitleClass}>Typography</p>
              <div className="md:grid md:grid-cols-5 md:gap-x-[var(--grid-gutter)]">
                <p className={`${bodyTextClass} md:col-span-4 min-w-0 [text-wrap:pretty]`}>
                  I selected a font inspired by Tim Burton&apos;s Alice in Wonderland to
                  reinforce the dark forest atmosphere and overall magical
                  aesthetic.
                </p>
              </div>

              <div className={`flex w-full min-w-0 max-w-full flex-col items-stretch ${gapIntroClass} overflow-hidden md:overflow-visible`}>
                <div className="self-center bg-[#0d0439] rounded-[10px] px-5 py-2.5 md:px-8 md:py-3 mt-4">
                  <CloudinaryImage
                    src={cloudinaryUrl("LuMina_FoRest_logo_ca5aur_yat0j0.png")}
                    alt=""
                    className="h-[38px] md:h-[46px] w-auto object-contain"
                  />
                </div>
                {/* Mobile: 2-col grid (2,2,1 centered); Desktop: two offset rows of 3+2 */}
                <div className="grid grid-cols-2 gap-3 justify-items-center overflow-hidden md:overflow-visible md:flex md:flex-col md:gap-0">
                  {/* Desktop Row 1 — cols 1, 3, 5 */}
                  <div className="contents md:!grid md:w-full md:min-w-0 md:grid-cols-5 md:gap-x-[var(--grid-gutter)] md:gap-y-0 md:justify-items-center md:overflow-visible">
                    <CloudinaryImage
                      key="start"
                      src={cloudinaryUrl("btn_start_pwwpbq_v1vjfe.png")}
                      alt=""
                      wrapperClassName="flex justify-center overflow-visible md:col-start-1 md:col-span-1"
                      className="h-[72px] w-auto origin-center object-contain md:h-[142px] md:scale-[1.35]"
                    />
                    <CloudinaryImage
                      key="quit"
                      src={cloudinaryUrl("btn_quit_dxbnl3_dd4nyu.png")}
                      alt=""
                      wrapperClassName="flex justify-center overflow-visible md:col-start-3 md:col-span-1"
                      className="h-[72px] w-auto origin-center object-contain md:h-[142px] md:scale-[1.35]"
                    />
                    <CloudinaryImage
                      key="tutorial"
                      src={cloudinaryUrl("btn_tutorial_vxwliu_ya4myf.png")}
                      alt=""
                      wrapperClassName="flex justify-center overflow-visible md:col-start-5 md:col-span-1"
                      className="h-[72px] w-auto origin-center object-contain md:h-[142px] md:scale-[1.35]"
                    />
                  </div>
                  {/* Desktop Row 2 — cols 2, 4 */}
                  <div className="contents md:!grid md:w-full md:min-w-0 md:-mt-6 md:grid-cols-5 md:gap-x-[var(--grid-gutter)] md:gap-y-0 md:justify-items-center md:overflow-visible">
                    <CloudinaryImage
                      key="resume"
                      src={cloudinaryUrl("btn_resume_yuquf7_usjwdz.png")}
                      alt=""
                      wrapperClassName="flex justify-center overflow-visible md:col-start-2 md:col-span-1"
                      className="h-[72px] w-auto origin-center object-contain md:h-[142px] md:scale-[1.35]"
                    />
                    <CloudinaryImage
                      key="mainmenu"
                      src={cloudinaryUrl("btn_mainmenu_pvgedf_znnfwn.png")}
                      alt=""
                      wrapperClassName="col-span-2 flex justify-center overflow-visible md:col-span-1 md:col-start-4"
                      className="h-[72px] w-auto origin-center object-contain md:h-[142px] md:scale-[1.35]"
                    />
                  </div>
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
        <MobileStickyTitle>AI Integration</MobileStickyTitle>
        <PageGrid className={sectionPageGridStretchClass}>
          <SectionTitle>AI Integration</SectionTitle>

          <ContentColumn>
            <p className={`${smallTitleClass} leading-[1.5]`}>
              I utilized various AI tools to create a comprehensive and immersive
              gaming experience.
            </p>

            {/* ── GameObjects (AI) ── */}
            <div className="flex flex-col gap-6">
              <div className={`flex flex-col ${gapSubtitleClass}`}>
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
              </div>

              {/* Column labels — desktop only */}
              <div className="hidden lg:grid grid-cols-5 gap-x-[var(--grid-gutter)]">
                <p className={`${bodyTextClass} col-span-2`}>
                  3D styled images created with Nano Banana
                </p>
                <div className="col-span-1" />
                <p className={`${bodyTextClass} col-start-4 col-span-2`}>3D models created with Meshy</p>
              </div>

              {/* Mobile labels above pairs */}
              <div className="flex justify-between lg:hidden">
                <p className={bodyTextClass}>Nano Banana</p>
                <p className={bodyTextClass}>Meshy 3D</p>
              </div>

              {/* Fairyhouse: Nano Banana → Meshy 3D */}
              <div className="grid grid-cols-[1fr_auto_1fr] gap-2 lg:gap-6 items-center">
                <CloudinaryImage
                  src={cloudinaryUrl("img_3dfairyhouse_rrswv7_xjnf70.png")}
                  alt=""
                  className={`w-full max-lg:h-[calc(var(--media-inline-figure-h)*0.8)] h-[length:var(--media-inline-figure-h)] object-contain ${radiusMediaSmClass}`}
                />
                <svg width="24" height="12" viewBox="0 0 24 12" fill="none" className="self-center shrink-0 lg:hidden">
                  <line x1="0" y1="6" x2="18" y2="6" stroke="#2200b8" strokeWidth="1.5" />
                  <polygon points="18,2 24,6 18,10" fill="#2200b8" />
                </svg>
                <svg width="100" height="12" viewBox="0 0 100 12" fill="none" className="self-center hidden lg:block">
                  <line x1="0" y1="6" x2="90" y2="6" stroke="#2200b8" strokeWidth="1.5" />
                  <polygon points="90,2 100,6 90,10" fill="#2200b8" />
                </svg>
                <FbxModelViewer
                  url={cloudinaryUrl("Meshy_AI_Enchanted_Treehouse_0404113704_texture_fm05fe_dsjaxg.glb", { raw: true })}
                  label="Treehouse 3D"
                  transparent
                  className="max-lg:h-[calc(var(--media-inline-figure-h)*1.7)] h-[calc(var(--media-inline-figure-h)*1.4)] lg:h-[length:var(--media-glb-h)] lg:-ml-10"
                />
              </div>

              {/* Bridge: Nano Banana → Meshy 3D */}
              <div className="grid grid-cols-[1fr_auto_1fr] gap-2 lg:gap-6 items-center">
                <CloudinaryImage
                  src={cloudinaryUrl("img_3dbridge_e0qvcp_bhzymp.png")}
                  alt=""
                  className={`w-full max-lg:h-[calc(var(--media-inline-figure-h)*0.8)] h-[length:var(--media-inline-figure-h)] object-contain ${radiusMediaSmClass}`}
                />
                <svg width="24" height="12" viewBox="0 0 24 12" fill="none" className="self-center shrink-0 lg:hidden">
                  <line x1="0" y1="6" x2="18" y2="6" stroke="#2200b8" strokeWidth="1.5" />
                  <polygon points="18,2 24,6 18,10" fill="#2200b8" />
                </svg>
                <svg width="100" height="12" viewBox="0 0 100 12" fill="none" className="self-center hidden lg:block">
                  <line x1="0" y1="6" x2="90" y2="6" stroke="#2200b8" strokeWidth="1.5" />
                  <polygon points="90,2 100,6 90,10" fill="#2200b8" />
                </svg>
                <FbxModelViewer
                  url={cloudinaryUrl("Meshy_AI_Enchanted_Forest_Brid_0404114828_texture-v7_xhyovc_t49axu.glb", { raw: true })}
                  label="Bridge 3D"
                  transparent
                  className="max-lg:h-[calc(var(--media-inline-figure-h)*1.7)] h-[calc(var(--media-inline-figure-h)*1.4)] lg:h-[length:var(--media-glb-h)]"
                />
              </div>
            </div>

            {/* ── Character Creation Process ── */}
            <div className={`flex flex-col ${gapSubtitleClass} md:gap-8`}>
              <h3 className={smallTitleClass}>Character Creation Process</h3>

              {/* Step 1: ChatGPT prompt */}
              <div className="flex flex-col gap-2 md:gap-4">
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
                    <CloudinaryImage
                      key={file}
                      src={cloudinaryUrl(file)}
                      alt=""
                      className={`w-full h-auto object-contain ${radiusMediaLgClass}`}
                    />
                  ))}
                </div>
              </div>

              {/* Step 2: Meshy 3D */}
              <div className="flex flex-col gap-2 md:gap-4">
                <p className={bodyTextClass}>
                  The final image was then processed through Meshy 3D to generate
                  a functional 3D model.
                </p>
                <div className="grid grid-cols-[1fr_auto_1fr] gap-2 lg:gap-6 items-center">
                  <CloudinaryImage
                    src={cloudinaryUrl("elf_final_estugk_rty43d.png")}
                    alt=""
                    className={`w-full max-lg:h-[180px] h-[length:var(--media-inline-tall-h)] object-contain ${radiusVideoInlineClass}`}
                  />
                  <svg width="24" height="12" viewBox="0 0 24 12" fill="none" className="self-center shrink-0 lg:hidden">
                    <line x1="0" y1="6" x2="18" y2="6" stroke="#2200b8" strokeWidth="1.5" />
                    <polygon points="18,2 24,6 18,10" fill="#2200b8" />
                  </svg>
                  <svg width="100" height="12" viewBox="0 0 100 12" fill="none" className="self-center hidden lg:block">
                    <line x1="0" y1="6" x2="90" y2="6" stroke="#2200b8" strokeWidth="1.5" />
                    <polygon points="90,2 100,6 90,10" fill="#2200b8" />
                  </svg>
                  <FbxModelViewer
                    url={cloudinaryUrl("Meshy_AI_Floral_Sprite_0404113616_texture_b4ydnh_a5ywwl.glb", { raw: true })}
                    label="Elf 3D"
                    transparent
                    className="max-lg:h-[210px] h-[length:var(--media-inline-tall-h)] lg:h-[calc(var(--media-glb-h)*1.15)]"
                  />
                </div>
              </div>

              {/* Step 3: Mixamo */}
              <div className="flex flex-col gap-2 md:gap-4">
                <p className={bodyTextClass}>
                  Finally, I imported the model into Adobe Mixamo to rig and
                  animate the character, bringing it to life.
                </p>
                <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-stretch lg:gap-x-6 lg:gap-y-0 mt-2">
                  {/* Same frame size; clip-path on wrapper so corners show even when video ignores border-radius */}
                  <div
                    className="min-w-0 min-h-0 w-full h-[270px] lg:h-[360px] overflow-hidden bg-[var(--color-bg)]"
                    style={videoCornerClipInlineStyle}
                  >
                    <AutoPlayVideo
                      src={ELF_MIXAMO_VIDEO}
                      containFit
                      containMode="cover"
                      unframed
                      className="h-full min-h-0 w-full"
                      alwaysMuted
                    />
                  </div>
                  <div
                    className="flex shrink-0 justify-center py-1 lg:py-0 lg:w-[100px] lg:items-center lg:justify-center"
                    aria-hidden
                  >
                    <svg
                      width="100"
                      height="12"
                      viewBox="0 0 100 12"
                      fill="none"
                      className="hidden lg:block"
                    >
                      <line x1="0" y1="6" x2="90" y2="6" stroke="#2200b8" strokeWidth="1.5" />
                      <polygon points="90,2 100,6 90,10" fill="#2200b8" />
                    </svg>
                    <svg
                      width="12"
                      height="32"
                      viewBox="0 0 12 32"
                      fill="none"
                      className="lg:hidden"
                    >
                      <line x1="6" y1="0" x2="6" y2="24" stroke="#2200b8" strokeWidth="1.5" />
                      <polygon points="2,24 6,32 10,24" fill="#2200b8" />
                    </svg>
                  </div>
                  <div
                    className="min-w-0 min-h-0 w-full h-[270px] lg:h-[360px] overflow-hidden bg-[var(--color-bg)]"
                    style={videoCornerClipInlineStyle}
                  >
                    <AutoPlayVideo
                      src={cloudinaryUrl("elfanimation_rhrtu4_xifrcc.mp4", { resourceType: "video" })}
                      containFit
                      containMode="cover"
                      unframed
                      className="h-full min-h-0 w-full"
                      alwaysMuted
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── AI Tools Details ── */}
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {/* UI */}
                <div className={`flex flex-col ${gapSubtitleClass}`}>
                  <p className={smallTitleClass}>UI</p>
                  <p className={bodyTextClass}>
                    All UI elements were generated using{" "}
                    <span className="font-medium">Nano Banana</span> and
                    subsequently refined in Photoshop to ensure color consistency
                    and stylistic precision.
                  </p>
                </div>

                {/* Sound */}
                <div className={`flex flex-col ${gapSubtitleClass}`}>
                  <div className={`flex flex-col ${gapSubtitleClass}`}>
                    <p className={smallTitleClass}>Sound</p>
                    <p className={bodyTextClass}>
                      Sound effects were created using{" "}
                      <span className="font-medium">Kling</span> and{" "}
                      <span className="font-medium">Stable Audio</span>.
                    </p>
                  </div>
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
              <div className={`flex flex-col ${gapSubtitleClass}`}>
                <div className={`flex flex-col ${gapSubtitleClass}`}>
                  <p className={smallTitleClass}>Scripts</p>
                  <p className={bodyTextClass}>
                    As part of the game development I have integrated scripts developed using{" "}
                    <span className="font-medium">ChatGPT</span> and{" "}
                    <span className="font-medium">Gemini</span>:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {/* Row 1 */}
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
                      Fairy Float
                    </p>
                    <p className={bodyTextClass}>
                      An animation script for fairies, enabling floating
                      movement across the X, Y, and Z axes.
                    </p>
                  </div>

                  {/* Row 2 */}
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
                      Log Movement
                    </p>
                    <p className={bodyTextClass}>
                      Handles the movement of logs along the X-axis.
                    </p>
                  </div>

                  {/* Row 3 */}
                  <div>
                    <p className="font-['Bricolage_Grotesque'] font-normal text-[14px] text-[#2200b8] tracking-[0.5px]">
                      Light Growth + Light Collectible
                    </p>
                    <p className={bodyTextClass}>
                      Increases the player&apos;s point light intensity by
                      collecting fireflies.
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
          </ContentColumn>
        </PageGrid>
      </section>

      {/* ── Project Navigation ── */}
      <div className="lg:translate-x-7">
        <ProjectNav currentProject="lumina" onSelectSection={onSelectSection} />
      </div>
    </div>
    </MuteProvider>
  );
}
