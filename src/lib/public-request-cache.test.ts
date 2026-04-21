import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

process.env.API_BASE_URL = "https://api.example.com";

type PublicLoaderModule = {
  runWithPublicRequestCache: <T>(loader: () => Promise<T>) => Promise<T>;
  getNavigationResponse: () => Promise<unknown>;
  resolvePublicMenuPath: (path: string) => Promise<unknown>;
  getPublicPlaylistDetailByPath: (path: string) => Promise<unknown>;
  getPublicPlaylistVideoDetailByPath: (path: string, videoId: string) => Promise<unknown>;
  getPublicPlaylistVideoListByPath: (path: string, page?: number, size?: number) => Promise<unknown>;
};

async function createTempModule(root: string, moduleName: string, source: string): Promise<string> {
  const modulePath = join(root, moduleName);
  await writeFile(modulePath, source, "utf8");
  return modulePath;
}

async function loadPublicLoaderModule(): Promise<PublicLoaderModule> {
  const root = await mkdtemp(join(tmpdir(), "public-request-cache-"));
  const [
    serverFetchSource,
    publicRequestCacheSource,
    navigationApiSource,
    publicMenuApiSource,
    videosApiSource,
  ] = await Promise.all([
    readFile(new URL("./server-fetch.ts", import.meta.url), "utf8"),
    readFile(new URL("./public-request-cache.ts", import.meta.url), "utf8"),
    readFile(new URL("./navigation-api.ts", import.meta.url), "utf8"),
    readFile(new URL("./public-menu-api.ts", import.meta.url), "utf8"),
    readFile(new URL("./videos-api.ts", import.meta.url), "utf8"),
  ]);

  await createTempModule(root, "server-fetch.ts", serverFetchSource);
  const publicRequestCachePath = await createTempModule(
    root,
    "public-request-cache.ts",
    publicRequestCacheSource
      .replace('import "server-only";\n\n', "")
      .replaceAll('from "react"', 'from "./react-stub.ts"'),
  );
  const navigationTypesPath = await createTempModule(root, "navigation-types.ts", "export {};\n");
  const navigationUtilsPath = await createTempModule(root, "navigation-utils.ts", "export function toNavMenuGroups(navigation){ return navigation.groups ?? []; }\n");
  const adminMenuApiPath = await createTempModule(root, "admin-menu-api.ts", "export {};\n");

  void navigationTypesPath;
  void navigationUtilsPath;
  void adminMenuApiPath;

  const navigationApiPath = await createTempModule(
    root,
    "navigation-api.ts",
    navigationApiSource
      .replace('import "server-only";\n\n', "")
      .replaceAll('from "react"', 'from "./react-stub.ts"')
      .replaceAll('from "@/lib/navigation-types"', 'from "./navigation-types.ts"')
      .replaceAll('from "@/lib/navigation-utils"', 'from "./navigation-utils.ts"')
      .replaceAll('from "@/lib/server-fetch"', 'from "./server-fetch.ts"')
      .replaceAll('from "@/lib/public-request-cache"', 'from "./public-request-cache.ts"'),
  );

  const publicMenuApiPath = await createTempModule(
    root,
    "public-menu-api.ts",
    publicMenuApiSource
      .replace('import "server-only";\n\n', "")
      .replaceAll('from "react"', 'from "./react-stub.ts"')
      .replaceAll('from "@/lib/admin-menu-api"', 'from "./admin-menu-api.ts"')
      .replaceAll('from "@/lib/server-fetch"', 'from "./server-fetch.ts"')
      .replaceAll('from "@/lib/public-request-cache"', 'from "./public-request-cache.ts"'),
  );

  const videosApiPath = await createTempModule(
    root,
    "videos-api.ts",
    videosApiSource
      .replace('import "server-only";\n\n', "")
      .replaceAll('from "react"', 'from "./react-stub.ts"')
      .replaceAll('from "@/lib/server-fetch"', 'from "./server-fetch.ts"')
      .replaceAll('from "@/lib/public-request-cache"', 'from "./public-request-cache.ts"'),
  );

  await createTempModule(root, "react-stub.ts", "export const cache = (fn) => fn;\n");

  const [publicRequestCacheModule, navigationApi, publicMenuApi, videosApi] = await Promise.all([
    import(`file://${publicRequestCachePath}`),
    import(`file://${navigationApiPath}`),
    import(`file://${publicMenuApiPath}`),
    import(`file://${videosApiPath}`),
  ]);

  return {
    runWithPublicRequestCache: publicRequestCacheModule.runWithPublicRequestCache,
    getNavigationResponse: navigationApi.getNavigationResponse,
    resolvePublicMenuPath: publicMenuApi.resolvePublicMenuPath,
    getPublicPlaylistDetailByPath: videosApi.getPublicPlaylistDetailByPath,
    getPublicPlaylistVideoDetailByPath: videosApi.getPublicPlaylistVideoDetailByPath,
    getPublicPlaylistVideoListByPath: videosApi.getPublicPlaylistVideoListByPath,
  };
}

function createJsonResponse(payload: unknown): Response {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

test("getNavigationResponse dedupes identical calls inside one public request cache scope", async () => {
  const { runWithPublicRequestCache, getNavigationResponse } = await loadPublicLoaderModule();
  const originalFetch = globalThis.fetch;
  const requestedUrls: string[] = [];

  globalThis.fetch = (async (input: string | URL | Request) => {
    requestedUrls.push(typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url);
    return createJsonResponse({ groups: [] });
  }) as typeof fetch;

  try {
    await runWithPublicRequestCache(() => Promise.all([getNavigationResponse(), getNavigationResponse()]));
    assert.deepEqual(requestedUrls, ["https://api.example.com/api/v1/public/menu"]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("resolvePublicMenuPath dedupes identical paths and keeps distinct paths separate within one scope", async () => {
  const { runWithPublicRequestCache, resolvePublicMenuPath } = await loadPublicLoaderModule();
  const originalFetch = globalThis.fetch;
  const requestedUrls: string[] = [];

  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    requestedUrls.push(url);
    return createJsonResponse({ fullPath: url });
  }) as typeof fetch;

  try {
    await runWithPublicRequestCache(() =>
      Promise.all([resolvePublicMenuPath("about"), resolvePublicMenuPath("about"), resolvePublicMenuPath("newcomer")]),
    );
    assert.deepEqual(requestedUrls, [
      "https://api.example.com/api/v1/public/menu/resolve?path=about",
      "https://api.example.com/api/v1/public/menu/resolve?path=newcomer",
    ]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("getPublicPlaylistDetailByPath dedupes identical paths and does not collapse distinct paths", async () => {
  const { runWithPublicRequestCache, getPublicPlaylistDetailByPath } = await loadPublicLoaderModule();
  const originalFetch = globalThis.fetch;
  const requestedUrls: string[] = [];

  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    requestedUrls.push(url);
    return createJsonResponse({ fullPath: url });
  }) as typeof fetch;

  try {
    await runWithPublicRequestCache(() =>
      Promise.all([
        getPublicPlaylistDetailByPath("sermons/alpha"),
        getPublicPlaylistDetailByPath("sermons/alpha"),
        getPublicPlaylistDetailByPath("sermons/beta"),
      ]),
    );
    assert.deepEqual(requestedUrls, [
      "https://api.example.com/api/v1/public/videos?path=sermons%2Falpha",
      "https://api.example.com/api/v1/public/videos?path=sermons%2Fbeta",
    ]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("getPublicPlaylistVideoDetailByPath dedupes identical path and video tuples only", async () => {
  const { runWithPublicRequestCache, getPublicPlaylistVideoDetailByPath } = await loadPublicLoaderModule();
  const originalFetch = globalThis.fetch;
  const requestedUrls: string[] = [];

  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    requestedUrls.push(url);
    return createJsonResponse({ href: url });
  }) as typeof fetch;

  try {
    await runWithPublicRequestCache(() =>
      Promise.all([
        getPublicPlaylistVideoDetailByPath("shorts/worship", "video-1"),
        getPublicPlaylistVideoDetailByPath("shorts/worship", "video-1"),
        getPublicPlaylistVideoDetailByPath("shorts/worship", "video-2"),
      ]),
    );
    assert.deepEqual(requestedUrls, [
      "https://api.example.com/api/v1/public/videos/detail?path=shorts%2Fworship&videoId=video-1",
      "https://api.example.com/api/v1/public/videos/detail?path=shorts%2Fworship&videoId=video-2",
    ]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("getPublicPlaylistVideoListByPath dedupes identical path, page, and size tuples only", async () => {
  const { runWithPublicRequestCache, getPublicPlaylistVideoListByPath } = await loadPublicLoaderModule();
  const originalFetch = globalThis.fetch;
  const requestedUrls: string[] = [];

  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    requestedUrls.push(url);
    return createJsonResponse({ items: [] });
  }) as typeof fetch;

  try {
    await runWithPublicRequestCache(() =>
      Promise.all([
        getPublicPlaylistVideoListByPath("shorts/worship", 1, 6),
        getPublicPlaylistVideoListByPath("shorts/worship", 1, 6),
        getPublicPlaylistVideoListByPath("shorts/worship", 2, 6),
        getPublicPlaylistVideoListByPath("shorts/worship", 1, 12),
      ]),
    );
    assert.deepEqual(requestedUrls, [
      "https://api.example.com/api/v1/public/videos/items?path=shorts%2Fworship&page=1&size=6",
      "https://api.example.com/api/v1/public/videos/items?path=shorts%2Fworship&page=2&size=6",
      "https://api.example.com/api/v1/public/videos/items?path=shorts%2Fworship&page=1&size=12",
    ]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
