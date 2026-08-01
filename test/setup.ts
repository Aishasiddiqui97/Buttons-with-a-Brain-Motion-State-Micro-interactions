import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

/* --- jsdom polyfills required by libraries used in tests ----------------- */

const g = globalThis as unknown as {
  matchMedia?: typeof window.matchMedia;
  requestAnimationFrame?: typeof window.requestAnimationFrame;
  cancelAnimationFrame?: typeof window.cancelAnimationFrame;
  IS_REACT_ACT_ENVIRONMENT?: boolean;
};

/* Framer Motion's useReducedMotion() calls window.matchMedia(). */
if (!g.matchMedia) {
  g.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}

/* Framer Motion relies on requestAnimationFrame. */
if (!g.requestAnimationFrame) {
  g.requestAnimationFrame = ((cb: FrameRequestCallback) =>
    setTimeout(cb, 0)) as typeof window.requestAnimationFrame;
}
if (!g.cancelAnimationFrame) {
  g.cancelAnimationFrame = ((id: number) =>
    clearTimeout(id)) as typeof window.cancelAnimationFrame;
}

/* Suppress React act() warnings under React 18/19 + Testing Library. */
g.IS_REACT_ACT_ENVIRONMENT = true;
