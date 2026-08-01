import ReactMarkdown from "react-markdown";
import { CircleAlert, Sparkles } from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import { ToolResult } from "./ToolResult";

export interface ChatMessageRendererProps {
  message: ChatMessage;
}

/**
 * Animated "AI is thinking" indicator. A live region (`role="status"`) so
 * screen readers announce that a reply is being generated.
 */
export function ThinkingIndicator() {
  return (
    <span
      role="status"
      aria-label="AI is thinking"
      className="inline-flex items-center text-violet-300"
    >
      <span aria-hidden="true" className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-current"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </span>
    </span>
  );
}

/**
 * Renders a single chat message. Handles user, assistant and tool messages,
 * and every assistant state: pending, streaming, completed and error.
 */
export function ChatMessageRenderer({ message }: ChatMessageRendererProps) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-violet-600 px-4 py-2.5 text-sm leading-relaxed text-white">
          {message.content}
        </div>
      </div>
    );
  }

  if (message.role === "tool") {
    if (!message.tool) return null;
    return (
      <div className="flex justify-start">
        <div className="w-full max-w-[85%]">
          <ToolResult
            title={message.tool.title}
            status={message.tool.status}
            description={message.tool.description}
          />
        </div>
      </div>
    );
  }

  const isPending = message.status === "pending";
  const isStreaming = message.status === "streaming";
  const isError = message.status === "error";
  const isCompleted = !isPending && !isStreaming && !isError;

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] space-y-2 rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.05] px-4 py-3">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-violet-300">
          <Sparkles size={14} aria-hidden="true" />
          AI Assistant
        </div>

        {isPending && <ThinkingIndicator />}

        {isStreaming && (
          <div className="flex items-start gap-2.5">
            <ThinkingIndicator />
            <div className="markdown min-w-0 text-sm leading-relaxed text-slate-100">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          </div>
        )}

        {isError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg bg-rose-500/10 px-3 py-2 text-sm leading-relaxed text-rose-200"
          >
            <CircleAlert
              size={16}
              aria-hidden="true"
              className="mt-0.5 shrink-0"
            />
            <span>{message.content}</span>
          </div>
        )}

        {isCompleted &&
          (message.content.trim() ? (
            <div className="markdown text-sm leading-relaxed text-slate-100">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-slate-400">No response.</p>
          ))}
      </div>
    </div>
  );
}
