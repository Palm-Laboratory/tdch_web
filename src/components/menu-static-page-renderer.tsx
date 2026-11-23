import { notFound } from "next/navigation";
import SitePageShell from "@/components/site-page-shell";
import GreetingPage from "@/app/(site)/about/greeting/page";
import PastorPage from "@/app/(site)/about/pastor/page";
import ServiceTimesPage from "@/app/(site)/about/service-times/page";
import LocationPage from "@/app/(site)/about/location/page";
import HistoryPage from "@/app/(site)/about/history/page";
import GivingPage from "@/app/(site)/about/giving/page";
import NewcomerGuidePage from "@/app/(site)/newcomer/guide/page";
import NewcomerCarePage from "@/app/(site)/newcomer/care/page";
import NewcomerDisciplesPage from "@/app/(site)/newcomer/disciples/page";
import CommissionSummaryPage from "@/app/(site)/commission/summary/page";
import CommissionNextgenPage from "@/app/(site)/commission/nextgen/page";
import CommissionCulturePage from "@/app/(site)/commission/culture/page";
import CommissionSeniorPage from "@/app/(site)/commission/senior/page";

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
    <SitePageShell
      title="교회소개"
      subtitle={subtitle}
      showHeader={showHeader}
      showBreadcrumb={showBreadcrumb}
    >
      <main className="flex-1 w-full">{children}</main>
    </SitePageShell>
  );
}

function CommissionStaticPageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SitePageShell title="지상명령" subtitle="THE GREAT COMMISSION">
      <main className="flex-1 w-full">{children}</main>
    </SitePageShell>
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
    case "commission.summary":
      return (
        <CommissionStaticPageShell>
          <CommissionSummaryPage />
        </CommissionStaticPageShell>
      );
    case "commission.nextgen":
      return (
        <CommissionStaticPageShell>
          <CommissionNextgenPage />
        </CommissionStaticPageShell>
      );
    case "commission.culture":
      return (
        <CommissionStaticPageShell>
          <CommissionCulturePage />
        </CommissionStaticPageShell>
      );
    case "commission.ethnic":
      return (
        <CommissionStaticPageShell>
          <CommissionCulturePage />
        </CommissionStaticPageShell>
      );
    case "commission.senior":
      return (
        <CommissionStaticPageShell>
          <CommissionSeniorPage />
        </CommissionStaticPageShell>
      );
    default:
      notFound();
  }
}
