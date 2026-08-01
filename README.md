# BrainButton — Buttons with a Brain

**FE-AA1 · Frontend AI Engineering — Motion & State Micro-interactions** + **FE-09 — Testing**

Two assignments in one repo: a production-quality, reusable animated button
for AI interfaces (FE-AA1) and a streaming AI chat app with a professional
testing setup — Vitest, React Testing Library and Playwright (FE-09).

![States](https://img.shields.io/badge/states-6-8b5cf6) ![Stack](https://img.shields.io/badge/Next.js%2015-TypeScript-blue) ![Motion](https://img.shields.io/badge/Framer%20Motion-12-ea580c) ![Tests](https://img.shields.io/badge/tests-38%20unit%20+%201%20e2e-22c55e) ![Coverage](https://img.shields.io/badge/coverage-100%25-16a34a)

- **`/`** — AI Chat Studio (FE-09): streaming assistant replies, validated prompt form, markdown rendering, tool result cards.
- **`/brain-button`** — the BrainButton micro-interactions demo (FE-AA1).

---

## Concept

An **“AI Generate”** button that walks a real async lifecycle:

| State | Visual | Text |
| --- | --- | --- |
| `idle` | Gradient pill, subtle glow | **Generate AI Summary** |
| `hover / focus` | Lift + enhanced shadow | — |
| `loading` | Spinner crossfade | **Generating…** |
| `success` | Spring check-icon pop | **Generated** |
| `error` | Single shake, retry affordance | **Retry** |
| `disabled` | Dimmed, non-interactive (bonus) | — |

**User flow:** click → fake async request (random `900–2400ms`, ~20% failure)
→ `Generating…` → `Generated ✓` (auto-returns to idle after ~1.8s) or
`Retry ↻` (shake once, click again to retry).

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000  (AI Chat Studio)
                 # /brain-button          (motion demo)
```

Other scripts:

```bash
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint       # ESLint (flat config)
```

---

## Usage

```tsx
"use client";

import { useRef } from "react";
import BrainButton, { type BrainButtonHandle } from "@/components/BrainButton";

export default function App() {
  const ref = useRef<BrainButtonHandle>(null);

  return (
    <div>
      {/* Self-managed: handles the whole lifecycle internally */}
      <BrainButton
        ref={ref}
        onStatusChange={(s) => console.log(s)}
        generateDuration={[1200, 3000]}
        failureRate={0.25}
      />

      {/* Drive it imperatively from elsewhere (demo page does this) */}
      <button onClick={() => ref.current?.forceSuccess()}>Force success</button>
      <button onClick={() => ref.current?.forceError()}>Force error</button>
      <button onClick={() => ref.current?.reset()}>Reset</button>
    </div>
  );
}
```

### Custom async work

Replace the fake API with your own promise — the button wires itself up:

```tsx
<BrainButton
  onGenerate={async () => {
    const res = await fetch("/api/summary", { method: "POST" });
    if (!res.ok) throw new Error("Failed");
  }}
/>
```

### Controlled mode

Pass `status` and drive transitions yourself via `onStatusChange`:

```tsx
<BrainButton status={myStatus} onStatusChange={setMyStatus} />
```

---

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | `"Generate AI Summary"` | Idle label |
| `loadingLabel` | `ReactNode` | `"Generating…"` | Loading label |
| `successLabel` | `ReactNode` | `"Generated"` | Success label |
| `errorLabel` | `ReactNode` | `"Retry"` | Error label |
| `status` | `"idle" \| "loading" \| "success" \| "error"` | — | Controlled status (optional) |
| `onStatusChange` | `(s) => void` | — | Fires on every transition |
| `onClick` | `() => void` | — | Extra click handler (runs first) |
| `onGenerate` | `() => Promise<void>` | — | Replace internal fake API |
| `generateDuration` | `[number, number]` | `[900, 2400]` | Fake request delay (ms) |
| `failureRate` | `number` | `0.2` | Probability of error (0–1) |
| `successHoldMs` | `number` | `1800` | Time success is shown before idle |
| `disabled` | `boolean` | `false` | Hard-disable (dimmed) |
| `showIcon` | `boolean` | `true` | Idle sparkles icon |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Visual size |
| `variant` | `"primary" \| "secondary" \| "ghost"` | `"primary"` | Visual style |
| `type` | native button type | `"button"` | Form submission type |

Native button attributes (`aria-label`, `id`, `title`, …) pass straight
through.

### Imperative handle

| Method | Effect |
| --- | --- |
| `generate()` | Runs the full lifecycle |
| `forceSuccess()` | Short run, always succeeds |
| `forceError()` | Short run, always fails |
| `reset()` | Clears timers, back to idle |

---

## Demo page

`app/page.tsx` renders a polished SaaS-style demo:

- The **Generate AI Summary** button (self-managed, live status readout)
- **Force success** / **Force error** / **Reset** controls (drive the button
  via its imperative handle — try force-success while it’s mid-loading)
- Success / error counters
- A state legend for all six states

---

## Motion design

### Durations & easings

| Interaction | Duration | Easing | Element |
| --- | --- | --- | --- |
| Hover lift (`translateY`) | **200ms** | `ease-out` | button |
| Hover glow (shadow layer) | 200ms | `ease-out` | shadow `opacity` |
| Tap press (`scale`) | 120ms | `ease-out` | button |
| State text swap (in) | **300ms** | `ease-in-out` | content |
| State text swap (out) | 200ms | `ease-in-out` | content |
| Success / error pop | **400ms** | spring (`bounce 0.28`) | check icon + content |
| Error shake (single pass) | **400ms** | `ease-in-out` | button `x` |

Easing choices, briefly:

- **`ease-out` for hover** — fast start, gentle settle. Feels “pulled” toward
  the pointer, never overshoots.
- **`ease-in-out` for state swaps** — neutral and readable for a
  text/icon transition; avoids the “crash” of `ease-in` or the sluggish tail of
  a long `ease-out`.
- **Spring for success/error** — the physical overshoot makes the check-icon
  “pop” feel satisfying and organic; a tween would feel flat here. The spring is
  **duration-based** (`duration: 0.4, bounce: 0.28`) so it is explicitly ~400ms
  per the guidelines.

### Why `transform` and `opacity` only

The button animates **exclusively** the compositor-friendly properties —
`translateY`, `scale`, `x`, and `opacity` — and never `width`, `height`,
`box-shadow`, `color`, or `background`.

Why:

1. **GPU-composited, no layout/paint.** Transform & opacity run on the
   compositor thread, so frames are cheap and smooth on 60Hz (and high-refresh)
   displays. Animating layout properties forces synchronous reflows and
   repaints every frame — the classic “layout thrashing” jank.
2. **The “enhanced shadow” is a blurred gradient layer** whose `opacity` fades
   in on hover/focus. We never animate `box-shadow` (a paint-heavy property);
   the halo simply appears via opacity while the button lifts via
   `translateY`.
3. **`AnimatePresence mode="popLayout"`** removes exiting content from flow, so
   the text↔spinner swap never resizes/relayouts the button mid-animation.
   A `min-width` keeps the button stable across label length changes.
4. Only the **appearance** of the focus ring uses `box-shadow` — it is a static
   style, not an animation.

### Interruptibility & async correctness

- **Generation ids.** Each run bumps a counter; stale async completions check
  the id and bail. A `forceSuccess()` called mid-load *interrupts* cleanly
  instead of corrupting state.
- **`busyRef` re-entry guard.** Rapid clicking while loading is ignored — no
  double-starts, no torn transitions.
- **All timers are tracked and cleared** on `reset()` and on unmount (no
  leaks, no state-updates-after-unmount).
- Framer Motion’s animations are themselves interruptible — hovering away from
  the button mid-lift snaps back instantly without glitches.

---

## Accessibility decisions

- **Keyboard first.** A native `<button>` with visible focus state
  (`focus-visible` ring) — the lift, glow, and ring all trigger on focus too.
- **`aria-busy="true"`** during loading so assistive tech announces the busy
  state.
- **`aria-live="polite"` + `aria-atomic="true"`** on the button announce the
  label change (`Generating…` → `Generated` → `Retry` → back to idle) without
  interrupting the user.
- **Disabled is real.** Native `disabled` during loading/success/hard-disable
  blocks pointer events and removes the control from tab order; `aria-busy`
  conveys *why* it is momentarily non-interactive.
- **Decorative icons are `aria-hidden`**; the text labels carry all meaning.
  The spinner is kept (slowed) so reduced-motion users still get loading
  feedback.
- **`prefers-reduced-motion`** (via `useReducedMotion`): all springs, lifts,
  shakes, and text-slides collapse to `duration: 0`; the opacity-based glow and
  a slower spinner remain as non-motion visual feedback.
- **Feedback isn’t color-only.** States are differentiated by icon + text +
  shape, not just hue.

---

## Project structure

```
├── app/
│   ├── api/chat/route.ts    # Streaming AI endpoint (mocked in tests)
│   ├── brain-button/        # FE-AA1 motion demo
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx             # AI Chat Studio (FE-09)
├── components/
│   ├── chat/
│   │   ├── ChatApp.tsx              # Chat shell + streaming lifecycle
│   │   ├── ChatInput.tsx            # Validated prompt form
│   │   ├── ChatMessageRenderer.tsx  # Message states + markdown
│   │   └── ToolResult.tsx           # Tool result card (4 states)
│   └── BrainButton.tsx     # FE-AA1 reusable button
├── lib/
│   ├── chat.ts    # streamChat() — streaming fetch wrapper
│   ├── cn.ts
│   ├── id.ts
│   └── types.ts
├── tests/
│   ├── components/__tests__/   # RTL component tests
│   ├── e2e/                    # Playwright tests
│   └── lib/                    # streamChat unit tests
├── test/setup.ts               # Vitest setup (jest-dom, polyfills)
├── .github/workflows/test.yml  # CI pipeline
├── vitest.config.ts
├── playwright.config.ts
└── eslint.config.mjs
```

---

## Testing (FE-09)

A production testing setup: **Vitest + React Testing Library** for unit/component
tests and **Playwright** for browser-level E2E. Coverage is **100%** on the FE-09
app code (`components/chat/**`, `lib/**`) and enforced at **≥ 80%**.

### Scripts

```bash
npm run test           # run unit + component tests once
npm run test:watch     # watch mode
npm run test:coverage  # run with coverage report (html in ./coverage)
npm run test:e2e       # run Playwright tests (starts the app automatically)
npm run test:e2e:ui    # interactive Playwright UI
npm run lint           # ESLint
npm run typecheck      # tsc --noEmit
```

### Install (one time)

```bash
npm install
npx playwright install chromium   # downloads the browser used by E2E
```

> If the Playwright browser download fails because the default location has no
> space, point it elsewhere: `PLAYWRIGHT_BROWSERS_PATH=/your/disk/folder npx playwright install chromium`.

### How to run tests

```bash
npm run test            # ~38 unit/component tests
npm run test:coverage   # 100% statement/branch/function/line coverage
npm run test:e2e        # 1 browser test: type → Generate → reply → loading gone
```

### How to view coverage

```bash
npm run test:coverage
# console table + ./coverage/index.html (open in a browser for the full report)
```

### What is covered

| Area | Tests |
| --- | --- |
| `lib/chat.ts` (streamChat) | success, per-chunk streaming, `onComplete`, HTTP errors, missing body |
| `ChatMessageRenderer` | user, assistant (pending / streaming / completed / error), tool, markdown, loading indicator, empty reply |
| `ChatInput` (form) | validation errors, required + min length, successful submit + clear, disabled + `aria-busy` loading |
| `ToolResult` | loading, success, empty, error + retry action, accessibility roles |
| `ChatApp` | empty state, pending indicator, token streaming, completion, error alert, form disabled in flight |
| `BrainButton` | idle, loading + `aria-busy`, error + retry, success → auto-idle, disabled |
| E2E (`chat.spec.ts`) | full user flow with the `/api/chat` route mocked |

### Mocking the AI API

The real endpoint is **never called in tests**.

- **Unit tests** mock `fetch()` (`vi.stubGlobal`) with a fake streaming
  `Response`, or mock the `@/lib/chat` module with `vi.mock()`.
- **E2E** intercepts the request with `page.route('**/api/chat', …)` and
  `route.fulfill(...)` — including an artificial delay so the loading state is
  observable.

### Best practices applied

- Query by role/name/label (`getByRole`, `getByLabelText`, `findByRole`) — no
  `data-testid`, no CSS-class queries; tests survive UI refactoring.
- Behavioral assertions via `userEvent` (real keyboard/mouse semantics) and
  `waitFor` for async transitions.
- `describe`/`test`/`beforeEach`/`afterEach`, `vi.fn()`, `vi.spyOn()` —
  mocks are reset between tests.
- Accessibility is asserted directly: buttons, textboxes, alerts, live regions
  (`role="status"`), forms (`aria-busy`), labels and ARIA wiring.

### CI (GitHub Actions)

`.github/workflows/test.yml` runs on every push/PR to `main`:

1. `npm ci`
2. `npm run lint`
3. `npm run test`
4. `npx playwright install --with-deps chromium`
5. `npm run test:e2e`
6. `npm run build`

The workflow fails if any step fails.

---

## Stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript** (strict)
- **Tailwind CSS 3**
- **Framer Motion 12**
- **lucide-react** icons
- **react-markdown** for assistant replies
- **Vitest 3 + React Testing Library + jsdom** (unit/component tests)
- **Playwright** (E2E)
- **ESLint 9** (flat config) · **GitHub Actions** (CI)

## License

MIT — build something delightful.
