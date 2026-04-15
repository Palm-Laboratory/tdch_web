import AdminMediaSyncJobDetailPage from "@/app/(admin)/admin/(cms)/media/sync-jobs/[jobId]/page";

void AdminMediaSyncJobDetailPage;

type AdminMediaSyncJobDetailPageProps = Parameters<typeof AdminMediaSyncJobDetailPage>[0];

const _assertPageProps: AdminMediaSyncJobDetailPageProps = {
  params: Promise.resolve({
    jobId: "42",
  }),
};

void _assertPageProps;
