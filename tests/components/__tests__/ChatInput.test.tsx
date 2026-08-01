import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatInput } from "@/components/chat/ChatInput";

describe("ChatInput", () => {
  it("renders a labelled textbox", () => {
    render(<ChatInput onSubmit={vi.fn()} />);

    expect(screen.getByLabelText("Prompt")).toBeInTheDocument();
  });

  it("exposes the form with an accessible name", () => {
    render(<ChatInput onSubmit={vi.fn()} />);

    expect(
      screen.getByRole("form", { name: "Chat prompt form" }),
    ).toBeInTheDocument();
  });

  it("shows a validation error when submitted empty", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ChatInput onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Generate" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please enter a prompt.",
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("enforces a minimum length", async () => {
    const user = userEvent.setup();
    render(<ChatInput onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText("Prompt"), "a");
    await user.click(screen.getByRole("button", { name: "Generate" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "at least 2 characters",
    );
  });

  it("submits the trimmed prompt and clears the field", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ChatInput onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Prompt"), "  Summarize this  ");
    await user.click(screen.getByRole("button", { name: "Generate" }));

    expect(onSubmit).toHaveBeenCalledWith("Summarize this");
    expect(screen.getByLabelText("Prompt")).toHaveValue("");
  });

  it("clears the validation error as the user types", async () => {
    const user = userEvent.setup();
    render(<ChatInput onSubmit={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Generate" }));
    expect(screen.getByRole("alert")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Prompt"), "hello");

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("disables the textbox and submit button while loading", () => {
    render(<ChatInput onSubmit={vi.fn()} isLoading />);

    expect(screen.getByRole("button", { name: "Generating…" })).toBeDisabled();
    expect(screen.getByLabelText("Prompt")).toBeDisabled();
  });

  it("marks the form as busy while loading", () => {
    render(<ChatInput onSubmit={vi.fn()} isLoading />);

    expect(screen.getByRole("form", { name: "Chat prompt form" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });
});
