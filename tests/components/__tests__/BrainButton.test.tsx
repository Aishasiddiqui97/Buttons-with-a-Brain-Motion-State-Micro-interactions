import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BrainButton from "@/components/BrainButton";

describe("BrainButton", () => {
  it("renders the idle label and is enabled", () => {
    render(<BrainButton />);

    const button = screen.getByRole("button", { name: /Generate AI Summary/ });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  it("transitions to loading and sets aria-busy", async () => {
    const user = userEvent.setup();
    render(<BrainButton generateDuration={[600, 600]} failureRate={1} />);

    await user.click(screen.getByRole("button", { name: /Generate AI Summary/ }));

    const loading = screen.getByRole("button", { name: /Generating/i });
    expect(loading).toHaveAttribute("aria-busy", "true");
  });

  it("shows the error state and supports retry", async () => {
    const user = userEvent.setup();
    render(<BrainButton generateDuration={[20, 20]} failureRate={1} />);

    await user.click(screen.getByRole("button", { name: /Generate AI Summary/ }));

    const retry = await screen.findByRole("button", { name: /Retry/i });
    expect(retry).toBeInTheDocument();

    await user.click(retry);
    expect(
      screen.getByRole("button", { name: /Generating/i }),
    ).toBeInTheDocument();
  });

  it("shows success then auto-returns to idle", async () => {
    const user = userEvent.setup();
    render(
      <BrainButton
        generateDuration={[20, 20]}
        failureRate={0}
        successHoldMs={300}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Generate AI Summary/ }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Generated/i }),
      ).toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(
          screen.getByRole("button", { name: /Generate AI Summary/ }),
        ).toBeInTheDocument();
      },
      { timeout: 2000 },
    );
  });

  it("honours the disabled prop", () => {
    render(<BrainButton disabled />);

    expect(
      screen.getByRole("button", { name: /Generate AI Summary/ }),
    ).toBeDisabled();
  });
});
