import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const clientPath = path.join(here, "_components", "board-management-client.tsx");
const editorPath = path.join(here, "_components", "board-post-editor.tsx");

async function readSource(sourcePath) {
  return readFile(sourcePath, "utf8");
}

test("board management client fetches internal board post routes for list and detail", async () => {
  const contents = await readSource(clientPath);

  assert.match(
    contents,
    /fetch\s*\(\s*`\/api\/admin\/boards\/\$\{[^}]*\}\/posts`/s,
    "Expected board-management-client to fetch /api/admin/boards/${slug}/posts for the selected board list.",
  );
  assert.match(
    contents,
    /fetch\s*\(\s*`\/api\/admin\/boards\/\$\{[^}]*\}\/posts\/\$\{[^}]*\}`/s,
    "Expected board-management-client to fetch /api/admin/boards/${slug}/posts/${postId} for post detail.",
  );
});

test("board management client creates and updates posts through internal route handlers", async () => {
  const contents = await readSource(clientPath);

  assert.match(
    contents,
    /method\s*:\s*["']POST["'][\s\S]*`\/api\/admin\/boards\/\$\{[^}]*\}\/posts`|`\/api\/admin\/boards\/\$\{[^}]*\}\/posts`[\s\S]*method\s*:\s*["']POST["']/s,
    "Expected create saves to POST /api/admin/boards/${slug}/posts.",
  );
  assert.match(
    contents,
    /method\s*:\s*["']PUT["'][\s\S]*`\/api\/admin\/boards\/\$\{[^}]*\}\/posts\/\$\{[^}]*\}`|`\/api\/admin\/boards\/\$\{[^}]*\}\/posts\/\$\{[^}]*\}`[\s\S]*method\s*:\s*["']PUT["']/s,
    "Expected update saves to PUT /api/admin/boards/${slug}/posts/${postId}.",
  );
  assert.match(
    contents,
    /headers\s*:\s*\{[\s\S]*["']Content-Type["']\s*:\s*["']application\/json["'][\s\S]*\}/s,
    "Expected save requests to send JSON content headers.",
  );
});

test("board management client sends the complete board post save payload", async () => {
  const contents = await readSource(clientPath);

  assert.match(
    contents,
    /body\s*:\s*JSON\.stringify\s*\(\s*savePayload\s*\)/s,
    "Expected save requests to JSON.stringify savePayload, which contains title, contentJson, contentHtml, isPublic, and assetIds.",
  );
});

test("board management client uploads FILE_ATTACHMENT assets and includes them in save payload", async () => {
  const contents = await readSource(clientPath);

  assert.match(contents, /FILE_ATTACHMENT/, "Expected the client to include a FILE_ATTACHMENT marker.");
  assert.match(
    contents,
    /kind\s*:\s*["']FILE_ATTACHMENT["']/,
    "Expected attachment upload-token requests to use kind FILE_ATTACHMENT.",
  );
  assert.match(
    contents,
    /uploadAdminAssetDirect\s*\(\s*\{[\s\S]*kind\s*:\s*["']FILE_ATTACHMENT["'][\s\S]*\}\s*\)/s,
    "Expected attachments to upload through uploadAdminAssetDirect with kind FILE_ATTACHMENT.",
  );
  assert.match(
    contents,
    /attachmentAssetIds|fileAttachmentAssetIds|attachedAssetIds|attachments/s,
    "Expected the client to track uploaded attachment asset ids.",
  );
  assert.match(
    contents,
    /assetIds\s*:\s*\[[\s\S]*(attachmentAssetIds|fileAttachmentAssetIds|attachedAssetIds|attachments)/s,
    "Expected save payload assetIds to include attachment asset ids.",
  );
});

test("board post editor keeps inline image persistence asset based", async () => {
  const clientContents = await readSource(clientPath);
  const editorContents = await readSource(editorPath);

  assert.match(
    clientContents,
    /kind\s*:\s*["']INLINE_IMAGE["']/,
    "Expected image upload-token requests to keep using kind INLINE_IMAGE.",
  );
  assert.match(editorContents, /onImageUpload/, "Expected board-post-editor to keep delegating image uploads.");
  assert.match(editorContents, /createImageNode\s*\(/, "Expected board-post-editor to insert uploaded image nodes.");
  assert.equal(
    /\bpublicUrl\b/.test(editorContents),
    false,
    "Expected board-post-editor to avoid persisting publicUrl in editor content.",
  );
});
