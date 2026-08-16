"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import type { GLTF } from "three-stdlib";
import {
  getMaterialTarget,
  type MaterialTarget,
  type MaterialType,
  type ProductColorId,
} from "@/lib/fashion/customization";

/** The model is pre-generated and committed to public/models (see scripts/build-model.mjs). */
const MODEL_URL = "/models/fashion-bag.glb";

/** Fixed brushed-gold for the hardware parts — an accent that never recolours. */
const HARDWARE = { color: "#D4AF37", metalness: 0.92, roughness: 0.22 };

type ModelGLTF = GLTF & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.MeshStandardMaterial>;
};

/** MaterialTarget with the colour parsed into a THREE.Color for cheap lerping. */
type AnimatedTarget = Omit<MaterialTarget, "color"> & { color: THREE.Color };

interface FashionModelProps {
  color: ProductColorId;
  material: MaterialType;
  wireframe: boolean;
}

/**
 * FashionModel
 *
 * Loads the GLB, then rebuilds it with two runtime materials:
 *  - a MeshPhysicalMaterial for the "body" (fully customisable)
 *  - a fixed gold material for the "hardware" (handles, clasp, feet)
 *
 * Material changes are animated in `useFrame` by lerping toward the target
 * values stored in a ref. This keeps the colour/roughness fade smooth while
 * causing ZERO React re-renders — the whole transition happens on the render
 * loop, which is the correct place for per-frame 3D work.
 *
 * Reduced-motion users skip the lerp entirely: the effect applies the target
 * instantly and `useFrame` bails out, so the model still updates but nothing
 * animates.
 */
export function FashionModel({ color, material, wireframe }: FashionModelProps) {
  const { scene } = useGLTF(MODEL_URL) as unknown as ModelGLTF;
  const reducedMotion = useReducedMotion() ?? false;

  // Refs shared with the render loop; never trigger React re-renders.
  const bodyMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const targetRef = useRef<AnimatedTarget | null>(null);

  /* One-time material construction. The GLB scene is cached by useGLTF, so this
     runs exactly once per mount; afterwards we only mutate material values. */
  useMemo(() => {
    const body = new THREE.MeshPhysicalMaterial({
      color: "#3a3350",
      roughness: 0.6,
      metalness: 0.1,
      map: makeWeaveTexture(),
    });
    const hardware = new THREE.MeshPhysicalMaterial(HARDWARE);
    bodyMatRef.current = body;

    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        // The exporter tags each mesh's part into userData (node "extras").
        const isHardware = mesh.userData.part === "hardware";
        mesh.material = isHardware ? hardware : body;
      }
    });
  }, [scene]);

  /* Recompute the material target whenever the user changes a setting. The
     render loop picks it up and lerps toward it. */
  useEffect(() => {
    const target = getMaterialTarget(color, material, wireframe);
    const body = bodyMatRef.current;
    if (!body) return;

    // The weave texture only makes sense for fibre materials. Swapping the map
    // triggers a shader recompile, so do it here (on change) instead of per frame.
    const wantWeave = target.useWeave;
    if (Boolean(body.map) !== wantWeave) {
      body.map = wantWeave ? makeWeaveTexture() : null;
      body.needsUpdate = true;
    }

    if (body.wireframe !== target.wireframe) body.wireframe = target.wireframe;

    const nextTarget: AnimatedTarget = {
      ...target,
      color: new THREE.Color(target.color),
    };
    targetRef.current = nextTarget;

    // Reduced motion: apply the full target instantly, no animation.
    if (reducedMotion) applyTarget(body, nextTarget, 1);
  }, [color, material, wireframe, reducedMotion]);

  /* Smoothly interpolate the physical material toward the target every frame.
     The easing is frame-rate independent (exponential decay on delta time), so
     the animation feels identical at 30fps and 120fps. */
  useFrame((_, delta) => {
    const body = bodyMatRef.current;
    const target = targetRef.current;
    if (!body || !target || reducedMotion) return;

    const alpha = 1 - Math.exp(-7 * Math.min(delta, 0.1));
    applyTarget(body, target, alpha);
  });

  return <primitive object={scene} />;
}

/* -------------------------------------------------------------------------- */

/** Frame-rate-independent lerp of every animatable material value. */
function applyTarget(
  mat: THREE.MeshPhysicalMaterial,
  target: AnimatedTarget,
  alpha: number,
) {
  mat.color.lerp(target.color, alpha);
  mat.metalness += (target.metalness - mat.metalness) * alpha;
  mat.roughness += (target.roughness - mat.roughness) * alpha;
  mat.sheen += (target.sheen - mat.sheen) * alpha;
  mat.sheenRoughness += (target.sheenRoughness - mat.sheenRoughness) * alpha;
  mat.clearcoat += (target.clearcoat - mat.clearcoat) * alpha;
  mat.clearcoatRoughness += (target.clearcoatRoughness - mat.clearcoatRoughness) * alpha;
  mat.emissiveIntensity += (target.emissiveIntensity - mat.emissiveIntensity) * alpha;
}

/**
 * Builds a subtle woven-thread texture on a tiny canvas. Cheap to generate
 * once, stored on the GPU as a small 128×128 texture.
 */
function makeWeaveTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= size; i += 4) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(size, i);
      ctx.stroke();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}
