"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * Runs `reset` when Next.js hides this page via React <Activity> (Cache
 * Components keeps up to 3 visited routes alive). Use it for transient UI,
 * such as open menus, previews and dialogs, so returning to a page never shows
 * one still open. Layout-effect cleanup runs synchronously before hiding,
 * so there is no flash of stale UI.
 */
export function useResetOnHide(reset: () => void) {
  const resetRef = useRef(reset);
  resetRef.current = reset;

  useLayoutEffect(() => {
    return () => resetRef.current();
  }, []);
}
