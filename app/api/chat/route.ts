import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REPLIES = [
  "Here is a concise summary of what I found. The key takeaways are that this looks excellent for a developer portfolio and follows modern React patterns.",
  "Based on the available information, the approach is solid: composable components, tested behaviour, and accessible interactions.",
  "I analyzed the request and here is the result. Everything checks out and the streaming reply renders cleanly.",
];

/**
 * Mock streaming AI endpoint. Streams a plain-text reply word by word so the
 * client can render tokens as they arrive. Tests never hit this — they mock
 * `fetch` or the `/api/chat` route.
 */
export async function POST(request: NextRequest) {
  let prompt = "";

  try {
    const body = await request.json();
    const messages: Array<{ content?: unknown }> = Array.isArray(
      body?.messages,
    )
      ? body.messages
      : [];
    const last = messages[messages.length - 1];
    if (last && typeof last.content === "string") prompt = last.content;
  } catch {
    // Malformed body — respond anyway.
  }

  const text = prompt
    ? `You asked: "${prompt}".\n\n${REPLIES[0]}`
    : REPLIES[1];

  const encoder = new TextEncoder();
  const words = text.split(" ");

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      for (let i = 0; i < words.length; i += 1) {
        controller.enqueue(
          encoder.encode(words[i] + (i < words.length - 1 ? " " : "")),
        );
        await new Promise((resolve) => setTimeout(resolve, 30));
      }
      controller.close();
    },
    cancel() {
      // Client navigated away or aborted — nothing to clean up.
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
