import type { Metadata } from "next";
import SermonListPage, {
  generateMetadata as generateDynamicMetadata,
} from "@/app/(site)/sermons/[slug]/page";
import {
  buildLegacySermonListParams,
  type LegacySermonListWrapperProps,
} from "@/app/(site)/sermons/legacy-route-compatibility";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: LegacySermonListWrapperProps): Promise<Metadata> {
  return generateDynamicMetadata(buildLegacySermonListParams("its-okay", searchParams));
}

export default async function ItsOkayPage({ searchParams }: LegacySermonListWrapperProps) {
  return SermonListPage(buildLegacySermonListParams("its-okay", searchParams));
}
