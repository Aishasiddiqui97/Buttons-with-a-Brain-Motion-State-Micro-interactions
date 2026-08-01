import { useId, useState, type FormEvent } from "react";
import { LoaderCircle, Send } from "lucide-react";
import { cn } from "@/lib/cn";

export interface ChatInputProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
  label?: string;
  placeholder?: string;
  maxLength?: number;
}

/**
 * Validated prompt form: required field + minimum length, live error
 * clearing, `aria-busy` while a request is in flight, and a disabled submit
 * button while loading.
 */
export function ChatInput({
  onSubmit,
  isLoading = false,
  label = "Prompt",
  placeholder = "Ask anything, e.g. Summarize this article",
  maxLength = 500,
}: ChatInputProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const id = useId();
  const errorId = `${id}-error`;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = text.trim();
    if (!value) {
      setError("Please enter a prompt.");
      return;
    }
    if (value.length < 2) {
      setError("Prompt must be at least 2 characters.");
      return;
    }
    onSubmit(value);
    setText("");
    setError(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Chat prompt form"
      aria-busy={isLoading}
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
    >
      <div>
        <label
          htmlFor={id}
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300"
        >
          {label}
        </label>
        <textarea
          id={id}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            if (error) setError(null);
          }}
          placeholder={placeholder}
          disabled={isLoading}
          maxLength={maxLength}
          rows={2}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="w-full resize-none rounded-xl border border-white/10 bg-slate-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-violet-400/60 focus:outline-none focus:ring-2 focus:ring-violet-400/40 disabled:opacity-60"
        />
        {error && (
          <p id={errorId} role="alert" className="mt-2 text-xs font-medium text-rose-300">
            {error}
          </p>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-xs tabular-nums text-slate-500">
          {text.length}/{maxLength}
        </span>
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/40",
            "transition-transform duration-150 hover:-translate-y-0.5",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
            "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0",
          )}
        >
          {isLoading ? (
            <>
              <LoaderCircle
                className="h-4 w-4 animate-spin"
                aria-hidden="true"
              />
              Generating…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" />
              Generate
            </>
          )}
        </button>
      </div>
    </form>
  );
}
