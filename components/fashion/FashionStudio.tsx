"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Gem } from "lucide-react";
import { CustomizerPanel } from "@/components/fashion/CustomizerPanel";
import { LoadingFallback } from "@/components/fashion/LoadingFallback";
import {
  DEFAULT_CUSTOMIZER_STATE,
  type CustomizerState,
} from "@/lib/fashion/customization";

/**
 * The 3D Canvas (three.js + r3f + drei, ~1MB of JS) is loaded lazily with
 * next/dynamic + ssr:false. Three.js needs the browser (it touches `document`,
 * `window` and WebGL), and lazy loading means it never blocks first paint or
 * the main-thread cost of the hero/UI on the initial route.
 */
const ThreeScene = dynamic(
  () =>
    import("@/components/fashion/ThreeScene").then((mod) => mod.ThreeScene),
  {
    ssr: false,
    loading: () => <LoadingFallback />,
  },
);

export function FashionStudio() {
  const [state, setState] = useState<CustomizerState>(DEFAULT_CUSTOMIZER_STATE);

  const patch = (next: Partial<CustomizerState>) =>
    setState((prev) => ({ ...prev, ...next }));

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0F0B1F] text-slate-100">
      {/* Ambient glow layers */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-40 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[#00E5C4]/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-[#C8A24A]/10 blur-3xl" />
        <div className="absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-[#5B21B6]/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#00E5C4] to-[#0E7490] shadow-lg shadow-[#00E5C4]/20">
              <Gem className="h-5 w-5 text-[#0F0B1F]" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold tracking-wide text-slate-100">
                AI Fashion Studio 3D
              </p>
              <p className="text-xs text-slate-500">
                React Three Fiber · Product Customizer
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5C4]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back home
          </Link>
        </header>

        {/* Hero */}
        <section className="pt-2 text-center sm:pt-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-[#00E5C4] via-white to-[#C8A24A] bg-clip-text text-transparent">
              AI Fashion Studio 3D
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Design, customize and explore fashion products in an immersive 3D
            experience.
          </p>
        </section>

        {/* Studio layout: 3D viewport + customization sidebar */}
        <div className="flex flex-1 flex-col gap-5 pb-6 lg:flex-row">
          <section
            aria-label="3D product viewport"
            className="relative min-h-[420px] flex-1 overflow-hidden rounded-3xl border border-white/10 bg-[#151028]/60 shadow-2xl shadow-black/40 sm:min-h-[520px] lg:min-h-[600px]"
          >
            <ThreeScene state={state} />
          </section>

          <aside className="w-full shrink-0 lg:w-[340px]">
            <CustomizerPanel state={state} onChange={patch} />
          </aside>
        </div>
      </div>
    </main>
  );
}
