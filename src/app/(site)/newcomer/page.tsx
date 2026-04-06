import { redirect } from "next/navigation";
import { getNavigationGroupByKey } from "@/lib/navigation-api";

export default async function NewcomerPage() {
  const group = await getNavigationGroupByKey("newcomer");
  redirect(group?.defaultLandingHref ?? "/newcomer/guide");
}
