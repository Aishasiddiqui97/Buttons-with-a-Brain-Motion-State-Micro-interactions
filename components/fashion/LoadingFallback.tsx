import { cn } from "@/lib/cn";

/**
 * LoadingFallback
 *
 * Suspense fallback shown while the model downloads + parses and while the lazy
 * Canvas bundle is being fetched. It doubles as the skeleton for the whole
 * 3D viewport so the layout never jumps.
 *
 * Motion is CSS-only and slowed/stopped via `prefers-reduced-motion`
 * (see the `.fashion-loading-ring` rules in globals.css).
 */
export function LoadingFallback({
  label = "Preparing your studio…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-4",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="fashion-loading-ring h-12 w-12 rounded-full border-2 border-white/10 border-t-[#00E5C4]"
      />
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
    </div>
  );
}
