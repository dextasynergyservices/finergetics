/**
 * Short, stable hash of a value's JSON content (FNV-1a, 32-bit).
 * Used as a React `key` so admin forms remount, and reset all their local
 * state, whenever the saved record they were seeded from changes.
 * Safe on both server and client. Not for security purposes.
 */
export function contentKey(value: unknown): string {
  let json: string;
  try {
    json = JSON.stringify(value) ?? "undefined";
  } catch {
    json = String(value);
  }
  let hash = 0x811c9dc5;
  for (let i = 0; i < json.length; i++) {
    hash ^= json.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}
