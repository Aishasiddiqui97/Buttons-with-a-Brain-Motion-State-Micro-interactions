import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aisha A. Siddiqui — Frontend & Full-Stack Developer (AI-powered)",
  description:
    "Portfolio of Aisha A. Siddiqui: Frontend & Full-Stack Developer building AI-powered web apps with React, Next.js, TypeScript and AI/LLM integration. Streaming chat UIs, AI automation, 3D product experiences, and production testing.",
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
