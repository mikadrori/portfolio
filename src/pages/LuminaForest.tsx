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
      className="w-full text-left bg-[#f0ecff] rounded-[8px] px-4 py-3 cursor-pointer transition-colors hover:bg-[#e4deff]"
    >
      <p className="font-['Bricolage_Grotesque'] font-normal text-[14px] text-[#2200b8] tracking-[0.42px]">
        Prompt {open ? "▾" : "▸"}
      </p>
      {open && (
        <p className={`${bodyTextClass} mt-2`}>
          Prompt content will be added here once finalized.
        </p>
      )}
    </button>
  );
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
    <div className="flex flex-col">
      {/* ════════════════════════════════════════════════════════
          HERO + CONCEPT  (min-h-screen)
          ════════════════════════════════════════════════════════ */}
      <div className="min-h-screen flex flex-col">
        {/* Hero Video Banner — placeholder */}
        <div className="w-full shrink-0 overflow-hidden bg-[#d9d9d9] h-[280px] md:h-[420px] flex items-center justify-center">
          <span className="text-[#999] text-lg font-['Bricolage_Grotesque'] select-none">
            ▶ Hero Video Placeholder
          </span>
        </div>

        <Divider />

        {/* Concept Section */}
        <section className="flex-1 flex flex-col justify-center">
          <PageGrid className={sectionPageGridStretchClass}>
            <SectionTitle>Concept</SectionTitle>

            <ContentColumn>
              {/* Title + subtitle + body */}
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 flex flex-col gap-2">
                  <h3 className={`${projectNameClass} leading-[1.5]`}>
                    Lumina Forest
                  </h3>
                  <p className={`${smallTitleClass} leading-[1.5]`}>
                    Explore a mystical world where shadows meet glow
                  </p>
                  <p className={bodyTextClass}>
                    Trapped within the mystical Lumina Forest, Mia must
                    reactivate the ancient portal to return home. To power the
                    gateway, she must retrieve three magical mushrooms by
                    overcoming the unique trials set by the forest's mysterious
                    guardians.
                  </p>
                </div>
                {/* Decorative mushroom placeholder */}
                <div className="shrink-0 w-[100px] h-[100px] md:w-[140px] md:h-[130px] bg-[#d9d9d9] rounded-[12px] flex items-center justify-center self-start">
                  <span className="text-[#999] text-[10px] text-center">
                    Mushroom
                  </span>
                </div>
              </div>

              {/* Cover image placeholder with title overlay */}
              <div className="relative w-full h-[260px] md:h-[400px] bg-[#d9d9d9] rounded-[8px] overflow-hidden flex items-center justify-center">
                <span className="text-[#bbb] text-2xl md:text-4xl font-['Bricolage_Grotesque'] font-bold tracking-widest select-none">
                  LuMina FoRest
                </span>
              </div>
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
              <h3 className={subTitleClass}>Player</h3>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 flex flex-col gap-2">
                  <p className={bodyTextClass}>
                    Mia is a lost girl who has wandered into the depths of the
                    mystical Lumina Forest. Her mission is to find the three
                    magical mushrooms and activate the portal that will finally
                    lead her back home.
                  </p>
                </div>
                {/* Character placeholder */}
                <div className="shrink-0 w-[180px] h-[180px] bg-[#d9d9d9] rounded-[12px] flex items-center justify-center self-center">
                  <span className="text-[#999] text-[11px]">Mia</span>
                </div>
              </div>

              {/* Carousel: video first, then images */}
              <DragCarousel>
                <PlaceholderCard
                  width="w-[320px] md:w-[460px]"
                  height="h-[200px] md:h-[280px]"
                  label="Gameplay video"
                  isVideo
                />
                {Array.from({ length: 4 }).map((_, i) => (
                  <PlaceholderCard
                    key={i}
                    width="w-[200px] md:w-[280px]"
                    height="h-[200px] md:h-[280px]"
                    label={`Screenshot ${i + 1}`}
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

              {/* Carousel: videos */}
              <DragCarousel>
                {["Win scenario", "Lives demo", "Lose scenario"].map(
                  (label) => (
                    <PlaceholderCard
                      key={label}
                      width="w-[320px] md:w-[460px]"
                      height="h-[200px] md:h-[280px]"
                      label={label}
                      isVideo
                    />
                  )
                )}
              </DragCarousel>
            </div>

            {/* ── Collectibles & Power-ups ── */}
            <div className="flex flex-col gap-6">
              <h3 className={subTitleClass}>Collectibles &amp; Power-ups</h3>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Healing Mushrooms */}
                <div className="flex gap-4 items-start">
                  <div className="w-[80px] h-[80px] bg-[#0d0439] rounded-[11px] shrink-0 flex items-center justify-center">
                    <span className="text-[#fcf7ee60] text-[9px] text-center">
                      Heal Mushroom
                    </span>
                  </div>
                  <div>
                    <p className={smallTitleClass}>Healing Mushrooms</p>
                    <p className={bodyTextClass}>
                      Grant the player an extra life cycle to help them continue
                      their journey.
                    </p>
                  </div>
                </div>
                {/* Fireflies */}
                <div className="flex gap-4 items-start">
                  <div className="w-[80px] h-[80px] bg-[#0d0439] rounded-[11px] shrink-0 flex items-center justify-center">
                    <span className="text-[#fcf7ee60] text-[9px] text-center">
                      Fireflies
                    </span>
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

              {/* Carousel */}
              <DragCarousel>
                {Array.from({ length: 5 }).map((_, i) => (
                  <PlaceholderCard
                    key={i}
                    width="w-[260px] md:w-[320px]"
                    height="h-[180px] md:h-[240px]"
                    label={`Collectible ${i + 1}`}
                  />
                ))}
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
              <DragCarousel>
                {Array.from({ length: 5 }).map((_, i) => (
                  <PlaceholderCard
                    key={i}
                    width="w-[300px] md:w-[400px]"
                    height="h-[200px] md:h-[280px]"
                    label={`Visual ${i + 1}`}
                  />
                ))}
              </DragCarousel>
            </div>

            {/* ── GameObjects ── */}
            <div className="flex flex-col gap-4">
              <h3 className={smallTitleClass}>GameObjects</h3>
              <p className={bodyTextClass}>
                I combined collected environmental assets (trees, plants, and
                stones) with custom-made objects I created specifically to fit
                each unique game zone.
              </p>
              <DragCarousel>
                {Array.from({ length: 11 }).map((_, i) => (
                  <PlaceholderCard
                    key={i}
                    width="w-[160px] md:w-[220px]"
                    height="h-[160px] md:h-[220px]"
                    label={`Object ${i + 1}`}
                  />
                ))}
              </DragCarousel>
            </div>

            {/* ── Characters ── */}
            <div className="flex flex-col gap-4">
              <h3 className={smallTitleClass}>Characters</h3>
              <DragCarousel>
                {[
                  "Mia",
                  "Fairy 1",
                  "Fairy 2",
                  "Fairy 3",
                  "Troll",
                  "Elf",
                ].map((name) => (
                  <PlaceholderCard
                    key={name}
                    width="w-[180px] md:w-[260px]"
                    height="h-[240px] md:h-[340px]"
                    label={name}
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

              <div className="flex flex-col md:flex-row gap-8 items-start">
                <ColorPaletteGrid />
                <PlaceholderCard
                  width="w-full md:w-[500px]"
                  height="h-[260px] md:h-[360px]"
                  label="Lighting example"
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
                <div className="flex flex-wrap gap-4">
                  <PlaceholderCard
                    width="w-[260px]"
                    height="h-[160px]"
                    label="Text box"
                  />
                  <PlaceholderCard
                    width="w-[180px]"
                    height="h-[80px]"
                    label="Button"
                  />
                  <PlaceholderCard
                    width="w-[70px]"
                    height="h-[70px]"
                    label="Cursor"
                  />
                  <PlaceholderCard
                    width="w-[60px]"
                    height="h-[60px]"
                    label="Click"
                  />
                </div>
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
              <DragCarousel>
                {[
                  "Heart",
                  "Portal",
                  "Yellow Mushroom",
                  "Blue Mushroom",
                  "Pink Mushroom",
                  "Arch Yellow",
                  "Arch Blue",
                  "Arch Pink",
                  "Fireflies",
                  "Heal Mushroom",
                  "Poison Mushroom",
                  "Swamp",
                  "Log",
                ].map((name) => (
                  <PlaceholderCard
                    key={name}
                    width="w-[80px] md:w-[100px]"
                    height="h-[80px] md:h-[100px]"
                    label={name}
                  />
                ))}
              </DragCarousel>
            </div>

            {/* ── Typography ── */}
            <div className="flex flex-col gap-4">
              <p className={smallTitleClass}>Typography</p>
              <p className={bodyTextClass}>
                I selected a font inspired by Tim Burton's Alice in Wonderland to
                reinforce the dark forest atmosphere and overall magical
                aesthetic.
              </p>

              {/* Dark background with title + buttons */}
              <div className="bg-[#0d0439] rounded-[12px] p-8 flex flex-col items-center gap-6">
                <div className="bg-[#0d0439] rounded-[7px] w-full max-w-[600px] h-[120px] flex items-center justify-center">
                  <span className="text-white text-3xl md:text-5xl font-bold tracking-widest select-none opacity-80">
                    LuMina FoRest
                  </span>
                </div>

                {/* Menu buttons */}
                <div className="flex flex-wrap gap-3 justify-center">
                  {["start", "quit", "tutorial"].map((label) => (
                    <div
                      key={label}
                      className="w-[140px] md:w-[170px] h-[50px] md:h-[60px] bg-[#1d1171] rounded-[8px] flex items-center justify-center"
                    >
                      <span className="text-white text-lg md:text-xl opacity-80 select-none">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                  {["resume", "main menu"].map((label) => (
                    <div
                      key={label}
                      className="w-[140px] md:w-[170px] h-[50px] md:h-[60px] bg-[#1d1171] rounded-[8px] flex items-center justify-center"
                    >
                      <span className="text-white text-lg md:text-xl opacity-80 select-none">
                        {label}
                      </span>
                    </div>
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

              {/* Two-column: Nano Banana → Meshy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-3">
                  <p className={bodyTextClass}>
                    3D styled images created with Nano Banana
                  </p>
                  <div className="flex gap-3">
                    <PlaceholderCard
                      width="w-[160px]"
                      height="h-[160px]"
                      label="Nano 1"
                    />
                    <PlaceholderCard
                      width="w-[160px]"
                      height="h-[160px]"
                      label="Nano 2"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <p className={bodyTextClass}>3D models created with Meshy</p>
                  <div className="flex gap-3">
                    <PlaceholderCard
                      width="w-[160px]"
                      height="h-[160px]"
                      label="Meshy 1"
                    />
                    <PlaceholderCard
                      width="w-[160px]"
                      height="h-[160px]"
                      label="Meshy 2"
                    />
                  </div>
                </div>
              </div>

              {/* Arrow indicators */}
              <div className="flex justify-center">
                <span className="text-[#2200b8] text-2xl select-none">
                  →
                </span>
              </div>

              {/* Bridge: before/after */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PlaceholderCard
                  width="w-full"
                  height="h-[200px]"
                  label="Bridge (Nano Banana)"
                />
                <PlaceholderCard
                  width="w-full"
                  height="h-[200px]"
                  label="Bridge (Meshy 3D)"
                />
              </div>

              {/* 3D model viewers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FbxModelViewer url="/assets/Meshy_AI_Floral_Sprite_0404113616_texture_b4ydnh.glb" label="River Elf 3D" className="h-[280px]" />
                <FbxModelViewer label="Game Object 3D" className="h-[280px]" />
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
                <DragCarousel>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <PlaceholderCard
                      key={i}
                      width="w-[120px] md:w-[150px]"
                      height="h-[220px] md:h-[280px]"
                      label={`Iteration ${i + 1}`}
                    />
                  ))}
                </DragCarousel>
              </div>

              {/* Step 2: Meshy 3D */}
              <div className="flex flex-col gap-4">
                <p className={bodyTextClass}>
                  The final image was then processed through Meshy 3D to generate
                  a functional 3D model.
                </p>
                <FbxModelViewer
                  label="Character 3D Model"
                  className="h-[320px] md:h-[400px]"
                />
              </div>

              {/* Step 3: Mixamo */}
              <div className="flex flex-col gap-4">
                <p className={bodyTextClass}>
                  Finally, I imported the model into Adobe Mixamo to rig and
                  animate the character, bringing it to life.
                </p>
                <FbxModelViewer
                  label="Animated Character"
                  className="h-[320px] md:h-[400px]"
                />
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
                    Sound effects were crafted using{" "}
                    <span className="font-medium">Kling</span> and{" "}
                    <span className="font-medium">Stable Audio</span>.
                  </p>
                  <RandomSoundPlayer sounds={[]} />
                </div>
              </div>

              {/* Scripts */}
              <div className="flex flex-col gap-4">
                <p className={smallTitleClass}>Scripts</p>
                <p className={bodyTextClass}>
                  While the core game logic is based on foundational code
                  provided by my lecturer, I integrated unique scripts developed
                  with <span className="font-medium">ChatGPT</span> and{" "}
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
  );
}
