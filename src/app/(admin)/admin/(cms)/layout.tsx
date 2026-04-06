import { redirect } from "next/navigation";
import { getAdminSession, isAdminSession } from "@/auth";
import { AdminApiError } from "@/lib/admin-api";
import { getCurrentAdminAccount } from "@/lib/admin-accounts-api";
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

  let topbarSession = session;

  if (session.user.authProvider === "credentials" && session.user.id) {
    try {
      const currentAccount = await getCurrentAdminAccount(session.user.id);
      topbarSession = {
        ...session,
        user: {
          ...session.user,
          name: currentAccount.displayName,
          username: currentAccount.username,
          accountRole: currentAccount.role,
        },
      };
    } catch (error) {
      if (error instanceof AdminApiError && (error.status === 401 || error.status === 403)) {
        redirect("/admin/login?callbackUrl=/admin");
      }
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <CmsSidebar canManageAccounts={topbarSession.user.accountRole === "SUPER_ADMIN"} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <CmsTopbar session={topbarSession} />
        <main className="flex-1 overflow-y-auto bg-[#faf8ff]">
          <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
