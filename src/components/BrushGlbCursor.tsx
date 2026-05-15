import { Suspense, useEffect, useLayoutEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Clone, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ABOUT_BRUSH_GLB_URL, ABOUT_SATELLITE_MODEL_MAX_DIM } from "./AboutScene3D";

/** HUD tile size (px); brush should read clearly without dominating the screen. */
const CURSOR_PX = 200;
/**
 * Camera Z so the brush’s on-screen pixel size approximates the in-scene satellite at
 * `SATELLITE_MODEL_MAX_DIM` (~10 world units from main camera, ~full viewport height).
 */
const MAIN_CAMERA_Z = 9.85;

function cursorCameraZ(): number {
  if (typeof window === "undefined") {
    return MAIN_CAMERA_Z * (CURSOR_PX / 640);
  }
  const h = Math.max(480, window.innerHeight);
  return MAIN_CAMERA_Z * (CURSOR_PX / h);
}

/**
 * Base orientation for `Brush_3D_f4tcfc.glb` after centering / scale; then +90° on Z so the
 * tip reads toward +Y (top of viewport) instead of −X (left).
 */
const BRUSH_PAINT_CURSOR_EULER: [number, number, number] = [
  THREE.MathUtils.degToRad(-88),
  THREE.MathUtils.degToRad(4),
  THREE.MathUtils.degToRad(8),
];

const BRUSH_CURSOR_Z_ROLL = Math.PI / 2;

function CursorBrushGlb() {
  const { scene } = useGLTF(ABOUT_BRUSH_GLB_URL);
  const { camera, invalidate } = useThree();
  const faceRef = useRef<THREE.Group>(null);
  const pivotRef = useRef<THREE.Group>(null);
  const contentRef = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    const face = faceRef.current;
    const pivot = pivotRef.current;
    const content = contentRef.current;
    if (!face || !pivot || !content) return;

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
        pivot.scale.setScalar(ABOUT_SATELLITE_MODEL_MAX_DIM / maxDim);
      }

      content.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) mesh.raycast = () => {};
      });
    };

    face.position.set(0, 0, 0);
    face.quaternion.identity();
    applyPivotAndScale();

    const [rx, ry, rz] = BRUSH_PAINT_CURSOR_EULER;
    face.rotation.set(rx, ry, rz);
    face.rotateY(BRUSH_CURSOR_Z_ROLL);
    face.rotateZ(THREE.MathUtils.degToRad(-40));

    if (camera && "position" in camera) {
      const cam = camera as THREE.PerspectiveCamera;
      cam.position.set(0, 0.4, cursorCameraZ());
      cam.near = 0.08;
      cam.far = 40;
      cam.fov = 40;
      cam.updateProjectionMatrix();
    }

    invalidate();
  }, [scene, camera, invalidate]);

  useEffect(() => {
    const onResize = () => {
      const cam = camera as THREE.PerspectiveCamera;
      if (!cam?.isPerspectiveCamera) return;
      cam.position.set(0, 0.4, cursorCameraZ());
      cam.updateProjectionMatrix();
      invalidate();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [camera, invalidate]);

  return (
    <>
      <ambientLight intensity={1.05} />
      <hemisphereLight args={["#faf6f0", "#ebe6df", 0.85]} />
      <directionalLight position={[4, 6, 5]} intensity={1.0} />
      <directionalLight position={[-3, 2, -3]} intensity={0.45} />
      <group ref={faceRef}>
        <group ref={pivotRef}>
          <group ref={contentRef}>
            <Clone object={scene} deep />
          </group>
        </group>
      </group>
    </>
  );
}

/**
 * Paint mode only: small WebGL tile follows the pointer with the same brush GLB scale as the
 * scene satellite; in-world brush is hidden separately. `document.body` cursor should be `none`.
 *
 * `seedClient` — pointer position when paint was opened (e.g. from the Paint button). Without it,
 * the HUD would sit at the viewport center until the first `pointermove`, which does not fire
 * while the pointer stays over the button.
 */
export function BrushGlbCursor({
  active,
  seedClient,
}: {
  active: boolean;
  seedClient: { x: number; y: number } | null;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });

  useLayoutEffect(() => {
    if (!active) return;
    const el = wrapRef.current;
    if (!el) return;
    const x = seedClient?.x ?? window.innerWidth / 2;
    const y = seedClient?.y ?? window.innerHeight / 2;
    posRef.current = { x, y };
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, [active, seedClient]);

  useEffect(() => {
    if (!active) return;

    const apply = () => {
      const el = wrapRef.current;
      if (!el) return;
      const { x, y } = posRef.current;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const onMove = (e: PointerEvent) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
      apply();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed left-0 top-0 z-[200]"
      style={{ transform: "translate3d(-200px, -200px, 0)" }}
    >
      <div
        className="-translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ width: CURSOR_PX, height: CURSOR_PX }}
      >
        <Canvas
          camera={{ position: [0, 0.4, cursorCameraZ()], fov: 40, near: 0.08, far: 40 }}
          gl={{ alpha: true, antialias: true, premultipliedAlpha: false, powerPreference: "high-performance" }}
          dpr={[1, 1.5]}
          frameloop="demand"
          style={{ width: CURSOR_PX, height: CURSOR_PX, display: "block", pointerEvents: "none" }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.06;
            gl.outputColorSpace = THREE.SRGBColorSpace;
            /* Let clicks reach BrushPaintLayer below; WebGL canvases default to receiving hits. */
            gl.domElement.style.pointerEvents = "none";
          }}
        >
          <Suspense fallback={null}>
            <CursorBrushGlb />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
