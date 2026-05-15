import { Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Clone, Edges, Html, useGLTF } from "@react-three/drei";
import { LoadingCubes } from "./LoadingCubes";
import * as THREE from "three";
import { cloudinaryUrl } from "../lib/cloudinary";

const glb = (publicId: string) => cloudinaryUrl(publicId, { raw: true });

const ASSETS = {
  mika: glb("Mika_3d_new_phq8ab.glb"),
  pencil: glb("Pencil_3D_mhatif.glb"),
  palette: glb("WaterColor_3D_sb3gsc.glb"),
  brush: glb("Brush_3D_f4tcfc.glb"),
  headphones: glb("Headphones_3D_b7caie.glb"),
  sushi: glb("Sushi_3d_iazad2.glb"),
} as const;

/** Same URL as the in-scene brush — for HUD cursor GLB. */
export const ABOUT_BRUSH_GLB_URL = ASSETS.brush;

export type AboutObjectId = "pencil" | "palette" | "brush" | "headphones" | "sushi";

export const COPY: Record<AboutObjectId, string> = {
  pencil:
    "My process always starts with a pencil, paper, and hand-drawn sketches. I believe the hand conveys a certain emotion that a computer just can't replicate. you'll find me blending illustrations, textures, and personal typography into the digital world.",
  palette:
    "As a designer, I'm always looking for that delicate balance between order and colorful chaos. I can get lost for hours in color palettes, it's my favorite part of the process. I'm constantly searching for inspiration in my surroundings, aiming to create design that leaves a mark.",
  brush:
    "When I'm not designing, you'll likely find me renovating furniture or working on my latest DIY home project. I've always loved working with my hands and the feeling of making things myself.",
  headphones:
    "When I'm working, I usually listen to Shlomo Artzi or Aviv Geffen (depending on the mood). Music is an essential part of my flow and helps set the tone for my creative day.",
  sushi:
    "My favorite foods are mainly raw fish and Asian cuisine. I also have a serious weakness for pretty much any dessert that exists.",
};

const DRAG_THRESHOLD_PX = 10;
const ROTATE_SPEED = 0.012;
/** Idle spin on the center character only (Y). */
const CENTER_AUTO_ROTATE_RAD_S = 0.16;
/** Snap Mika back to the default front-facing pose after a tap. */
const CENTER_FACE_FRONT_LERP = 10;
const CENTER_MODEL_MAX_DIM = 2.6;
const SATELLITE_MODEL_MAX_DIM = 0.95;
/** Exported for paint-mode HUD brush — same world scale as in-scene satellites. */
export const ABOUT_SATELLITE_MODEL_MAX_DIM = SATELLITE_MODEL_MAX_DIM;
/** Slightly smaller than other props so the pencil doesn’t dominate the cluster. */
const PENCIL_MODEL_MAX_DIM = 0.8;
/** Headphones slightly under default satellite scale so they don’t overpower the upper pair. */
const HEADPHONES_MODEL_MAX_DIM = 0.93;

/** Hover feedback on satellite props: grow, idle 20% → active 100% opacity, continuous spin. */
const SATELLITE_HOVER_SCALE = 1.14;
const SATELLITE_HOVER_SPIN_RAD_S = 1.35;
const SATELLITE_HOVER_LERP = 14;
/** Default (idle) opacity for surrounding GLBs; active/hover/selected uses full cached opacity. */
const SATELLITE_IDLE_OPACITY = 0.2;
/** Hit / wireframe cube vs scaled prop size (world units); per-id overrides below. */
const SATELLITE_CONTAINER_BOX_SCALE_DEFAULT = 1.22;
const SATELLITE_CONTAINER_BOX_SCALE_BY_ID: Record<AboutObjectId, number> = {
  pencil: 1.34,
  headphones: SATELLITE_CONTAINER_BOX_SCALE_DEFAULT,
  palette: 1.12,
  sushi: SATELLITE_CONTAINER_BOX_SCALE_DEFAULT,
  brush: 1.1,
};
/** Wireframe box: idle / hover max opacity. */
const SATELLITE_BOX_WIRE_OPACITY_IDLE = 0.14;
const SATELLITE_BOX_WIRE_OPACITY_HOVER = 0.52;
type OpacityCapableMaterial = THREE.Material & {
  opacity: number;
  transparent: boolean;
  userData: Record<string, unknown>;
};

/** Apply idle (0) → full (1) opacity on every mesh material under a GLB root. */
function applySatelliteOpacity(root: THREE.Object3D | null, blend: number) {
  if (!root) return;
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh || !mesh.material) return;
    const materials = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as THREE.Material[];
    for (const mat of materials) {
      if (!mat || !("opacity" in mat)) continue;
      const m = mat as OpacityCapableMaterial;
      if (m.userData.satelliteBaseOpacity === undefined) {
        m.userData.satelliteBaseOpacity = m.opacity ?? 1;
        m.userData.satelliteWasTransparent = m.transparent;
        m.transparent = true;
      }
      const base = m.userData.satelliteBaseOpacity as number;
      m.opacity = THREE.MathUtils.lerp(base * SATELLITE_IDLE_OPACITY, base, blend);
      m.needsUpdate = true;
    }
  });
}

function restoreSatelliteOpacity(root: THREE.Object3D | null) {
  if (!root) return;
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh || !mesh.material) return;
    const materials = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as THREE.Material[];
    for (const mat of materials) {
      if (!mat || !("opacity" in mat)) continue;
      const m = mat as OpacityCapableMaterial;
      if (m.userData.satelliteBaseOpacity === undefined) continue;
      m.opacity = m.userData.satelliteBaseOpacity as number;
      m.transparent = m.userData.satelliteWasTransparent as boolean;
      m.needsUpdate = true;
      delete m.userData.satelliteBaseOpacity;
      delete m.userData.satelliteWasTransparent;
    }
  });
}

/**
 * Wireframe (8-col PageGrid): centerline = gutter 4–5 at world x=0.
 * One gutter step U from that line: 3–4 = −U, 2–3 = −2U, 5–6 = +U, 6–7 = +2U.
 */
const GUTTER_UNIT = 1.42;

const X_GUTTER_23 = -2 * GUTTER_UNIT;
const X_GUTTER_34 = -1 * GUTTER_UNIT;
const X_GUTTER_56 = 1 * GUTTER_UNIT;
const X_GUTTER_67 = 2 * GUTTER_UNIT;

/** Vertical bands: top (pencil) > upper pair > Mika > lower pair */
const Y_PENCIL = 1.8;
const Y_UPPER_PAIR = 1.05;
const MIKA_ROW_ANCHOR_Y = -0.55;
const Y_LOWER_PAIR = -1.28;

/** Wireframe table: pencil 4–5 top; headphones 2–3 + palette 6–7 upper-mid; Mika 4–5 mid; sushi 3–4 + brush 5–6 lower. */
const POS_PENCIL: [number, number, number] = [0, Y_PENCIL, 0.16];
const POS_HEADPHONES: [number, number, number] = [X_GUTTER_23, Y_UPPER_PAIR, -0.14];
const POS_PALETTE: [number, number, number] = [X_GUTTER_67, Y_UPPER_PAIR, -0.2];
const POS_SUSHI: [number, number, number] = [X_GUTTER_34 - 0.7, Y_LOWER_PAIR, -0.1];
const POS_BRUSH: [number, number, number] = [X_GUTTER_56 + 0.7, Y_LOWER_PAIR, 0.12];

/** Match Tailwind `sm` / `md` / `lg` for canvas `size.width`. */
const SM_BREAKPOINT_PX = 640;
const MD_BREAKPOINT_PX = 768;
const LG_BREAKPOINT_PX = 1024;

/** Sub-`lg`: satellites in compact layouts (no wireframe boxes). */
const COMPACT_SATELLITE_ORDER: AboutObjectId[] = [
  "pencil",
  "headphones",
  "palette",
  "sushi",
  "brush",
];
const COMPACT_ROW_Y = 0.82;
const COMPACT_ROW_Z = -0.06;
/** `md`–`lg`: one row, wider spread between items. */
const COMPACT_MD_ROW_HALF_SPAN = 2.72;
const COMPACT_CAMERA_Z = 11.35;

/** Under `md`: two rows + extra horizontal spacing. */
const COMPACT_XS_ROW_UPPER_Y = 1.72;
const COMPACT_XS_ROW_LOWER_Y = 0.28;
const COMPACT_XS_ROW_Z = -0.06;
const COMPACT_XS_UPPER_IDS: AboutObjectId[] = ["headphones", "pencil", "palette"];
const COMPACT_XS_LOWER_IDS: AboutObjectId[] = ["sushi", "brush"];
const COMPACT_XS_UPPER_HALF_SPAN = 1.95;
const COMPACT_XS_LOWER_HALF_SPAN = 1.72;
const COMPACT_XS_CAMERA_Z = 12.1;
/** `sm`–`lg`: shift the whole composition up (world Y+) so Mika and all props sit slightly higher than on extra-narrow. */
const COMPACT_SM_UP_SCENE_Y_BOOST = 0.14;
/** Below `md` width: shift compact satellite rows down (world Y) so they sit farther under the intro copy. */
const COMPACT_UNDER_MD_GLBS_Y_OFFSET = -1.1;

const POS_BY_ID: Record<AboutObjectId, [number, number, number]> = {
  pencil: POS_PENCIL,
  headphones: POS_HEADPHONES,
  palette: POS_PALETTE,
  sushi: POS_SUSHI,
  brush: POS_BRUSH,
};

function satelliteBasePosition(
  id: AboutObjectId,
  opts: { lgUp: boolean; mdUp: boolean },
): [number, number, number] {
  const { lgUp, mdUp } = opts;
  if (lgUp) return POS_BY_ID[id];

  const idx = COMPACT_SATELLITE_ORDER.indexOf(id);
  if (idx < 0) return POS_BY_ID[id];

  if (mdUp) {
    const n = COMPACT_SATELLITE_ORDER.length;
    const t = n <= 1 ? 0 : idx / (n - 1);
    const x = (t * 2 - 1) * COMPACT_MD_ROW_HALF_SPAN;
    return [x, COMPACT_ROW_Y, COMPACT_ROW_Z];
  }

  const u = COMPACT_XS_UPPER_IDS.indexOf(id);
  if (u >= 0) {
    const nu = COMPACT_XS_UPPER_IDS.length;
    const t = nu <= 1 ? 0 : u / (nu - 1);
    const x = (t * 2 - 1) * COMPACT_XS_UPPER_HALF_SPAN;
    return [x, COMPACT_XS_ROW_UPPER_Y + COMPACT_UNDER_MD_GLBS_Y_OFFSET, COMPACT_XS_ROW_Z];
  }
  const l = COMPACT_XS_LOWER_IDS.indexOf(id);
  if (l >= 0) {
    const nl = COMPACT_XS_LOWER_IDS.length;
    const t = nl <= 1 ? 0 : l / (nl - 1);
    const x = (t * 2 - 1) * COMPACT_XS_LOWER_HALF_SPAN;
    return [x, COMPACT_XS_ROW_LOWER_Y + COMPACT_UNDER_MD_GLBS_Y_OFFSET, COMPACT_XS_ROW_Z];
  }

  return POS_BY_ID[id];
}

/** Lower the whole GLB composition so it clears the PageGrid intro copy (less = higher on screen). */
const SCENE_SHIFT_Y = -0.48;
/** `md`–`lg`: lower Mika — extra vertical space between her and the prop row. */
const MIKA_ANCHOR_Y_SUB_LG_OFFSET = -0.52;
/** Below `md`: lower Mika further so she and the compact props clear the intro copy. */
const MIKA_ANCHOR_UNDER_MD_OFFSET = -0.68;

/**
 * Small local tilt (radians) after `lookAt(camera)` — keep modest so the mesh still reads as
 * facing the viewer. Palette, sushi, and brush get +90° on local X on top of their tilt.
 */
const D15 = THREE.MathUtils.degToRad(15);
const D30 = THREE.MathUtils.degToRad(30);
const D45 = THREE.MathUtils.degToRad(45);
const D90 = THREE.MathUtils.degToRad(90);
const D180 = THREE.MathUtils.degToRad(180);

const SATELLITE_FACE_OFFSET: Record<AboutObjectId, [number, number, number]> = {
  pencil: [THREE.MathUtils.degToRad(-6), THREE.MathUtils.degToRad(4), THREE.MathUtils.degToRad(-3)],
  headphones: [THREE.MathUtils.degToRad(4), THREE.MathUtils.degToRad(-8) + D15, THREE.MathUtils.degToRad(2) + D15],
palette: [THREE.MathUtils.degToRad(-10) - D30, THREE.MathUtils.degToRad(4), THREE.MathUtils.degToRad(4) + D30],
  sushi: [THREE.MathUtils.degToRad(-5) - D90, THREE.MathUtils.degToRad(2) + D30, THREE.MathUtils.degToRad(10) + D180 + D15],
  brush: [THREE.MathUtils.degToRad(-6) + D90, THREE.MathUtils.degToRad(-4) + D180 + D45, THREE.MathUtils.degToRad(-6) + D30],
};

/** Hover idle spin on the prop container: watercolor / sushi / brush on local X; pencil / headphones on Y. */
function satelliteHoverSpinOnX(id: AboutObjectId): boolean {
  return id === "palette" || id === "sushi" || id === "brush";
}

function applyDragDeltaToGroup(group: THREE.Object3D, dx: number, dy: number, shiftKey: boolean) {
  const s = ROTATE_SPEED;
  if (shiftKey) {
    group.rotation.z += dx * s;
    group.rotation.x += dy * s;
  } else {
    group.rotation.y += dx * s;
    group.rotation.x += dy * s;
  }
}

function removeWindowPointerListeners(
  move: (ev: PointerEvent) => void,
  up: (ev: PointerEvent) => void,
) {
  window.removeEventListener("pointermove", move);
  window.removeEventListener("pointerup", up);
  window.removeEventListener("pointercancel", up);
}

/**
 * Pivot at axis-aligned bbox center: offset `content` inside `pivot` in pivot-local space,
 * then uniform scale on `pivot` so rotation/drag happens around the mesh middle (works when
 * parent `rotRef` has rotation — avoids mixing world bbox centers with local position).
 */
function GlbScaled({
  url,
  targetMaxDim,
  disableRaycast = false,
}: {
  url: string;
  targetMaxDim: number;
  /** When true, meshes do not raycast — use a sibling hit box for pointer events. */
  disableRaycast?: boolean;
}) {
  const { scene } = useGLTF(url);
  const pivotRef = useRef<THREE.Group>(null);
  const contentRef = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    const pivot = pivotRef.current;
    const content = contentRef.current;
    if (!pivot || !content) return;

    const applyPivotAndScale = () => {
      pivot.position.set(0, 0, 0);
      pivot.rotation.set(0, 0, 0);
      pivot.scale.set(1, 1, 1);
      content.position.set(0, 0, 0);
      content.rotation.set(0, 0, 0);
      content.scale.set(1, 1, 1);
      pivot.updateMatrixWorld(true);

      const box = new THREE.Box3().setFromObject(content);
      if (box.isEmpty()) return;

      const centerWorld = box.getCenter(new THREE.Vector3());
      const invPivot = new THREE.Matrix4().copy(pivot.matrixWorld).invert();
      const centerInPivot = centerWorld.clone().applyMatrix4(invPivot);
      content.position.sub(centerInPivot);

      pivot.updateMatrixWorld(true);
      const boxSized = new THREE.Box3().setFromObject(content);
      if (boxSized.isEmpty()) return;
      const size = boxSized.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) {
        pivot.scale.setScalar(targetMaxDim / maxDim);
      }

      if (disableRaycast) {
        content.traverse((o) => {
          const mesh = o as THREE.Mesh;
          if (mesh.isMesh) mesh.raycast = () => {};
        });
      }
    };

    applyPivotAndScale();
    const id = requestAnimationFrame(applyPivotAndScale);
    return () => cancelAnimationFrame(id);
  }, [scene, targetMaxDim, disableRaycast]);

  return (
    <group ref={pivotRef}>
      <group ref={contentRef}>
        <Clone object={scene} deep />
      </group>
    </group>
  );
}

function CenterCharacter({
  anchorY,
  onSelectIntro,
  faceFront,
}: {
  anchorY: number;
  /** Tap (no drag) on Mika shows intro copy in the text slot. */
  onSelectIntro?: () => void;
  /** Stop idle spin and ease rotation back to the default front-facing pose. */
  faceFront?: boolean;
}) {
  const { gl, invalidate } = useThree();
  const rootRef = useRef<THREE.Group>(null);
  /** True between pointer down and up — pauses idle spin while deciding tap vs drag. */
  const interactingRef = useRef(false);
  const windowHandlers = useRef<{
    move: (ev: PointerEvent) => void;
    up: (ev: PointerEvent) => void;
  } | null>(null);

  const detachWindowListeners = useCallback(() => {
    const h = windowHandlers.current;
    if (h) {
      removeWindowPointerListeners(h.move, h.up);
      windowHandlers.current = null;
    }
  }, []);

  useEffect(() => {
    return () => detachWindowListeners();
  }, [detachWindowListeners]);

  useEffect(() => {
    if (faceFront) invalidate();
  }, [faceFront, invalidate]);

  useFrame((state, delta) => {
    const g = rootRef.current;
    if (!g || interactingRef.current) return;

    if (faceFront) {
      const k = 1 - Math.exp(-CENTER_FACE_FRONT_LERP * delta);
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, 0, k);
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, 0, k);
      g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, 0, k);
      const settled =
        Math.abs(g.rotation.x) < 0.002 &&
        Math.abs(g.rotation.y) < 0.002 &&
        Math.abs(g.rotation.z) < 0.002;
      if (!settled) state.invalidate();
      return;
    }

    g.rotation.y += delta * CENTER_AUTO_ROTATE_RAD_S;
    state.invalidate();
  });

  const onPointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      if (windowHandlers.current) return;

      const pid = e.pointerId;
      const startX = e.clientX;
      const startY = e.clientY;
      let lastX = startX;
      let lastY = startY;
      let movedPastThreshold = false;

      interactingRef.current = true;

      try {
        gl.domElement.setPointerCapture(pid);
      } catch {
        /* ignore */
      }

      const move = (ev: PointerEvent) => {
        if (ev.pointerId !== pid) return;
        if (Math.hypot(ev.clientX - startX, ev.clientY - startY) > DRAG_THRESHOLD_PX) {
          movedPastThreshold = true;
        }
        const g = rootRef.current;
        if (!g) return;
        const dx = ev.clientX - lastX;
        const dy = ev.clientY - lastY;
        lastX = ev.clientX;
        lastY = ev.clientY;
        if (dx === 0 && dy === 0) return;
        applyDragDeltaToGroup(g, dx, dy, ev.shiftKey);
        invalidate();
      };

      const up = (ev: PointerEvent) => {
        if (ev.pointerId !== pid) return;
        try {
          gl.domElement.releasePointerCapture(pid);
        } catch {
          /* ignore */
        }
        detachWindowListeners();
        interactingRef.current = false;
        const tap = !movedPastThreshold && Math.hypot(ev.clientX - startX, ev.clientY - startY) <= DRAG_THRESHOLD_PX;
        if (tap) {
          onSelectIntro?.();
        }
        invalidate();
      };

      windowHandlers.current = { move, up };
      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", up);
    },
    [detachWindowListeners, gl, invalidate, onSelectIntro],
  );

  return (
    <group ref={rootRef} position={[0, anchorY, 0]}>
      <group onPointerDown={onPointerDown}>
        <GlbScaled url={ASSETS.mika} targetMaxDim={CENTER_MODEL_MAX_DIM} />
      </group>
    </group>
  );
}

function FloatingObject({
  id,
  url,
  basePosition,
  targetMaxDim,
  onSelect,
  focusedSatelliteId,
  hintPulse,
  showWireframeBox = true,
}: {
  id: AboutObjectId;
  url: string;
  basePosition: [number, number, number];
  targetMaxDim: number;
  onSelect: (id: AboutObjectId) => void;
  /** Which satellite is at full opacity / active; others stay at idle 20%. */
  focusedSatelliteId?: AboutObjectId | null;
  /** Paint-mode hint: same continuous hover/active spin until cleared. */
  hintPulse?: boolean;
  /** Desktop (`lg+`): wireframe cube around prop; mobile/tablet: hidden, hit box only. */
  showWireframeBox?: boolean;
}) {
  const { camera, gl, scene, invalidate } = useThree();
  const anchorRef = useRef<THREE.Group>(null);
  const rotRef = useRef<THREE.Group>(null);
  /** Wraps hit box + wireframe + GLB; hover scale + spin apply here. */
  const containerRef = useRef<THREE.Group>(null);
  const glbWrapRef = useRef<THREE.Group>(null);
  const wireBoxRef = useRef<THREE.Mesh>(null);
  /** Re-apply twice so parent `SCENE_SHIFT_Y` world matrices are valid after first R3F tick. */
  const facePassRef = useRef(0);
  const hoverIntentRef = useRef(false);
  const hoverTRef = useRef(0);
  const windowHandlers = useRef<{
    move: (ev: PointerEvent) => void;
    up: (ev: PointerEvent) => void;
  } | null>(null);

  const detachWindowListeners = useCallback(() => {
    const h = windowHandlers.current;
    if (h) {
      removeWindowPointerListeners(h.move, h.up);
      windowHandlers.current = null;
    }
  }, []);

  useEffect(() => {
    return () => detachWindowListeners();
  }, [detachWindowListeners]);

  useEffect(() => {
    const root = glbWrapRef.current;
    return () => restoreSatelliteOpacity(root);
  }, [url]);

  useEffect(() => {
    if (hintPulse) invalidate();
  }, [hintPulse, invalidate]);

  useEffect(() => {
    if (focusedSatelliteId != null) invalidate();
  }, [focusedSatelliteId, invalidate]);

  useLayoutEffect(() => {
    facePassRef.current = 0;
  }, [basePosition[0], basePosition[1], basePosition[2]]);

  useFrame((state, delta) => {
    const rot = rotRef.current;
    const anchor = anchorRef.current;
    const visual = containerRef.current;
    const glbRoot = glbWrapRef.current;
    if (!rot || !anchor) return;

    if (facePassRef.current < 2) {
      scene.updateMatrixWorld(true);
      camera.updateMatrixWorld(true);
      anchor.updateMatrixWorld(true);

      const camWorld = new THREE.Vector3();
      camera.getWorldPosition(camWorld);

      rot.position.set(0, 0, 0);
      rot.quaternion.identity();
      /* Non-camera Object3D.lookAt: local +Z points from anchor toward the camera. */
      rot.lookAt(camWorld);

      const [ox, oy, oz] = SATELLITE_FACE_OFFSET[id];
      rot.rotateX(ox);
      rot.rotateY(oy);
      rot.rotateZ(oz);

      facePassRef.current += 1;
      state.invalidate();
      return;
    }

    if (!visual) return;

    const isFocused = focusedSatelliteId === id;
    const hovered = hoverIntentRef.current;
    /** Scale / spin / wireframe — works on hover even when another satellite is focused. */
    const hoverVisual = hovered || isFocused || hintPulse;
    const hoverTarget = hoverVisual ? 1 : 0;
    const k = 1 - Math.exp(-SATELLITE_HOVER_LERP * delta);
    hoverTRef.current += (hoverTarget - hoverTRef.current) * k;

    const t = hoverTRef.current;
    /** Full opacity only for the focused satellite (or any hover when nothing is focused). */
    let opacityBlend: number;
    if (isFocused || hintPulse) {
      opacityBlend = 1;
    } else if (focusedSatelliteId == null && hovered) {
      opacityBlend = t;
    } else {
      opacityBlend = 0;
    }
    const scale = 1 + (SATELLITE_HOVER_SCALE - 1) * t;

    visual.scale.setScalar(scale);
    const spin = delta * SATELLITE_HOVER_SPIN_RAD_S * t;
    if (satelliteHoverSpinOnX(id)) {
      visual.rotation.x += spin;
      if (t < 0.02 && !hoverVisual) {
        visual.rotation.x *= Math.exp(-14 * delta);
        if (Math.abs(visual.rotation.x) < 0.002) visual.rotation.x = 0;
      }
    } else {
      visual.rotation.y += spin;
      if (t < 0.02 && !hoverVisual) {
        visual.rotation.y *= Math.exp(-14 * delta);
        if (Math.abs(visual.rotation.y) < 0.002) visual.rotation.y = 0;
      }
    }

    applySatelliteOpacity(glbRoot, opacityBlend);

    const wire = wireBoxRef.current;
    if (wire && showWireframeBox) {
      wire.traverse((child) => {
        const line = child as THREE.LineSegments;
        if (line.isLineSegments && line.material && !Array.isArray(line.material)) {
          const lm = line.material as THREE.LineBasicMaterial;
          lm.opacity = THREE.MathUtils.lerp(
            SATELLITE_BOX_WIRE_OPACITY_IDLE,
            SATELLITE_BOX_WIRE_OPACITY_HOVER,
            t,
          );
          lm.needsUpdate = true;
        }
      });
    }

    if (t > 0.001 || facePassRef.current < 2 || hoverVisual || focusedSatelliteId != null) {
      state.invalidate();
    }
  });

  const onPointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      if (windowHandlers.current) return;

      const pid = e.pointerId;
      const startX = e.clientX;
      const startY = e.clientY;
      let lastX = startX;
      let lastY = startY;
      let movedPastThreshold = false;

      try {
        gl.domElement.setPointerCapture(pid);
      } catch {
        /* ignore */
      }

      const move = (ev: PointerEvent) => {
        if (ev.pointerId !== pid) return;
        if (Math.hypot(ev.clientX - startX, ev.clientY - startY) > DRAG_THRESHOLD_PX) {
          movedPastThreshold = true;
        }
        const g = rotRef.current;
        if (!g) return;
        const dx = ev.clientX - lastX;
        const dy = ev.clientY - lastY;
        lastX = ev.clientX;
        lastY = ev.clientY;
        if (dx === 0 && dy === 0) return;
        applyDragDeltaToGroup(g, dx, dy, ev.shiftKey);
        invalidate();
      };

      const up = (ev: PointerEvent) => {
        if (ev.pointerId !== pid) return;
        try {
          gl.domElement.releasePointerCapture(pid);
        } catch {
          /* ignore */
        }
        detachWindowListeners();
        const tap = !movedPastThreshold && Math.hypot(ev.clientX - startX, ev.clientY - startY) <= DRAG_THRESHOLD_PX;
        if (tap) {
          onSelect(id);
        }
        invalidate();
      };

      windowHandlers.current = { move, up };
      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", up);
    },
    [detachWindowListeners, gl, id, invalidate, onSelect],
  );

  const onPointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      hoverIntentRef.current = true;
      invalidate();
    },
    [invalidate],
  );

  const onPointerOut = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      hoverIntentRef.current = false;
      invalidate();
    },
    [invalidate],
  );

  useLayoutEffect(() => {
    const w = wireBoxRef.current;
    if (w) w.raycast = () => {};
  }, [showWireframeBox]);

  const boxSize = targetMaxDim * SATELLITE_CONTAINER_BOX_SCALE_BY_ID[id];

  return (
    <group ref={anchorRef} position={[basePosition[0], basePosition[1], basePosition[2]]}>
      <group ref={rotRef}>
        <group ref={containerRef}>
          <mesh onPointerDown={onPointerDown} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
            <boxGeometry args={[boxSize, boxSize, boxSize]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
          {showWireframeBox ? (
            <mesh ref={wireBoxRef}>
              <boxGeometry args={[boxSize, boxSize, boxSize]} />
              <meshBasicMaterial visible={false} />
              <Edges
                threshold={15}
                color="#2200b8"
                transparent
                opacity={SATELLITE_BOX_WIRE_OPACITY_IDLE}
                depthWrite={false}
              />
            </mesh>
          ) : null}
          <group ref={glbWrapRef}>
            <GlbScaled url={url} targetMaxDim={targetMaxDim} disableRaycast />
          </group>
        </group>
      </group>
    </group>
  );
}

/**
 * R3F `Canvas` `onPointerMissed` only runs for click-type events with tiny movement — not `pointerdown`.
 * In paint mode we need real pointerdown on empty sky so brush strokes can drag.
 */
function AboutPaintEmptyPointerBridge({
  enabled,
  onEmptyPrimaryPointerDown,
}: {
  enabled: boolean;
  onEmptyPrimaryPointerDown?: (e: PointerEvent) => void;
}) {
  const { gl, camera, raycaster, scene } = useThree();
  const ndcRef = useRef(new THREE.Vector2());

  useEffect(() => {
    if (!enabled || !onEmptyPrimaryPointerDown) return;
    const el = gl.domElement;
    const ndc = ndcRef.current;

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const rect = el.getBoundingClientRect();
      const rw = rect.width;
      const rh = rect.height;
      if (rw <= 0 || rh <= 0) return;
      ndc.x = ((e.clientX - rect.left) / rw) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rh) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects([scene], true);
      if (hits.length > 0) return;
      onEmptyPrimaryPointerDown(e);
    };

    el.addEventListener("pointerdown", onDown);
    return () => el.removeEventListener("pointerdown", onDown);
  }, [enabled, onEmptyPrimaryPointerDown, gl, camera, raycaster, scene]);

  return null;
}

function SceneLoadingCube() {
  return (
    <Html center>
      <LoadingCubes />
    </Html>
  );
}

function AboutSceneContent({
  onSelectObject,
  onSelectIntro,
  selectedObjectId,
  mikaFacingFront,
  hideBrushInScene,
  hidePaletteInScene,
  hintPalette,
  onPaintEmptyPointerDown,
}: {
  onSelectObject: (id: AboutObjectId) => void;
  onSelectIntro?: () => void;
  selectedObjectId?: AboutObjectId | null;
  mikaFacingFront?: boolean;
  hideBrushInScene?: boolean;
  hidePaletteInScene?: boolean;
  hintPalette?: boolean;
  onPaintEmptyPointerDown?: (e: PointerEvent) => void;
}) {
  const { camera, invalidate, size } = useThree();
  const mdUp = size.width >= MD_BREAKPOINT_PX;
  const lgUp = size.width >= LG_BREAKPOINT_PX;
  const smUp = size.width >= SM_BREAKPOINT_PX;
  const layoutOpts = { lgUp, mdUp };
  const compactSceneY =
    smUp && !lgUp ? SCENE_SHIFT_Y + COMPACT_SM_UP_SCENE_Y_BOOST : SCENE_SHIFT_Y;
  const mikaAnchorOffsetY = lgUp ? 0 : !mdUp ? MIKA_ANCHOR_UNDER_MD_OFFSET : MIKA_ANCHOR_Y_SUB_LG_OFFSET;
  const [stage, setStage] = useState(0);
  const advanceStage = useCallback(() => setStage((s) => s + 1), []);

  const focusedSatelliteId: AboutObjectId | null = hintPalette
    ? "palette"
    : selectedObjectId ?? null;

  useLayoutEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    let z = 9.85;
    if (!lgUp) {
      z = mdUp ? COMPACT_CAMERA_Z : COMPACT_XS_CAMERA_Z;
    }
    camera.position.z = z;
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, invalidate, lgUp, mdUp]);

  return (
    <>
      <ambientLight intensity={1.18} />
      <hemisphereLight args={["#faf6f0", "#ebe6df", 0.88]} />
      <directionalLight position={[5, 8, 6]} intensity={1.12} />
      <directionalLight position={[-5, 4, -4]} intensity={0.72} />
      <directionalLight position={[0, 2, -8]} intensity={0.16} />

      <group position={[0, compactSceneY, 0]}>
        <Suspense fallback={<SceneLoadingCube />}>

          <CenterCharacter
            anchorY={MIKA_ROW_ANCHOR_Y + mikaAnchorOffsetY}
            onSelectIntro={onSelectIntro}
            faceFront={mikaFacingFront}
          />
          <StageSignal onReady={advanceStage} />
        </Suspense>

        {stage >= 1 && (
          <Suspense fallback={null}>
            <FloatingObject
              id="pencil"
              url={ASSETS.pencil}
              basePosition={satelliteBasePosition("pencil", layoutOpts)}
              targetMaxDim={PENCIL_MODEL_MAX_DIM}
              onSelect={onSelectObject}
              focusedSatelliteId={focusedSatelliteId}
              showWireframeBox={lgUp}
            />
            <StageSignal onReady={advanceStage} />
          </Suspense>
        )}

        {stage >= 2 && (
          <Suspense fallback={null}>
            <FloatingObject
              id="headphones"
              url={ASSETS.headphones}
              basePosition={satelliteBasePosition("headphones", layoutOpts)}
              targetMaxDim={HEADPHONES_MODEL_MAX_DIM}
              onSelect={onSelectObject}
              focusedSatelliteId={focusedSatelliteId}
              showWireframeBox={lgUp}
            />
            <StageSignal onReady={advanceStage} />
          </Suspense>
        )}

        {stage >= 3 && !hidePaletteInScene && (
          <Suspense fallback={null}>
            <FloatingObject
              id="palette"
              url={ASSETS.palette}
              basePosition={satelliteBasePosition("palette", layoutOpts)}
              targetMaxDim={SATELLITE_MODEL_MAX_DIM}
              onSelect={onSelectObject}
              focusedSatelliteId={focusedSatelliteId}
              hintPulse={hintPalette}
              showWireframeBox={lgUp}
            />
            <StageSignal onReady={advanceStage} />
          </Suspense>
        )}

        {stage >= (hidePaletteInScene ? 3 : 4) && (
          <Suspense fallback={null}>
            <FloatingObject
              id="sushi"
              url={ASSETS.sushi}
              basePosition={satelliteBasePosition("sushi", layoutOpts)}
              targetMaxDim={SATELLITE_MODEL_MAX_DIM}
              onSelect={onSelectObject}
              focusedSatelliteId={focusedSatelliteId}
              showWireframeBox={lgUp}
            />
            <StageSignal onReady={advanceStage} />
          </Suspense>
        )}

        {stage >= (hidePaletteInScene ? 4 : 5) && !hideBrushInScene && (
          <Suspense fallback={null}>
            <FloatingObject
              id="brush"
              url={ASSETS.brush}
              basePosition={satelliteBasePosition("brush", layoutOpts)}
              targetMaxDim={SATELLITE_MODEL_MAX_DIM}
              onSelect={onSelectObject}
              focusedSatelliteId={focusedSatelliteId}
              showWireframeBox={lgUp}
            />
          </Suspense>
        )}
      </group>
      <AboutPaintEmptyPointerBridge
        enabled={Boolean(hideBrushInScene && onPaintEmptyPointerDown)}
        onEmptyPrimaryPointerDown={onPaintEmptyPointerDown}
      />
    </>
  );
}

/** Fires once when mounted inside a Suspense that has resolved. */
function StageSignal({ onReady }: { onReady: () => void }) {
  const called = useRef(false);
  useEffect(() => {
    if (called.current) return;
    called.current = true;
    onReady();
  }, [onReady]);
  return null;
}

export interface AboutScene3DProps {
  onSelectObject: (id: AboutObjectId) => void;
  onSelectIntro?: () => void;
  selectedObjectId?: AboutObjectId | null;
  mikaFacingFront?: boolean;
  hideBrushInScene?: boolean;
  hidePaletteInScene?: boolean;
  /** Continuous hover/active spin on the 3D palette (paint mode, before docked). */
  hintPalette?: boolean;
  onPaintEmptyPointerDown?: (event: PointerEvent) => void;
}

/** Full-viewport transparent canvas for the About page 3D composition. */
export function AboutScene3D({
  onSelectObject,
  onSelectIntro,
  selectedObjectId,
  mikaFacingFront,
  hideBrushInScene,
  hidePaletteInScene,
  hintPalette,
  onPaintEmptyPointerDown,
}: AboutScene3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 9.85], fov: 40, near: 0.1, far: 80 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      frameloop="demand"
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%", touchAction: "none" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.06;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <AboutSceneContent
        onSelectObject={onSelectObject}
        onSelectIntro={onSelectIntro}
        selectedObjectId={selectedObjectId}
        mikaFacingFront={mikaFacingFront}
        hideBrushInScene={hideBrushInScene}
        hidePaletteInScene={hidePaletteInScene}
        hintPalette={hintPalette}
        onPaintEmptyPointerDown={onPaintEmptyPointerDown}
      />
    </Canvas>
  );
}

useGLTF.preload(ASSETS.mika);
