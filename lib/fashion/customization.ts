/**
 * lib/fashion/customization.ts
 *
 * Pure, framework-free configuration for the product customizer. Keeping this
 * module side-effect free means it is trivially unit-testable (and imported by
 * both the UI panel and the 3D model without pulling React/three into each
 * other's render paths).
 */

/** Which base colour the product is dyed with. */
export type ProductColorId = "emerald" | "gold" | "black" | "white";

/** The simulated textile finish applied to the product. */
export type MaterialType = "fabric" | "silk" | "metallic";

export interface CustomizerState {
  color: ProductColorId;
  material: MaterialType;
  wireframe: boolean;
  autoRotate: boolean;
}

export const DEFAULT_CUSTOMIZER_STATE: CustomizerState = {
  color: "emerald",
  material: "fabric",
  wireframe: false,
  autoRotate: true,
};

export interface ColorPreset {
  id: ProductColorId;
  /** Human label shown in the accessibility tree / panel. */
  label: string;
  /** Hex swatch for the UI chip. */
  swatch: string;
  /** Hex base colour applied to the 3D material. */
  color: string;
}

export const COLOR_PRESETS: readonly ColorPreset[] = [
  { id: "emerald", label: "Emerald Green", swatch: "#10B981", color: "#10B981" },
  { id: "gold", label: "Gold", swatch: "#C8A24A", color: "#C8A24A" },
  { id: "black", label: "Black", swatch: "#0B0B0F", color: "#0B0B0F" },
  { id: "white", label: "White", swatch: "#F4F2EE", color: "#F4F2EE" },
];

export interface MaterialPreset {
  id: MaterialType;
  label: string;
  description: string;
  /**
   * MeshPhysicalMaterial parameters that the render loop lerps toward.
   * Tuned per textile: silk gets a clear-coat + strong sheen, metallic goes
   * fully reflective, fabric stays matte with a soft sheen.
   */
  metalness: number;
  roughness: number;
  sheen: number;
  sheenRoughness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  /** Whether a procedural weave texture is mixed into the albedo. */
  useWeave: boolean;
  emissiveIntensity: number;
}

export const MATERIAL_PRESETS: readonly MaterialPreset[] = [
  {
    id: "fabric",
    label: "Fabric",
    description: "Matte canvas with a soft fibre sheen",
    metalness: 0.0,
    roughness: 0.85,
    sheen: 0.55,
    sheenRoughness: 0.65,
    clearcoat: 0.0,
    clearcoatRoughness: 1.0,
    useWeave: true,
    emissiveIntensity: 0.0,
  },
  {
    id: "silk",
    label: "Silk",
    description: "Glossy, light-catching clear coat",
    metalness: 0.05,
    roughness: 0.3,
    sheen: 0.9,
    sheenRoughness: 0.18,
    clearcoat: 0.4,
    clearcoatRoughness: 0.12,
    useWeave: true,
    emissiveIntensity: 0.015,
  },
  {
    id: "metallic",
    label: "Metallic",
    description: "Polished mirror finish",
    metalness: 1.0,
    roughness: 0.26,
    sheen: 0.0,
    sheenRoughness: 1.0,
    clearcoat: 0.7,
    clearcoatRoughness: 0.2,
    useWeave: false,
    emissiveIntensity: 0.03,
  },
];

/**
 * Every animatable material value the 3D scene cares about. Returned as plain
 * data so the FashionModel can interpolate toward it without re-rendering.
 */
export interface MaterialTarget {
  color: string;
  metalness: number;
  roughness: number;
  sheen: number;
  sheenRoughness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  emissiveIntensity: number;
  useWeave: boolean;
  wireframe: boolean;
}

const materialById = (id: MaterialType): MaterialPreset => {
  const preset = MATERIAL_PRESETS.find((m) => m.id === id);
  if (!preset) throw new Error(`Unknown material preset: ${id}`);
  return preset;
};

const colorById = (id: ProductColorId): string => {
  const preset = COLOR_PRESETS.find((c) => c.id === id);
  if (!preset) throw new Error(`Unknown color preset: ${id}`);
  return preset.color;
};

export const getMaterialTarget = (
  color: ProductColorId,
  material: MaterialType,
  wireframe: boolean,
): MaterialTarget => {
  const m = materialById(material);
  return {
    color: colorById(color),
    metalness: m.metalness,
    roughness: m.roughness,
    sheen: m.sheen,
    sheenRoughness: m.sheenRoughness,
    clearcoat: m.clearcoat,
    clearcoatRoughness: m.clearcoatRoughness,
    emissiveIntensity: m.emissiveIntensity,
    useWeave: m.useWeave,
    wireframe,
  };
};
