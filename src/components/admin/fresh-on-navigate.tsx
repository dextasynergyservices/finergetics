"use client";

import { useRouter } from "next/navigation";
import { Fragment } from "react";

/**
 * Remounts its children on every fresh (push/replace) navigation, while still
 * restoring state on browser back/forward.
 *
 * Used for "Create new …" admin pages: without it, Next.js Cache Components
 * preserve the page and the form reopens pre-filled with the previous entry.
 */
export function FreshOnNavigate({ children }: { children: React.ReactNode }) {
  const { bfcacheId } = useRouter();
  return <Fragment key={bfcacheId}>{children}</Fragment>;
}
