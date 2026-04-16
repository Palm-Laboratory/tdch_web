import { redirect } from "next/navigation";

export default async function LegacyMediaVideoDetailRedirectPage({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = await params;
  redirect(`/media/videos/${videoId}`);
}
