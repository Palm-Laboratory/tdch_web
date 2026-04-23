import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const pagePath = path.join(here, "page.tsx");
const clientPath = path.join(here, "_components", "menu-management-client.tsx");

async function readPage() {
  return readFile(pagePath, "utf8");
}

async function readClient() {
  return readFile(clientPath, "utf8");
}

function extractBoardCase(contents) {
  const match = contents.match(/case\s+["']BOARD["']\s*:\s*(?<body>[\s\S]*?)(?=\n\s*case\s+["'][A-Z_]+["']\s*:)/);
  assert.ok(match?.groups?.body, "Expected getPublicRouteSummary to handle BOARD menu nodes.");
  return match.groups.body;
}

test("admin menu page does not fetch global boards for BOARD menu editing", async () => {
  const contents = await readPage();

  assert.doesNotMatch(
    contents,
    /getAdminBoards|availableBoards|getAdminBoardTypes|boardTypes/s,
    "Expected menu/page.tsx to avoid fetching or passing global boards or board types.",
  );
  assert.match(
    contents,
    /<MenuManagementClient\b[\s\S]*initialItems\s*=\s*\{\s*menuTree\.items\s*\}/s,
    "Expected menu/page.tsx to pass only the menu tree into MenuManagementClient.",
  );
});

test("admin menu public address preview builds BOARD URLs from parent and child slugs", async () => {
  const contents = await readClient();
  const boardCase = extractBoardCase(contents);

  assert.match(
    boardCase,
    /node\.parentId/,
    "Expected BOARD preview to require or use its parent menu when building the public route.",
  );
  assert.match(
    boardCase,
    /menuById\.get\s*\(\s*node\.parentId\s*\)/,
    "Expected BOARD preview to read the parent slug from menuById.",
  );
  assert.match(
    boardCase,
    /node\.slug/,
    "Expected BOARD preview to use the BOARD menu slug as the child path segment.",
  );
  assert.doesNotMatch(
    boardCase,
    /\/news\s*#|\$\{\s*node\.boardKey\s*\}/,
    "Expected BOARD preview to avoid legacy /news#boardKey URLs.",
  );
});

test("menu management client hides BOARD type editing from admins", async () => {
  const contents = await readClient();

  assert.doesNotMatch(
    contents,
    /availableBoards|AdminBoardSummary|getAdminBoards|AdminBoardTypeSummary|getAdminBoardTypes/s,
    "Expected MenuManagementClient to avoid global board and board type props.",
  );
  assert.doesNotMatch(
    contents,
    /게시판 타입|게시판 키|연결 게시판/,
    "Expected BOARD editor to hide board type and raw board key controls.",
  );
  assert.match(
    contents,
    /boardTypeId:\s*null/,
    "Expected new BOARD menu nodes to let the backend assign the default board type.",
  );
});

test("menu management client labels slug as a URL path field", async () => {
  const contents = await readClient();

  assert.match(
    contents,
    /<span[^>]*>\s*URL\s*경로\s*<\/span>|<span[^>]*>\s*공개\s*URL\s*경로\s*<\/span>/,
    "Expected the slug input label to communicate that it controls the URL path.",
  );
  assert.match(
    contents,
    /URL\s*경로|공개\s*URL에\s*들어가는\s*주소\s*조각/,
    "Expected the slug help text to explain the URL path behavior.",
  );
});

test("menu management client keeps DRAFT as a server-created playlist state only", async () => {
  const contents = await readClient();
  const buildNewNodeMatch = contents.match(/function\s+buildNewNode[\s\S]*?\n}\n/);

  assert.ok(buildNewNodeMatch?.[0], "Expected MenuManagementClient to define buildNewNode.");
  assert.match(
    buildNewNodeMatch[0],
    /status:\s*"HIDDEN"/,
    "Expected new manual menus to start hidden instead of draft.",
  );
  assert.doesNotMatch(
    buildNewNodeMatch[0],
    /status:\s*"DRAFT"/,
    "Expected manual menu creation to avoid client-created DRAFT status.",
  );
  assert.doesNotMatch(
    contents,
    /\[\s*"DRAFT"\s*,\s*"PUBLISHED"\s*,\s*"HIDDEN"\s*\]/,
    "Expected manual menu status options to exclude DRAFT.",
  );
  assert.match(
    contents,
    /MANAGED_STATUS_OPTIONS[\s\S]*PUBLISHED[\s\S]*HIDDEN/,
    "Expected menu status editing to expose published and hidden as the managed choices.",
  );
});

test("menu management client hides all children when a root menu is hidden", async () => {
  const contents = await readClient();

  assert.match(
    contents,
    /function\s+hideNodeTree[\s\S]*children:\s*node\.children\.map\s*\(\s*hideNodeTree\s*\)/,
    "Expected a recursive helper that hides the selected menu subtree.",
  );
  assert.match(
    contents,
    /node\.parentId\s*===\s*null\s*&&\s*nextStatus\s*===\s*["']HIDDEN["'][\s\S]*hideNodeTree\s*\(\s*node\s*\)/,
    "Expected root menu status changes to HIDDEN to cascade to descendants.",
  );
  assert.match(
    contents,
    /node\.status\s*===\s*["']ARCHIVED["']\s*\?\s*node\.status\s*:\s*["']HIDDEN["']/,
    "Expected archived children to keep their archived state while published or hidden children become hidden.",
  );
});
