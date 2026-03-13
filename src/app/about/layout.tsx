import PageHeader from "@/components/page-header";
import SubNav from "@/components/sub-nav";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col pb-20">
      <PageHeader
        title="교회소개"
        subtitle="THE DISCIPLES CHURCH"
        backgroundImageUrl="/images/main_bg/main_bg_sec1.png"
      />
      <SubNav groupLabel="교회소개" />
      <main className="section-shell pt-16 md:pt-24">{children}</main>
    </div>
  );
}
