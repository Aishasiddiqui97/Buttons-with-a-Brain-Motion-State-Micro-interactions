import { beforeEach, describe, expect, it, vi } from "vitest";
import { streamChat } from "@/lib/chat";

/** Build a mock Response whose body streams the given chunks. */
function streamResponse(chunks: string[], status = 200): Response {
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
      controller.close();
    },
  });
  return new Response(body, { status });
}

describe("streamChat", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("posts the prompt and returns the full accumulated text", async () => {
    fetchMock.mockResolvedValue(streamResponse(["Hello", " world"]));

    const result = await streamChat("hi", { onToken: vi.fn() });

    expect(result).toBe("Hello world");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/chat",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: expect.stringContaining("hi"),
      }),
    );
  });

  it("emits each decoded chunk through onToken", async () => {
    const onToken = vi.fn();
    fetchMock.mockResolvedValue(streamResponse(["The ", "quick ", "fox"]));

    await streamChat("prompt", { onToken });

    expect(onToken).toHaveBeenCalledTimes(3);
    expect(onToken).toHaveBeenNthCalledWith(1, "The ");
    expect(onToken).toHaveBeenNthCalledWith(3, "fox");
  });

  it("calls onComplete once the stream finishes", async () => {
    const onComplete = vi.fn();
    fetchMock.mockResolvedValue(streamResponse(["done"]));

    await streamChat("x", { onToken: vi.fn(), onComplete });

    expect(onComplete).toHaveBeenCalledOnce();
  });

  it("throws when the server responds with an error status", async () => {
    fetchMock.mockResolvedValue(streamResponse(["oops"], 500));

    await expect(streamChat("x", { onToken: vi.fn() })).rejects.toThrow("500");
  });

  it("throws when the response has no body", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 200 }));

    await expect(streamChat("x", { onToken: vi.fn() })).rejects.toThrow(
      "No response body",
    );
  });
});
