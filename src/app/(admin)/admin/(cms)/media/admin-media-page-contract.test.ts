import AdminMediaPage from "@/app/(admin)/admin/(cms)/media/page";
import { discoverAdminPlaylistsAction } from "@/app/(admin)/admin/(cms)/media/actions";
import DiscoverPlaylistsButton from "@/app/(admin)/admin/(cms)/media/_components/discover-playlists-button";

void AdminMediaPage;
void discoverAdminPlaylistsAction;
void DiscoverPlaylistsButton;

type AdminMediaPageProps = Parameters<typeof AdminMediaPage>[0];
type DiscoverPlaylistsActionResult = Awaited<ReturnType<typeof discoverAdminPlaylistsAction>>;
type DiscoverPlaylistsButtonProps = Parameters<typeof DiscoverPlaylistsButton>[0];

const _assertPageProps: AdminMediaPageProps = {};
void _assertPageProps;

const _assertDiscoverActionResult: DiscoverPlaylistsActionResult = {
  discoveredCount: 0,
  skippedCount: 0,
};
void _assertDiscoverActionResult;

const _assertButtonProps: DiscoverPlaylistsButtonProps = {
  action: discoverAdminPlaylistsAction,
};
void _assertButtonProps;
