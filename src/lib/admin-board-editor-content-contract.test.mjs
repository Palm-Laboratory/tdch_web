import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const helperPath = path.join(here, "admin-board-editor-content.ts");

async function readHelper() {
  return readFile(helperPath, "utf8");
}

function assertExportedFunction(contents, name) {
  assert.match(
    contents,
    new RegExp(`export\\s+(?:async\\s+)?function\\s+${name}\\s*\\(`),
    `Expected admin-board-editor-content.ts to export ${name}().`,
  );
}

function extractFunction(contents, name) {
  const startPattern = new RegExp(`export\\s+(?:async\\s+)?function\\s+${name}\\s*\\(`);
  const startMatch = startPattern.exec(contents);
  assert.ok(startMatch, `Expected to find exported function ${name}().`);

  const start = startMatch.index;
  const nextExport = contents.slice(start + 1).search(/\nexport\s+(?:async\s+)?function\s+/);
  return nextExport === -1 ? contents.slice(start) : contents.slice(start, start + 1 + nextExport);
}

test("admin board editor content helper file exists and exports the expected surface", async () => {
  const contents = await readHelper();

  assertExportedFunction(contents, "createEmptyTiptapDocument");
  assertExportedFunction(contents, "createImageNode");
  assertExportedFunction(contents, "createYoutubeEmbedNode");
  assertExportedFunction(contents, "extractYouTubeVideoId");
  assertExportedFunction(contents, "collectAssetIdsFromTiptapDocument");
});

test("image node creation stores asset identity and stored path without public URLs", async () => {
  const contents = await readHelper();
  const createImageNode = extractFunction(contents, "createImageNode");

  assert.match(createImageNode, /\bstoredPath\b/, "Expected image nodes to persist storedPath.");
  assert.match(createImageNode, /\bassetId\b/, "Expected image nodes to persist assetId.");
  assert.match(createImageNode, /\balt\b/, "Expected image nodes to support alt text.");
  assert.equal(
    /\bpublicUrl\b/.test(createImageNode),
    false,
    "Expected image node persistence to avoid storing publicUrl.",
  );
});

test("youtube embed nodes persist videoId rather than provider URLs", async () => {
  const contents = await readHelper();
  const createYoutubeEmbedNode = extractFunction(contents, "createYoutubeEmbedNode");

  assert.match(createYoutubeEmbedNode, /\bvideoId\b/, "Expected YouTube embed nodes to persist videoId.");
  assert.equal(
    /\bpublicUrl\b/.test(createYoutubeEmbedNode),
    false,
    "Expected YouTube embed nodes to avoid persisting publicUrl.",
  );
});
