import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const rendererPath = path.join(here, "public-board-renderer.tsx");

async function readRenderer() {
  return readFile(rendererPath, "utf8");
}

test("public board renderer composes safe media URLs and never trusts raw iframe URLs", async () => {
  const contents = await readRenderer();

  assert.match(contents, /storedPath/, "Expected the renderer to use storedPath for media composition.");
  assert.match(
    contents,
    /MEDIA_API_BASE_URL|public media base/i,
    "Expected the renderer to compose image URLs from a configured public media base URL.",
  );
  assert.match(
    contents,
    /youtube-nocookie\.com\/embed/,
    "Expected the renderer to build YouTube embeds from the youtube-nocookie.com domain.",
  );
  assert.match(
    contents,
    /videoId.{0,120}\b11\b|validated.{0,120}11-char|^[\s\S]*\b11-char\b[\s\S]*videoId/s,
    "Expected the renderer to validate YouTube video ids before building the iframe source.",
  );
  assert.match(
    contents,
    /publicUrl|filename|originalFilename|mimeType|byteSize/,
    "Expected file attachments to render backend asset metadata and a backend-provided public URL or composed media URL.",
  );
  assert.doesNotMatch(
    contents,
    /iframe[^]*src\s*=\s*\{\s*[^}]*url[^}]*\}/s,
    "Expected the renderer not to feed arbitrary URL attrs directly into iframe src.",
  );
});

