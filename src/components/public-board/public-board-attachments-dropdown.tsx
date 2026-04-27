"use client";

import { useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/tiptap-ui-primitive/dropdown-menu/dropdown-menu";

type AttachmentItem = {
  id: string;
  filename: string;
  byteSize: number;
};

type PublicBoardAttachmentsDropdownProps = {
  boardPath: string;
  postId: string;
  attachments: AttachmentItem[];
};

function DownloadIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
      <path d="M10 3.5v7m0 0 3-3m-3 3-3-3M4.5 13.5v1A1.5 1.5 0 0 0 6 16h8a1.5 1.5 0 0 0 1.5-1.5v-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
      <path d="M6.25 3.75h4.6l2.9 2.9v8.1A1.25 1.25 0 0 1 12.5 16H6.25A1.25 1.25 0 0 1 5 14.75V5A1.25 1.25 0 0 1 6.25 3.75Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M10.75 3.75V6.5H13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function formatByteSize(value: number) {
  if (value >= 1024 * 1024) {
    return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (value >= 1024) {
    return `${Math.round(value / 1024)} KB`;
  }

  return `${value} B`;
}

function buildDownloadHref(boardPath: string, postId: string, item: AttachmentItem) {
  const params = new URLSearchParams({
    boardPath,
    postId,
    assetId: item.id,
    filename: item.filename,
  });
  return `/api/public/attachments/download?${params.toString()}`;
}

function triggerAttachmentDownload(boardPath: string, postId: string, item: AttachmentItem) {
  const anchor = document.createElement("a");
  anchor.href = buildDownloadHref(boardPath, postId, item);
  anchor.download = item.filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
}

export default function PublicBoardAttachmentsDropdown({
  boardPath,
  postId,
  attachments,
}: PublicBoardAttachmentsDropdownProps) {
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const downloadableAttachments = useMemo(
    () => attachments.filter((attachment) => attachment.id.trim().length > 0),
    [attachments],
  );

  if (downloadableAttachments.length === 0) {
    return null;
  }

  async function handleDownloadAll() {
    if (isDownloadingAll) {
      return;
    }

    setIsDownloadingAll(true);

    try {
      for (const attachment of downloadableAttachments) {
        triggerAttachmentDownload(boardPath, postId, attachment);
        await new Promise((resolve) => window.setTimeout(resolve, 180));
      }
    } finally {
      setIsDownloadingAll(false);
    }
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="type-body-small inline-flex shrink-0 cursor-pointer items-center gap-2 self-start font-semibold text-cedar underline underline-offset-4 transition hover:text-site-ink"
          aria-label="첨부파일 다운로드 메뉴 열기"
        >
          <span className="inline-flex h-5 w-5 items-center justify-center text-current">
            <DownloadIcon />
          </span>
          <span>첨부파일 다운로드</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[320px] p-2">
        <DropdownMenuLabel className="px-3 pt-3 pb-2">첨부 파일</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              void handleDownloadAll();
            }}
            disabled={isDownloadingAll}
            className="my-1 flex cursor-pointer items-center justify-between gap-4 rounded-[14px] px-4 py-3 data-[disabled]:cursor-progress data-[disabled]:opacity-70"
          >
            <span className="inline-flex min-w-0 items-center gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cedar/10 text-cedar">
                <DownloadIcon />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-site-ink">
                  {isDownloadingAll ? "일괄 다운로드 중..." : "전체 다운로드"}
                </span>
                <span className="type-label text-site-muted">
                  첨부파일을 순서대로 내려받습니다
                </span>
              </span>
            </span>
            <span className="type-label rounded-full bg-cedar/8 px-2.5 py-1 text-site-muted">
              {downloadableAttachments.length}개
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {downloadableAttachments.map((attachment) => (
            <DropdownMenuItem
              key={attachment.id}
              onSelect={(event) => {
                event.preventDefault();
                triggerAttachmentDownload(boardPath, postId, attachment);
              }}
              className="my-1 flex cursor-pointer items-center justify-between gap-4 rounded-[14px] px-4 py-3"
            >
              <span className="inline-flex min-w-0 items-center gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-site-ink/5 text-site-ink/70">
                  <FileIcon />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="min-w-0 truncate text-site-ink">{attachment.filename}</span>
                  <span className="type-label text-site-muted">개별 다운로드</span>
                </span>
              </span>
              <span className="type-label shrink-0 rounded-full bg-site-ink/5 px-2.5 py-1 text-site-muted">
                {formatByteSize(attachment.byteSize)}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
