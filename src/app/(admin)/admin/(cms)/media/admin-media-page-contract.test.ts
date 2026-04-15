import AdminMediaPage from "@/app/(admin)/admin/(cms)/media/page";
import { discoverAdminPlaylistsAction } from "@/app/(admin)/admin/(cms)/media/actions";
import DiscoverPlaylistsButton from "@/app/(admin)/admin/(cms)/media/_components/discover-playlists-button";
import type { AdminPlaylist } from "@/lib/admin-media-api";

void AdminMediaPage;
void discoverAdminPlaylistsAction;
void DiscoverPlaylistsButton;

type AdminMediaPageProps = Parameters<typeof AdminMediaPage>[0];
type DiscoverPlaylistsActionResult = Awaited<ReturnType<typeof discoverAdminPlaylistsAction>>;
type DiscoverPlaylistsButtonProps = Parameters<typeof DiscoverPlaylistsButton>[0];

const _assertPageProps: AdminMediaPageProps = {};
void _assertPageProps;

const _assertPlaylist: AdminPlaylist = {
  id: 1,
  menuName: "주일예배",
  siteKey: "sermons",
  slug: "sunday-worship",
  contentKind: "LONG_FORM",
  status: "PUBLISHED",
  active: true,
  navigationVisible: true,
  sortOrder: 0,
  description: null,
  discoveredAt: null,
  publishedAt: null,
  lastModifiedBy: null,
  youtubePlaylistId: "PL_TEST",
  itemCount: 12,
  syncEnabled: true,
  lastSyncedAt: null,
  lastDiscoveredAt: null,
  lastSyncSucceededAt: null,
  lastSyncFailedAt: null,
  lastSyncErrorMessage: null,
  discoverySource: null,
  operationStatus: "READY",
};
void _assertPlaylist;

const _assertDiscoverActionResult: DiscoverPlaylistsActionResult = {
  discoveredCount: 0,
  skippedCount: 0,
};
void _assertDiscoverActionResult;

const _assertButtonProps: DiscoverPlaylistsButtonProps = {
  action: discoverAdminPlaylistsAction,
};
void _assertButtonProps;
