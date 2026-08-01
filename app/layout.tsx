import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrainButton — Motion & State Micro-interactions",
  description:
    "FE-AA1: a reusable animated button for AI interfaces with idle, hover, loading, success, error and disabled states.",
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
