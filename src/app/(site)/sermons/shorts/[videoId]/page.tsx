import { redirect } from "next/navigation";

export default async function LegacyMediaVideoShortDetailRedirectPage({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = await params;
  redirect(`/media/videos/shorts/${videoId}`);
}
