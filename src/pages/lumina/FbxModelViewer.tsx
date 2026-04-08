import { Component, Suspense, useState, useRef, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { radiusVideoInlineClass } from "../../lib/spacing";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useFBX, Environment, Center } from "@react-three/drei";
import * as THREE from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

function GlbModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const ref = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!ref.current) return;
    const box = new THREE.Box3().setFromObject(ref.current);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      const targetSize = 2;
      ref.current.scale.setScalar(targetSize / maxDim);
    }
    const center = box.getCenter(new THREE.Vector3());
    ref.current.position.sub(center.multiplyScalar(ref.current.scale.x));
  }, [clone]);

  return <primitive ref={ref} object={clone} dispose={null} />;
}

function FbxModel({ url }: { url: string }) {
  const fbx = useFBX(url);
  return <primitive object={fbx} scale={0.01} dispose={null} />;
}

function Model({ url }: { url: string }) {
  const isGlb = /\.glb$/i.test(url) || /\.gltf$/i.test(url);
  return isGlb ? <GlbModel url={url} /> : <FbxModel url={url} />;
}

function PlaceholderCube() {
  return (
    <mesh rotation={[0.4, 0.6, 0]}>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <meshStandardMaterial color="#1d1171" wireframe />
    </mesh>
  );
}

class ModelErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

interface ModelViewerProps {
  url?: string;
  label?: string;
  className?: string;
  transparent?: boolean;
}

export function FbxModelViewer({
  url,
  label = "3D Model",
  className = "",
  transparent = false,
}: ModelViewerProps) {
  const [error, setError] = useState(false);
  const [dragging, setDragging] = useState(false);

  return (
    <div
      className={`relative ${transparent ? "" : `bg-[#0d0439] ${radiusVideoInlineClass} min-h-[length:var(--media-fbx-min-h)]`} overflow-hidden ${dragging ? "cursor-grabbing" : "cursor-grab"} ${className}`}
      onPointerDown={() => setDragging(true)}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <Canvas
        camera={{ position: [0, 0.5, 3.5], fov: 45 }}
        gl={{ alpha: transparent }}
        onError={() => setError(true)}
        style={transparent ? { background: "transparent" } : undefined}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} />
        <Suspense fallback={null}>
          <ModelErrorBoundary fallback={<PlaceholderCube />}>
            {url && !error ? (
              <Center>
                <Model url={url} />
              </Center>
            ) : (
              <PlaceholderCube />
            )}
          </ModelErrorBoundary>
          {!transparent && <Environment preset="forest" />}
        </Suspense>
        <OrbitControls enableZoom={false} autoRotate={!transparent} autoRotateSpeed={1.5} />
      </Canvas>

      {!transparent && (
        <div className="absolute bottom-3 left-3 bg-[#0d043980] backdrop-blur-sm rounded-md px-3 py-1">
          <span className="text-[#fcf7ee80] text-xs font-['Bricolage_Grotesque']">
            {url && !error ? label : `${label} (placeholder)`}
          </span>
        </div>
      )}
    </div>
  );
}
