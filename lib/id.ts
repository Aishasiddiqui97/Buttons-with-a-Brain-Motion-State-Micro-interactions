let counter = 0;

/**
 * Deterministic, environment-agnostic id generator (works in Node, jsdom and
 * browsers). Prefer over crypto.randomUUID() for testability.
 */
export function createId(prefix = "msg"): string {
  counter += 1;
  return `${prefix}-${counter}`;
}
