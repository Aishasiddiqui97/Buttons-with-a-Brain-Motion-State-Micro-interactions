/**
 * build-model.mjs
 *
 * Procedurally builds the stylised tote-bag GLB used by the AI Fashion Studio.
 *
 * Why a generated model instead of a downloaded .glb?
 *   - The repo stays fully self-contained (works offline, no copyright/license
 *     ambiguity, no runtime CDN dependency).
 *   - The geometry is simple primitive shapes, so the resulting GLB is only a
 *     few kilobytes — ideal for a "model size" performance budget.
 *   - Every mesh is tagged with `userData.part` ("body" | "hardware") which the
 *     GLTFExporter writes into node extras. The runtime customizer (FashionModel)
 *     reads that tag to decide which material each piece receives.
 *
 * Run: npm run build:model
 */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "..", "public", "models");
const OUT_FILE = resolve(OUT_DIR, "fashion-bag.glb");

// GLTFExporter's binary path reads the output Blob through a FileReader, which
// does not exist in Node. Blob is global (Node 18+), so shim FileReader on top
// of it — production is unaffected (this file never runs in the browser).
if (typeof globalThis.FileReader === "undefined") {
  globalThis.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      blob
        .arrayBuffer()
        .then((buf) => {
          this.result = buf;
          this.onloadend?.(new Event("loadend"));
        })
        .catch((err) => this.onerror?.(err));
    }
  };
}

const scene = new THREE.Scene();

/** Muted plum — a neutral base; the runtime replaces it with the user's colour. */
const bodyMat = new THREE.MeshStandardMaterial({
  color: 0x3a3350,
  roughness: 0.6,
  metalness: 0.1,
});

/** Brushed gold hardware — kept as an accent that does not change with colour. */
const hardwareMat = new THREE.MeshStandardMaterial({
  color: 0xd4af37,
  roughness: 0.22,
  metalness: 0.9,
});

const tag = (mesh, part) => {
  mesh.userData.part = part;
  return mesh;
};

// --- Bag body ---------------------------------------------------------------
// Low segment counts keep the exported GLB tiny (the rounded corners are small
// enough that 3-4 segments read as smooth at typical camera distance).
const bodyGeo = new RoundedBoxGeometry(2.0, 1.6, 0.72, 3, 0.16);
scene.add(tag(new THREE.Mesh(bodyGeo, bodyMat), "body"));

// --- Front pocket -----------------------------------------------------------
const pocketGeo = new RoundedBoxGeometry(1.42, 0.95, 0.1, 3, 0.07);
const pocket = tag(new THREE.Mesh(pocketGeo, bodyMat), "body");
pocket.position.set(0, -0.28, 0.38);
pocket.rotation.x = -0.12;
scene.add(pocket);

// --- Handles (two gold "∩" arcs) -------------------------------------------
const handleGeo = new THREE.TorusGeometry(0.4, 0.085, 8, 24, Math.PI * 1.05);
for (const x of [-0.46, 0.46]) {
  const handle = tag(new THREE.Mesh(handleGeo, hardwareMat), "hardware");
  handle.position.set(x, 0.92, 0);
  scene.add(handle);
}

// --- Gold clasp -------------------------------------------------------------
const claspGeo = new RoundedBoxGeometry(0.22, 0.09, 0.09, 2, 0.025);
const clasp = tag(new THREE.Mesh(claspGeo, hardwareMat), "hardware");
clasp.position.set(0, 0.62, 0.4);
scene.add(clasp);

// --- Gold feet --------------------------------------------------------------
const footGeo = new THREE.SphereGeometry(0.07, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.6);
for (const x of [-0.7, 0.7]) {
  const foot = tag(new THREE.Mesh(footGeo, hardwareMat), "hardware");
  foot.position.set(x, -0.82, 0.1);
  scene.add(foot);
}

// --- Normalise size & centre ------------------------------------------------
const box = new THREE.Box3().setFromObject(scene);
const size = box.getSize(new THREE.Vector3());
const maxDim = Math.max(size.x, size.y, size.z);
const scale = 2 / maxDim; // fit within a ~2-unit box, matching the camera framing
scene.scale.setScalar(scale);
box.setFromObject(scene);
const center = box.getCenter(new THREE.Vector3());
scene.position.x -= center.x;
scene.position.y -= center.y;
scene.position.z -= center.z;

// --- Export GLB (binary) -----------------------------------------------------
const exporter = new GLTFExporter();
exporter.parse(
  scene,
  (result) => {
    const buffer = result instanceof ArrayBuffer ? result : Buffer.from(JSON.stringify(result));
    mkdirSync(OUT_DIR, { recursive: true });
    writeFileSync(OUT_FILE, Buffer.from(buffer));
    const kb = (Buffer.byteLength(buffer) / 1024).toFixed(1);
    console.log(`Wrote ${OUT_FILE} (${kb} KB)`);
  },
  (error) => {
    console.error(error);
    process.exit(1);
  },
  { binary: true, onlyVisible: true },
);
