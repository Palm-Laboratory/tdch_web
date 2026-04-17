import { notFound, redirect } from "next/navigation";
import { getVideoNavigationLandingHref } from "@/lib/navigation-api";
import { getLegacyVideoHref } from "@/lib/videos-api";

export default async function LegacyVideoShortDetailRedirectPage({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = await params;
  const redirectHref = await getLegacyVideoHref(videoId);

  if (redirectHref) {
    redirect(redirectHref);
  }

  const landingHref = await getVideoNavigationLandingHref();
  if (landingHref) {
    redirect(landingHref);
  }

  notFound();
}
