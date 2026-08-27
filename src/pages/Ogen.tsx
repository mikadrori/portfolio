import { useEffect, useRef, useCallback, useState, type ReactNode } from "react";

import {
  stickyTitleClass,
  projectHeroNameClass,
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
  gapContentLgClass,
  gapSubtitleClass,
  gapTightStripClass,
} from "../lib/spacing";
import { PageGrid } from "../components/PageGrid";
import { MobileStickyTitle, TITLE_COL_DESKTOP_CLASS } from "../components/MobileStickyTitle";
import { IntroToggle } from "../components/IntroToggle";
import { ProjectHeroVideo } from "../components/ProjectHeroVideo";
import { ProjectNav } from "../components/ProjectNav";
import { useDragScroll } from "../hooks/useDragScroll";
import { cloudinaryUrl } from "../lib/cloudinary";
import { OGEN_PROTOTYPE_VIDEO, OGEN_SCREEN_VIDEO } from "./ogen/videoCrop";

const Q = "auto";
const ogenAsset = (file: string, opts?: { resourceType?: "image" | "video"; width?: number }) =>
  cloudinaryUrl(`OGEN/${file}`, { quality: Q, ...opts });

const HERO_VIDEO = ogenAsset("Hero_VID_iyrla8.mp4", { resourceType: "video" });
const HERO_POSTER = ogenAsset("Screen_Dashboard_vur6vl.png");
const SYSTEM_MOCKUP_NIGHT = ogenAsset("System_Mockup_Night_zezhb6.png");
const PROTOTYPE_VIDEO = ogenAsset("OGEN_Prototype_NEW_vwuhkn.mp4", { resourceType: "video" });
const INTRO_SCREENS_VIDEO = ogenAsset("OGEN_Screens_VID_kowbya.mp4", { resourceType: "video" });
const APP_ICON = cloudinaryUrl("OGEN_App_icon_kdayq6.png", { quality: Q });
const DISASTER_SCENES = [
  ogenAsset("Disaster_Scene1_rdsiuw.png"),
  ogenAsset("Disaster_Scene2_vdoqmo.png"),
  ogenAsset("Disaster_Scene3_shvcdb.png"),
] as const;
const MARKET_REALITY_IMGS = [
  ogenAsset("Market_Reality_1_uendfw.png"),
  ogenAsset("Market_Reality_2_jtx4eu.png"),
  ogenAsset("Market_Reality_4_f3lbxk.png"),
  ogenAsset("Market_Reality_5_iwqp4c.png"),
  ogenAsset("Market_Reality_6_i8zunq.png"),
] as const;
/** Top row: paper refs + 3D map. Bottom row: digital dashboards. */
const MARKET_REALITY_ROW_1 = MARKET_REALITY_IMGS.slice(0, 3);
const MARKET_REALITY_ROW_2 = MARKET_REALITY_IMGS.slice(3);
const LOW_FIDELITY_IMG = ogenAsset("Low_fidelity_Dashboard_icuydl.png");
const PERSONA_IMG = ogenAsset("User_persona_NEW_IMG_zgfvyl.png");

// ─── Intro copy ───
const OGEN_INTRO_TAGS = ["UX UI", "Complex System & Dashboard", "Duo Project"] as const;

const OGEN_BRIEF =
  "Designing a digital complex content product that organizes and delivers heavy data through intuitive UX, clear information architecture, and a refined visual system.";

const OGEN_CONCEPT =
  "OGEN is a tablet-based system (iPad Pro) designed for Population NCOs at disaster sites. It helps manage order within chaos, organizes incoming field data in real time, and gives rescuers an accurate map of trapped individuals to save lives.";

const OGEN_TOOLS = ["Figma", "Figma Make", "Gemini"] as const;

// ─── Research ───
const INFO_SOURCES = [
  "Rescue & Police",
  "City & Local Authorities",
  "Field Teams",
  "Hospitals",
  "Families & Survivors",
  "Digital Footprints",
  "Technology",
] as const;

// ─── User Persona ───
const PERSONA_ROWS = [
  { label: "Role", value: "Field Population NCO" },
  { label: "Age", value: "25–30" },
  {
    label: "Characteristics",
    value: "Sharp, tech-savvy, highly capable under pressure, skilled at real-time data aggregation.",
  },
  {
    label: "Tech Literacy",
    value: "High; proficient with tablets and laptops in operational field conditions.",
  },
  {
    label: "Core Needs",
    value:
      "Information condensation, urgency-based categorization, clear Call-to-Action (CTA), strict organization, and rapid communication channels.",
  },
] as const;

// ─── UX Challenges ───
const EXTREME_CONDITION_INTRO =
  "As part of our research, we analyzed human physiological reactions under extreme stress and darkness, referencing edge conditions beyond standard field operations.";

const EXTREME_CONDITION_SECTIONS = [
  {
    title: "What Happens to Human Body Under Stress?",
    effects: ["Cognitive disruption", "Motor impairment", "Sensory overload"],
    solutions: [
      "Progressive disclosure (hiding non-critical data)",
      "Simple language and short copy",
      "Clear icons",
      "Large, prominent buttons",
    ],
  },
  {
    title: "What Happens to Vision at Night?",
    effects: [
      "Reduced visual focus and contrast sensitivity",
      "Cool light (blue, green, white) degrades night vision proteins",
    ],
    solutions: ["Operational dark mode", "Maximum contrast", "Warm color tones"],
  },
] as const;

const VISION_CONFLICT_INTRO =
  "Under extreme operational stress and darkness, two conflicting visual phenomena occur simultaneously:";

const VISION_PHENOMENA = [
  {
    title: "Tunnel Vision",
    desc: "Under extreme stress, the visual field narrows, blurring the edges and forcing focus strictly on the screen center.",
    image: ogenAsset("Tunnel_vision_sj6ku0.png"),
  },
  {
    title: "Night Blind Spot",
    desc: "In low-light environments, central vision degrades, creating a blind spot in the center of the screen.",
    image: ogenAsset("Night_blind_spot_cklv73.png"),
  },
] as const;

const VISION_UX_SOLUTION =
  "To resolve the conflict between both conditions, the interface must overcome the central blind spot by placing a prominent visual element in the screen center to capture focus.";

// ─── Low / High Fidelity + Design screens ───
const PILLARS = [
  { title: "Status Overview", desc: "Real-time macro view of the incident." },
  { title: "Anchor List", desc: "Central population database." },
  { title: "Battalion Reports", desc: "Incoming operational field feed." },
  { title: "Building Schematic", desc: "Interactive 3D structural breakdown." },
  { title: "Tools & Resources", desc: "Files, SOPs, interview forms, important contacts." },
] as const;

/** High Fidelity carousel: five screen stills (two are pop-up overlays). */
const HIFI_SCREENS = [
  { title: "Dashboard", src: ogenAsset("High_fidelity_Dashboard.png") },
  { title: "Anchor List", src: ogenAsset("High_fidelity_Ogen1_mn0azo.png") },
  { title: "Anchor List pop up", src: ogenAsset("High_fidelity_Ogen2_yox0mg.png") },
  { title: "Battalion Reports", src: ogenAsset("High_fidelity_reports1_vxkyda.png") },
  { title: "Battalion Reports pop up", src: ogenAsset("High_fidelity_reports2_kgpty2.png") },
] as const;

/** Screen write-ups for the Design — Screens section. */
const DESIGN_SCREENS = [
  {
    title: "Login & Event Setup",
    desc: "Population NCOs log in and initialize an incident with key location and building data. Triggers automated data requests to municipal and emergency authorities before arriving on-site to streamline early operations.",
    video: ogenAsset("OGEN_Login_VID_jah2mq.mp4", { resourceType: "video" }),
  },
  {
    title: "Main Dashboard",
    desc: "The primary command view delivering a real-time situational picture, prominently placed at the screen center to counteract night blind spots and tunnel vision. Tracks casualty tallies and incident timers, with quick-access shortcuts to the Anchor List and Battalion Reports.",
    video: ogenAsset("OGEN_Dashboard_VID_dp87zv.mp4", { resourceType: "video" }),
  },
  {
    title: "Anchor List",
    desc: "The central population hub, automatically sorted by urgency status with Missing at the top. Allows real-time data entry, scrolling, filtering, and viewing full profile details.",
    note: {
      title: "Smart Cross-Referencing",
      desc: "Field chaos leads to duplicate, incomplete profiles. The AI scans for matching traits and alerts the Population NCO with merge recommendations, leaving final decisions strictly to the human operator.",
    },
    video: ogenAsset("OGEN_Anchorlist_VID_tv5aef.mp4", { resourceType: "video" }),
  },
  {
    title: "Battalion Reports",
    desc: "A dedicated feed for field updates received directly from battalion command, alongside a direct chat for rapid operational communication. Reports can be filtered by source authority: Family Center, Municipality, Commander HQ, Medical (MADA & Hospitals), and Emergency Forces (Police & Fire Department).",
    video: ogenAsset("OGEN_Reports_VID_dv2i4p.mp4", { resourceType: "video" }),
  },
  {
    title: "Building Schematic",
    desc: "An interactive module where the Population NCO configures the building layout by specifying floors and apartments per floor. Enables entering occupant details for each unit and marking real-time status as Cleared or Uncleared.",
    video: ogenAsset("OGEN_Building_VID_dlnwxa.mp4", { resourceType: "video" }),
  },
] as const;

// ─── Design System (individual assets composed to match Figma composite layout) ───

/** Design-system folder has a typo in Cloudinary (`Deisgn`); encode spaces for CDN + local. */
const dsAsset = (file: string) => cloudinaryUrl(encodeURI(`Deisgn System/${file}`));

const DS_COLOR_PALETTE = dsAsset("Ogen_UI_ColorPallete_shqxzu.png");
const DS_TYPOGRAPHY = [
  dsAsset("Ogen_UI_Typography_vlwghh.png"),
  dsAsset("Ogen_UI_Typography_ButtonsText_ew46kz.png"),
  dsAsset("Ogen_UI_Typography_SmallText_fbha02.png"),
] as const;

/** Composite icon order (6-col) matching Design System Figma still. */
const DS_ICONS = [
  "Ogen_UI_icon_12_rjvr4n", // grid
  "Ogen_UI_icon_3_h8hg0h", // pie / progress
  "Ogen_UI_icon_14_qzfref", // contacts / profile
  "Ogen_UI_icon_13_nkgbim", // broadcast / signal
  "Ogen_UI_icon_15_u0z9rr", // building
  "Ogen_UI_icon_4_v0xvyi", // chat
  "Ogen_UI_icon_9_vb5gqs", // edit-note
  "Ogen_UI_icon_10_ojpqko", // checklist
  "Ogen_UI_icon_11_hmps5z", // phone / mobile
  "Ogen_UI_icon_8_fefyuq", // files
  "Ogen_UI_icon_7_ozsf8x", // paperclip
  "Ogen_UI_icon_6_dzexdj", // star
  "Ogen_UI_icon_16_a745dr", // close
  "Ogen_UI_icon_1_d9aqfb", // check
  "Ogen_UI_icon_2_qsuxtb", // double-check
  "Ogen_UI_icon_17_cvv0ep", // add
  "Ogen_UI_icon_5_w5xoli", // expand
].map((id) => dsAsset(`${id}.svg`));

/**
 * Status badges — Figma Frame 238 cluster:
 * top row Pink → Blue → Green → Orange(גלוי) → Red, with the other two oranges stacked under גלוי.
 */
const DS_STATUS_BADGES = [
  { id: "Ogen_Ui_status_7_exkaqk", label: "pink evacuated", box: { left: "54.336%", top: "17.293%", width: "7.080%", height: "6.767%" } },
  { id: "Ogen_Ui_status_1_amtitt", label: "blue located", box: { left: "63.186%", top: "17.669%", width: "7.080%", height: "6.767%" } },
  { id: "Ogen_Ui_status_2_skvagk", label: "green rescued", box: { left: "72.035%", top: "17.669%", width: "7.080%", height: "6.767%" } },
  { id: "Ogen_Ui_status_3_vcpb1x", label: "orange visible-trapped", box: { left: "80.885%", top: "17.669%", width: "7.080%", height: "6.767%" } },
  { id: "Ogen_Ui_status_6_stw6pm", label: "red missing", box: { left: "89.735%", top: "17.669%", width: "7.080%", height: "6.767%" } },
  { id: "Ogen_Ui_status_4_hxhqv9", label: "orange located-trapped", box: { left: "80.885%", top: "30.451%", width: "7.080%", height: "6.767%" } },
  { id: "Ogen_Ui_status_5_ooesda", label: "orange concealed-trapped", box: { left: "80.885%", top: "43.233%", width: "7.080%", height: "6.767%" } },
].map(({ id, label, box }) => ({ src: dsAsset(`${id}.svg`), label, box }));

/** Figma Frame 238 panel size for icons + status cluster. */
const DS_ICONS_LAYOUT = {
  aspect: "1130 / 266",
} as const;

const DS_BUTTONS = {
  secondary: dsAsset("Ogen_UI_SecondaryButton_ttvja8.svg"),
  primary: dsAsset("Ogen_UI_MainButton_gnjof4.svg"),
  wide: dsAsset("Ogen_UI_BigButton_lfo5wl.png"),
} as const;

const DS_INPUTS = {
  rest: dsAsset("Ogen_UI_Textinput_swsggc.svg"),
  focused: dsAsset("Ogen_UI_Textinputclicked_kcb06b.svg"),
} as const;

const DS_FILTER_AUTHORITY = {
  active: dsAsset("Ogen_UI_FilterAuthority_ctnqtj.svg"),
  inactive: dsAsset("Ogen_UI_FilterAuthority_2_stzo0r.svg"),
} as const;

const DS_FILTER_REPORTS = dsAsset("Ogen_UI_Filter_e1hvdk.svg");
const DS_POPUP_ANCHOR = dsAsset("Ogen_UI_OgenPopup_hrfs2n.png");
const DS_POPUP_ANCHOR_NEW = dsAsset("Ogen_UI_OgenPopupNewAdd_eywta8.svg");
const DS_POPUP_REPORT_NEW = dsAsset("Ogen_UI_ReportNew_u3q8pi.svg");
const DS_POPUP_REPORT_READ = dsAsset("Ogen_UI_ReportRead_id0ceo.svg");

const DESIGN_SYSTEM_BLOCKS = [
  { title: "Operational Color Palette", kind: "palette" as const },
  { title: "Typography & Scannability", kind: "typography" as const },
  { title: "Icons & Status Badges", kind: "icons-badges" as const },
  { title: "Buttons & Text Boxes", kind: "tactical" as const },
  { title: "Tactical Components & Pop-ups", kind: "popups" as const },
] as const;

/** Placeholder slot when no asset is available yet. */
function MediaPlaceholder({
  label = "Media Placeholder",
  aspect = "aspect-[16/10]",
  className = "",
}: {
  label?: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <div
      className={`w-full ${aspect} rounded-sm border-2 border-dashed border-[#2200b8]/30 bg-[#2200b8]/5 flex items-center justify-center ${className}`}
    >
      <span className="font-['Bricolage_Grotesque'] font-light text-[length:var(--text-small-title)] uppercase tracking-[3px] text-[#2200b8]/40">
        {label}
      </span>
    </div>
  );
}

function MediaImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`block h-auto w-full rounded-sm ${className}`}
      loading="lazy"
    />
  );
}

/** Inline SVG/PNG leaf for Design System atom/organism showcases (no forced full-bleed). */
function DsAsset({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`block max-w-full object-contain ${className}`}
      loading="lazy"
    />
  );
}

/** Persona radial gradient — typography, icons/status, and tactical atoms panels.
 *  No padding: Figma frames place assets with absolute insets inside the panel. */
const dsPanelClass =
  "relative w-full overflow-hidden rounded-[6px] bg-[radial-gradient(circle_at_center,#2A2372_0%,#000000_100%)]";

/** Figma Frame 237 (1130×266) — typography still positions as % of the panel. */
const DS_TYPO_LAYOUT = {
  aspect: "1130 / 266",
  headings: { left: "80.265%", top: "5.639%", width: "17.611%", height: "88.346%" },
  buttons: { left: "56.018%", top: "73.684%", width: "11.593%", height: "20.301%" },
  body: { left: "33.628%", top: "76.316%", width: "9.735%", height: "17.669%" },
} as const;

/** Figma Frame 239 (1130×313) — tactical atom positions as % of the panel. */
const DS_TACTICAL_LAYOUT = {
  aspect: "1130 / 313",
  secondary: { left: "36.018%", top: "6.390%", width: "12.035%", height: "11.821%" },
  primary: { left: "51.858%", top: "6.390%", width: "12.035%", height: "11.821%" },
  wide: { left: "68.142%", top: "6.390%", width: "29.823%", height: "11.821%" },
  authorityInactive: { left: "75.487%", top: "29.073%", width: "9.823%", height: "12.780%" },
  authorityActive: { left: "88.142%", top: "29.073%", width: "9.823%", height: "12.780%" },
  filters: { left: "71.681%", top: "52.716%", width: "26.283%", height: "8.307%" },
  inputRest: { left: "57.168%", top: "68.051%", width: "18.584%", height: "22.364%" },
  inputFocused: { left: "79.381%", top: "68.051%", width: "18.584%", height: "22.364%" },
} as const;

const DS_PANEL_KINDS = new Set<(typeof DESIGN_SYSTEM_BLOCKS)[number]["kind"]>([
  "typography",
  "icons-badges",
  "tactical",
]);

/** Absolutely positioned Design System leaf matching a Figma frame slot. */
function DsPinnedAsset({
  src,
  alt,
  box,
  className = "",
}: {
  src: string;
  alt: string;
  box: { left: string; top: string; width: string; height: string };
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`pointer-events-none absolute object-contain ${className}`}
      style={{
        left: box.left,
        top: box.top,
        width: box.width,
        height: box.height,
      }}
      draggable={false}
      loading="lazy"
    />
  );
}

/** Renders curated media for each Design System block from individual Figma SVGs. */
function DesignSystemMedia({
  kind,
}: {
  kind: (typeof DESIGN_SYSTEM_BLOCKS)[number]["kind"];
}) {
  if (kind === "palette") {
    return (
      <div data-ogen-ds-media="palette" className="w-full">
        <DsAsset
          src={DS_COLOR_PALETTE}
          alt="OGEN operational color palette"
          className="h-auto w-full"
        />
      </div>
    );
  }

  if (kind === "typography") {
    // Figma Frame 237: headings on the right, button + body type near the bottom with ~143px gaps.
    return (
      <div
        data-ogen-ds-media="typography"
        className="relative w-full"
        style={{ aspectRatio: DS_TYPO_LAYOUT.aspect }}
      >
        <DsPinnedAsset
          src={DS_TYPOGRAPHY[0]}
          alt="OGEN typography headings"
          box={DS_TYPO_LAYOUT.headings}
          className="mix-blend-screen object-right-top"
        />
        <DsPinnedAsset
          src={DS_TYPOGRAPHY[1]}
          alt="OGEN button text scale"
          box={DS_TYPO_LAYOUT.buttons}
          className="mix-blend-screen object-right-bottom"
        />
        <DsPinnedAsset
          src={DS_TYPOGRAPHY[2]}
          alt="OGEN body and small text"
          box={DS_TYPO_LAYOUT.body}
          className="mix-blend-screen object-right-bottom"
        />
      </div>
    );
  }

  if (kind === "icons-badges") {
    // Figma Frame 238: icon grid on the left, status cluster on the right
    // (Pink→Blue→Green→Orange→Red across the top; two more oranges under the first orange).
    return (
      <div
        data-ogen-ds-media="icons-badges"
        className="relative w-full"
        style={{ aspectRatio: DS_ICONS_LAYOUT.aspect }}
      >
        <div
          data-ogen-ds-icons=""
          className="absolute bottom-[10%] left-[5%] top-[12%] grid w-[46%] grid-cols-6 content-between justify-items-center gap-x-3 gap-y-4"
        >
          {DS_ICONS.map((src, i) => (
            <DsAsset
              key={src}
              src={src}
              alt={`OGEN operational icon ${i + 1}`}
              className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
            />
          ))}
        </div>
        <div data-ogen-ds-status-badges="" className="contents">
          {DS_STATUS_BADGES.map(({ src, label, box }) => (
            <DsPinnedAsset
              key={src}
              src={src}
              alt={`OGEN status badge ${label}`}
              box={box}
              className="object-contain"
            />
          ))}
        </div>
      </div>
    );
  }

  // tactical atoms — Figma Frame 239 absolute slots
  return (
    <div
      data-ogen-ds-media="tactical"
      data-ogen-ds-atoms=""
      className="relative w-full"
      style={{ aspectRatio: DS_TACTICAL_LAYOUT.aspect }}
    >
      <DsPinnedAsset
        src={DS_BUTTONS.secondary}
        alt="OGEN secondary button"
        box={DS_TACTICAL_LAYOUT.secondary}
      />
      <DsPinnedAsset
        src={DS_BUTTONS.primary}
        alt="OGEN primary button"
        box={DS_TACTICAL_LAYOUT.primary}
      />
      <DsPinnedAsset
        src={DS_BUTTONS.wide}
        alt="OGEN wide CTA button"
        box={DS_TACTICAL_LAYOUT.wide}
      />
      <div data-ogen-ds-filters="" className="contents">
        <div data-ogen-ds-filter-authority="" className="contents">
          <DsPinnedAsset
            src={DS_FILTER_AUTHORITY.inactive}
            alt="OGEN authority filter inactive state"
            box={DS_TACTICAL_LAYOUT.authorityInactive}
          />
          <DsPinnedAsset
            src={DS_FILTER_AUTHORITY.active}
            alt="OGEN authority filter active state"
            box={DS_TACTICAL_LAYOUT.authorityActive}
          />
        </div>
        <DsPinnedAsset
          src={DS_FILTER_REPORTS}
          alt="OGEN reports filter bar — All, Unread, Starred"
          box={DS_TACTICAL_LAYOUT.filters}
        />
      </div>
      <DsPinnedAsset
        src={DS_INPUTS.rest}
        alt="OGEN text input rest state"
        box={DS_TACTICAL_LAYOUT.inputRest}
      />
      <DsPinnedAsset
        src={DS_INPUTS.focused}
        alt="OGEN text input focused state"
        box={DS_TACTICAL_LAYOUT.inputFocused}
      />
    </div>
  );
}

/** Anchor List pair side-by-side; report cards share the forms' asset scale
 *  (Figma report 771 / form 543 ≈ 1.42 × one column ≈ 68% of the pair). */
function DesignSystemPopups() {
  return (
    <div className="flex w-full flex-col gap-5 sm:gap-6" data-ogen-ds-popups="">
      <div
        data-ogen-ds-popup-anchor=""
        className="grid w-full grid-cols-1 items-start gap-4 sm:grid-cols-2 sm:gap-[3.8%]"
      >
        <DsAsset
          src={DS_POPUP_ANCHOR_NEW}
          alt="OGEN Anchor List add-person popup"
          className="aspect-[585/651] h-auto w-full"
        />
        <DsAsset
          src={DS_POPUP_ANCHOR}
          alt="OGEN Anchor List tactical popup"
          className="aspect-[585/692] h-auto w-full"
        />
      </div>
      <div
        data-ogen-ds-popup-reports=""
        className="ml-auto flex w-full flex-col gap-3 sm:w-[calc((100%-3.8%)/2*771/543)] sm:gap-4"
      >
        <DsAsset
          src={DS_POPUP_REPORT_NEW}
          alt="OGEN report popup unread"
          className="aspect-[771/228] h-auto w-full"
        />
        <DsAsset
          src={DS_POPUP_REPORT_READ}
          alt="OGEN report popup read"
          className="aspect-[770/198] h-auto w-full"
        />
      </div>
    </div>
  );
}

/** One Design System block per row (title + media). */
function DesignSystemSection({
  title,
  kind,
}: {
  title: string;
  kind: (typeof DESIGN_SYSTEM_BLOCKS)[number]["kind"];
}) {
  if (kind === "popups") {
    return (
      <div
        className={`flex w-full flex-col ${gapSubtitleClass}`}
        data-ogen-design-system-block={title}
      >
        <h4 className={smallTitleClass}>{title}</h4>
        <DesignSystemPopups />
      </div>
    );
  }

  const media = <DesignSystemMedia kind={kind} />;
  const body = DS_PANEL_KINDS.has(kind) ? (
    <div className={`${dsPanelClass} w-full`} data-ogen-ds-panel="">
      {media}
    </div>
  ) : (
    media
  );

  return (
    <div
      className={`flex w-full flex-col ${gapSubtitleClass}`}
      data-ogen-design-system-block={title}
    >
      <h4 className={smallTitleClass}>{title}</h4>
      {kind === "tactical" ? (
        <div data-ogen-ds-tactical-atoms="">{body}</div>
      ) : (
        body
      )}
    </div>
  );
}


function MediaVideo({
  src,
  title,
  className = "",
  cropX = OGEN_SCREEN_VIDEO.cropX,
  cropY = OGEN_SCREEN_VIDEO.cropY,
  /** CSS length used for wrapper radius + video clip-path. */
  radius = OGEN_SCREEN_VIDEO.radius,
  /** Source frame aspect before crop (screen recordings use 14.4×10.8). */
  sourceAspect = OGEN_SCREEN_VIDEO.sourceAspect,
}: {
  src: string;
  title: string;
  className?: string;
  cropX?: number;
  cropY?: number;
  radius?: string;
  sourceAspect?: { w: number; h: number };
}) {
  const innerW = 100 - cropX * 2;
  const innerH = 100 - cropY * 2;

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        aspectRatio: `${innerW * sourceAspect.w} / ${innerH * sourceAspect.h}`,
        borderRadius: radius,
      }}
    >
      <video
        src={src}
        title={title}
        autoPlay
        muted
        loop
        playsInline
        className="absolute max-w-none"
        style={{
          width: `${(100 / innerW) * 100}%`,
          height: `${(100 / innerH) * 100}%`,
          left: `${(-cropX / innerW) * 100}%`,
          top: `${(-cropY / innerH) * 100}%`,
          // Border-radius alone often fails on decoded <video>; clip-path removes cream corners.
          clipPath: `inset(0 round ${radius})`,
          WebkitClipPath: `inset(0 round ${radius})`,
          background: "none",
        }}
      />
    </div>
  );
}

/**
 * Renders images in a grid at one shared height (tallest natural height at
 * column width). Each image keeps full visibility via object-contain.
 * Single images still occupy one grid cell so they match paired-screen size.
 * Optional `hoverExpand` (Lumina VisualStyleGallery pattern): hovered column
 * grows to 4fr while others shrink to 1fr within the same row width.
 */
function MediaImageRow({
  images,
  altPrefix,
  columns = 2,
  className = "",
  itemDataAttrs,
  sharedHeight,
  onImagesReady,
  singleRow = false,
  /** Crop images to fill equal frames (same cell height). */
  cover = false,
  /** Desktop hover: expand hovered image, shrink siblings (grid fr animation). */
  hoverExpand = false,
}: {
  images: readonly string[];
  altPrefix: string;
  columns?: 2 | 3;
  className?: string;
  /** Applied to each image cell (e.g. data-ogen-hifi-screen). */
  itemDataAttrs?: Record<string, string>;
  /** Optional height imposed by a parent (e.g. whole High Fidelity section). */
  sharedHeight?: number | null;
  onImagesReady?: () => void;
  /** Keep all images on one row at every breakpoint (no stack). */
  singleRow?: boolean;
  cover?: boolean;
  hoverExpand?: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [rowHeight, setRowHeight] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const measure = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    const imgs = [...row.querySelectorAll("img")] as HTMLImageElement[];
    if (imgs.length === 0) return;
    if (!imgs.every((img) => img.naturalWidth > 0)) return;
    onImagesReady?.();

    // When a parent supplies sharedHeight, skip local equalization.
    if (sharedHeight != null) return;
    if (imgs.length < 2) return;

    let cellWidth: number;
    if (hoverExpand) {
      // Lock to equal-column rest width so hover animation does not change row height.
      const styles = getComputedStyle(row);
      const gap =
        Number.parseFloat(styles.columnGap) ||
        Number.parseFloat(styles.getPropertyValue("--grid-gutter")) ||
        20;
      const available = row.clientWidth;
      cellWidth = (available - gap * (imgs.length - 1)) / imgs.length;
    } else {
      const widths = imgs.map((img) => img.parentElement?.clientWidth ?? 0).filter((w) => w > 0);
      if (widths.length === 0) return;
      cellWidth = Math.min(...widths);
    }
    if (cellWidth <= 0) return;

    const heights = imgs.map(
      (img) => cellWidth * (img.naturalHeight / img.naturalWidth),
    );
    // Cover: match shortest so frames fill. Contain: match tallest so nothing is cropped.
    setRowHeight(cover ? Math.min(...heights) : Math.max(...heights));
  }, [cover, hoverExpand, images.length, onImagesReady, sharedHeight]);

  useEffect(() => {
    measure();
    const row = rowRef.current;
    if (!row) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(row);
    for (const img of row.querySelectorAll("img")) {
      ro.observe(img);
    }
    return () => ro.disconnect();
  }, [measure]);

  const colsClass = singleRow
    ? columns === 3
      ? "grid-cols-3"
      : "grid-cols-2"
    : columns === 3
      ? "grid-cols-1 sm:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2";
  const cellHeight = sharedHeight ?? rowHeight;

  const defaultTemplate = Array.from({ length: columns }, () => "1fr").join(" ");
  const hoverTemplate =
    hovered != null
      ? Array.from({ length: columns }, (_, c) => (c === hovered ? "4fr" : "1fr")).join(" ")
      : defaultTemplate;

  return (
    <div
      ref={rowRef}
      data-ogen-equal-image-row=""
      className={`grid items-stretch gap-3 gap-x-[var(--grid-gutter)] sm:gap-5 ${hoverExpand ? "" : colsClass} ${className}`}
      style={
        hoverExpand
          ? {
              gridTemplateColumns: hoverTemplate,
              transition: "grid-template-columns 0.35s ease",
            }
          : undefined
      }
      onMouseLeave={hoverExpand ? () => setHovered(null) : undefined}
    >
      {images.map((src, i) => (
          <div
            key={src}
            {...itemDataAttrs}
            className="min-h-0 min-w-0 overflow-hidden rounded-sm"
            style={
              cellHeight != null
                ? { height: cellHeight }
                : cover
                  ? { aspectRatio: "3 / 4" }
                  : undefined
            }
            onMouseEnter={hoverExpand ? () => setHovered(i) : undefined}
          >
          <img
            src={src}
            alt={`${altPrefix} ${i + 1}`}
            className={`block h-full w-full ${cover ? "object-cover" : "object-contain"} ${
              hoverExpand
                ? `cursor-pointer transition-opacity duration-300 ${
                    hovered === i
                      ? "opacity-100"
                      : hovered !== null
                        ? "opacity-50"
                        : "opacity-100"
                  }`
                : ""
            }`}
            loading="lazy"
            onLoad={measure}
          />
        </div>
      ))}
    </div>
  );
}

/** Tunnel Vision | Night Blind Spot: subtle image scale toward center + up.
 *  Layout stays fixed (`2fr 1fr 2fr`); text does not move. */
function VisionPhenomenaPair() {
  const [hovered, setHovered] = useState<number | null>(null);

  const renderCard = (index: 0 | 1) => {
    const { title, desc, image } = VISION_PHENOMENA[index];
    const isHovered = hovered === index;
    const somethingHovered = hovered !== null;
    /** Left grows up+right; right grows up+left — both toward the center gap. */
    const transformOrigin = index === 0 ? "left bottom" : "right bottom";
    return (
      <div
        key={title}
        data-ogen-vision-phenomenon={title}
        className="flex min-w-0 flex-col gap-3"
        onMouseEnter={() => setHovered(index)}
      >
        <div className="relative z-0 min-w-0 overflow-visible">
          <img
            src={image}
            alt={title}
            className={`relative block h-auto w-full rounded-sm object-cover cursor-pointer transition-[transform,opacity] duration-300 ease-out ${
              isHovered ? "z-10 opacity-100" : somethingHovered ? "z-0 opacity-50" : "z-0 opacity-100"
            }`}
            style={{
              transform: isHovered ? "scale(1.22)" : "scale(1)",
              transformOrigin,
            }}
            loading="lazy"
          />
        </div>
        <div className="relative z-0 flex flex-col gap-1">
          <h4 className={smallTitleClass}>{title}</h4>
          <p className={bodyTextClass}>{desc}</p>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-8 md:grid md:grid-cols-[2fr_1fr_2fr] md:gap-0 pt-[length:var(--pad-column-y)]`}
      data-ogen-vision-phenomena=""
      onMouseLeave={() => setHovered(null)}
    >
      {renderCard(0)}
      <div className="hidden min-w-0 md:block" aria-hidden />
      {renderCard(1)}
    </div>
  );
}

/** Market Reality: two-row gallery with Lumina-style 2D hover expand.
 *  Hovering any image grows its column and its row; the other row shrinks.
 *  Total group height stays fixed; object-cover fills cells.
 *  Both axes use O(1) flex-grow (1—4) so width and height animate in sync. */
function MarketRealityGallery() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [restHeights, setRestHeights] = useState<{ h1: number; h2: number } | null>(null);
  /** Global hover across both rows: which row + column index. */
  const [hovered, setHovered] = useState<{ row: 0 | 1; col: number } | null>(null);

  const measure = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const imgs = [...root.querySelectorAll("img")] as HTMLImageElement[];
    if (imgs.length < MARKET_REALITY_IMGS.length) return;
    if (!imgs.every((img) => img.naturalWidth > 0)) return;

    const available = root.clientWidth;
    if (available <= 0) return;

    /** Match disaster-scene MediaImageRow: gap-x grid gutter / sm:gap-5. */
    const styles = getComputedStyle(root);
    const MIN_GAP =
      Number.parseFloat(styles.getPropertyValue("--grid-gutter")) ||
      20;
    const row1Imgs = imgs.slice(0, MARKET_REALITY_ROW_1.length);
    const row2Imgs = imgs.slice(MARKET_REALITY_ROW_1.length);

    /** Cover-mode height: equal columns, use shortest natural aspect so cells fill. */
    const heightForRow = (rowImgs: HTMLImageElement[]) => {
      const n = rowImgs.length;
      if (n === 0) return 0;
      const gaps = MIN_GAP * Math.max(0, n - 1);
      const cellWidth = (available - gaps) / n;
      if (cellWidth <= 0) return 0;
      const heights = rowImgs.map(
        (img) => cellWidth * (img.naturalHeight / img.naturalWidth),
      );
      return Math.min(...heights);
    };

    const h1 = heightForRow(row1Imgs);
    const h2 = heightForRow(row2Imgs);
    if (h1 > 0 && h2 > 0) setRestHeights({ h1, h2 });
  }, []);

  useEffect(() => {
    measure();
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(root);
    return () => ro.disconnect();
  }, [measure]);

  const gapY = 20; // matches gap-5 between rows
  const totalHeight =
    restHeights != null ? restHeights.h1 + restHeights.h2 + gapY : 240 + 210 + gapY;

  /** Rest row grows stay O(1) so hover 1—4 interpolates evenly with column grows. */
  const restRow2Grow =
    restHeights != null && restHeights.h1 > 0 ? restHeights.h2 / restHeights.h1 : 1;

  const rowGrow = (rowIndex: 0 | 1) => {
    if (hovered == null) return rowIndex === 0 ? 1 : restRow2Grow;
    if (hovered.row === rowIndex) return 4;
    return 1;
  };

  const colGrow = (rowIndex: 0 | 1, col: number) => {
    if (hovered?.row === rowIndex && hovered.col === col) return 4;
    return 1;
  };

  const flexTransition = "flex-grow 0.35s ease";

  const renderRow = (
    sources: readonly string[],
    altOffset: number,
    rowIndex: 0 | 1,
    rowAttr: string,
  ) => (
    <div
      className="flex min-h-0 w-full gap-3 gap-x-[var(--grid-gutter)] sm:gap-5"
      data-ogen-equal-image-row=""
      {...{ [rowAttr]: "" }}
      style={{
        flexGrow: rowGrow(rowIndex),
        flexShrink: 1,
        flexBasis: 0,
        transition: flexTransition,
      }}
    >
      {sources.map((src, i) => {
        const isHovered = hovered?.row === rowIndex && hovered.col === i;
        const somethingHovered = hovered !== null;
        return (
          <div
            key={src}
            className="min-h-0 min-w-0 overflow-hidden rounded-sm"
            style={{
              flexGrow: colGrow(rowIndex, i),
              flexShrink: 1,
              flexBasis: 0,
              transition: flexTransition,
            }}
            onMouseEnter={() => setHovered({ row: rowIndex, col: i })}
          >
            <img
              src={src}
              alt={`Market reality reference ${altOffset + i + 1}`}
              className={`block h-full w-full object-cover cursor-pointer transition-opacity duration-300 ${
                isHovered
                  ? "opacity-100"
                  : somethingHovered
                    ? "opacity-50"
                    : "opacity-100"
              }`}
              loading="lazy"
              onLoad={measure}
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      ref={rootRef}
      data-ogen-market-reality=""
      className="flex w-full flex-col gap-5"
      style={{ height: totalHeight }}
      onMouseLeave={() => setHovered(null)}
    >
      {renderRow(MARKET_REALITY_ROW_1, 0, 0, "data-ogen-market-reality-row1")}
      {renderRow(
        MARKET_REALITY_ROW_2,
        MARKET_REALITY_ROW_1.length,
        1,
        "data-ogen-market-reality-row2",
      )}
    </div>
  );
}

/** Design — Screens: horizontal drag carousel of title + body + video cards.
 *  Subgrid columns share one text-row height so all videos start on the same baseline. */
function ScreensCarousel() {
  const { ref, onMouseDown } = useDragScroll();

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
      data-ogen-screens-carousel=""
    >
      <div
        className={`grid w-max grid-flow-col grid-rows-[auto_auto] gap-x-[var(--gap-tight-strip)] gap-y-3 auto-cols-[85vw] md:auto-cols-[calc((100vw-2*var(--grid-margin)-var(--grid-gutter))/2)]`}
      >
        {DESIGN_SCREENS.map((screen) => (
          <div 
            key={screen.title}
            className="col-span-1 row-span-2 grid grid-rows-subgrid"
            data-ogen-design-screen={screen.title}
          >
            <div data-ogen-screen-text="" className={`flex flex-col ${gapSubtitleClass}`}>
              <div className="flex flex-col gap-1">
                <h4 className={smallTitleClass}>{screen.title}</h4>
                <p className={bodyTextClass}>{screen.desc}</p>
              </div>
              {"note" in screen && screen.note ? (
                <div className="flex flex-col gap-1">
                  <p className={`${bodyTextClass} !font-normal`}>{screen.note.title}:</p>
                  <p className={bodyTextClass}>{screen.note.desc}</p>
                </div>
              ) : null}
            </div>
            {"video" in screen && screen.video ? (
              <MediaVideo src={screen.video} title={`OGEN ${screen.title} screen`} />
            ) : (
              <MediaPlaceholder label={screen.title} aspect="aspect-[16/9]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Same slide width as Screens / Aviv KeyFeatures carousels. */
const hifiSlideClass =
  "w-[85vw] md:w-[calc((100vw-2*var(--grid-margin)-var(--grid-gutter))/2)] shrink-0";

/** High Fidelity: horizontal drag carousel of title + screen stills (Aviv KeyFeatures pattern).
 *  Images use pointer-events-none so native image-drag cannot steal the grab scroll. */
function HiFiScreensCarousel() {
  const { ref, onMouseDown } = useDragScroll();

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
      data-ogen-hifi-screens=""
      data-ogen-hifi-carousel=""
    >
      <div className={`flex ${gapTightStripClass} w-max`}>
        {HIFI_SCREENS.map(({ title, src }) => (
          <div
            key={title}
            className={`flex flex-col ${gapSubtitleClass} ${hifiSlideClass}`}
            data-ogen-hifi-group={title}
            data-ogen-hifi-screen={title}
          >
            <h4 className={smallTitleClass}>{title}</h4>
            <img
              src={src}
              alt={`OGEN ${title} screen`}
              className="block h-auto w-full rounded-sm pointer-events-none"
              draggable={false}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Diagram primitives (navy boxes + navy connectors on page background) ───
const DIAGRAM_SHELL_CLASS = "w-full overflow-hidden";
const DIAGRAM_LINE_CLASS = "bg-[#5F4DE5]";
/** Shared connector weight for User Flow + Information Architecture (SVG + CSS). */
const DIAGRAM_STROKE_PX = 2.5;
const DIAGRAM_STROKE = "#5F4DE5";
const DIAGRAM_LINE_H = `h-[2.5px] ${DIAGRAM_LINE_CLASS}`;
const DIAGRAM_LINE_V = `w-[2.5px] ${DIAGRAM_LINE_CLASS}`;

type DiagramNodeSize = "big" | "small" | "flow";

/** A single node box used inside the flow and IA diagrams.
 *  Height is fixed by size; width fits text, fills the column when `fill` is set,
 *  or uses an explicit pixel width when `widthPx` is provided. */
function DiagramNode({
  label,
  size = "big",
  fill = false,
  widthPx,
}: {
  label: string;
  size?: DiagramNodeSize;
  fill?: boolean;
  widthPx?: number;
}) {
  const sizeClass =
    size === "flow"
      ? "h-24 px-5 sm:h-28 sm:px-6 bg-[#1D1838] border-[#1D1838]"
      : size === "big"
        ? "h-20 px-5 sm:h-24 sm:px-6 bg-[#1D1838] border-[#1D1838]"
        : "h-16 px-5 sm:h-[4.5rem] sm:px-6 bg-[#352D6A] border-[#352D6A]";
  const textClass =
    size === "flow"
      ? "text-[34px] sm:text-[42px] font-normal"
      : size === "big"
        ? "text-[28px] sm:text-[34px] font-normal"
        : "text-[22px] sm:text-[26px] font-normal";
  const widthClass = widthPx ? "shrink-0" : fill ? "w-full min-w-0" : "w-max shrink-0";

  return (
    <div
      className={`relative z-10 flex ${widthClass} items-center justify-center rounded-[6px] border ${sizeClass} text-center`}
      style={widthPx ? { width: widthPx } : undefined}
    >
      <span
        className={`whitespace-nowrap font-['Bricolage_Grotesque'] leading-none text-white ${textClass}`}
      >
        {label}
      </span>
    </div>
  );
}

/** Scales children down uniformly so wide diagrams fit without horizontal scroll. */
function FitScale({ children }: { children: ReactNode }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shell = shellRef.current;
    const frame = frameRef.current;
    const content = contentRef.current;
    if (!shell || !frame || !content) return;

    const update = () => {
      content.style.transform = "scale(1)";
      frame.style.width = "max-content";
      frame.style.height = "auto";

      const available = shell.clientWidth;
      const naturalWidth = content.scrollWidth;
      const naturalHeight = content.scrollHeight;
      const scale = naturalWidth > 0 ? Math.min(1, available / naturalWidth) : 1;

      content.style.transform = `scale(${scale})`;
      frame.style.width = `${naturalWidth * scale}px`;
      frame.style.height = `${naturalHeight * scale}px`;
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(shell);
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={shellRef} className="w-full overflow-hidden">
      <div ref={frameRef} className="overflow-hidden">
        <div ref={contentRef} className="w-max origin-top-left will-change-transform">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── User Flow: serpentine of connected steps ───
const FLOW_ROWS: string[][] = [
  [
    "System Entry",
    "Forwarding Requests to Battalion",
    "On-Site Data Collection",
    "Collecting Data in Anchor List",
  ],
  [
    "Tracking Anchor List",
    "Refining All Authority Data",
    "Receiving Data from Authorities",
    "Status Overview",
  ],
  ["Directing Forces", "Closing Population Story"],
];

/** Horizontal gap between equal flow columns (kept generous so FitScale still leaves clear space). */
const FLOW_GAP_PX = 160;
/** Equal columns — wide enough for the longest flow label at flow type size. */
const FLOW_COLUMN_PX = 720;
const FLOW_COLS = 4;
const FLOW_STAIR_PX = 112;
const FLOW_STROKE = DIAGRAM_STROKE;

type FlowSeg = { x1: number; y1: number; x2: number; y2: number };

/** One flow row inside a parent 4-column grid (uses subgrid so columns stay aligned). */
function FlowRow({
  rowIndex,
  labels,
  align = "start",
}: {
  rowIndex: number;
  labels: string[];
  align?: "start" | "end";
}) {
  const emptyCount = Math.max(0, FLOW_COLS - labels.length);
  const leadingEmptyCount = align === "end" ? emptyCount : 0;
  const trailingEmptyCount = align === "start" ? emptyCount : 0;

  return (
    <div className={`relative col-span-4 grid grid-cols-subgrid`}>
      {Array.from({ length: leadingEmptyCount }).map((_, index) => (
        <div key={`leading-empty-${index}`} />
      ))}
      {labels.map((label, index) => (
        <div
          key={label}
          data-flow-node={`${rowIndex}-${leadingEmptyCount + index}`}
          className="relative z-10 flex items-center justify-center px-0"
        >
          <DiagramNode label={label} size="flow" fill />
        </div>
      ))}
      {Array.from({ length: trailingEmptyCount }).map((_, index) => (
        <div key={`trailing-empty-${index}`} />
      ))}
    </div>
  );
}

function UserFlowDiagram() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [segments, setSegments] = useState<FlowSeg[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const measure = () => {
      const rootRect = root.getBoundingClientRect();
      const scale = root.offsetWidth > 0 ? rootRect.width / root.offsetWidth : 1;
      const local = (rect: DOMRect) => ({
        left: (rect.left - rootRect.left) / scale,
        right: (rect.right - rootRect.left) / scale,
        top: (rect.top - rootRect.top) / scale,
        bottom: (rect.bottom - rootRect.top) / scale,
        cx: (rect.left + rect.width / 2 - rootRect.left) / scale,
        cy: (rect.top + rect.height / 2 - rootRect.top) / scale,
      });

      const node = (row: number, col: number) => {
        const el = root.querySelector(`[data-flow-node="${row}-${col}"]`);
        return el ? local(el.getBoundingClientRect()) : null;
      };

      const next: FlowSeg[] = [];
      const linkGap = (row: number, fromCol: number, toCol: number) => {
        const a = node(row, fromCol);
        const b = node(row, toCol);
        if (!a || !b) return;
        next.push({ x1: a.right, y1: a.cy, x2: b.left, y2: b.cy });
      };
      const linkStair = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
        const a = node(fromRow, fromCol);
        const b = node(toRow, toCol);
        if (!a || !b) return;
        const midY = (a.bottom + b.top) / 2;
        next.push({ x1: a.cx, y1: a.bottom, x2: a.cx, y2: midY });
        next.push({ x1: a.cx, y1: midY, x2: b.cx, y2: midY });
        next.push({ x1: b.cx, y1: midY, x2: b.cx, y2: b.top });
      };

      // Row horizontals (4–4–2)
      linkGap(0, 0, 1);
      linkGap(0, 1, 2);
      linkGap(0, 2, 3);
      linkGap(1, 0, 1);
      linkGap(1, 1, 2);
      linkGap(1, 2, 3);
      linkGap(2, 0, 1);
      // Stairs reset from column 4 back to column 1
      linkStair(0, 3, 1, 0);
      linkStair(1, 3, 2, 0);

      setSegments(next);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={DIAGRAM_SHELL_CLASS} data-ogen-diagram="user-flow">
      <FitScale>
        <div ref={rootRef} className="relative w-max">
          <svg
            className="pointer-events-none absolute inset-0 z-0 overflow-visible"
            width="100%"
            height="100%"
            aria-hidden
          >
            {segments.map((seg, index) => (
              <line
                key={`flow-seg-${index}`}
                x1={seg.x1}
                y1={seg.y1}
                x2={seg.x2}
                y2={seg.y2}
                stroke={FLOW_STROKE}
                strokeWidth={DIAGRAM_STROKE_PX}
                strokeLinecap="square"
                data-ogen-flow-line={index === 0 ? "sample" : undefined}
              />
            ))}
          </svg>

          <div
            className="relative z-10 grid"
            style={{
              gridTemplateColumns: `repeat(${FLOW_COLS}, ${FLOW_COLUMN_PX}px)`,
              columnGap: FLOW_GAP_PX,
            }}
          >
            <FlowRow rowIndex={0} labels={FLOW_ROWS[0]} />
            <div className="col-span-4" style={{ height: FLOW_STAIR_PX }} aria-hidden data-ogen-flow-stair="" />
            <FlowRow rowIndex={1} labels={FLOW_ROWS[1]} />
            <div className="col-span-4" style={{ height: FLOW_STAIR_PX }} aria-hidden data-ogen-flow-stair="" />
            <FlowRow rowIndex={2} labels={FLOW_ROWS[2]} />
          </div>
        </div>
      </FitScale>
    </div>
  );
}

// ─── Information Architecture: hierarchical tree ───
const IA_TREE: { title: string; children: string[] }[] = [
  { title: "Status Overview", children: [] },
  {
    title: "Anchor List",
    children: [
      "Individual View",
      "Add New Person",
      "Full List",
      "Cross-Referencing Recommendations",
    ],
  },
  {
    title: "Battalion Reports",
    children: ["All Reports", "Detailed Report View", "Battalion Direct Chat"],
  },
  { title: "Building Schematic", children: ["Structure Definition", "Data Entry"] },
  {
    title: "NCO Aids",
    children: ["SOPs", "Important Contacts", "Personnel Tracking", "Yahalom Unit"],
  },
  { title: "Interview Forms", children: [] },
  { title: "Documents", children: [] },
];

/** Equal-width columns give uniform gaps between the seven category boxes.
 *  Column is wide enough for the longest small label ("Cross-Referencing Recommendations"). */
const IA_COLUMN_PX = 460;
const IA_BIG_WIDTH_PX = 340;
/** Vertical rhythm — kept loose so the tree doesn't feel cramped. */
const IA_TRUNK_GAP_PX = 40;
const IA_DROP_PX = 36;
const IA_SMALL_GAP_CLASS = "mt-6 flex flex-col items-center gap-8";
const IA_COL_GAP_CLASS = "gap-x-6 sm:gap-x-10";

function IADiagram() {
  const [isNarrow, setIsNarrow] = useState(false);
  const cols = IA_TREE.length;
  const treeRef = useRef<HTMLDivElement>(null);
  const [trunkBus, setTrunkBus] = useState<{
    trunkTop: number;
    trunkBottom: number;
    trunkX: number;
    busY: number;
    busLeft: number;
    busRight: number;
    dropBottoms: number[];
    dropXs: number[];
  } | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1199px)");
    const sync = () => setIsNarrow(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const tree = treeRef.current;
    if (!tree || isNarrow) return;

    const measure = () => {
      const system = tree.querySelector<HTMLElement>('[data-ia-node="system"]');
      const dashboard = tree.querySelector<HTMLElement>('[data-ia-node="dashboard"]');
      const categories = [...tree.querySelectorAll<HTMLElement>('[data-ia-node="category"]')];
      if (!system || !dashboard || categories.length === 0) return;

      const treeRect = tree.getBoundingClientRect();
      // FitScale applies a CSS transform; convert screen deltas back to local SVG units.
      const scale = tree.offsetWidth > 0 ? treeRect.width / tree.offsetWidth : 1;
      const toLocalX = (rect: DOMRect) => (rect.left + rect.width / 2 - treeRect.left) / scale;
      const toLocalY = (screenY: number) => (screenY - treeRect.top) / scale;

      const systemRect = system.getBoundingClientRect();
      const dashboardRect = dashboard.getBoundingClientRect();
      const categoryRects = categories.map((node) => node.getBoundingClientRect());

      const trunkX = toLocalX(systemRect);
      const busY = toLocalY(dashboardRect.bottom) + IA_TRUNK_GAP_PX;
      const dropXs = categoryRects.map((rect) => toLocalX(rect));
      const busLeft = Math.min(...dropXs);
      const busRight = Math.max(...dropXs);

      setTrunkBus({
        trunkTop: toLocalY(systemRect.bottom),
        trunkBottom: busY,
        trunkX,
        busY,
        busLeft,
        busRight,
        dropBottoms: categoryRects.map((rect) => toLocalY(rect.top)),
        dropXs,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(tree);
    return () => observer.disconnect();
  }, [isNarrow]);

  if (isNarrow) {
    return (
      <div className={DIAGRAM_SHELL_CLASS} data-ogen-diagram="information-architecture">
        <FitScale>
          <div className="flex w-max flex-col items-start gap-6">
            <div className="flex flex-col items-start">
              <DiagramNode label="System Entry" size="big" widthPx={IA_BIG_WIDTH_PX} />
              <div className={`ml-4 h-8 ${DIAGRAM_LINE_V}`} />
              <DiagramNode label="Dashboard" size="big" widthPx={IA_BIG_WIDTH_PX} />
            </div>
            {IA_TREE.map(({ title, children }) => (
              <div key={title} className="flex flex-col items-start pl-2">
                <div className={`mb-2 h-6 ${DIAGRAM_LINE_V}`} />
                <DiagramNode label={title} size="big" widthPx={IA_BIG_WIDTH_PX} />
                {children.length > 0 && (
                  <div className="mt-6 flex flex-col items-start gap-8 pl-5">
                    {children.map((child) => (
                      <DiagramNode key={child} label={child} size="small" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </FitScale>
      </div>
    );
  }

  return (
    <div className={DIAGRAM_SHELL_CLASS} data-ogen-diagram="information-architecture">
      <FitScale>
        <div ref={treeRef} className="relative w-max">
          {/* Single SVG connector layer — one trunk, one bus, aligned drops (no stepped segments). */}
          {trunkBus && (
            <svg
              className="pointer-events-none absolute inset-0 z-0 overflow-visible"
              width="100%"
              height="100%"
              aria-hidden
            >
              <line
                data-ogen-ia-trunk=""
                x1={trunkBus.trunkX}
                y1={trunkBus.trunkTop}
                x2={trunkBus.trunkX}
                y2={trunkBus.trunkBottom}
                stroke={DIAGRAM_STROKE}
                strokeWidth={DIAGRAM_STROKE_PX}
                strokeLinecap="square"
              />
              <line
                data-ogen-ia-bus=""
                x1={trunkBus.busLeft}
                y1={trunkBus.busY}
                x2={trunkBus.busRight}
                y2={trunkBus.busY}
                stroke={DIAGRAM_STROKE}
                strokeWidth={DIAGRAM_STROKE_PX}
                strokeLinecap="square"
              />
              {trunkBus.dropXs.map((x, index) => (
                <line
                  key={`drop-${index}`}
                  x1={x}
                  y1={trunkBus.busY}
                  x2={x}
                  y2={trunkBus.dropBottoms[index]}
                  stroke={DIAGRAM_STROKE}
                  strokeWidth={DIAGRAM_STROKE_PX}
                  strokeLinecap="square"
                />
              ))}
            </svg>
          )}

          <div className="relative z-10 flex flex-col items-center">
            <div data-ia-node="system">
              <DiagramNode label="System Entry" size="big" widthPx={IA_BIG_WIDTH_PX} />
            </div>
            <div style={{ height: IA_TRUNK_GAP_PX }} aria-hidden />
            <div data-ia-node="dashboard">
              <DiagramNode label="Dashboard" size="big" widthPx={IA_BIG_WIDTH_PX} />
            </div>
            <div style={{ height: IA_TRUNK_GAP_PX + IA_DROP_PX }} aria-hidden />

            <div
              className={`grid ${IA_COL_GAP_CLASS}`}
              style={{ gridTemplateColumns: `repeat(${cols}, ${IA_COLUMN_PX}px)` }}
            >
              {IA_TREE.map(({ title, children }) => (
                <div key={title} className="flex flex-col items-center">
                  <div data-ia-node="category">
                    <DiagramNode label={title} size="big" widthPx={IA_BIG_WIDTH_PX} />
                  </div>
                  {children.length > 0 && (
                    <div className={IA_SMALL_GAP_CLASS}>
                      {children.map((child) => (
                        <DiagramNode key={child} label={child} size="small" />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </FitScale>
    </div>
  );
}

interface OgenProps {
  onSelectSection: (id: string) => void;
  onReady?: () => void;
}

export default function Ogen({ onSelectSection, onReady }: OgenProps) {
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
      {/* — Hero + Intro = min 100vh — */}
      <div className="min-h-screen flex flex-col">
        {/* Hero video — aspect strip */}
        <ProjectHeroVideo src={HERO_VIDEO} poster={HERO_POSTER} fillViewport />

        {/* Project Intro */}
        <section className="flex-1 flex flex-col justify-start md:justify-center">
          <PageGrid className={sectionPageGridStretchClass}>
            {/* — Row 1: Title + slogan + icon — */}
            <div className={`col-span-8 md:col-start-2 md:col-span-6 flex flex-col md:flex-row md:items-end gap-6 md:gap-10 ${sectionColumnPaddingClass} pb-0`}>
              <div className={`flex min-w-0 flex-col ${gapSubtitleClass}`}>
                <h3 className={projectHeroNameClass}>OGEN System</h3>
                <p className={`${subTitleClass} leading-[1.5]`}>
                  Making order in the chaos
                </p>
              </div>
              <div className="order-first flex shrink-0 justify-start md:order-none md:ml-6">
                <img
                  src={APP_ICON}
                  alt="OGEN app icon"
                  className="h-auto w-[calc(var(--media-app-icon)*0.75)] shrink-0 object-contain"
                  loading="lazy"
                />
              </div>
            </div>

            {/* — Row 2: Tag pills (cols 2-7) — */}
            <div className="col-span-8 md:col-start-2 md:col-span-6 flex flex-wrap items-center gap-y-3 gap-x-8 md:gap-x-12 py-4">
              {OGEN_INTRO_TAGS.map((label) => (
                <span
                  key={label}
                  className={`${smallTitleClass} inline-flex border border-[#2200b8] px-3 py-1`}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* — Row 3: Brief / Concept / Tools — */}
            <div className="[grid-column:1/-1] md:[grid-column:2/8] flex flex-col md:flex-row md:justify-between gap-y-6 gap-x-[var(--grid-gutter)]">
              <IntroToggle label="Brief" className="md:w-2/6 md:shrink-0">
                <p className={bodyTextClass}>{OGEN_BRIEF}</p>
              </IntroToggle>
              <IntroToggle label="Concept" className="md:w-2/6 md:shrink-0">
                <p className={bodyTextClass}>{OGEN_CONCEPT}</p>
              </IntroToggle>
              <IntroToggle label="Tools" className="md:shrink-0">
                <ul className={`${bodyTextClass} list-none space-y-1`}>
                  {OGEN_TOOLS.map((tool) => (
                    <li key={tool}>{tool}</li>
                  ))}
                </ul>
              </IntroToggle>
            </div>

            {/* — Screens overview video — */}
            <div className={`col-span-8 md:col-start-2 md:col-span-6 mt-6 md:mt-10 ${sectionColumnPaddingClass} pt-0 flex justify-center`}>
              <div className="w-5/6">
                <MediaVideo src={INTRO_SCREENS_VIDEO} title="OGEN screens overview" />
              </div>
            </div>
          </PageGrid>
        </section>
      </div>

      {/* — Divider — */}
      <div className="w-full border-t border-[#2200b8]" />

      {/* — Research — */}
      <section>
        <MobileStickyTitle leading="leading-[1.5]">Research</MobileStickyTitle>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className={`${TITLE_COL_DESKTOP_CLASS} md:row-span-5`}>
            <h2 className={`${stickyTitleClass} leading-[1.5]`}>Research</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-4 flex flex-col ${gapContentClass} ${sectionColumnPaddingClass}`}>
            {/* The Problem */}
            <div className={`flex flex-col ${gapSubtitleClass}`}>
              <h3 className={subTitleClass}>What is a Disaster Scene?</h3>
              <p className={bodyTextClass}>
                In a building collapse, rescuers cannot work effectively without knowing who was
                inside and where they were. Until everyone is accounted for, the event is not over.
                In the first critical hours, information arrives from fragmented sources all at once,
                creating complete chaos. OGEN turns that chaotic input into clear, actionable data.
              </p>
            </div>
          </div>

          {/* Disaster scenes — one equal-height row spanning columns 3–8 */}
          <div
            className={`col-span-8 md:col-start-3 md:col-span-6 ${sectionColumnPaddingClass}`}
            data-ogen-disaster-scenes=""
          >
            <MediaImageRow
              images={DISASTER_SCENES}
              altPrefix="Disaster scene research reference"
              columns={3}
              singleRow
              cover
              hoverExpand
            />
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-6 flex flex-col ${gapContentClass} ${sectionColumnPaddingClass}`}>
            {/* Information Sources */}
            <div className={`flex flex-col ${gapSubtitleClass}`}>
              <h3 className={subTitleClass}>Where Does the Information Come From?</h3>
              <ul className="grid grid-cols-1 gap-x-[var(--grid-gutter)] gap-y-3 sm:grid-cols-2 sm:gap-y-4">
                {INFO_SOURCES.map((source) => (
                  <li key={source} className={smallTitleClass}>• {source}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-4 flex flex-col ${gapContentClass} ${sectionColumnPaddingClass}`}>
            {/* Market Reality & Existing Systems */}
            <div className={`flex flex-col ${gapSubtitleClass}`}>
              <h3 className={subTitleClass}>Market Reality &amp; Existing Systems</h3>
              <p className={bodyTextClass}>
                Currently, no digital system exists for field teams, who rely on pen, paper, and
                whiteboards. For baseline reference, we looked at military command systems like ZAYAD
                750, DROR, and MAYA.
                <br />
                Analyzing these existing systems highlighted a key insight: the core strength and
                priority of our interface must be complete simplicity and clarity.
              </p>
            </div>
          </div>

          {/* Market Reality media — shared height, native proportions, two rows (cols 3–7) */}
          <div
            className={`col-span-8 md:col-start-3 md:col-span-5 ${sectionColumnPaddingClass}`}
          >
            <MarketRealityGallery />
          </div>
        </PageGrid>
      </section>

      {/* — Divider — */}
      <div className="w-full border-t border-[#2200b8]" />

      {/* — Challenges — */}
      <section>
        <MobileStickyTitle>Challenges</MobileStickyTitle>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className={`${TITLE_COL_DESKTOP_CLASS} md:row-span-5`}>
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Challenges</h2>
          </div>

          <div
            className={`col-span-8 md:col-start-3 md:col-span-4 flex flex-col ${gapContentClass} ${sectionColumnPaddingClass}`}
            data-ogen-extreme-conditions=""
          >
            <div className={`flex flex-col ${gapSubtitleClass}`}>
              <h3 className={subTitleClass}>Designing for Extreme Conditions</h3>
              <p className={bodyTextClass}>{EXTREME_CONDITION_INTRO}</p>
            </div>
          </div>

          <div
            className={`col-span-8 md:col-start-3 md:col-span-6 ${sectionColumnPaddingClass}`}
            data-ogen-extreme-condition-sections=""
          >
            {/* Stacked pairs: problem | Interface Solutions (LTR on md+) */}
            <div className={`flex flex-col ${gapContentClass}`}>
              {EXTREME_CONDITION_SECTIONS.map(({ title, effects, solutions }) => (
                <div
                  key={title}
                  className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-x-[var(--grid-gutter)]"
                  data-ogen-extreme-condition-pair=""
                >
                  <div className="flex min-w-0 flex-col gap-3">
                    <h4 className={smallTitleClass}>{title}</h4>
                    <ul className={`${bodyTextClass} list-none space-y-1`}>
                      {effects.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex min-w-0 flex-col gap-3">
                    <p className={smallTitleClass} data-ogen-interface-solutions="">
                      Interface Solutions:
                    </p>
                    <ul className={`${bodyTextClass} list-none space-y-1`}>
                      {solutions.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`col-span-8 md:col-start-3 md:col-span-4 flex flex-col ${gapContentClass} ${sectionColumnPaddingClass}`}
            data-ogen-vision-conflict=""
          >
            <div className={`flex flex-col ${gapSubtitleClass}`}>
              <h3 className={subTitleClass}>Tunnel Vision VS Night Blind Spot</h3>
              <p className={bodyTextClass}>{VISION_CONFLICT_INTRO}</p>
            </div>
          </div>

          <VisionPhenomenaPair />

          <div
            className="col-span-8 md:col-start-3 md:col-span-5 flex flex-col gap-12 mt-12 pb-[length:var(--pad-column-y)]"
            data-ogen-vision-solution=""
          >
            <div
              data-ogen-ux-ui-solution=""
              className="rounded-[6px] bg-[radial-gradient(circle_at_center,#2A2372_0%,#000000_100%)] p-5 sm:p-6 flex flex-col gap-1 text-white"
            >
              <h4 className={`${smallTitleClass} text-white`}>UX UI Solution</h4>
              <p className={`${bodyTextClass} text-white`}>{VISION_UX_SOLUTION}</p>
            </div>
            <MediaImage
              src={SYSTEM_MOCKUP_NIGHT}
              alt="OGEN system mockup in operational dark mode"
            />
          </div>
        </PageGrid>
      </section>

      {/* — Divider — */}
      <div className="w-full border-t border-[#2200b8]" />

      {/* — User Persona — */}
      <section>
        <MobileStickyTitle>User Persona</MobileStickyTitle>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className={TITLE_COL_DESKTOP_CLASS}>
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>User Persona</h2>
          </div>

          <div className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col ${gapContentClass} ${sectionColumnPaddingClass}`}>
            <div
              data-ogen-persona-card=""
              className="overflow-hidden rounded-[6px] bg-[radial-gradient(circle_at_center,#2A2372_0%,#000000_100%)] text-white shadow-[0_0_5px_rgba(0,0,0,0.15)]"
            >
              <div className="flex flex-col sm:flex-row sm:items-stretch">
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-5 self-stretch p-5 sm:gap-6 sm:p-6 lg:gap-8 lg:p-8 order-2 sm:order-1">
                  {PERSONA_ROWS.map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-1">
                      <h4 className="font-['Bricolage_Grotesque'] font-semibold text-[length:var(--text-small-title)] tracking-[0.5px] text-white">
                        {label}
                      </h4>
                      <p className="font-['Bricolage_Grotesque'] font-light text-[length:var(--text-body)] leading-[1.5] tracking-[0.5px] text-white/90">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="w-full shrink-0 sm:w-[48%] md:w-[52%] lg:w-[55%] order-1 sm:order-2">
                  <img
                    src={PERSONA_IMG}
                    alt="Population NCO user persona"
                    className="h-56 w-full object-cover object-center sm:h-full sm:min-h-full"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </PageGrid>
      </section>

      {/* — Divider — */}
      <div className="w-full border-t border-[#2200b8]" />

      {/* — Architecture: Information Architecture — User Flow — */}
      <section>
        <MobileStickyTitle>Architecture</MobileStickyTitle>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className={`${TITLE_COL_DESKTOP_CLASS} md:row-span-3`}>
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Architecture</h2>
          </div>

          <div
            className={`col-span-8 md:col-start-3 md:col-span-6 flex flex-col gap-12 pt-[length:var(--pad-column-y)]`}
            data-ogen-architecture-title-row=""
            data-ogen-information-architecture=""
          >
            <h3 className={subTitleClass}>Information Architecture</h3>
            {/* Break out to full page-grid width so FitScale matches the previous IA size. */}
            <div className="w-full min-w-0 md:w-[calc(100%+((100%-7*var(--grid-gutter))/8)*2+var(--grid-gutter))] md:max-w-none md:-ml-[calc(((100%-7*var(--grid-gutter))/8)*2+var(--grid-gutter))]">
              <IADiagram />
            </div>
          </div>

          {/* Prototype video between IA and User Flow — equal gaps above/below via py */}
          <div
            className="col-span-8 md:col-start-3 md:col-span-5 py-[length:var(--gap-content-lg)]"
            data-ogen-prototype-video=""
          >
            <MediaVideo
              src={PROTOTYPE_VIDEO}
              title="OGEN prototype walkthrough"
              cropX={OGEN_PROTOTYPE_VIDEO.cropX}
              cropY={OGEN_PROTOTYPE_VIDEO.cropY}
              radius={OGEN_PROTOTYPE_VIDEO.radius}
              sourceAspect={OGEN_PROTOTYPE_VIDEO.sourceAspect}
            />
          </div>

          <div
            className={`col-span-8 md:col-start-3 md:col-span-6 flex flex-col ${gapSubtitleClass} pb-12`}
            data-ogen-architecture-column=""
            data-ogen-user-flow=""
          >
            <h3 className={subTitleClass}>User Flow</h3>
            <UserFlowDiagram />
          </div>
        </PageGrid>
      </section>

      {/* — Divider — */}
      <div className="w-full border-t border-[#2200b8]" />

      {/* — Design: Low Fidelity — High Fidelity — Screens — Design System — */}
      <section>
        <MobileStickyTitle>Design</MobileStickyTitle>
        <PageGrid className={sectionPageGridStretchClass}>
          <div className={TITLE_COL_DESKTOP_CLASS}>
            <h2 className={`${stickyTitleClass} leading-none -mt-1`}>Design</h2>
          </div>

          <div
            className={`col-span-8 md:col-start-3 md:col-span-5 flex flex-col ${gapContentLgClass} ${sectionColumnPaddingClass}`}
            data-ogen-design-column=""
          >
            {/* Low Fidelity */}
            <div className={`flex flex-col ${gapContentClass}`} data-ogen-low-fidelity="">
              <div className={`flex flex-col ${gapSubtitleClass}`}>
                <h3 className={subTitleClass}>Low Fidelity</h3>
                <p className={`${bodyTextClass} md:w-2/3`}>
                  Through research and synthesis, we identified five essential pillars required for the
                  interface, ordered by priority:
                </p>
              </div>
              <div data-ogen-wireframe-pillars="">
                <div className="grid grid-cols-1 items-start gap-y-5 gap-x-10 sm:grid-cols-6 sm:items-stretch md:gap-x-14 lg:gap-x-16">
                  <div className="flex min-w-0 flex-col gap-5 sm:col-span-2 sm:h-full sm:justify-between sm:gap-0">
                    {PILLARS.map(({ title, desc }, i) => (
                      <div key={title} className="flex gap-3" data-ogen-pillar={i + 1}>
                        <span className="font-['Bricolage_Grotesque'] font-light text-[length:var(--text-subtitle)] text-[#2200b8]/40 leading-none w-8 shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="flex flex-col gap-1">
                          <h4 className={smallTitleClass}>{title}</h4>
                          <p className={bodyTextClass}>{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div data-ogen-wireframe-media="" className="w-full sm:col-span-4">
                    <MediaImage
                      src={LOW_FIDELITY_IMG}
                      alt="OGEN low fidelity dashboard wireframe"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* High Fidelity — horizontal drag carousel (Screens / Aviv KeyFeatures pattern) */}
            <div className={`flex min-w-0 flex-col ${gapSubtitleClass}`} data-ogen-hifi-column="">
              <h3 className={subTitleClass}>High Fidelity</h3>
              <div className="min-w-0 overflow-hidden">
                <HiFiScreensCarousel />
              </div>
            </div>

            {/* Screens — horizontal drag carousel (Aviv KeyFeatures pattern) */}
            <div className={`flex min-w-0 flex-col ${gapSubtitleClass}`} data-ogen-design-screens="">
              <h3 className={subTitleClass}>Screens</h3>
              <div className="min-w-0 overflow-hidden">
                <ScreensCarousel />
              </div>
            </div>

            {/* Design System — individual assets composed to match Figma composite layout */}
            <div
              className={`flex w-full min-w-0 flex-col ${gapSubtitleClass}`}
              data-ogen-design-system=""
            >
              <h3 className={subTitleClass}>Design System</h3>
              <div className={`flex w-full min-w-0 flex-col ${gapContentClass}`}>
                {DESIGN_SYSTEM_BLOCKS.map(({ title, kind }) => (
                  <DesignSystemSection key={title} title={title} kind={kind} />
                ))}
              </div>
            </div>
          </div>
        </PageGrid>
      </section>

      {/* — Next Project — */}
      <ProjectNav currentProject="ogen" onSelectSection={onSelectSection} />
    </div>
  );
}
