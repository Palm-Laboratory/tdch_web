import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const routePath = path.join(here, "page.tsx");

async function readRoute() {
  return readFile(routePath, "utf8");
}

test("public site catch-all route keeps static behavior and adds board rendering branches", async () => {
  const contents = await readRoute();

  assert.match(
    contents,
    /from\s*["']@\/components\/public-board\/public-board-renderer["']/,
    "Expected the catch-all route to import the public board renderer.",
  );
  assert.match(
    contents,
    /from\s*["']@\/lib\/public-board-api["']/,
    "Expected the catch-all route to import public board API helpers.",
  );
  assert.match(contents, /resolved\.type\s*===\s*["']BOARD["']/, "Expected a BOARD branch in the catch-all route.");
  assert.match(
    contents,
    /resolved\.boardKey/,
    "Expected the BOARD branch to require resolved.boardKey.",
  );
  assert.match(
    contents,
    /listPublicBoardPosts\s*\(/,
    "Expected the board menu path to load a public board post list.",
  );
  assert.match(
    contents,
    /getPublicBoardPost\s*\(/,
    "Expected the board detail path to load a public board post detail.",
  );
  assert.match(contents, /notFound\s*\(\s*\)/, "Expected the route to call notFound() for missing/private board details.");
  assert.match(
    contents,
    /PUBLIC_BOARD|board/i,
    "Expected the route to keep the existing public-site menu resolution logic and add board-specific handling.",
  );
});

test("public site catch-all route does not pass raw user URLs to iframe src", async () => {
  const contents = await readRoute();

  assert.doesNotMatch(
    contents,
    /iframe[^]*src[^]*resolved\.redirectTo|iframe[^]*src[^]*searchParams|iframe[^]*src[^]*url/i,
    "Expected raw user-provided URLs not to be used directly as iframe src in the route layer.",
  );
});
