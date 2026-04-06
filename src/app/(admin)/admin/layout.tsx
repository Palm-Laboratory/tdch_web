import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "관리자",
    template: `%s | 관리자`,
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-50">
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-10 md:px-10">
        {children}
      </main>
    </div>
  );
}
