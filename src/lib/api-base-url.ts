export const DEFAULT_API_BASE_URL = "http://localhost:8080";

type EnvSource = Record<string, string | undefined>;

export function normalizeApiBaseUrl(
  value: string | null | undefined,
  fallback = DEFAULT_API_BASE_URL,
): string {
  const normalized = value?.trim().replace(/\/+$/, "") ?? "";
  return normalized || fallback.replace(/\/+$/, "");
}

export function readApiBaseUrlFromEnv(
  env: EnvSource,
  names: string[],
  fallback = DEFAULT_API_BASE_URL,
): string {
  for (const name of names) {
    const value = env[name];
    if (value?.trim()) {
      return normalizeApiBaseUrl(value, fallback);
    }
  }

  return normalizeApiBaseUrl(fallback, DEFAULT_API_BASE_URL);
}

export function joinApiUrl(baseUrl: string, path: string): string {
  const normalizedBaseUrl = normalizeApiBaseUrl(baseUrl);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBaseUrl}${normalizedPath}`;
}
