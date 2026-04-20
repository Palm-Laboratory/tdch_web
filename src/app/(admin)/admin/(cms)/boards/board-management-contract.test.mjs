import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const pagePath = path.join(here, "page.tsx");
const clientPath = path.join(here, "_components", "board-management-client.tsx");
const editorPath = path.join(here, "_components", "board-post-editor.tsx");

async function readSource(sourcePath) {
  return readFile(sourcePath, "utf8");
}

test("board management page exists and uses the admin session gate", async () => {
  const contents = await readSource(pagePath);

  assert.match(
    contents,
    /import\s*\{[^}]*getAdminSession[^}]*isAdminSession[^}]*\}\s*from\s*["']@\/auth["']/s,
    "Expected the board management page to import getAdminSession and isAdminSession from @/auth.",
  );
  assert.match(contents, /await\s+getAdminSession\s*\(/, "Expected the page to read the admin session.");
  assert.match(contents, /isAdminSession\s*\(\s*session\s*\)/, "Expected the page to verify the admin session.");
  assert.match(
    contents,
    /redirect\s*\(\s*["']\/admin\/login["']\s*\)/,
    "Expected unauthorized admins to be redirected to /admin/login.",
  );
});

test("board management page fetches boards and renders the client entry screen", async () => {
  const contents = await readSource(pagePath);

  assert.match(
    contents,
    /import\s*\{[^}]*getAdminBoards[^}]*\}\s*from\s*["']@\/lib\/admin-board-api["']/s,
    "Expected the page to import getAdminBoards from @/lib/admin-board-api.",
  );
  assert.match(
    contents,
    /getAdminBoards\s*\(\s*session\.user\.id\s*\)/s,
    "Expected the page to fetch admin boards with session.user.id.",
  );
  assert.match(
    contents,
    /<BoardManagementClient\b/s,
    "Expected the page to render BoardManagementClient.",
  );
});

test("board management client is a client component with list, save, loading, and error states", async () => {
  const contents = await readSource(clientPath);

  assert.match(contents, /^["']use client["'];?/m, "Expected board-management-client.tsx to be a client component.");
  assert.match(contents, /BoardManagementClient/, "Expected the component to expose BoardManagementClient.");
  assert.match(contents, /post|posts|게시글|목록/i, "Expected the client to show a board post list.");
  assert.match(contents, /save|saving|저장/i, "Expected the client to expose save state markers.");
  assert.match(contents, /loading|로딩|불러오/i, "Expected the client to expose loading state markers.");
  assert.match(contents, /error|오류|실패/i, "Expected the client to expose error state markers.");
});

test("board management client requests upload tokens and uploads assets directly", async () => {
  const contents = await readSource(clientPath);

  assert.match(
    contents,
    /\/api\/admin\/uploads\/token|issueAdminUploadToken|upload token/i,
    "Expected the client to request admin upload tokens or use an upload token helper.",
  );
  assert.match(
    contents,
    /uploadAdminAssetDirect/,
    "Expected the client to use uploadAdminAssetDirect for direct admin asset uploads.",
  );
});

test("board post editor uses Tiptap and exposes image plus YouTube insertion controls", async () => {
  const contents = await readSource(editorPath);

  assert.match(contents, /^["']use client["'];?/m, "Expected board-post-editor.tsx to be a client component.");
  assert.match(
    contents,
    /@tiptap\/react/,
    "Expected the board post editor to import @tiptap/react.",
  );
  assert.match(
    contents,
    /useEditor|EditorContent/,
    "Expected the board post editor to use Tiptap's editor surface.",
  );
  assert.match(
    contents,
    /@tiptap\/extension-|StarterKit|Image|Youtube|YouTube/i,
    "Expected the editor to use Tiptap extensions.",
  );
  assert.match(contents, /image|이미지/i, "Expected the editor to expose image insertion text markers.");
  assert.match(contents, /youtube|youTube|video|동영상|유튜브/i, "Expected the editor to expose YouTube insertion text markers.");
  assert.equal(
    /\bpublicUrl\b/.test(contents),
    false,
    "Expected the editor to avoid persisting publicUrl in editor content.",
  );
});
