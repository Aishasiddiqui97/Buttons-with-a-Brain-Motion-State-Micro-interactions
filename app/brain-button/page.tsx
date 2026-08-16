"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  CircleCheck,
  RefreshCw,
  TriangleAlert,
} from "lucide-react";
import BrainButton, {
  type BrainButtonHandle,
  type BrainButtonStatus,
} from "@/components/BrainButton";

const cn = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(" ");

const STATUS_META: Record<
  BrainButtonStatus,
  { label: string; dot: string; ring: string }
> = {
  idle: {
    label: "Idle",
    dot: "bg-slate-400",
    ring: "border-slate-400/30 text-slate-300",
  },
  loading: {
    label: "Loading",
    dot: "bg-violet-400 animate-pulse",
    ring: "border-violet-400/30 text-violet-300",
  },
  success: {
    label: "Success",
    dot: "bg-emerald-400",
    ring: "border-emerald-400/30 text-emerald-300",
  },
  error: {
    label: "Error",
    dot: "bg-rose-400",
    ring: "border-rose-400/30 text-rose-300",
  },
};

const STATES: BrainButtonStatus[] = ["idle", "loading", "success", "error"];

export default function BrainButtonDemoPage() {
  const buttonRef = useRef<BrainButtonHandle>(null);
  const [status, setStatus] = useState<BrainButtonStatus>("idle");
  const [successes, setSuccesses] = useState(0);
  const [errors, setErrors] = useState(0);

  const handleStatusChange = (next: BrainButtonStatus) => {
    setStatus(next);
    if (next === "success") setSuccesses((c) => c + 1);
    if (next === "error") setErrors((c) => c + 1);
  };

  const meta = STATUS_META[status];

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-44 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-violet-600/25 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-fuchsia-600/15 blur-3xl" />
        <div className="absolute -right-20 bottom-24 h-72 w-72 rounded-full bg-indigo-600/15 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-10 px-6 py-20">
        <header className="text-center">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10"
          >
            ← Back to portfolio
          </Link>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Buttons with a{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
              Brain
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-400">
            One reusable button, six states, zero jank. Click{" "}
            <span className="text-slate-200">Generate AI Summary</span> to watch
            the full lifecycle — or force a state below. Try clicking rapidly
            while it is loading.
          </p>
        </header>

        <section className="w-full rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/50 backdrop-blur">
          <div className="flex flex-col items-center gap-7">
            <BrainButton
              ref={buttonRef}
              onStatusChange={handleStatusChange}
              className="w-full sm:w-auto"
            />

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => buttonRef.current?.forceSuccess()}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2.5 text-sm font-medium text-emerald-300 transition-colors duration-150 hover:bg-emerald-400/20",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                )}
              >
                <CircleCheck size={16} aria-hidden="true" />
                Force success
              </button>
              <button
                type="button"
                onClick={() => buttonRef.current?.forceError()}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-2.5 text-sm font-medium text-rose-300 transition-colors duration-150 hover:bg-rose-400/20",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                )}
              >
                <TriangleAlert size={16} aria-hidden="true" />
                Force error
              </button>
              <button
                type="button"
                onClick={() => buttonRef.current?.reset()}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors duration-150 hover:bg-white/10",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                )}
              >
                <RefreshCw size={16} aria-hidden="true" />
                Reset
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border bg-slate-900/60 px-4 py-1.5 text-xs font-medium",
                  meta.ring,
                )}
              >
                <span className={cn("h-2 w-2 rounded-full", meta.dot)} />
                {meta.label}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                <CircleCheck size={14} className="text-emerald-400" />
                {successes} success
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                <TriangleAlert size={14} className="text-rose-400" />
                {errors} error
              </span>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {STATES.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-slate-300"
            >
              <span
                className={cn("h-1.5 w-1.5 rounded-full", STATUS_META[s].dot)}
              />
              {STATUS_META[s].label}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
