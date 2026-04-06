import { redirect } from "next/navigation";
import { getNavigationGroupByKey } from "@/lib/navigation-api";

export default async function SermonsPage() {
  const group = await getNavigationGroupByKey("sermons");
  redirect(group?.defaultLandingHref ?? "/sermons/messages");
}
