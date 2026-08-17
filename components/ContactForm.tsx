"use client";

import { FormEvent, useState } from "react";
import { Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react";

const MAX_MESSAGE_LENGTH = 2000;

type FormStatus = "idle" | "submitting" | "success" | "error";

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

function validateName(value: string): string | undefined {
  if (!value.trim()) return "Please enter your name.";
  return undefined;
}

function validateEmail(value: string): string | undefined {
  if (!value.trim()) return "Please enter your email address.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return "Please enter a valid email address.";
  return undefined;
}

function validateMessage(value: string): string | undefined {
  if (!value.trim()) return "Please enter a message.";
  if (value.length > MAX_MESSAGE_LENGTH)
    return `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`;
  return undefined;
}

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");

  function validate(): boolean {
    const next: FieldErrors = {};
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const messageErr = validateMessage(message);
    if (nameErr) next.name = nameErr;
    if (emailErr) next.email = emailErr;
    if (messageErr) next.message = messageErr;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    setServerError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus("error");
        setServerError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
      setErrors({});
    } catch {
      setStatus("error");
      setServerError(
        "Could not reach the server. Please check your connection and try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-2xl border border-emerald-500/20 bg-emerald-950/30 p-6 text-center"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2
          className="mx-auto h-10 w-10 text-emerald-400"
          aria-hidden="true"
        />
        <h3 className="mt-3 text-lg font-semibold text-slate-100">
          Message sent!
        </h3>
        <p className="mt-2 text-sm text-slate-400">
          Thank you for reaching out. I&apos;ll get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className={`mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white ${FOCUS_RING}`}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
      aria-label="Contact form"
    >
      {/* Name */}
      <div>
        <label
          htmlFor="contact-name"
          className="mb-1.5 block text-sm font-medium text-slate-300"
        >
          Name <span className="text-violet-400" aria-hidden="true">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          placeholder="Your name"
          className={`w-full rounded-xl border bg-white/[0.05] px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-colors hover:bg-white/[0.08] ${
            errors.name
              ? "border-red-500/60 focus:border-red-400"
              : "border-white/10 focus:border-violet-400"
          } ${FOCUS_RING}`}
        />
        {errors.name && (
          <p
            id="name-error"
            className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400"
            role="alert"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="contact-email"
          className="mb-1.5 block text-sm font-medium text-slate-300"
        >
          Email <span className="text-violet-400" aria-hidden="true">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          placeholder="you@example.com"
          className={`w-full rounded-xl border bg-white/[0.05] px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-colors hover:bg-white/[0.08] ${
            errors.email
              ? "border-red-500/60 focus:border-red-400"
              : "border-white/10 focus:border-violet-400"
          } ${FOCUS_RING}`}
        />
        {errors.email && (
          <p
            id="email-error"
            className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400"
            role="alert"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="contact-message"
          className="mb-1.5 block text-sm font-medium text-slate-300"
        >
          Message <span className="text-violet-400" aria-hidden="true">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          placeholder="Tell me about your project, role, or idea…"
          className={`w-full resize-y rounded-xl border bg-white/[0.05] px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-colors hover:bg-white/[0.08] ${
            errors.message
              ? "border-red-500/60 focus:border-red-400"
              : "border-white/10 focus:border-violet-400"
          } ${FOCUS_RING}`}
        />
        <div className="mt-1 flex items-center justify-between">
          {errors.message ? (
            <p
              id="message-error"
              className="flex items-center gap-1.5 text-xs text-red-400"
              role="alert"
            >
              <AlertCircle
                className="h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
              {errors.message}
            </p>
          ) : (
            <span id="message-error" className="text-xs text-slate-600">
              <span className="sr-only">Current character count: </span>
              {message.length}/{MAX_MESSAGE_LENGTH}
            </span>
          )}
        </div>
      </div>

      {/* Server error */}
      {status === "error" && serverError && (
        <div
          className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-950/30 px-4 py-3 text-sm text-red-300"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          {serverError}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${FOCUS_RING}`}
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" />
            Send message
          </>
        )}
      </button>
    </form>
  );
}
