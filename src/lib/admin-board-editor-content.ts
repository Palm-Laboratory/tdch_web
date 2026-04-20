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

function mediaSourceFromStoredPath(storedPath: string) {
  const cleanPath = storedPath.replace(/^\/+/, "");
  return cleanPath ? `/media/${cleanPath}` : "";
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
      src: mediaSourceFromStoredPath(storedPath),
      assetId,
      storedPath,
      alt,
    },
  };
}

export function createYoutubeEmbedNode(videoId: string): TiptapNode {
  return {
    type: "youtubeEmbed",
    attrs: {
      videoId,
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

  const visit = (node: unknown) => {
    if (!node || typeof node !== "object") {
      return;
    }

    const candidate = node as TiptapNode;
    const assetId = candidate.attrs?.assetId;

    if (typeof assetId === "string" || typeof assetId === "number") {
      assetIds.push(assetId);
    }

    if (Array.isArray(candidate.content)) {
      candidate.content.forEach(visit);
    }
  };

  visit(document);
  return assetIds;
}

function normalizeYouTubeId(value: string) {
  const id = value.trim();
  return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
}
