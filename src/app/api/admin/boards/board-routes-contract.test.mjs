import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const routes = {
  boards: path.join(here, "route.ts"),
  posts: path.join(here, "[slug]", "posts", "route.ts"),
  postDetail: path.join(here, "[slug]", "posts", "[postId]", "route.ts"),
};

async function readRoute(routePath) {
  return readFile(routePath, "utf8");
}

function assertAdminSessionGate(contents, routeName) {
  assert.match(
    contents,
    /import\s*\{[^}]*getAdminSession[^}]*isAdminSession[^}]*\}\s*from\s*["']@\/auth["']/s,
    `Expected ${routeName} to import getAdminSession and isAdminSession from @/auth.`,
  );
  assert.match(contents, /await\s+getAdminSession\s*\(/, `Expected ${routeName} to read the admin session.`);
  assert.match(
    contents,
    /isAdminSession\s*\(\s*session\s*\)/,
    `Expected ${routeName} to verify the admin session.`,
  );
  assert.match(contents, /status\s*:\s*401/, `Expected ${routeName} to return HTTP 401 when unauthorized.`);
  assert.match(
    contents,
    /로그인|인증|권한|관리자/,
    `Expected ${routeName} unauthorized response to include a Korean login/auth message.`,
  );
}

test("all admin board route handlers use the existing admin session gate", async () => {
  for (const [routeName, routePath] of Object.entries(routes)) {
    const contents = await readRoute(routePath);
    assertAdminSessionGate(contents, routeName);
  }
});

test("admin boards route lists boards for the current admin actor", async () => {
  const contents = await readRoute(routes.boards);

  assert.match(contents, /export\s+async\s+function\s+GET\s*\(/, "Expected boards/route.ts to export GET.");
  assert.match(
    contents,
    /import\s*\{[^}]*getAdminBoards[^}]*\}\s*from\s*["']@\/lib\/admin-board-api["']/s,
    "Expected boards/route.ts to import getAdminBoards from @/lib/admin-board-api.",
  );
  assert.match(
    contents,
    /getAdminBoards\s*\(\s*session\.user\.id\s*\)/s,
    "Expected boards/route.ts to call getAdminBoards(session.user.id).",
  );
});

test("admin board posts route lists and creates posts for a board slug", async () => {
  const contents = await readRoute(routes.posts);

  assert.match(contents, /export\s+async\s+function\s+GET\s*\(/, "Expected [slug]/posts/route.ts to export GET.");
  assert.match(contents, /export\s+async\s+function\s+POST\s*\(/, "Expected [slug]/posts/route.ts to export POST.");
  assert.match(
    contents,
    /from\s*["']@\/lib\/admin-board-api["']/,
    "Expected [slug]/posts/route.ts to import helpers from @/lib/admin-board-api.",
  );
  for (const helperName of ["getAdminBoardPosts", "createAdminBoardPost", "toFriendlyAdminBoardMessage"]) {
    assert.match(contents, new RegExp(`\\b${helperName}\\b`), `Expected [slug]/posts/route.ts to use ${helperName}.`);
  }
  assert.match(
    contents,
    /readMenuId\s*\(\s*request\s*\)/s,
    "Expected [slug]/posts/route.ts to read the selected BOARD menu id from the request.",
  );
  assert.match(
    contents,
    /getAdminBoardPosts\s*\(\s*session\.user\.id\s*,\s*slug\s*,\s*menuId\s*\)/s,
    "Expected [slug]/posts/route.ts to call getAdminBoardPosts(session.user.id, slug, menuId).",
  );
  assert.match(
    contents,
    /createAdminBoardPost\s*\(\s*session\.user\.id\s*,\s*slug\s*,\s*menuId\s*\?\s*\{\s*\.\.\.payload,\s*menuId\s*\}\s*:\s*payload\s*\)/s,
    "Expected [slug]/posts/route.ts to call createAdminBoardPost with the selected menuId when present.",
  );
  assert.match(contents, /request\.json\s*\(/, "Expected POST to parse request.json().");
  assert.match(
    contents,
    /catch\s*\([^)]*\)\s*\{[\s\S]*toFriendlyAdminBoardMessage/s,
    "Expected POST catch paths to use toFriendlyAdminBoardMessage.",
  );
});

test("admin board post detail route reads, updates, and deletes a post by id", async () => {
  const contents = await readRoute(routes.postDetail);

  assert.match(contents, /export\s+async\s+function\s+GET\s*\(/, "Expected [postId]/route.ts to export GET.");
  assert.match(contents, /export\s+async\s+function\s+PUT\s*\(/, "Expected [postId]/route.ts to export PUT.");
  assert.match(contents, /export\s+async\s+function\s+DELETE\s*\(/, "Expected [postId]/route.ts to export DELETE.");
  assert.match(
    contents,
    /from\s*["']@\/lib\/admin-board-api["']/,
    "Expected [postId]/route.ts to import helpers from @/lib/admin-board-api.",
  );
  for (const helperName of [
    "getAdminBoardPost",
    "updateAdminBoardPost",
    "deleteAdminBoardPost",
    "toFriendlyAdminBoardMessage",
  ]) {
    assert.match(contents, new RegExp(`\\b${helperName}\\b`), `Expected [postId]/route.ts to use ${helperName}.`);
  }
  assert.match(
    contents,
    /readMenuId\s*\(\s*request\s*\)/s,
    "Expected [postId]/route.ts to read the selected BOARD menu id from the request.",
  );
  assert.match(
    contents,
    /getAdminBoardPost\s*\(\s*session\.user\.id\s*,\s*slug\s*,\s*postId\s*,\s*menuId\s*\)/s,
    "Expected [postId]/route.ts to call getAdminBoardPost(session.user.id, slug, postId, menuId).",
  );
  assert.match(
    contents,
    /updateAdminBoardPost\s*\(\s*session\.user\.id\s*,\s*slug\s*,\s*postId\s*,\s*menuId\s*\?\s*\{\s*\.\.\.payload,\s*menuId\s*\}\s*:\s*payload\s*\)/s,
    "Expected [postId]/route.ts to call updateAdminBoardPost with the selected menuId when present.",
  );
  assert.match(
    contents,
    /deleteAdminBoardPost\s*\(\s*session\.user\.id\s*,\s*slug\s*,\s*postId\s*,\s*menuId\s*\)/s,
    "Expected [postId]/route.ts to call deleteAdminBoardPost(session.user.id, slug, postId, menuId).",
  );
  assert.match(contents, /request\.json\s*\(/, "Expected PUT to parse request.json().");
  assert.match(
    contents,
    /catch\s*\([^)]*\)\s*\{[\s\S]*toFriendlyAdminBoardMessage/s,
    "Expected PUT catch paths to use toFriendlyAdminBoardMessage.",
  );
});
