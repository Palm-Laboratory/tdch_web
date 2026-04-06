import { redirect } from "next/navigation";
import { getAdminSession, isAdminSession } from "@/auth";
import CmsSidebar from "./components/cms-sidebar";
import CmsTopbar from "./components/cms-topbar";

export default async function CmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!isAdminSession(session)) {
    redirect("/admin/login?callbackUrl=/admin");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <CmsSidebar canManageAccounts={session.user.accountRole === "SUPER_ADMIN"} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <CmsTopbar session={session} />
        <main className="flex-1 overflow-y-auto bg-[#faf8ff]">
          <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
