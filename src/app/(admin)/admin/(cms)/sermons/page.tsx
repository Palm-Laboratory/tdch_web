import { redirect } from "next/navigation";

export default function LegacyAdminMediaVideosRedirectPage() {
  redirect("/admin/media/videos");
}
