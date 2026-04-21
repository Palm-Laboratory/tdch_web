import {
  uploadAdminAssetDirect,
  type AdminUploadAssetMetadata,
  type AdminUploadDirectRequest,
} from "@/lib/admin-upload-client";
import type { AdminUploadAssetKind } from "@/lib/admin-upload-api";

const file = new File(["upload-body"], "bulletin.png", { type: "image/png" });
const kind: AdminUploadAssetKind = "INLINE_IMAGE";

const _assertDirectRequest: AdminUploadDirectRequest = {
  file,
  kind,
  rawToken: "opaque-upload-token",
};

async function assertUploadAdminAssetDirectContract() {
  const asset = await uploadAdminAssetDirect(_assertDirectRequest);

  const _assertAssetId: string = asset.assetId;
  const _assertKind: AdminUploadAssetKind = asset.kind;
  const _assertStoredPath: string = asset.storedPath;
  const _assertPublicUrl: string | undefined = asset.publicUrl;
  const _assertByteSize: number = asset.byteSize;
  const _assertWidth: number | undefined = asset.width;
  const _assertHeight: number | undefined = asset.height;
  const _assertOriginalFilename: string = asset.originalFilename;

  return {
    _assertAssetId,
    _assertKind,
    _assertStoredPath,
    _assertPublicUrl,
    _assertByteSize,
    _assertWidth,
    _assertHeight,
    _assertOriginalFilename,
  };
}

const _assertAssetMetadata: AdminUploadAssetMetadata = {
  assetId: "asset-123",
  kind,
  storedPath: "uploads/asset-123.png",
  publicUrl: "https://api.example.com/upload/uploads/asset-123.png",
  byteSize: file.size,
  width: 640,
  height: 480,
  originalFilename: file.name,
};

void _assertDirectRequest;
void _assertAssetMetadata;
void assertUploadAdminAssetDirectContract;
