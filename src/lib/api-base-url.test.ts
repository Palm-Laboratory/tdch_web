import assert from "node:assert/strict";
import test from "node:test";

import { DEFAULT_API_BASE_URL, joinApiUrl, normalizeApiBaseUrl, readApiBaseUrlFromEnv } from "./api-base-url.ts";

test("normalizeApiBaseUrl trims whitespace and trailing slashes", () => {
  assert.equal(normalizeApiBaseUrl(" https://api.example.com/// "), "https://api.example.com");
});

test("normalizeApiBaseUrl falls back to the local API base URL", () => {
  assert.equal(normalizeApiBaseUrl("   "), DEFAULT_API_BASE_URL);
  assert.equal(normalizeApiBaseUrl(undefined), DEFAULT_API_BASE_URL);
});

test("readApiBaseUrlFromEnv uses the first configured environment variable", () => {
  assert.equal(
    readApiBaseUrlFromEnv(
      {
        API_BASE_URL: " https://api.example.com/ ",
        NEXT_PUBLIC_API_BASE_URL: "https://public.example.com",
      },
      ["API_BASE_URL", "NEXT_PUBLIC_API_BASE_URL"],
    ),
    "https://api.example.com",
  );
});

test("joinApiUrl avoids duplicate slashes between base URL and path", () => {
  assert.equal(joinApiUrl("https://api.example.com/", "/api/v1/health"), "https://api.example.com/api/v1/health");
  assert.equal(joinApiUrl("https://api.example.com", "api/v1/health"), "https://api.example.com/api/v1/health");
});
