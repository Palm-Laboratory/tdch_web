import AdminMediaPage from "@/app/(admin)/admin/(cms)/media/page";
import AdminMediaFilterForm from "@/app/(admin)/admin/(cms)/media/_components/admin-media-filter-form";

void AdminMediaPage;
void AdminMediaFilterForm;

type AdminMediaPageProps = Parameters<typeof AdminMediaPage>[0];
type AdminMediaFilterFormProps = Parameters<typeof AdminMediaFilterForm>[0];

const _assertPageProps: AdminMediaPageProps = {
  searchParams: Promise.resolve({
    status: ["PUBLISHED", "DRAFT"],
    sync: "enabled",
    search: "  주일예배  ",
  }),
};

void _assertPageProps;

const _assertFilterFormProps: AdminMediaFilterFormProps = {
  currentStatus: "published",
  currentSync: "enabled",
  currentSearch: "주일예배",
  currentPath: "/admin/media",
};

void _assertFilterFormProps;
