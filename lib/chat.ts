export interface StreamHandlers {
  onToken: (chunk: string) => void;
  onComplete?: () => void;
}

const CHAT_ENDPOINT = "/api/chat";

/**
 * POSTs a prompt to the AI chat endpoint and reads the streaming plain-text
 * response, emitting each decoded chunk via `onToken`.
 *
 * Resolves with the full accumulated text. Rejects on network errors, non-2xx
 * responses, or a missing body.
 */
export async function streamChat(
  prompt: string,
  handlers: StreamHandlers,
): Promise<string> {
  const response = await fetch(CHAT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let full = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    full += chunk;
    handlers.onToken(chunk);
  }

  handlers.onComplete?.();
  return full;
}
