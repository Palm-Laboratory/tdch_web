import assert from "node:assert/strict";
import test from "node:test";

process.env.API_BASE_URL = "https://api.example.com";

type ServerFetchModule = {
  serverFetch: (path: string, init?: RequestInit & { timeoutMs?: number }) => Promise<Response>;
  ServerFetchError: new (kind: string, status: number, code: string, message: string) => Error & {
    kind: string;
    status: number;
    code: string;
  };
};

async function loadServerFetchModule(): Promise<ServerFetchModule> {
  return import("./server-fetch.ts") as Promise<ServerFetchModule>;
}

function createAbortError() {
  const error = new Error("The operation was aborted.");
  error.name = "AbortError";
  return error;
}

test("serverFetch calls the upstream API with no-store caching and returns the upstream response", async () => {
  const { serverFetch } = await loadServerFetchModule();
  const originalFetch = globalThis.fetch;
  const response = new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });

  let capturedUrl: string | undefined;
  let capturedInit: RequestInit | undefined;

  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    capturedUrl = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    capturedInit = init;
    return response;
  }) as typeof fetch;

  try {
    const result = await serverFetch("/api/v1/public/menu", {
      headers: {
        Accept: "application/json",
      },
    });

    assert.equal(result, response);
    assert.equal(capturedUrl, "https://api.example.com/api/v1/public/menu");
    assert.equal(capturedInit?.cache, "no-store");
    assert.equal(new Headers(capturedInit?.headers).get("accept"), "application/json");
    assert.ok(capturedInit?.signal instanceof AbortSignal);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("serverFetch throws a not-found error for upstream 404 responses", async () => {
  const { serverFetch, ServerFetchError } = await loadServerFetchModule();
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async () =>
    new Response(JSON.stringify({ code: "PLAYLIST_NOT_FOUND", message: "missing" }), {
      status: 404,
      headers: { "content-type": "application/json" },
    })) as typeof fetch;

  try {
    await assert.rejects(
      () => serverFetch("/api/v1/public/videos/detail?path=shorts"),
      (error: unknown) => {
        assert.ok(error instanceof ServerFetchError);
        assert.equal(error.kind, "not-found");
        assert.equal(error.status, 404);
        assert.equal(error.code, "PLAYLIST_NOT_FOUND");
        assert.equal(error.message, "missing");
        return true;
      },
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("serverFetch throws an upstream failure error for non-404 upstream responses", async () => {
  const { serverFetch, ServerFetchError } = await loadServerFetchModule();
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async () =>
    new Response(JSON.stringify({ code: "UPSTREAM_RATE_LIMITED", message: "slow down" }), {
      status: 429,
      headers: { "content-type": "application/json" },
    })) as typeof fetch;

  try {
    await assert.rejects(
      () => serverFetch("/api/v1/public/menu/resolve?path=about"),
      (error: unknown) => {
        assert.ok(error instanceof ServerFetchError);
        assert.equal(error.kind, "upstream-failure");
        assert.equal(error.status, 429);
        assert.equal(error.code, "UPSTREAM_RATE_LIMITED");
        assert.equal(error.message, "slow down");
        return true;
      },
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("serverFetch aborts slow upstream requests and throws a timeout error", async () => {
  const { serverFetch, ServerFetchError } = await loadServerFetchModule();
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async (_input: string | URL | Request, init?: RequestInit) => {
    await new Promise((_, reject) => {
      init?.signal?.addEventListener("abort", () => {
        reject(createAbortError());
      });
    });
    throw new Error("unreachable");
  }) as typeof fetch;

  try {
    await assert.rejects(
      () => serverFetch("/api/v1/public/videos/detail?path=shorts", { timeoutMs: 10 }),
      (error: unknown) => {
        assert.ok(error instanceof ServerFetchError);
        assert.equal(error.kind, "timeout");
        assert.equal(error.status, 504);
        assert.equal(error.code, "UPSTREAM_TIMEOUT");
        return true;
      },
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
