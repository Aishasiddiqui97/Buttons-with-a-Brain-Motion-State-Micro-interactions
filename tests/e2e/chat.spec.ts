import { expect, test } from "@playwright/test";

test("user can generate an AI reply end to end", async ({ page }) => {
  // Mock the AI API: never hit the real endpoint.
  await page.route("**/api/chat", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    await route.fulfill({
      status: 200,
      headers: { "content-type": "text/plain; charset=utf-8" },
      body: "The mock assistant summary for the prompt.",
    });
  });

  await page.goto("/ai-chat-studio");

  // 1. Type a prompt.
  const input = page.getByRole("textbox", { name: "Prompt" });
  await input.fill("Summarize the latest AI trends");

  // 2. Click Generate.
  await page.getByRole("button", { name: "Generate" }).click();

  // 3. Loading indicator appears while the mock response is pending.
  const thinking = page.getByRole("status", { name: "AI is thinking" });
  await expect(thinking).toBeVisible();

  // 4. Assistant reply is streamed in.
  await expect(page.getByText("The mock assistant summary")).toBeVisible();

  // 5. Loading indicator disappears.
  await expect(thinking).toHaveCount(0);
});
