import { joinApiUrl, normalizeApiBaseUrl } from "@/lib/api-base-url";

export type AdminUploadAssetKind = "INLINE_IMAGE" | "FILE_ATTACHMENT";

export interface AdminUploadDirectRequest {
  file: File;
  kind: AdminUploadAssetKind;
  rawToken: string;
}

export interface AdminUploadAssetMetadata {
  assetId: string;
  kind: AdminUploadAssetKind;
  storedPath: string;
  publicUrl?: string;
  byteSize: number;
  width?: number;
  height?: number;
  originalFilename: string;
}

interface UploadAssetResponse {
  assetId?: string | number;
  id?: string | number;
  storedPath?: string;
  publicUrl?: string;
  byteSize?: number;
  width?: number | null;
  height?: number | null;
  originalFilename?: string;
}

function getApiBaseUrl() {
  return normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);
}

function buildPublicUrl(baseUrl: string, storedPath: string) {
  const cleanStoredPath = storedPath.replace(/^\/+/, "");
  return joinApiUrl(baseUrl, `/upload/${cleanStoredPath}`);
}

function requiredUploadMetadataValue(value: string | number | undefined) {
  const normalizedValue = value === undefined ? "" : String(value).trim();

  if (!normalizedValue) {
    throw new Error("업로드 응답에 필수 파일 정보가 없습니다. 잠시 후 다시 시도해 주세요.");
  }

  return normalizedValue;
}

async function readErrorMessage(response: Response) {
  try {
    const data = (await response.json()) as { message?: string };
    return data.message?.trim();
  } catch {
    return undefined;
  }
}

export async function uploadAdminAssetDirect(
  request: AdminUploadDirectRequest,
): Promise<AdminUploadAssetMetadata> {
  const baseUrl = getApiBaseUrl();
  const formData = new FormData();
  formData.append("file", request.file);
  formData.append("kind", request.kind);

  const response = await fetch(joinApiUrl(baseUrl, "/api/v1/admin/uploads"), {
    method: "POST",
    headers: {
      "X-Upload-Token": request.rawToken,
    },
    body: formData,
  });

  if (!response.ok) {
    const upstreamMessage = await readErrorMessage(response);
    throw new Error(upstreamMessage || `파일 업로드에 실패했습니다. 잠시 후 다시 시도해 주세요. (${response.status})`);
  }

  const data = (await response.json()) as UploadAssetResponse;
  const assetId = requiredUploadMetadataValue(data.assetId ?? data.id);
  const storedPath = requiredUploadMetadataValue(data.storedPath);

  return {
    assetId,
    kind: request.kind,
    storedPath,
    publicUrl: data.publicUrl || buildPublicUrl(baseUrl, storedPath),
    byteSize: data.byteSize ?? request.file.size,
    width: data.width ?? undefined,
    height: data.height ?? undefined,
    originalFilename: data.originalFilename || request.file.name,
  };
}
