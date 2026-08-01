import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChatMessageRenderer } from "@/components/chat/ChatMessageRenderer";
import type { ChatMessage } from "@/lib/types";

function makeMessage(overrides: Partial<ChatMessage>): ChatMessage {
  return {
    id: "msg-1",
    role: "assistant",
    content: "",
    ...overrides,
  } as ChatMessage;
}

describe("ChatMessageRenderer", () => {
  it("renders a user message with its content", () => {
    render(
      <ChatMessageRenderer
        message={makeMessage({ role: "user", content: "What is AI?" })}
      />,
    );

    expect(screen.getByText("What is AI?")).toBeInTheDocument();
  });

  it("shows the loading indicator for a pending assistant message", () => {
    render(
      <ChatMessageRenderer
        message={makeMessage({ status: "pending", content: "" })}
      />,
    );

    expect(
      screen.getByRole("status", { name: "AI is thinking" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("What is AI?")).not.toBeInTheDocument();
  });

  it("keeps the indicator and streams partial content while streaming", () => {
    render(
      <ChatMessageRenderer
        message={makeMessage({ status: "streaming", content: "The **result**" })}
      />,
    );

    expect(
      screen.getByRole("status", { name: "AI is thinking" }),
    ).toBeInTheDocument();
    expect(screen.getByText("result")).toBeInTheDocument();
  });

  it("renders a completed assistant reply as markdown", () => {
    render(
      <ChatMessageRenderer
        message={makeMessage({
          status: "completed",
          content: "# Title\n\nSome **bold** text and `code`.",
        })}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Title" }),
    ).toBeInTheDocument();
    expect(screen.getByText("bold")).toBeInTheDocument();
    expect(screen.getByText("code")).toBeInTheDocument();
  });

  it("falls back to 'No response.' for a completed empty reply", () => {
    render(
      <ChatMessageRenderer message={makeMessage({ status: "completed" })} />,
    );

    expect(screen.getByText("No response.")).toBeInTheDocument();
  });

  it("renders an error message as an alert", () => {
    render(
      <ChatMessageRenderer
        message={makeMessage({
          status: "error",
          content: "Sorry, something went wrong.",
        })}
      />,
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Sorry, something went wrong.");
  });

  it("renders an assistant message when status is omitted", () => {
    render(
      <ChatMessageRenderer
        message={makeMessage({ content: "**Hello** world" })}
      />,
    );

    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders a tool message via ToolResult", () => {
    render(
      <ChatMessageRenderer
        message={makeMessage({
          role: "tool",
          tool: { title: "Web Search", status: "success", description: "3 hits" },
        })}
      />,
    );

    expect(screen.getByText("Web Search")).toBeInTheDocument();
    expect(screen.getByText("3 hits")).toBeInTheDocument();
  });

  it("renders nothing for a tool message without tool data", () => {
    const { container } = render(
      <ChatMessageRenderer message={makeMessage({ role: "tool" })} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
