import type { Metadata } from "next";
import { FashionStudio } from "@/components/fashion/FashionStudio";

export const metadata: Metadata = {
  title: "AI Fashion Studio 3D — Virtual Product Customizer",
  description:
    "Design, customize and explore fashion products in an immersive 3D experience. Built with React Three Fiber, Three.js and drei.",
};

/**
 * Server component: static HTML + metadata for the route shell. All
 * interactivity (customizer state + the lazy WebGL canvas) lives in the client
 * component below, so this page pre-renders instantly.
 */
export default function FashionStudioPage() {
  return <FashionStudio />;
}
