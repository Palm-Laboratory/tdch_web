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

test("public board renderer composes safe upload URLs and never trusts raw iframe URLs", async () => {
  const contents = await readRenderer();

  assert.match(contents, /storedPath/, "Expected the renderer to use storedPath for upload URL composition.");
  assert.match(
    contents,
    /PUBLIC_API_BASE_URL|public API base/i,
    "Expected the renderer to compose image URLs from a configured public API base URL.",
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
    "Expected file attachments to render backend asset metadata and a backend-provided public URL or composed upload URL.",
  );
  assert.doesNotMatch(
    contents,
    /iframe[^]*src\s*=\s*\{\s*[^}]*url[^}]*\}/s,
    "Expected the renderer not to feed arbitrary URL attrs directly into iframe src.",
  );
});

test("public board renderer applies supported Tiptap text marks", async () => {
  const contents = await readRenderer();

  assert.match(contents, /case\s+["']bold["']/, "Expected public board text rendering to support bold marks.");
  assert.match(contents, /case\s+["']italic["']/, "Expected public board text rendering to support italic marks.");
  assert.match(contents, /case\s+["']strike["']/, "Expected public board text rendering to support strike marks.");
  assert.match(contents, /case\s+["']underline["']/, "Expected public board text rendering to support underline marks.");
  assert.match(contents, /case\s+["']code["']/, "Expected public board text rendering to support inline code marks.");
  assert.match(contents, /case\s+["']highlight["']/, "Expected public board text rendering to support highlight marks.");
  assert.match(contents, /case\s+["']link["']/, "Expected public board text rendering to support link marks.");
  assert.match(contents, /case\s+["']subscript["']/, "Expected public board text rendering to support subscript marks.");
  assert.match(contents, /case\s+["']superscript["']/, "Expected public board text rendering to support superscript marks.");
  assert.match(contents, /case\s+["']fontSize["']/, "Expected public board text rendering to support font-size marks.");
  assert.match(contents, /fontSize\s*:\s*size/, "Expected font-size marks to render as inline font-size styles.");
  assert.match(contents, /getSafeLinkHref/, "Expected link marks to sanitize href values before rendering anchors.");
});

test("public board renderer supports official SimpleEditor uploaded image sources", async () => {
  const contents = await readRenderer();

  assert.match(
    contents,
    /storedPathFromEditorImageSource/,
    "Expected public rendering to recover storedPath from SimpleEditor image src metadata.",
  );
  assert.match(
    contents,
    /candidate\.attrs\?\.src/,
    "Expected public rendering to inspect official image src attrs when storedPath is absent.",
  );
});

test("public board renderer supports official SimpleEditor block nodes and text alignment", async () => {
  const contents = await readRenderer();

  assert.match(contents, /case\s+["']taskList["']/, "Expected public rendering to support task lists.");
  assert.match(contents, /case\s+["']taskItem["']/, "Expected public rendering to support task list items.");
  assert.match(contents, /type="checkbox"/, "Expected task list items to render checkbox controls.");
  assert.match(contents, /candidate\.attrs\?\.checked\s*===\s*true/, "Expected task item checked attrs to drive checkbox state.");
  assert.match(contents, /case\s+["']codeBlock["']/, "Expected public rendering to support code blocks.");
  assert.match(contents, /<pre\b/, "Expected code blocks to render in preformatted containers.");
  assert.match(contents, /case\s+["']horizontalRule["']/, "Expected public rendering to support horizontal rules.");
  assert.match(contents, /getTextAlignStyle/, "Expected paragraph and heading nodes to render textAlign attrs.");
});

test("public board renderer uses typography policy tokens instead of arbitrary page typography", async () => {
  const contents = await readRenderer();

  assert.match(contents, /type-section-title/, "Expected section headings to use typography policy tokens.");
  assert.match(contents, /type-body/, "Expected body copy to use typography policy tokens.");
  assert.match(contents, /type-label/, "Expected labels and metadata to use typography policy tokens.");
  assert.doesNotMatch(contents, /text-\[[0-9.]+(?:px|rem|em)\]/, "Expected no arbitrary text sizing classes.");
  assert.doesNotMatch(contents, /font-\[var\(/, "Expected no arbitrary CSS variable font classes.");
  assert.doesNotMatch(contents, /clamp\(|\bvw\b/, "Expected no viewport-driven typography sizing.");
});

test("public board renderer follows the shared section header and narrow content layout", async () => {
  const contents = await readRenderer();

  assert.match(
    contents,
    /section-shell section-shell--narrow/,
    "Expected public board content to use the shared narrow content shell.",
  );
  assert.match(
    contents,
    /type-label font-semibold uppercase tracking-\[0\.28em\] text-site-gold/,
    "Expected public board headers to use the shared eyebrow typography.",
  );
  assert.match(
    contents,
    /type-section-title font-section-title font-bold tracking-\[-0\.02em\] text-site-ink/,
    "Expected public board headers to use the shared section title typography.",
  );
  assert.match(contents, /<h2\b/, "Expected public board content headers to use section-level h2 headings.");
});
