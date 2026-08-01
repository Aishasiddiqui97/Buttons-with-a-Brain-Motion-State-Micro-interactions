import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToolResult } from "@/components/chat/ToolResult";

describe("ToolResult", () => {
  it("shows a loading state as a live region", () => {
    render(<ToolResult title="Web Search" status="loading" />);

    expect(
      screen.getByRole("status", { name: "Web Search is running" }),
    ).toBeInTheDocument();
  });

  it("shows the success state with a description", () => {
    render(
      <ToolResult
        title="Web Search"
        status="success"
        description="Found 3 results"
      />,
    );

    expect(screen.getByText("Web Search")).toBeInTheDocument();
    expect(screen.getByText("Found 3 results")).toBeInTheDocument();
  });

  it("shows a custom icon in the success state", () => {
    render(
      <ToolResult
        title="Web Search"
        status="success"
        icon={<span>★</span>}
      />,
    );

    expect(screen.getByText("★")).toBeInTheDocument();
  });

  it("shows the empty state with a default message", () => {
    render(<ToolResult title="Web Search" status="empty" />);

    expect(screen.getByText("No results were found.")).toBeInTheDocument();
  });

  it("shows an error alert and triggers the retry action", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <ToolResult
        title="Web Search"
        status="error"
        actionLabel="Retry"
        onAction={onAction}
      />,
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Web Search");

    await user.click(screen.getByRole("button", { name: "Retry" }));

    expect(onAction).toHaveBeenCalledOnce();
  });

  it("does not render a button when no action label is given", () => {
    render(<ToolResult title="Web Search" status="error" />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
