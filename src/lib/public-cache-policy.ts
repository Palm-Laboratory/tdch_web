import type { ServerFetchInit } from "@/lib/server-fetch";

export const PUBLIC_ROUTE_REVALIDATE_SECONDS = 300;

export const PUBLIC_MENU_REVALIDATE_OPTIONS: NonNullable<ServerFetchInit["next"]> = {
  revalidate: PUBLIC_ROUTE_REVALIDATE_SECONDS,
  tags: ["menu"],
};

export const PUBLIC_VIDEO_REVALIDATE_OPTIONS: NonNullable<ServerFetchInit["next"]> = {
  revalidate: PUBLIC_ROUTE_REVALIDATE_SECONDS,
  tags: ["menu", "videos"],
};

export const PUBLIC_BOARD_REVALIDATE_OPTIONS: NonNullable<ServerFetchInit["next"]> = {
  revalidate: PUBLIC_ROUTE_REVALIDATE_SECONDS,
  tags: ["public-board"],
};
