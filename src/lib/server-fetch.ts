import { joinApiUrl } from "@/lib/api-base-url";
import { SERVER_API_BASE_URL } from "@/lib/server-config";

const DEFAULT_TIMEOUT_MS = 8000;

type ServerFetchErrorKind = "not-found" | "upstream-failure" | "timeout";
type ServerFetchNextOptions = {
  revalidate?: number | false;
  tags?: string[];
};
export type ServerFetchInit = RequestInit & {
  timeoutMs?: number;
  next?: ServerFetchNextOptions;
};

type AbortLink = {
  signal: AbortSignal;
  dispose: () => void;
};

async function readErrorPayload(response: Response): Promise<{ code: string; message: string }> {
  try {
    const payload = (await response.json()) as { code?: string; message?: string };
    return {
      code: payload.code ?? "UPSTREAM_FETCH_FAILED",
      message: payload.message ?? `Upstream request failed with status ${response.status}.`,
    };
  } catch {
    return {
      code: "UPSTREAM_FETCH_FAILED",
      message: `Upstream request failed with status ${response.status}.`,
    };
  }
}

function getRequestCache(init: ServerFetchInit): RequestCache | undefined {
  if (init.cache !== undefined) {
    return init.cache;
  }

  return init.next ? undefined : "no-store";
}

function linkAbortSignals(signal?: AbortSignal, timeoutMs = DEFAULT_TIMEOUT_MS): AbortLink {
  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  if (!signal) {
    return {
      signal: controller.signal,
      dispose: () => clearTimeout(timer),
    };
  }

  const abort = () => controller.abort();
  signal.addEventListener("abort", abort, { once: true });

  return {
    signal: controller.signal,
    dispose: () => {
      clearTimeout(timer);
      signal.removeEventListener("abort", abort);
    },
  };
}

export class ServerFetchError extends Error {
  kind: ServerFetchErrorKind;
  status: number;
  code: string;

  constructor(kind: ServerFetchErrorKind, status: number, code: string, message: string) {
    super(message);
    this.name = "ServerFetchError";
    this.kind = kind;
    this.status = status;
    this.code = code;
  }
}

export async function serverFetch(
  path: string,
  init: ServerFetchInit = {},
): Promise<Response> {
  const abortLink = linkAbortSignals(init.signal ?? undefined, init.timeoutMs);

  try {
    const response = await fetch(joinApiUrl(SERVER_API_BASE_URL, path), {
      ...init,
      cache: getRequestCache(init),
      signal: abortLink.signal,
    });

    if (response.ok) {
      return response;
    }

    const payload = await readErrorPayload(response);
    throw new ServerFetchError(
      response.status === 404 ? "not-found" : "upstream-failure",
      response.status,
      payload.code,
      payload.message,
    );
  } catch (error) {
    if (error instanceof ServerFetchError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new ServerFetchError("timeout", 504, "UPSTREAM_TIMEOUT", "The upstream request timed out.");
    }

    throw new ServerFetchError(
      "upstream-failure",
      502,
      "UPSTREAM_FETCH_FAILED",
      "Failed to reach the upstream service.",
    );
  } finally {
    abortLink.dispose();
  }
}

export async function serverFetchJson<T>(
  path: string,
  init: ServerFetchInit = {},
): Promise<T> {
  const response = await serverFetch(path, init);
  return response.json() as Promise<T>;
}

export async function serverFetchJsonOrNull<T>(
  path: string,
  init: ServerFetchInit = {},
): Promise<T | null> {
  try {
    return await serverFetchJson<T>(path, init);
  } catch (error) {
    if (error instanceof ServerFetchError && error.kind === "not-found") {
      return null;
    }
    throw error;
  }
}
