"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
  Sparkles,
  useGLTF,
} from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { FashionModel } from "@/components/fashion/FashionModel";
import { LoadingFallback } from "@/components/fashion/LoadingFallback";
import type { CustomizerState } from "@/lib/fashion/customization";

// Warm up the GLB cache as soon as this bundle arrives, so the Suspense
// fallback resolves almost instantly on first interaction.
useGLTF.preload("/models/fashion-bag.glb");

interface ThreeSceneProps {
  state: CustomizerState;
}

/**
 * ThreeScene
 *
 * The only component that talks to WebGL. It is lazy-loaded via next/dynamic
 * (see FashionStudio) so the ~1MB of three/r3f/drei JS never blocks first paint.
 *
 * Performance choices, all made with mobile in mind:
 *  - capped devicePixelRatio `[1, 1.5]`
 *  - no shadow maps — ground shadow comes from a single cheap ContactShadows pass
 *  - a procedural `Environment` built from Lightformers (zero network fetches)
 *  - `frameloop="demand"` + damping off for reduced-motion users, so the scene
 *    only re-renders while they are actually interacting
 */
export function ThreeScene({ state }: ThreeSceneProps) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={reducedMotion ? "demand" : "always"}
      camera={{ position: [0, 0.45, 4.2], fov: 42, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        // Tell WebGL we prefer performance over power saving on multi-GPU laptops.
      }}
      tabIndex={0}
      role="group"
      aria-label="3D product view — use arrow keys to orbit, scroll or pinch to zoom"
    >
      <SceneContents state={state} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

function SceneContents({
  state,
  reducedMotion,
}: {
  state: CustomizerState;
  reducedMotion: boolean;
}) {
  return (
    <>
      {/* --- Lighting ---------------------------------------------------- */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 4]} intensity={1.6} />
      {/* A teal rim light gives the on-brand fashion-tech glow. */}
      <pointLight position={[-4, 1.5, -3]} intensity={0.8} color="#00E5C4" />
      <pointLight position={[0, -1.5, 2]} intensity={0.3} color="#C8A24A" />

      <Suspense fallback={<LoadingFallback />}>
        <FashionModel
          color={state.color}
          material={state.material}
          wireframe={state.wireframe}
        />
      </Suspense>

      {/* A real studio environment would be an .hdr from a CDN; this version is
          built from light panels at runtime so the app works fully offline. */}
      <Environment resolution={256} frames={1}>
        <Lightformer
          intensity={2}
          color="#ffffff"
          position={[0, 3, 3]}
          scale={[6, 3, 1]}
        />
        <Lightformer
          intensity={1.2}
          color="#C8A24A"
          position={[-4, 1, -2]}
          rotation-y={Math.PI / 2}
          scale={[3, 2, 1]}
        />
        <Lightformer
          intensity={0.9}
          color="#00E5C4"
          position={[4, 0, -2]}
          rotation-y={-Math.PI / 2}
          scale={[3, 2, 1]}
        />
      </Environment>

      <ContactShadows
        position={[0, -1.05, 0]}
        opacity={0.55}
        scale={6}
        blur={2.4}
        far={3}
        resolution={256}
        frames={reducedMotion ? 1 : Infinity}
      />

      {/* Subtle gold dust — skipped entirely for reduced-motion users. */}
      {!reducedMotion && (
        <Sparkles
          count={60}
          scale={[5, 3.5, 5]}
          size={1.8}
          speed={0.3}
          opacity={0.45}
          color="#C8A24A"
        />
      )}

      <Controls state={state} reducedMotion={reducedMotion} />
    </>
  );
}

function Controls({
  state,
  reducedMotion,
}: {
  state: CustomizerState;
  reducedMotion: boolean;
}) {
  return (
    <OrbitControls
      makeDefault
      enablePan={false}
      minDistance={2.4}
      maxDistance={7.5}
      target={[0, 0, 0]}
      enableDamping={!reducedMotion}
      autoRotate={state.autoRotate && !reducedMotion}
      autoRotateSpeed={1.4}
      // Arrow keys orbit the camera (with the viewport focused) — a real
      // keyboard fallback to dragging, not just "focusable" buttons.
      keyEvents={true}
    />
  );
}
