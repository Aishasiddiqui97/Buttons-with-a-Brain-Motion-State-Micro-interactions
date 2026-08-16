"use client";

import { motion, MotionConfig } from "framer-motion";
import { Boxes, Check, RotateCw } from "lucide-react";
import {
  COLOR_PRESETS,
  MATERIAL_PRESETS,
  type CustomizerState,
} from "@/lib/fashion/customization";
import { cn } from "@/lib/cn";

interface CustomizerPanelProps {
  state: CustomizerState;
  onChange: (patch: Partial<CustomizerState>) => void;
}

/**
 * CustomizerPanel
 *
 * Accessible, keyboard-friendly controls for the 3D product. Every control is a
 * real <button> with `aria-pressed`/`aria-checked` state so a screen reader can
 * announce the selection. Selection changes only bump state — the 3D material
 * animation is driven from a ref downstream, so no React re-render happens in
 * the Canvas for the actual colour fade.
 */
export function CustomizerPanel({ state, onChange }: CustomizerPanelProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.aside
        aria-label="Product customizer"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex w-full flex-col gap-6 rounded-3xl border border-white/10 bg-[#151028]/80 p-5 shadow-2xl shadow-black/50 backdrop-blur-md sm:p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A24A]">
            Customize
          </h2>
          <p className="hidden text-[11px] text-slate-500 sm:block">
            Drag to orbit · Scroll to zoom
          </p>
        </div>

        {/* Colour ------------------------------------------------------- */}
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-slate-100">
            Colour
          </legend>
          <div className="flex items-center gap-2.5">
            {COLOR_PRESETS.map((preset) => {
              const selected = state.color === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  aria-pressed={selected}
                  aria-label={`${preset.label} colour`}
                  title={preset.label}
                  onClick={() => onChange({ color: preset.id })}
                  className={cn(
                    "group flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5C4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0B1F]",
                    selected
                      ? "ring-2 ring-[#00E5C4] ring-offset-2 ring-offset-[#0F0B1F]"
                      : "hover:scale-110",
                  )}
                  style={{ backgroundColor: preset.swatch }}
                >
                  <Check
                    aria-hidden="true"
                    className={cn(
                      "h-4 w-4 transition-opacity",
                      selected
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-60",
                    )}
                    style={{
                      color:
                        preset.id === "black"
                          ? "#00E5C4"
                          : preset.id === "white"
                            ? "#0F0B1F"
                            : "#0F0B1F",
                    }}
                  />
                  <span className="sr-only">{preset.label}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Material ------------------------------------------------------ */}
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-slate-100">
            Material
          </legend>
          <div className="flex flex-col gap-2">
            {MATERIAL_PRESETS.map((preset) => {
              const selected = state.material === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onChange({ material: preset.id })}
                  className={cn(
                    "flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-left transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5C4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#151028]",
                    selected
                      ? "border-[#00E5C4]/50 bg-[#00E5C4]/10"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]",
                  )}
                >
                  <span>
                    <span
                      className={cn(
                        "block text-sm font-medium",
                        selected ? "text-[#00E5C4]" : "text-slate-200",
                      )}
                    >
                      {preset.label}
                    </span>
                    <span className="block text-[11px] text-slate-500">
                      {preset.description}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border",
                      selected
                        ? "border-[#00E5C4] bg-[#00E5C4] text-[#0F0B1F]"
                        : "border-white/20 text-transparent",
                    )}
                  >
                    <Check className="h-3 w-3" />
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Toggles ------------------------------------------------------- */}
        <div className="flex flex-col gap-2.5">
          <ToggleSwitch
            label="Wireframe mode"
            hint="Show the mesh structure"
            icon={<Boxes aria-hidden="true" className="h-4 w-4" />}
            checked={state.wireframe}
            onCheckedChange={(checked) => onChange({ wireframe: checked })}
          />
          <ToggleSwitch
            label="Auto-rotate"
            hint="Slowly spin the product"
            icon={<RotateCw aria-hidden="true" className="h-4 w-4" />}
            checked={state.autoRotate}
            onCheckedChange={(checked) => onChange({ autoRotate: checked })}
          />
        </div>
      </motion.aside>
    </MotionConfig>
  );
}

/* -------------------------------------------------------------------------- */
/* ToggleSwitch — labelled switch control with role="switch"                  */
/* -------------------------------------------------------------------------- */

function ToggleSwitch({
  label,
  hint,
  icon,
  checked,
  onCheckedChange,
}: {
  label: string;
  hint?: string;
  icon: React.ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5C4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#151028]",
        checked
          ? "border-[#00E5C4]/40 bg-[#00E5C4]/10"
          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]",
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          checked ? "bg-[#00E5C4]/20 text-[#00E5C4]" : "bg-white/[0.06] text-slate-400",
        )}
      >
        {icon}
      </span>
      <span className="flex-1">
        <span className="block text-sm font-medium text-slate-200">{label}</span>
        {hint ? (
          <span className="block text-[11px] text-slate-500">{hint}</span>
        ) : null}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200",
          checked ? "bg-[#00E5C4]" : "bg-white/15",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200",
            checked ? "translate-x-[1.125rem]" : "translate-x-0.5",
          )}
        />
      </span>
    </button>
  );
}
