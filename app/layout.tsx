import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Chat Studio — Buttons with a Brain",
  description:
    "FE-AA1 + FE-09: an animated BrainButton, a streaming AI chat interface, and a production testing setup with Vitest, React Testing Library and Playwright.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
