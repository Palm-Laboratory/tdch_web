import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site-config";
import { AdminToastProvider } from "./(cms)/components/admin-toast-provider";

export const metadata: Metadata = {
  title: {
    default: `관리자 | ${SITE_NAME}`,
    template: `%s | 관리자 · ${SITE_NAME}`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminToastProvider>
      <div className="min-h-screen bg-[#0f1c2e] font-[var(--font-sans)] antialiased">
        {children}
      </div>
    </AdminToastProvider>
  );
}
