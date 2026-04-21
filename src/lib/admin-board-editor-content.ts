export interface TiptapNode {
  type: string;
  text?: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
}

export interface TiptapDocument {
  type: "doc";
  content: TiptapNode[];
}

export interface CreateImageNodeInput {
  assetId: string | number;
  storedPath: string;
  alt?: string;
}

function uploadSourceFromStoredPath(storedPath: string) {
  const cleanPath = storedPath.replace(/^\/+/, "");
  return cleanPath ? `/upload/${cleanPath}` : "";
}

export function createEmptyTiptapDocument(): TiptapDocument {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
      },
    ],
  };
}

export function createImageNode({ assetId, storedPath, alt = "" }: CreateImageNodeInput): TiptapNode {
  return {
    type: "image",
    attrs: {
      src: uploadSourceFromStoredPath(storedPath),
      assetId,
      storedPath,
      alt,
    },
  };
}

export function createYoutubeEmbedNode(videoId: string): TiptapNode {
  return {
    type: "youtube",
    attrs: {
      src: `https://www.youtube.com/watch?v=${videoId}`,
      width: 640,
      height: 360,
    },
  };
}

export function extractYouTubeVideoId(value: string): string | null {
  const input = value.trim();

  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input;
  }

  try {
    const url = new URL(input);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      return normalizeYouTubeId(url.pathname.slice(1));
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      if (url.pathname === "/watch") {
        return normalizeYouTubeId(url.searchParams.get("v") ?? "");
      }

      const embedMatch = url.pathname.match(/^\/(?:embed|shorts)\/([^/?#]+)/);
      return embedMatch ? normalizeYouTubeId(embedMatch[1]) : null;
    }
  } catch {
    return null;
  }

  return null;
}

export function collectAssetIdsFromTiptapDocument(document: unknown): Array<string | number> {
  const assetIds: Array<string | number> = [];

  const collectFromImageSource = (value: unknown) => {
    const { assetId } = getImageMetadataFromSource(value);

    if (assetId) {
      assetIds.push(assetId);
    }
  };

  const visit = (node: unknown) => {
    if (!node || typeof node !== "object") {
      return;
    }

    const candidate = node as TiptapNode;
    const assetId = candidate.attrs?.assetId;

    if (typeof assetId === "string" || typeof assetId === "number") {
      assetIds.push(assetId);
    }

    collectFromImageSource(candidate.attrs?.src);

    if (Array.isArray(candidate.content)) {
      candidate.content.forEach(visit);
    }
  };

  visit(document);
  return assetIds;
}

function getImageMetadataFromSource(value: unknown) {
  if (typeof value !== "string") {
    return {};
  }

  const hashIndex = value.indexOf("#");
  if (hashIndex === -1) {
    return {};
  }

  const params = new URLSearchParams(value.slice(hashIndex + 1));
  const assetId = params.get("tdchAssetId");
  const storedPath = params.get("tdchStoredPath");

  return {
    ...(assetId ? { assetId } : {}),
    ...(storedPath ? { storedPath } : {}),
  };
}

export function normalizeTiptapDocumentImageMetadata(
  document: TiptapDocument | Record<string, unknown>,
): TiptapDocument | Record<string, unknown> {
  const normalizeNode = (node: unknown): unknown => {
    if (!node || typeof node !== "object") {
      return node;
    }

    const candidate = node as TiptapNode;
    const attrs = candidate.attrs && typeof candidate.attrs === "object" ? candidate.attrs : undefined;
    const metadata = getImageMetadataFromSource(attrs?.src);
    const content = Array.isArray(candidate.content) ? candidate.content.map(normalizeNode) : undefined;

    if (candidate.type !== "image" && !content) {
      return node;
    }

    return {
      ...candidate,
      ...(attrs || Object.keys(metadata).length > 0
        ? {
            attrs: {
              ...attrs,
              ...metadata,
            },
          }
        : {}),
      ...(content ? { content } : {}),
    };
  };

  return normalizeNode(document) as TiptapDocument | Record<string, unknown>;
}

function normalizeYouTubeId(value: string) {
  const id = value.trim();
  return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
}
