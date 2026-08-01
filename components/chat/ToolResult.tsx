import type { ReactNode } from "react";
import {
  CircleCheck,
  LoaderCircle,
  SearchX,
  TriangleAlert,
} from "lucide-react";
import type { ToolResultStatus } from "@/lib/types";
import { cn } from "@/lib/cn";

export interface ToolResultProps {
  title: string;
  status: ToolResultStatus;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  icon?: ReactNode;
}

/**
 * Reusable tool/agent result card covering the four states:
 * loading, success, empty and error. Accessible via `role="status"`
 * (loading) and `role="alert"` (error).
 */
export function ToolResult({
  title,
  status,
  description,
  actionLabel,
  onAction,
  className,
  icon,
}: ToolResultProps) {
  if (status === "loading") {
    return (
      <div
        role="status"
        aria-label={`${title} is running`}
        className={cn(
          "flex items-center gap-3 rounded-2xl border border-violet-400/20 bg-violet-400/10 p-4",
          className,
        )}
      >
        <LoaderCircle
          className="h-5 w-5 animate-spin text-violet-300"
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-semibold text-violet-100">{title}</p>
          <p className="text-xs text-violet-300/70">Running…</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div
        role="alert"
        className={cn(
          "flex items-start gap-3 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4",
          className,
        )}
      >
        <TriangleAlert
          className="mt-0.5 h-5 w-5 shrink-0 text-rose-300"
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-rose-100">{title}</p>
          <p className="mt-1 text-sm text-rose-200/80">
            {description ?? "Something went wrong while running this tool."}
          </p>
          {actionLabel && (
            <button
              type="button"
              onClick={onAction}
              className="mt-3 rounded-lg bg-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-100 transition-colors hover:bg-rose-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (status === "empty") {
    return (
      <div
        className={cn(
          "flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4",
          className,
        )}
      >
        <SearchX
          className="mt-0.5 h-5 w-5 shrink-0 text-slate-400"
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-semibold text-slate-200">{title}</p>
          <p className="mt-1 text-sm text-slate-400">
            {description ?? "No results were found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4",
        className,
      )}
    >
      {icon ?? (
        <CircleCheck
          className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300"
          aria-hidden="true"
        />
      )}
      <div>
        <p className="text-sm font-semibold text-emerald-100">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-emerald-200/80">{description}</p>
        )}
      </div>
    </div>
  );
}
