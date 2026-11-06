"use client";

import { type Dispatch, type SetStateAction, useState } from "react";

function contentKey(value: unknown): string {
  try {
    return JSON.stringify(value) ?? "undefined";
  } catch {
    // Non-serializable value: fall back to "always treat as changed".
    return String(Math.random());
  }
}

/**
 * `useState` seeded from server-provided props that stays in sync with them.
 *
 * Plain `useState(initialProp)` only reads the prop on first mount. With Next
 * 16 Cache Components, admin pages are kept alive (React <Activity>) between
 * navigations, so after a save the server sends fresh props but the component
 * keeps showing stale state until a hard reload.
 *
 * This hook resets local state whenever the server value's *content* changes.
 * Comparing by content (not reference) means unrelated re-renders, e.g. a
 * background refresh while an editor is typing, never wipe unsaved input.
 */
export function useServerSyncedState<T>(
  serverValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const serverKey = contentKey(serverValue);
  const [state, setState] = useState<T>(serverValue);
  const [syncedKey, setSyncedKey] = useState(serverKey);

  // Adjust state during render when props change (React-recommended pattern;
  // avoids the extra stale paint a useEffect would cause).
  if (serverKey !== syncedKey) {
    setSyncedKey(serverKey);
    setState(serverValue);
  }

  return [state, setState];
}
