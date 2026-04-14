import type { Metadata } from "next";
import SermonDetailRoute, {
  generateMetadata as generateDynamicMetadata,
} from "@/app/(site)/sermons/[slug]/[youtubeVideoId]/page";
import {
  buildLegacySermonDetailParams,
  type LegacySermonDetailWrapperProps,
} from "@/app/(site)/sermons/legacy-route-compatibility";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: LegacySermonDetailWrapperProps): Promise<Metadata> {
  return generateDynamicMetadata(
    await buildLegacySermonDetailParams(
      "better-devotion",
      Promise.resolve({ youtubeVideoId: (await params).youtubeVideoId }),
    ),
  );
}

export default async function BetterDevotionDetailPage({
  params,
}: LegacySermonDetailWrapperProps) {
  return SermonDetailRoute(
    await buildLegacySermonDetailParams(
      "better-devotion",
      Promise.resolve({ youtubeVideoId: (await params).youtubeVideoId }),
    ),
  );
}
