import { describe, expect, it, vi, beforeEach } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatApp } from "@/components/chat/ChatApp";
import { streamChat } from "@/lib/chat";

vi.mock("@/lib/chat", () => ({
  streamChat: vi.fn(),
}));

const streamChatMock = vi.mocked(streamChat);

describe("ChatApp", () => {
  beforeEach(() => {
    streamChatMock.mockReset();
  });

  it("shows an empty state before any message", () => {
    render(<ChatApp />);

    expect(screen.getByText(/I will stream a reply/)).toBeInTheDocument();
  });

  it("appends the user message and shows the thinking indicator while pending", async () => {
    let resolveStream!: () => void;
    streamChatMock.mockImplementation(
      async (_prompt, handlers) =>
        new Promise<string>((resolve) => {
          resolveStream = () => {
            handlers.onToken("done");
            resolve("done");
          };
        }),
    );

    const user = userEvent.setup();
    render(<ChatApp />);

    await user.type(screen.getByLabelText("Prompt"), "Hello there");
    await user.click(screen.getByRole("button", { name: "Generate" }));

    await waitFor(() => {
      expect(screen.getByText("Hello there")).toBeInTheDocument();
    });
    expect(
      screen.getByRole("status", { name: "AI is thinking" }),
    ).toBeInTheDocument();

    await act(async () => {
      resolveStream();
    });
    await waitFor(() => {
      expect(screen.getByText("done")).toBeInTheDocument();
    });
    expect(
      screen.queryByRole("status", { name: "AI is thinking" }),
    ).not.toBeInTheDocument();
  });  it("streams tokens into the assistant message and completes it", async () => {
    streamChatMock.mockImplementation(async (_prompt, handlers) => {
      handlers.onToken("The ");
      handlers.onToken("answer.");
      return "The answer.";
    });

    const user = userEvent.setup();
    render(<ChatApp />);

    await user.type(screen.getByLabelText("Prompt"), "Question");
    await user.click(screen.getByRole("button", { name: "Generate" }));

    await waitFor(() => {
      expect(screen.getByText("The answer.")).toBeInTheDocument();
    });
    expect(
      screen.queryByRole("status", { name: "AI is thinking" }),
    ).not.toBeInTheDocument();
  });

  it("shows an error alert when streaming fails", async () => {
    streamChatMock.mockRejectedValue(new Error("network"));

    const user = userEvent.setup();
    render(<ChatApp />);

    await user.type(screen.getByLabelText("Prompt"), "Question");
    await user.click(screen.getByRole("button", { name: "Generate" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(screen.getByRole("alert")).toHaveTextContent(/went wrong/i);
    expect(
      screen.queryByRole("status", { name: "AI is thinking" }),
    ).not.toBeInTheDocument();
  });

  it("disables the form while a request is in flight", async () => {
    let resolveStream!: () => void;
    streamChatMock.mockImplementation(
      async (_prompt, handlers) =>
        new Promise<string>((resolve) => {
          resolveStream = () => {
            handlers.onToken("ok");
            resolve("ok");
          };
        }),
    );

    const user = userEvent.setup();
    render(<ChatApp />);

    await user.type(screen.getByLabelText("Prompt"), "Question");
    await user.click(screen.getByRole("button", { name: "Generate" }));

    expect(screen.getByRole("button", { name: "Generating…" })).toBeDisabled();

    await act(async () => {
      resolveStream();
    });
    await waitFor(() => {
      expect(screen.getByText("ok")).toBeInTheDocument();
    });
  });
});
