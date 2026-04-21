import { readdir } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..");

async function collectTestFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".next") {
          return [];
        }
        return collectTestFiles(entryPath);
      }
      return entry.isFile() && /\.(?:test|contract\.test)\.mjs$|(?:api-base-url|public-request-cache|server-fetch)\.test\.ts$/.test(entry.name)
        ? [path.relative(repoRoot, entryPath)]
        : [];
    }),
  );

  return nested.flat();
}

const testFiles = (await collectTestFiles(path.join(repoRoot, "src"))).sort();

if (testFiles.length === 0) {
  console.error("No executable contract tests found.");
  process.exit(1);
}

const child = spawn(process.execPath, ["--test", ...testFiles], {
  cwd: repoRoot,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`Contract tests were interrupted by ${signal}.`);
    process.exit(1);
  }
  process.exit(code ?? 1);
});
