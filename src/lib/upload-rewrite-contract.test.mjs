import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const nextConfigPath = path.join(here, "..", "..", "next.config.ts");

test("next config proxies editor upload paths to the upstream API", async () => {
  const contents = await readFile(nextConfigPath, "utf8");

  assert.match(
    contents,
    /API_BASE_URL/,
    "Expected upload rewrite destination to come from the configured upstream API base URL.",
  );
  assert.match(
    contents,
    /source:\s*["']\/upload\/:path\*["']/,
    "Expected Next to own /upload/* paths so admin editor image previews can load before save.",
  );
  assert.match(
    contents,
    /destination:\s*`\$\{upstreamApiBaseUrl\}\/upload\/:path\*`/,
    "Expected /upload/* requests to be proxied to the upstream API /upload/* route.",
  );
});
