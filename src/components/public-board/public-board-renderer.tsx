import Link from "next/link";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import PublicBoardListControls from "@/components/public-board/public-board-list-controls";
import {
  type PublicBoardPostAsset,
  type PublicBoardPostDetail,
  type PublicBoardPostListResponse,
  type PublicBoardPostSummary,
} from "@/lib/public-board-api";
import { joinApiUrl } from "@/lib/api-base-url";
import { PUBLIC_API_BASE_URL } from "@/lib/site-config";

type PublicBoardRendererListProps = {
  mode: "list";
  boardLabel: string;
  boardPath: string;
  posts: PublicBoardPostListResponse["items"];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

type PublicBoardRendererDetailProps = {
  mode: "detail";
  boardLabel: string;
  boardPath: string;
  post: PublicBoardPostDetail;
};

type PublicBoardRendererProps = PublicBoardRendererListProps | PublicBoardRendererDetailProps;

function composePublicUploadUrl(storedPath: string) {
  const cleanPath = storedPath.replace(/^\/+/, "");
  return cleanPath ? joinApiUrl(PUBLIC_API_BASE_URL, `/upload/${cleanPath}`) : "";
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const now = new Date();
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isSameDay) {
    return formatter.format(date);
  }

  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day} ${formatter.format(date)}`;
}

function normalizeYouTubeVideoId(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const input = value.trim();

  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input;
  }

  try {
    const url = new URL(input);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const videoId = url.pathname.replace(/^\/+/, "").split("/")[0] ?? "";
      return /^[a-zA-Z0-9_-]{11}$/.test(videoId) ? videoId : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com" || host === "youtube-nocookie.com") {
      if (url.pathname === "/watch") {
        const videoId = url.searchParams.get("v") ?? "";
        return /^[a-zA-Z0-9_-]{11}$/.test(videoId) ? videoId : null;
      }

      const embedMatch = url.pathname.match(/^\/(?:embed|shorts)\/([^/?#]+)/);
      return embedMatch && /^[a-zA-Z0-9_-]{11}$/.test(embedMatch[1]) ? embedMatch[1] : null;
    }
  } catch {
    return null;
  }

  return null;
}

function storedPathFromEditorImageSource(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  const sourceWithoutHash = value.split("#")[0] ?? "";
  return sourceWithoutHash.replace(/^\/?upload\/+/, "").replace(/^\/+/, "");
}

function getAttachmentUrl(asset: PublicBoardPostAsset) {
  return asset.publicUrl || composePublicUploadUrl(asset.storedPath);
}

function getBoardPathHref(boardPath: string, postId: string) {
  return `${boardPath.replace(/\/+$/, "")}/${postId}`;
}

function getBoardListPageHref(boardPath: string, page: number) {
  const normalizedPath = boardPath.replace(/\/+$/, "");
  return page <= 1 ? normalizedPath : `${normalizedPath}?page=${page}`;
}

function getBoardPostNumber(currentPage: number, pageSize: number, totalItems: number, index: number) {
  return totalItems - (currentPage - 1) * pageSize - index;
}

function ImageIndicatorIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-5 fill-current">
      <path d="M4 4.75A1.75 1.75 0 0 1 5.75 3h8.5A1.75 1.75 0 0 1 16 4.75v10.5A1.75 1.75 0 0 1 14.25 17h-8.5A1.75 1.75 0 0 1 4 15.25zm1.5 8.82 2.28-2.73a.75.75 0 0 1 1.13-.03l1.54 1.76 2.2-2.57a.75.75 0 0 1 1.14 0l.71.83V4.75a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25zm9 1.68v-2.11l-1.28-1.5-2.24 2.62a.75.75 0 0 1-1.14 0L8.31 12.5l-2.81 3.37a.25.25 0 0 0 .25.13h8.5a.25.25 0 0 0 .25-.25M8.25 7.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5" />
    </svg>
  );
}

function VideoIndicatorIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M10 3.25c-3.73 0-5.98.2-7 .42a1.6 1.6 0 0 0-1.25 1.24C1.5 5.94 1.25 7.63 1.25 10s.25 4.06.5 5.09A1.6 1.6 0 0 0 3 16.33c1.02.22 3.27.42 7 .42s5.98-.2 7-.42a1.6 1.6 0 0 0 1.25-1.24c.25-1.03.5-2.72.5-5.09s-.25-4.06-.5-5.09A1.6 1.6 0 0 0 17 3.67c-1.02-.22-3.27-.42-7-.42m-1.1 4.24 4.22 2.31a.23.23 0 0 1 0 .4L8.9 12.51A.23.23 0 0 1 8.56 12V8a.23.23 0 0 1 .34-.2" />
    </svg>
  );
}

function AttachmentIndicatorIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M13.85 5.15a3 3 0 0 0-4.24 0l-5.1 5.1a4.25 4.25 0 0 0 6.01 6.01l5.6-5.6a2.75 2.75 0 0 0-3.89-3.89L6.79 12.2a1.5 1.5 0 1 0 2.12 2.12l4.2-4.2.88.88-4.2 4.2a2.75 2.75 0 1 1-3.89-3.89l5.44-5.44a4 4 0 1 1 5.66 5.66l-5.6 5.6a5.5 5.5 0 0 1-7.78-7.78l5.1-5.1a4.25 4.25 0 0 1 6.01 6.01l-5.1 5.1-.88-.88 5.1-5.1a3 3 0 0 0 0-4.24" />
    </svg>
  );
}

function getTextAlignStyle(attrs: Record<string, unknown> | undefined): CSSProperties | undefined {
  const align = attrs?.textAlign;
  return align === "center" || align === "right" || align === "justify" ? { textAlign: align } : undefined;
}

function getSafeLinkHref(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const href = value.trim();
  if (!href) {
    return null;
  }

  if (href.startsWith("/") || href.startsWith("#")) {
    return href;
  }

  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:" || url.protocol === "mailto:" || url.protocol === "tel:"
      ? href
      : null;
  } catch {
    return null;
  }
}

function getHighlightStyle(attrs: Record<string, unknown> | undefined): CSSProperties | undefined {
  const color = attrs?.color;
  if (typeof color !== "string") {
    return undefined;
  }

  const value = color.trim();
  if (/^#[0-9a-fA-F]{3,8}$/.test(value) || /^var\(--tt-color-highlight-[a-z-]+\)$/.test(value)) {
    return { backgroundColor: value };
  }

  return undefined;
}

function renderInlineText(text: string, key: string, marks: unknown[] = []): ReactNode {
  return marks.reduce<ReactNode>((content, mark, markIndex) => {
    if (!mark || typeof mark !== "object") {
      return content;
    }

    const candidate = mark as { type?: string; attrs?: Record<string, unknown> };
    const markKey = `${key}:mark-${markIndex}`;

    switch (candidate.type) {
      case "bold":
        return <strong key={markKey}>{content}</strong>;
      case "italic":
        return <em key={markKey}>{content}</em>;
      case "strike":
        return <s key={markKey}>{content}</s>;
      case "underline":
        return <u key={markKey}>{content}</u>;
      case "code":
        return <code key={markKey} className="type-body-small rounded bg-[#f1f5f9] px-1.5 py-0.5 font-mono text-[#1e293b]">{content}</code>;
      case "highlight":
        return <mark key={markKey} style={getHighlightStyle(candidate.attrs)} className="rounded px-1">{content}</mark>;
      case "subscript":
        return <sub key={markKey}>{content}</sub>;
      case "superscript":
        return <sup key={markKey}>{content}</sup>;
      case "link": {
        const href = getSafeLinkHref(candidate.attrs?.href);
        if (!href) {
          return content;
        }

        return (
          <a
            key={markKey}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noreferrer" : undefined}
            className="break-words text-[#4f46e5] underline underline-offset-4 hover:text-[#3730a3]"
          >
            {content}
          </a>
        );
      }
      case "fontSize": {
        const size = typeof candidate.attrs?.size === "string" ? candidate.attrs.size : "";
        return /^(13|16|20|24)px$/.test(size) ? <span key={markKey} style={{ fontSize: size }}>{content}</span> : content;
      }
      default:
        return content;
    }
  }, <span key={key}>{text}</span>);
}

function renderTiptapNode(node: unknown, key: string): ReactNode {
  if (!node || typeof node !== "object") {
    return null;
  }

  const candidate = node as {
    type?: string;
    text?: string;
    attrs?: Record<string, unknown>;
    content?: unknown[];
    marks?: unknown[];
  };

  if (typeof candidate.text === "string" && (!candidate.type || candidate.type === "text")) {
    return renderInlineText(candidate.text, key, candidate.marks);
  }

  const children = Array.isArray(candidate.content)
    ? candidate.content.map((child, childIndex) => renderTiptapNode(child, `${key}:${childIndex}`))
    : [];

  switch (candidate.type) {
    case "doc":
      return <div key={key} className="space-y-5">{children}</div>;
    case "paragraph":
      return <p key={key} style={getTextAlignStyle(candidate.attrs)}>{children.length > 0 ? children : <br />}</p>;
    case "heading": {
      const levelValue = candidate.attrs?.level;
      const level = typeof levelValue === "number" && levelValue >= 1 && levelValue <= 6 ? levelValue : 2;
      const style = getTextAlignStyle(candidate.attrs);
      if (level === 1) {
        return <h1 key={key} style={style} className="type-section-title font-bold text-[#10213f]">{children}</h1>;
      }
      if (level === 3) {
        return <h3 key={key} style={style} className="type-subsection-title font-bold text-[#10213f]">{children}</h3>;
      }
      if (level === 4) {
        return <h4 key={key} style={style} className="type-block-title font-bold text-[#10213f]">{children}</h4>;
      }
      if (level === 5) {
        return <h5 key={key} style={style} className="type-card-title font-bold text-[#10213f]">{children}</h5>;
      }
      if (level === 6) {
        return <h6 key={key} style={style} className="type-body-strong font-bold text-[#10213f]">{children}</h6>;
      }
      return <h2 key={key} style={style} className="type-section-title font-bold text-[#10213f]">{children}</h2>;
    }
    case "bulletList":
      return <ul key={key} className="list-disc space-y-2 pl-6">{children}</ul>;
    case "orderedList":
      return <ol key={key} className="list-decimal space-y-2 pl-6">{children}</ol>;
    case "listItem":
      return <li key={key}>{children}</li>;
    case "taskList":
      return <ul key={key} className="space-y-2 pl-0">{children}</ul>;
    case "taskItem":
      return (
        <li key={key} className="flex list-none items-start gap-3">
          <input
            type="checkbox"
            checked={candidate.attrs?.checked === true}
            readOnly
            aria-label="완료 여부"
            className="mt-2 h-4 w-4 rounded border-[#cbd5e1] accent-[#2a4f8f]"
          />
          <div className="min-w-0 flex-1 space-y-2">{children}</div>
        </li>
      );
    case "blockquote":
      return (
        <blockquote key={key} className="border-l-4 border-[#9bb6de] pl-5 text-[#334155]">
          {children}
        </blockquote>
      );
    case "codeBlock":
      return (
        <pre key={key} className="type-body-small overflow-x-auto rounded-[8px] border border-[#e2e8f0] bg-[#f8fafc] px-5 py-4 text-[#1e293b]">
          <code className="font-mono whitespace-pre-wrap">{children}</code>
        </pre>
      );
    case "horizontalRule":
      return <hr key={key} className="my-8 border-[#e2e8f0]" />;
    case "hardBreak":
      return <br key={key} />;
    case "image": {
      const storedPathValue = candidate.attrs?.storedPath;
      const storedPath = typeof storedPathValue === "string" && storedPathValue
        ? storedPathValue
        : storedPathFromEditorImageSource(candidate.attrs?.src);
      const src = composePublicUploadUrl(storedPath);
      const alt = typeof candidate.attrs?.alt === "string" ? candidate.attrs.alt : "";
      const widthValue = candidate.attrs?.width;
      const heightValue = candidate.attrs?.height;
      const width = typeof widthValue === "number" ? widthValue : undefined;
      const height = typeof heightValue === "number" ? heightValue : undefined;

      if (!src) {
        return null;
      }

      return (
        <figure key={key} className="overflow-hidden rounded-[8px] border border-[#e2e8f0] bg-[#f8fafc]">
          <Image
            src={src}
            alt={alt}
            width={width ?? 1200}
            height={height ?? 675}
            unoptimized
            className="h-auto w-full object-contain"
          />
        </figure>
      );
    }
    case "youtube":
    case "youtubeEmbed": {
      const videoId = normalizeYouTubeVideoId(candidate.attrs?.src ?? candidate.attrs?.videoId);

      if (!videoId) {
        return null;
      }

      return (
        <div key={key} className="overflow-hidden rounded-[8px] bg-[#111827]">
          <div className="relative aspect-video w-full">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}`}
              title="YouTube video"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      );
    }
    default:
      if (children.length > 0) {
        return <div key={key}>{children}</div>;
      }

      if (typeof candidate.text === "string") {
        return renderInlineText(candidate.text, key, candidate.marks);
      }

      return null;
  }
}

function renderTiptapDocument(document: PublicBoardPostDetail["contentJson"] | null) {
  if (!document || typeof document !== "object") {
    return null;
  }

  const root = document as { content?: unknown[] };
  const nodes = Array.isArray(root.content) ? root.content : [];

  return nodes.map((node, index) => renderTiptapNode(node, `node-${index}`));
}

function renderAttachment(asset: PublicBoardPostAsset) {
  if (asset.kind !== "FILE_ATTACHMENT") {
    return null;
  }

  const href = getAttachmentUrl(asset);
  if (!href) {
    return null;
  }

  const sizeLabel = `${asset.byteSize.toLocaleString("ko-KR")} bytes`;
  const dimensions =
    asset.width && asset.height ? `${asset.width} × ${asset.height}` : asset.width || asset.height ? "이미지" : null;

  return (
    <li key={asset.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-[#e2e8f0] py-3 last:border-b-0">
      <a href={href} target="_blank" rel="noreferrer" className="font-semibold text-[#2a4f8f] underline-offset-4 hover:underline">
        {asset.originalFilename}
      </a>
      <span className="type-label text-[#64748b]">{asset.mimeType}</span>
      <span className="type-label text-[#64748b]">{sizeLabel}</span>
      {dimensions ? <span className="type-label text-[#64748b]">{dimensions}</span> : null}
    </li>
  );
}

function renderBoardPostSummary(
  boardPath: string,
  post: PublicBoardPostSummary,
  number: number,
) {
  const itemClassName = post.isPinned
    ? "border-b border-[#d7dde6] bg-[#f5f7fa] last:border-b-0"
    : "border-b border-[#e2e8f0] last:border-b-0";
  const numberLabel = post.isPinned ? "공지" : String(number);
  const numberClassName = post.isPinned ? "text-[#c2410c]" : "text-[#64748b]";

  return (
    <li key={post.id} className={itemClassName}>
      <Link
        href={getBoardPathHref(boardPath, post.id)}
        className="group grid grid-cols-[72px_minmax(0,1fr)_84px_108px_72px] items-center gap-3 px-3 py-4 md:grid-cols-[88px_minmax(0,1fr)_120px_132px_88px] md:px-5"
      >
        <span className={`type-body-small text-center font-medium ${numberClassName}`}>
          {numberLabel}
        </span>
        <span className="flex min-w-0 items-center gap-2">
          <span className="type-body min-w-0 truncate font-semibold text-[#10213f] group-hover:text-[#2a4f8f]">
            {post.title}
          </span>
          {post.hasAttachments ? (
            <span className="shrink-0 text-[#7c8aa0]" title="첨부파일 포함">
              <AttachmentIndicatorIcon />
            </span>
          ) : null}
          {post.hasInlineImage ? (
            <span className="shrink-0 text-[#7c8aa0]" title="이미지 포함">
              <ImageIndicatorIcon />
            </span>
          ) : null}
          {post.hasVideoEmbed ? (
            <span className="shrink-0 text-[#7c8aa0]" title="영상 포함">
              <VideoIndicatorIcon />
            </span>
          ) : null}
        </span>
        <span className="type-body-small truncate text-center text-[#64748b]">
          {post.authorName || "-"}
        </span>
        <time dateTime={post.createdAt} className="type-body-small text-center text-[#64748b]">
          {formatDate(post.createdAt)}
        </time>
        <span className="type-body-small text-center text-[#64748b]">
          {post.viewCount.toLocaleString("ko-KR")}
        </span>
      </Link>
    </li>
  );
}

function buildPaginationPages(currentPage: number, totalPages: number) {
  const windowSize = 5;
  const halfWindow = Math.floor(windowSize / 2);
  let startPage = Math.max(1, currentPage - halfWindow);
  const endPage = Math.min(totalPages, startPage + windowSize - 1);

  startPage = Math.max(1, endPage - windowSize + 1);

  return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
}

export default function PublicBoardRenderer(props: PublicBoardRendererProps) {
  if (props.mode === "list") {
    const paginationPages = buildPaginationPages(props.currentPage, props.totalPages);

    return (
      <main className="bg-white pb-20">
        <section className="section-shell section-shell--narrow pt-10 md:pt-16">
          <header className="border-b border-site-ink pb-8">
            <div className="flex flex-col gap-2">
              <p className="type-label font-semibold uppercase tracking-[0.28em] text-site-gold">board</p>
              <h2
                id="public-board-list-title"
                className="type-section-title font-section-title font-bold tracking-[-0.02em] text-site-ink"
              >
                {props.boardLabel}
              </h2>
            </div>
          </header>
          {props.posts.length > 0 ? (
            <>
              <PublicBoardListControls totalItems={props.totalItems} pageSize={props.pageSize} />
              <div className="border-b border-site-ink">
                <div className="grid grid-cols-[72px_minmax(0,1fr)_84px_108px_72px] gap-3 px-3 py-3 text-center md:grid-cols-[88px_minmax(0,1fr)_120px_132px_88px] md:px-5">
                  <span className="type-label text-center font-semibold tracking-[0.08em] text-[#64748b]">번호</span>
                  <span className="type-label text-center font-semibold tracking-[0.08em] text-[#64748b]">제목</span>
                  <span className="type-label text-center font-semibold tracking-[0.08em] text-[#64748b]">작성자</span>
                  <span className="type-label text-center font-semibold tracking-[0.08em] text-[#64748b]">등록일</span>
                  <span className="type-label text-center font-semibold tracking-[0.08em] text-[#64748b]">조회수</span>
                </div>
              </div>
              <ul>
                {props.posts.map((post, index) =>
                  renderBoardPostSummary(
                    props.boardPath,
                    post,
                    getBoardPostNumber(props.currentPage, props.pageSize, props.totalItems, index),
                  ),
                )}
              </ul>
              {props.totalPages > 1 ? (
                <nav aria-label={`${props.boardLabel} 페이지 이동`} className="mt-10 flex items-center justify-center gap-2">
                  <Link
                    href={getBoardListPageHref(props.boardPath, props.currentPage - 1)}
                    aria-disabled={props.currentPage <= 1}
                    className={`type-body-small inline-flex min-w-20 items-center justify-center rounded-full border px-4 py-2 transition ${props.currentPage <= 1
                        ? "pointer-events-none border-[#d7dde6] text-[#9aa7b8]"
                        : "border-[#d7dde6] text-[#334155] hover:border-[#2a4f8f] hover:text-[#2a4f8f]"
                      }`}
                  >
                    이전
                  </Link>
                  <div className="flex items-center gap-2">
                    {paginationPages.map((page) => {
                      const isCurrent = page === props.currentPage;
                      return (
                        <Link
                          key={page}
                          href={getBoardListPageHref(props.boardPath, page)}
                          aria-current={isCurrent ? "page" : undefined}
                          className={`type-body-small inline-flex h-10 w-10 items-center justify-center rounded-full border transition ${isCurrent
                              ? "border-[#10213f] bg-[#10213f] text-white"
                              : "border-[#d7dde6] text-[#334155] hover:border-[#2a4f8f] hover:text-[#2a4f8f]"
                            }`}
                        >
                          {page}
                        </Link>
                      );
                    })}
                  </div>
                  <Link
                    href={getBoardListPageHref(props.boardPath, props.currentPage + 1)}
                    aria-disabled={props.currentPage >= props.totalPages}
                    className={`type-body-small inline-flex min-w-20 items-center justify-center rounded-full border px-4 py-2 transition ${props.currentPage >= props.totalPages
                        ? "pointer-events-none border-[#d7dde6] text-[#9aa7b8]"
                        : "border-[#d7dde6] text-[#334155] hover:border-[#2a4f8f] hover:text-[#2a4f8f]"
                      }`}
                  >
                    다음
                  </Link>
                </nav>
              ) : null}
            </>
          ) : (
            <p className="type-body-small py-16 text-center text-[#64748b]">등록된 게시글이 없습니다.</p>
          )}
        </section>
      </main>
    );
  }

  const fileAttachments = props.post.assets.filter((asset) => asset.kind === "FILE_ATTACHMENT");

  return (
    <main className="bg-white pb-20">
      <article className="section-shell section-shell--narrow pt-10 md:pt-16">
        <header className="border-b border-[#e2e8f0] pb-8">
          <Link href={props.boardPath} className="type-body-small font-semibold text-[#2a4f8f] underline-offset-4 hover:underline">
            {props.boardLabel}
          </Link>
          <div className="mt-5 flex flex-col gap-2">
            <p className="type-label font-semibold uppercase tracking-[0.28em] text-site-gold">board</p>
            <h2
              id="public-board-detail-title"
              className="type-section-title font-section-title font-bold tracking-[-0.02em] text-site-ink"
            >
              {props.post.title}
            </h2>
          </div>
          <time dateTime={props.post.createdAt} className="type-body-small mt-3 block text-[#64748b]">
            {formatDate(props.post.createdAt)}
          </time>
        </header>

        <div className="type-body prose prose-slate mt-10 max-w-none text-[#334155]">
          {renderTiptapDocument(props.post.contentJson)}
        </div>

        {fileAttachments.length > 0 ? (
          <section className="mt-12 border-t border-[#10213f] pt-6">
            <h2 className="type-block-title font-bold text-[#10213f]">첨부 파일</h2>
            <ul className="mt-4">{fileAttachments.map(renderAttachment)}</ul>
          </section>
        ) : null}
      </article>
    </main>
  );
}
