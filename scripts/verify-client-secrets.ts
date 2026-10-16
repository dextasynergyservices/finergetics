import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Script to verify that no server-side secrets, database connection strings,
 * or secret key names/values leak into client-side build bundles or client components.
 */

const FORBIDDEN_SECRET_NAMES = [
  "BETTER_AUTH_SECRET",
  "CLOUDINARY_API_SECRET",
  "BREVO_API_KEY",
  "DATABASE_URL",
  "DIRECT_URL",
  "RECAPTCHA_SECRET_KEY",
  "SEED_ADMIN_PASSWORD",
  "RATE_LIMIT_SALT",
  "REVALIDATE_SECRET",
];

const FORBIDDEN_SECRET_PATTERNS = [
  /CLOUDINARY_API_SECRET\s*[:=]\s*["'`][^"'`]+["'`]/i,
  /BREVO_API_KEY\s*[:=]\s*["'`][^"'`]+["'`]/i,
  /RECAPTCHA_SECRET_KEY\s*[:=]\s*["'`][^"'`]+["'`]/i,
  /RATE_LIMIT_SALT\s*[:=]\s*["'`][^"'`]+["'`]/i,
  /SEED_ADMIN_PASSWORD\s*[:=]\s*["'`][^"'`]+["'`]/i,
  /postgres:\/\/[^:]+:[^@]+@/i,
  /postgresql:\/\/[^:]+:[^@]+@/i,
];

function getFilesRecursively(dir: string, extension: string): string[] {
  let results: string[] = [];
  if (!existsSync(dir)) return results;

  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath, extension));
    } else if (fullPath.endsWith(extension)) {
      results.push(fullPath);
    }
  }
  return results;
}

export function auditClientBundles(): {
  clean: boolean;
  violations: Array<{ file: string; match: string }>;
} {
  const violations: Array<{ file: string; match: string }> = [];

  // 1. Audit .next/static build output (if Next.js has built)
  const staticDir = join(process.cwd(), ".next", "static");
  if (existsSync(staticDir)) {
    const jsFiles = getFilesRecursively(staticDir, ".js");

    for (const file of jsFiles) {
      const content = readFileSync(file, "utf-8");

      // Check regex patterns (database connection URLs, secret assignments)
      for (const pattern of FORBIDDEN_SECRET_PATTERNS) {
        if (pattern.test(content)) {
          violations.push({
            file,
            match: `Forbidden secret pattern match: ${pattern}`,
          });
        }
      }

      // Check for actual live environment variable secret values
      for (const secretName of FORBIDDEN_SECRET_NAMES) {
        const envVal = process.env[secretName];
        if (
          envVal &&
          envVal.length > 6 &&
          !["development", "production", "test", "http://localhost:3000"].some(
            (ign) => envVal.includes(ign),
          )
        ) {
          if (content.includes(envVal)) {
            violations.push({
              file,
              match: `Server secret value leaked for ${secretName}`,
            });
          }
        }
      }
    }
  }

  // 2. Audit client components in src/ ("use client" files)
  const srcDir = join(process.cwd(), "src");
  if (existsSync(srcDir)) {
    const clientCodeFiles = [
      ...getFilesRecursively(srcDir, ".tsx"),
      ...getFilesRecursively(srcDir, ".ts"),
    ];

    for (const file of clientCodeFiles) {
      const content = readFileSync(file, "utf-8");
      // Check if file is a client component
      if (
        content.includes('"use client"') ||
        content.includes("'use client'")
      ) {
        // Client components must never import server env schema
        if (
          content.includes('from "@/env"') ||
          content.includes("from '@/env'")
        ) {
          violations.push({
            file,
            match: "Client component imports server env schema from '@/env'",
          });
        }

        for (const secretName of FORBIDDEN_SECRET_NAMES) {
          // Check for direct references like env.CLOUDINARY_API_SECRET
          if (
            content.includes(`env.${secretName}`) ||
            content.includes(`process.env.${secretName}`)
          ) {
            violations.push({
              file,
              match: `Client component directly references server secret: ${secretName}`,
            });
          }
        }
      }
    }
  }

  return {
    clean: violations.length === 0,
    violations,
  };
}

if (process.argv[1]?.endsWith("verify-client-secrets.ts")) {
  console.log(
    "🔍 Scanning client bundles and components for secret leakage...",
  );
  const result = auditClientBundles();

  if (!result.clean) {
    console.error(
      "❌ CRITICAL SECURITY ERROR: Secret leakage detected in client bundle!",
    );
    for (const v of result.violations) {
      console.error(` - ${v.file}: ${v.match}`);
    }
    process.exit(1);
  }

  console.log(
    "✅ Zero secret leakage verified across client bundles and components.",
  );
  process.exit(0);
}
