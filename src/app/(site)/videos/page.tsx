import { redirect } from "next/navigation";
import { getVideoNavigationLandingHref } from "@/lib/navigation-api";

export default async function VideosLandingPage() {
  redirect((await getVideoNavigationLandingHref()) ?? "/");
}
