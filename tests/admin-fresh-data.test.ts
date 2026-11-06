import { describe, expect, it } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { contentKey } from "@/lib/content-key";

const ADMIN_DIR = join(import.meta.dir, "..", "src", "components", "admin");

function adminSources(): { file: string; src: string }[] {
  const out: { file: string; src: string }[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".tsx"))
        out.push({ file: full, src: readFileSync(full, "utf8") });
    }
  };
  walk(ADMIN_DIR);
  return out;
}

/**
 * Regression: admin lists showed stale data after a save until a hard reload,
 * because `useState(initialX)` ignores fresh server props and Next 16 Cache
 * Components keep visited pages alive. Server-seeded state must go through
 * `useServerSyncedState`.
 */
describe("Admin pages show fresh data after saving", () => {
  it("no admin component seeds plain useState from server props", () => {
    const offenders = adminSources()
      .filter(({ src }) =>
        /\buseState(<[^>]*>)?\(\s*initial[A-Z]\w*\s*\)/.test(src),
      )
      .map(({ file }) => file);
    expect(offenders).toEqual([]);
  });

  it("content key is stable for equal data and changes when data changes", () => {
    const a = { title: "Service", body: null, sortOrder: 1 };
    expect(contentKey(a)).toBe(contentKey({ ...a }));
    expect(contentKey(a)).not.toBe(contentKey({ ...a, title: "Edited" }));
  });

  it("every admin content save also revalidates the admin routes", () => {
    const src = readFileSync(
      join(import.meta.dir, "..", "src", "server", "actions", "revalidate.ts"),
      "utf8",
    );
    expect(src).toContain('revalidatePath("/admin", "layout")');
  });
});
