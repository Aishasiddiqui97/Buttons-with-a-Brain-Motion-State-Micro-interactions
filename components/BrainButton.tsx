"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Transition,
} from "framer-motion";
import { Check, LoaderCircle, RotateCcw, Sparkles } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type BrainButtonStatus = "idle" | "loading" | "success" | "error";

/** Imperative API so parents can drive the state machine from outside. */
export interface BrainButtonHandle {
  /** Run the full async lifecycle (loading → success/error). */
  generate: () => void;
  /** Short forced run that always resolves to success. */
  forceSuccess: () => void;
  /** Short forced run that always resolves to error. */
  forceError: () => void;
  /** Immediately clear timers and return to idle. */
  reset: () => void;
}

export interface BrainButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "type" | "disabled" | "onClick" | "children"
  > {
  /** Idle label. Defaults to "Generate AI Summary". */
  label?: ReactNode;
  /** Label shown while loading. */
  loadingLabel?: ReactNode;
  /** Label shown after success. */
  successLabel?: ReactNode;
  /** Label shown after error (retry). */
  errorLabel?: ReactNode;
  /**
   * Controlled status. When provided the component is fully controlled —
   * callers drive transitions via `onStatusChange`. When omitted the
   * component manages its own lifecycle.
   */
  status?: BrainButtonStatus;
  /** Called whenever the status changes (controlled or not). */
  onStatusChange?: (status: BrainButtonStatus) => void;
  /** Optional extra click handler (runs before the state machine). */
  onClick?: () => void;
  /**
   * Replace the internal fake API with your own async work. The button shows
   * loading while the promise is pending; a rejection → error, resolve → success.
   */
  onGenerate?: () => Promise<void>;
  /** [min, max] milliseconds for the fake request (default [900, 2400]). */
  generateDuration?: [number, number];
  /** Probability (0–1) that the fake request fails (default 0.2). */
  failureRate?: number;
  /** How long success is shown before auto-returning to idle (default 1800). */
  successHoldMs?: number;
  /** Hard-disable the button (dimmed). Loading/success also disable input. */
  disabled?: boolean;
  /** Show the Sparkles icon in idle state (default true). */
  showIcon?: boolean;
  /** Visual size. */
  size?: "sm" | "md" | "lg";
  /** Visual style. */
  variant?: "primary" | "secondary" | "ghost";
  /** Native button type. */
  type?: "button" | "submit" | "reset";
}

/* ------------------------------------------------------------------ */
/* Design tokens                                                       */
/* ------------------------------------------------------------------ */

/**
 * Motion guidelines (mirrored in the README):
 *  - Hover lift ......... 200ms   ease-out
 *  - State swap ......... 300ms   ease-in-out
 *  - Success/Error pop .. 400ms   spring (duration-based)
 *  - Error shake ........ 400ms   ease-in-out
 */
const HOVER_LIFT: Transition = { duration: 0.2, ease: "easeOut" };
const TAP_SCALE: Transition = { duration: 0.12, ease: "easeOut" };
const SWAP_IN: Transition = { duration: 0.3, ease: "easeInOut" };
const POP: Transition = { type: "spring", duration: 0.4, bounce: 0.28 };
const SHAKE: Transition = { duration: 0.4, ease: "easeInOut" };
const ZERO: Transition = { duration: 0 };

/** Single, non-looping shake keyframes for the error state. */
const SHAKE_KEYFRAMES: number[] = [0, -6, 6, -4, 4, 0];

const cn = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(" ");

const SIZE = {
  sm: { button: "px-4 py-2 text-sm rounded-xl", min: "min-w-44", icon: 16, gap: "gap-1.5" },
  md: { button: "px-6 py-3 text-sm rounded-2xl", min: "min-w-56", icon: 18, gap: "gap-2" },
  lg: { button: "px-8 py-3.5 text-base rounded-2xl", min: "min-w-64", icon: 20, gap: "gap-2" },
} as const;

const VARIANT = {
  primary:
    "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 text-white shadow-lg shadow-violet-950/40 border border-white/10",
  secondary: "bg-white/[0.06] text-slate-100 border border-white/10",
  ghost: "bg-transparent text-slate-300 border border-transparent",
} as const;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const BrainButton = forwardRef<BrainButtonHandle, BrainButtonProps>(
  function BrainButton(
    {
      label = "Generate AI Summary",
      loadingLabel = "Generating…",
      successLabel = "Generated",
      errorLabel = "Retry",
      status: controlledStatus,
      onStatusChange,
      onClick,
      onGenerate,
      generateDuration = [900, 2400],
      failureRate = 0.2,
      successHoldMs = 1800,
      disabled = false,
      showIcon = true,
      size = "md",
      variant = "primary",
      type = "button",
      className,
      ...rest
    },
    ref,
  ) {
    const reduced = useReducedMotion() === true;

    /* Transitions collapse to instant when the user prefers reduced motion,
       while opacity-based feedback (glow, spinner) is preserved. */
    const hoverLift = reduced ? ZERO : HOVER_LIFT;
    const tapScale = reduced ? ZERO : TAP_SCALE;
    const swapIn = reduced ? ZERO : SWAP_IN;
    const pop = reduced ? ZERO : POP;
    const shake = reduced ? ZERO : SHAKE;

    const [internalStatus, setInternalStatus] =
      useState<BrainButtonStatus>("idle");
    const controlledRef = useRef(controlledStatus !== undefined);
    controlledRef.current = controlledStatus !== undefined;
    const status = controlledStatus ?? internalStatus;

    /* The DOM node the native/`motion` button actually lives on. The public
       ref above is repurposed for the imperative handle via useImperativeHandle,
       so the motion ref keeps its own HTMLButtonElement ref. */
    const domRef = useRef<HTMLButtonElement>(null);

    /* Async guards: a monotonically increasing generation id lets newer runs
       invalidate stale ones (interruptible), and `busyRef` blocks re-entry. */
    const generationIdRef = useRef(0);
    const busyRef = useRef(false);
    const timersRef = useRef<number[]>([]);

    const onStatusChangeRef = useRef(onStatusChange);
    onStatusChangeRef.current = onStatusChange;
    const onGenerateRef = useRef(onGenerate);
    onGenerateRef.current = onGenerate;
    const onClickRef = useRef(onClick);
    onClickRef.current = onClick;

    const commitStatus = useCallback((next: BrainButtonStatus) => {
      if (controlledRef.current) {
        onStatusChangeRef.current?.(next);
      } else {
        setInternalStatus(next);
        onStatusChangeRef.current?.(next);
      }
    }, []);

    const wait = useCallback(
      (ms: number) =>
        new Promise<void>((resolve) => {
          timersRef.current.push(window.setTimeout(resolve, ms));
        }),
      [],
    );

    const runGeneration = useCallback(
      async (force?: "success" | "error") => {
        const id = ++generationIdRef.current;
        busyRef.current = true;
        commitStatus("loading");

        const succeed = () => {
          if (generationIdRef.current !== id) return;
          commitStatus("success");
          timersRef.current.push(
            window.setTimeout(() => {
              if (generationIdRef.current === id) {
                busyRef.current = false;
                commitStatus("idle");
              }
            }, successHoldMs),
          );
        };

        const fail = () => {
          if (generationIdRef.current !== id) return;
          commitStatus("error");
          busyRef.current = false;
        };

        try {
          if (force === "success") {
            await wait(450);
            succeed();
          } else if (force === "error") {
            await wait(450);
            fail();
          } else if (onGenerateRef.current) {
            await onGenerateRef.current();
            succeed();
          } else {
            const [min, max] = generateDuration;
            await wait(Math.round(min + Math.random() * (max - min)));
            if (Math.random() < failureRate) fail();
            else succeed();
          }
        } catch {
          fail();
        }
      },
      [commitStatus, wait, generateDuration, failureRate, successHoldMs],
    );

    const reset = useCallback(() => {
      generationIdRef.current += 1;
      timersRef.current.forEach((t) => window.clearTimeout(t));
      timersRef.current = [];
      busyRef.current = false;
      commitStatus("idle");
    }, [commitStatus]);

    useImperativeHandle(
      ref,
      () => ({
        generate: () => void runGeneration(),
        forceSuccess: () => void runGeneration("success"),
        forceError: () => void runGeneration("error"),
        reset,
      }),
      [runGeneration, reset],
    );

    /* Clear any pending timers on unmount to avoid state updates / leaks. */
    useEffect(() => {
      const timers = timersRef.current;
      return () => {
        timers.forEach((t) => window.clearTimeout(t));
      };
    }, []);

    const isBusy = status === "loading";
    const isDisabled = disabled || isBusy || status === "success";
    const s = SIZE[size];

    const handleClick = () => {
      onClickRef.current?.();
      if (busyRef.current) return;
      void runGeneration();
    };

    const content: ReactNode = (() => {
      switch (status) {
        case "loading":
          return (
            <motion.span
              key="loading"
              className={cn("inline-flex items-center", s.gap)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={swapIn}
            >
              <LoaderCircle
                size={s.icon}
                className="animate-spin"
                aria-hidden="true"
              />
              <span>{loadingLabel}</span>
            </motion.span>
          );
        case "success":
          return (
            <motion.span
              key="success"
              className={cn("inline-flex items-center", s.gap)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={pop}
            >
              <motion.span
                className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/25"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={pop}
              >
                <Check
                  size={s.icon}
                  strokeWidth={3}
                  className="text-emerald-300"
                  aria-hidden="true"
                />
              </motion.span>
              <span>{successLabel}</span>
            </motion.span>
          );
        case "error":
          return (
            <motion.span
              key="error"
              className={cn("inline-flex items-center", s.gap)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={swapIn}
            >
              <RotateCcw
                size={s.icon}
                className="text-amber-300"
                aria-hidden="true"
              />
              <span>{errorLabel}</span>
            </motion.span>
          );
        default:
          return (
            <motion.span
              key="idle"
              className={cn("inline-flex items-center", s.gap)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={swapIn}
            >
              {showIcon && (
                <Sparkles
                  size={s.icon}
                  className="text-violet-200"
                  aria-hidden="true"
                />
              )}
              <span>{label}</span>
            </motion.span>
          );
      }
    })();

    return (
      <motion.button
        {...(rest as HTMLMotionProps<"button">)}
        ref={domRef}
        type={type}
        disabled={isDisabled}
        aria-busy={isBusy}
        aria-live="polite"
        aria-atomic="true"
        data-status={status}
        onClick={handleClick}
        className={cn(
          "group relative inline-flex select-none items-center justify-center whitespace-nowrap font-semibold tracking-wide",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
          s.button,
          s.min,
          VARIANT[variant],
          disabled && "cursor-not-allowed opacity-60 saturate-50",
          isBusy && "cursor-wait",
          className,
        )}
        whileHover={reduced ? undefined : { y: -2, transition: hoverLift }}
        whileTap={
          reduced || isDisabled ? undefined : { scale: 0.97, transition: tapScale }
        }
        animate={
          status === "error" && !reduced ? { x: SHAKE_KEYFRAMES } : { x: 0 }
        }
        transition={shake}
      >
        {/* Enhanced shadow on hover/focus — fades via opacity (compositor-friendly).
            The button itself lifts via translateY, so no box-shadow is animated. */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute -inset-1.5 rounded-3xl bg-gradient-to-b from-violet-500/50 to-fuchsia-500/25 opacity-0 blur-xl",
            "transition-opacity duration-200 ease-out",
            "group-hover:opacity-100 group-focus-visible:opacity-100",
          )}
        />
        <span className="relative z-10 inline-flex items-center justify-center">
          <AnimatePresence mode="popLayout" initial={false}>
            {content}
          </AnimatePresence>
        </span>
      </motion.button>
    );
  },
);

export default BrainButton;
