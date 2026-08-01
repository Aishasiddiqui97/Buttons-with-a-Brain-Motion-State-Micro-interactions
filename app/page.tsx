import Link from "next/link";
import { Bot, Sparkles } from "lucide-react";
import { ChatApp } from "@/components/chat/ChatApp";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-6 sm:px-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-950/40">
            <Bot className="h-5 w-5 text-white" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-wide text-slate-100">
              AI Chat Studio
            </p>
            <p className="text-xs text-slate-500">
              FE-09 · streaming replies, mocked in tests
            </p>
          </div>
        </div>
        <Link
          href="/brain-button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          BrainButton demo
        </Link>
      </header>

      <div className="mt-5 flex h-[min(68vh,640px)] flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
        <ChatApp />
      </div>

      <footer className="mt-4 text-center text-xs text-slate-600">
        Streaming AI demo — the API is mocked in unit and E2E tests, never
        called for real.
      </footer>
    </main>
  );
}
