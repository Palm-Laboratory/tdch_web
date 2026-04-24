import { redirect, RedirectType } from "next/navigation";

export default function AdminVideosPage() {
  redirect("/admin/videos/manage", RedirectType.replace);
}
