import { fileURLToPath } from "node:url";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    include: [
      "tests/**/*.test.{ts,tsx}",
      "components/**/__tests__/**/*.test.{ts,tsx}",
    ],
    css: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["components/chat/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}"],
      exclude: ["lib/types.ts"],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": rootDir,
    },
  },
});
