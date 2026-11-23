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
    /from\s*["']@\/components\/site-page-shell["']/,
    "Expected the catch-all route to use the shared site page shell for public board pages.",
  );
  assert.match(
    contents,
    /from\s*["']@\/lib\/public-board-api["']/,
    "Expected the catch-all route to import public board API helpers.",
  );
  assert.match(contents, /resolved\?*\.type\s*===\s*["']BOARD["']/, "Expected a BOARD branch in the catch-all route.");
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

test("public board list and detail pages render the shared page header and breadcrumb shell", async () => {
  const contents = await readRoute();

  assert.match(
    contents,
    /function\s+PublicBoardPageShell/,
    "Expected public board pages to use a shared page shell.",
  );
  assert.match(
    contents,
    /<SitePageShell\b[\s\S]*subtitle\s*=\s*["']BOARD["'][\s\S]*>/,
    "Expected public board pages to render through the shared visual page shell.",
  );
  assert.doesNotMatch(
    contents,
    /from\s*["']@\/components\/(?:page-header|breadcrumb)["']/,
    "Expected public board route code not to compose PageHeader or Breadcrumb directly.",
  );
  assert.match(
    contents,
    /renderPublicBoardList[\s\S]*<PublicBoardPageShell\b[\s\S]*<PublicBoardRenderer\s+mode\s*=\s*["']list["']/,
    "Expected public board list pages to be wrapped in the page shell.",
  );
  assert.match(
    contents,
    /renderPublicBoardDetail[\s\S]*<PublicBoardPageShell\b[\s\S]*<PublicBoardRenderer\s+mode\s*=\s*["']detail["']/,
    "Expected public board detail pages to be wrapped in the page shell.",
  );
});

test("public site catch-all route passes resolved menu id to board list and detail APIs", async () => {
  const contents = await readRoute();

  assert.match(
    contents,
    /listPublicBoardPosts\s*\(\s*(?:resolved|boardState\.resolved)\.boardKey\s*,\s*(?:resolved|boardState\.resolved)\.(?:id|menuId)\s*,/s,
    "Expected public board list loading to pass the resolved BOARD menu id.",
  );
  assert.match(
    contents,
    /getPublicBoardPost\s*\(\s*parentResolved\.boardKey\s*,\s*parentResolved\.(?:id|menuId)\s*,\s*postId\s*\)/s,
    "Expected public board detail loading to pass the resolved BOARD menu id.",
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
