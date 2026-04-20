import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const clientPath = path.join(here, "_components", "board-management-client.tsx");
const editorPath = path.join(here, "_components", "board-post-editor.tsx");
const simpleEditorPath = path.join(here, "..", "..", "..", "..", "..", "components", "tiptap-templates", "simple", "simple-editor.tsx");
const imageUploadNodePath = path.join(here, "..", "..", "..", "..", "..", "components", "tiptap-node", "image-upload-node", "image-upload-node.tsx");

async function readSource(sourcePath) {
  return readFile(sourcePath, "utf8");
}

test("board management client fetches internal board post routes for list and detail", async () => {
  const contents = await readSource(clientPath);

  assert.match(
    contents,
    /fetch\s*\(\s*`\/api\/admin\/boards\/\$\{[^}]*\}\/posts\?menuId=\$\{[^}]*\}`/s,
    "Expected board-management-client to fetch menu-scoped /api/admin/boards/${slug}/posts?menuId=${menuId} for the list.",
  );
  assert.match(
    contents,
    /fetch\s*\(\s*`\/api\/admin\/boards\/\$\{[^}]*\}\/posts\/\$\{[^}]*\}\?menuId=\$\{[^}]*\}`/s,
    "Expected board-management-client to fetch menu-scoped /api/admin/boards/${slug}/posts/${postId}?menuId=${menuId} for detail.",
  );
});

test("board management client includes selected menuId in list and detail requests", async () => {
  const contents = await readSource(clientPath);

  assert.match(
    contents,
    /\/api\/admin\/boards\/\$\{[^}]*\}\/posts\?menuId=\$\{[^}]*\}/s,
    "Expected board-management-client to include menuId in selected board list requests.",
  );
  assert.match(
    contents,
    /\/api\/admin\/boards\/\$\{[^}]*\}\/posts\/\$\{[^}]*\}\?menuId=\$\{[^}]*\}/s,
    "Expected board-management-client to include menuId in selected board post detail requests.",
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

test("board management client sends selected menuId in create and update save payloads", async () => {
  const contents = await readSource(clientPath);

  assert.match(
    contents,
    /savePayload\s*=\s*useMemo[\s\S]*menuId\s*:\s*(?:selectedMenuId|selectedBoardMenuId|selectedBoardMenu\.(?:id|menuId))/s,
    "Expected savePayload to include the selected BOARD menu id.",
  );
  assert.match(
    contents,
    /body\s*:\s*JSON\.stringify\s*\(\s*savePayload\s*\)/s,
    "Expected create/update requests to send the savePayload containing menuId.",
  );
});

test("board management client sends the complete board post save payload", async () => {
  const contents = await readSource(clientPath);

  assert.match(
    contents,
    /normalizeTiptapDocumentImageMetadata/,
    "Expected save payload to restore uploaded image asset metadata before sending contentJson.",
  );
  assert.match(
    contents,
    /contentJson\s*=\s*normalizeTiptapDocumentImageMetadata\(draft\.contentJson\)/,
    "Expected save payload contentJson to use the normalized editor document.",
  );
  assert.match(
    contents,
    /body\s*:\s*JSON\.stringify\s*\(\s*savePayload\s*\)/s,
    "Expected save requests to JSON.stringify savePayload, which contains title, contentJson, contentHtml, isPublic, isPinned, and assetIds.",
  );
  assert.match(
    contents,
    /isPinned\s*:\s*draft\.isPinned/,
    "Expected save payload to include the draft pinned flag.",
  );
  assert.match(
    contents,
    /checked=\{draft\.isPinned\}[\s\S]*상단 고정/s,
    "Expected the editor to expose a top-pinned checkbox.",
  );
});

test("board management client returns to the post list after successful create or update", async () => {
  const contents = await readSource(clientPath);

  assert.match(
    contents,
    /setPosts\s*\([\s\S]*setSelectedPostId\s*\(\s*null\s*\)[\s\S]*setDraft\s*\(\s*createEmptyDraft\(\)\s*\)[\s\S]*setAttachmentAssetIds\s*\(\s*\[\]\s*\)[\s\S]*setScreenMode\s*\(\s*["']list["']\s*\)[\s\S]*게시글을 저장했습니다/s,
    "Expected successful saves to update the list and return to list mode.",
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
  const simpleEditorContents = await readSource(simpleEditorPath);
  const imageUploadNodeContents = await readSource(imageUploadNodePath);

  assert.match(
    clientContents,
    /kind\s*:\s*["']INLINE_IMAGE["']/,
    "Expected image upload-token requests to keep using kind INLINE_IMAGE.",
  );
  assert.match(editorContents, /onImageUpload/, "Expected board-post-editor to keep delegating image uploads.");
  assert.match(simpleEditorContents, /createEditorImageSource/, "Expected SimpleEditor uploaded image nodes to include asset metadata.");
  assert.match(simpleEditorContents, /tdchAssetId/, "Expected SimpleEditor image persistence to preserve uploaded asset ids.");
  assert.match(imageUploadNodeContents, /tdchAssetId/, "Expected uploaded image insertion to read the persisted asset id.");
  assert.match(imageUploadNodeContents, /tdchStoredPath/, "Expected uploaded image insertion to read the persisted stored path.");
  assert.match(imageUploadNodeContents, /\.\.\.getUploadedImageMetadata\(url\)/, "Expected inserted image attrs to include upload metadata.");
  assert.equal(
    /\bpublicUrl\b/.test(editorContents) || /\bpublicUrl\b/.test(simpleEditorContents),
    false,
    "Expected board-post-editor to avoid persisting publicUrl in editor content.",
  );
});
