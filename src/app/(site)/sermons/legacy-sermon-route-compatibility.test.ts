import {
  buildLegacySermonDetailParams,
  buildLegacySermonListParams,
} from "@/app/(site)/sermons/legacy-route-compatibility";

const _assertListParams = buildLegacySermonListParams("messages", Promise.resolve({ page: "1" }));
void _assertListParams;

const _assertDetailParams = buildLegacySermonDetailParams("its-okay", Promise.resolve({ youtubeVideoId: "abc123" }));
void _assertDetailParams;
