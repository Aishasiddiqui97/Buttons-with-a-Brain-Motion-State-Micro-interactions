"use client";

import { useCallback, useState } from "react";
import { Sparkles } from "lucide-react";
import { streamChat } from "@/lib/chat";
import { createId } from "@/lib/id";
import type { ChatMessage } from "@/lib/types";
import { ChatMessageRenderer } from "./ChatMessageRenderer";
import { ChatInput } from "./ChatInput";

/**
 * The chat shell: owns the message list and the streaming lifecycle.
 * Submits a prompt → shows a pending assistant message → streams tokens
 * in → completes, or surfaces an error in place of the reply.
 */
export function ChatApp() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(async (prompt: string) => {
    const userMessage: ChatMessage = {
      id: createId("user"),
      role: "user",
      content: prompt,
    };
    const assistantId = createId("assistant");
    const pendingMessage: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      status: "pending",
    };

    setMessages((prev) => [...prev, userMessage, pendingMessage]);
    setIsLoading(true);

    try {
      await streamChat(prompt, {
        onToken: (chunk) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: m.content + chunk, status: "streaming" }
                : m,
            ),
          );
        },
      });
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, status: "completed" } : m,
        ),
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content: "Sorry, something went wrong. Please try again.",
                status: "error",
              }
            : m,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col">
      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <Sparkles className="h-8 w-8 text-violet-300" aria-hidden="true" />
          <p className="text-sm text-slate-400">
            Ask anything — I will stream a reply.
          </p>
        </div>
      ) : (
        <ol
          aria-label="Chat history"
          className="min-h-0 flex-1 space-y-4 overflow-y-auto py-2"
        >
          {messages.map((message) => (
            <li key={message.id}>
              <ChatMessageRenderer message={message} />
            </li>
          ))}
        </ol>
      )}

      <div className="mt-4 shrink-0">
        <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
