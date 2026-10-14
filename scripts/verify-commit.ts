import { readFileSync } from "node:fs";

const commitMsgFile = process.argv[2];
if (!commitMsgFile) {
  process.exit(0);
}

const msg = readFileSync(commitMsgFile, "utf-8").trim();

// Allow merge or revert commits
if (msg.startsWith("Merge ") || msg.startsWith("Revert ")) {
  process.exit(0);
}

const conventionalRegex =
  /^(feat|fix|hotfix|chore|docs|refactor|perf|test|build|ci|style|revert)(\(.+\))?!?: .{3,}/;

if (!conventionalRegex.test(msg)) {
  console.error("\x1b[31m%s\x1b[0m", "\n❌ Invalid commit message format!");
  console.error("Please use Conventional Commits, e.g.:");
  console.error("  feat: project and tooling setup");
  console.error("  fix: resolve navigation bug");
  console.error("  chore: update configuration\n");
  process.exit(1);
}
