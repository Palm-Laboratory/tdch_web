import PageHeader from "@/components/page-header";
import Breadcrumb from "@/components/breadcrumb";

export default function SermonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col pb-20">
      <PageHeader
        title="말씀"
        subtitle="MESSAGE"
        backgroundImageUrl="/images/main_bg/main_bg_sec1.png"
      />
      <Breadcrumb />
      <main className="section-shell section-shell--wide pt-10 md:pt-16 pb-20">{children}</main>
    </div>
  );
}
