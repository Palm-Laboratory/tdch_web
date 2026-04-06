import { redirect } from "next/navigation";
import { getNavigationGroupByKey } from "@/lib/navigation-api";

export default async function AboutPage() {
  const group = await getNavigationGroupByKey("about");
  redirect(group?.defaultLandingHref ?? "/about/greeting");
}
