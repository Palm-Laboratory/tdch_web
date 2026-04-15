import { buildAdminApiHeaders } from "@/lib/admin-api";

const headers = buildAdminApiHeaders(
  new Headers({
    "X-Admin-Actor-Id": "42",
    "X-Trace-Id": "trace-123",
  }),
  "sync-secret",
);

const _assertAccept: string = headers.Accept;
const _assertAdminKey: string = headers["X-Admin-Key"];
const _assertActorId: string = headers["X-Admin-Actor-Id"];
const _assertTraceId: string = headers["X-Trace-Id"];

void _assertAccept;
void _assertAdminKey;
void _assertActorId;
void _assertTraceId;
