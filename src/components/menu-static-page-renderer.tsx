import { notFound } from "next/navigation";
import Breadcrumb from "@/components/breadcrumb";
import PageHeader from "@/components/page-header";
import GreetingPage from "@/app/(site)/about/greeting/page";
import PastorPage from "@/app/(site)/about/pastor/page";
import ServiceTimesPage from "@/app/(site)/about/service-times/page";
import LocationPage from "@/app/(site)/about/location/page";
import HistoryPage from "@/app/(site)/about/history/page";
import GivingPage from "@/app/(site)/about/giving/page";
import NewcomerGuidePage from "@/app/(site)/newcomer/guide/page";
import NewcomerCarePage from "@/app/(site)/newcomer/care/page";
import NewcomerDisciplesPage from "@/app/(site)/newcomer/disciples/page";

function AboutStaticPageShell({
  subtitle,
  showHeader = true,
  showBreadcrumb = true,
  children,
}: {
  subtitle: string;
  showHeader?: boolean;
  showBreadcrumb?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col">
      {showHeader && (
        <PageHeader
          title="교회소개"
          subtitle={subtitle}
          backgroundImageUrl="/images/main_bg/main_bg_sec1.png"
        />
      )}
      {showBreadcrumb && <Breadcrumb />}
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}

export default function MenuStaticPageRenderer({
  staticPageKey,
}: {
  staticPageKey: string;
}) {
  switch (staticPageKey) {
    case "about.greeting":
      return (
        <AboutStaticPageShell subtitle="THE DISCIPLES CHURCH" showHeader={false}>
          <GreetingPage />
        </AboutStaticPageShell>
      );
    case "about.pastor":
      return (
        <AboutStaticPageShell subtitle="THE DISCIPLES CHURCH" showHeader={false}>
          <PastorPage />
        </AboutStaticPageShell>
      );
    case "about.service-times":
      return (
        <AboutStaticPageShell subtitle="SERVICE TIMES">
          <ServiceTimesPage />
        </AboutStaticPageShell>
      );
    case "about.location":
      return (
        <AboutStaticPageShell subtitle="LOCATION">
          <LocationPage />
        </AboutStaticPageShell>
      );
    case "about.history":
      return (
        <AboutStaticPageShell subtitle="CHURCH HISTORY">
          <HistoryPage />
        </AboutStaticPageShell>
      );
    case "about.giving":
      return (
        <AboutStaticPageShell subtitle="ONLINE OFFERING GUIDE">
          <GivingPage />
        </AboutStaticPageShell>
      );
    case "newcomer.guide":
      return <NewcomerGuidePage />;
    case "newcomer.care":
      return <NewcomerCarePage />;
    case "newcomer.disciples":
      return <NewcomerDisciplesPage />;
    default:
      notFound();
  }
}
