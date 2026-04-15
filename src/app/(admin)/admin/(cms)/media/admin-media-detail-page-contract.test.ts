import AdminMediaDetailPage from "@/app/(admin)/admin/(cms)/media/[siteKey]/page";

void AdminMediaDetailPage;

type AdminMediaDetailPageProps = Parameters<typeof AdminMediaDetailPage>[0];

const _assertPageProps: AdminMediaDetailPageProps = {
  params: Promise.resolve({ siteKey: "sermons" }),
};

void _assertPageProps;
