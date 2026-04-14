type LegacySermonSlug = "messages" | "better-devotion" | "its-okay";

interface LegacyListSearchParams {
  page?: string;
}

interface LegacyDetailParams {
  youtubeVideoId: string;
}

export interface LegacySermonListWrapperProps {
  params: Promise<{
    slug: LegacySermonSlug;
  }>;
  searchParams?: Promise<LegacyListSearchParams>;
}

export interface LegacySermonDetailWrapperProps {
  params: Promise<{
    slug: LegacySermonSlug;
    youtubeVideoId: string;
  }>;
}

export function buildLegacySermonListParams(
  slug: LegacySermonSlug,
  searchParams?: Promise<LegacyListSearchParams>,
) {
  return {
    params: Promise.resolve({ slug }),
    searchParams,
  };
}

export async function buildLegacySermonDetailParams(
  slug: LegacySermonSlug,
  params: Promise<LegacyDetailParams>,
) {
  const resolvedParams = await params;

  return {
    params: Promise.resolve({
      slug,
      youtubeVideoId: resolvedParams.youtubeVideoId,
    }),
  };
}
