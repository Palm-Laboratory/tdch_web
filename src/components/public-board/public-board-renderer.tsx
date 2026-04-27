import Link from "next/link";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import PublicBoardDetailActions from "@/components/public-board/public-board-detail-actions";
import PublicBoardAttachmentsDropdown from "@/components/public-board/public-board-attachments-dropdown";
import PublicBoardListControls from "@/components/public-board/public-board-list-controls";
import {
  type PublicBoardPostAsset,
  type PublicBoardPostDetail,
  type PublicBoardPostListResponse,
  type PublicBoardPostSummary,
} from "@/lib/public-board-api";
import { buildUploadPath } from "@/lib/upload-path";

type PublicBoardRendererListProps = {
  mode: "list";
  boardLabel: string;
  boardPath: string;
  posts: PublicBoardPostListResponse["items"];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  searchTitle: string;
};

type PublicBoardRendererDetailProps = {
  mode: "detail";
  boardLabel: string;
  boardPath: string;
  post: PublicBoardPostDetail;
};

type PublicBoardRendererProps = PublicBoardRendererListProps | PublicBoardRendererDetailProps;

function composePublicUploadUrl(storedPath: string) {
  return buildUploadPath(storedPath);
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

  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day} ${formatter.format(date)}`;
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

function BoardSectionHeading({
  id,
  label,
  title,
  as: HeadingTag = "h2",
}: {
  id?: string;
  label: string;
  title: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="type-label font-semibold uppercase tracking-[0.28em] text-site-gold">
          {label}
        </p>
        <HeadingTag
          id={id}
          className="type-section-title font-section-title font-bold tracking-[-0.02em] text-site-ink"
        >
          {title}
        </HeadingTag>
      </div>
      <div className="h-px w-9 bg-site-gold" />
    </div>
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
        return <code key={markKey} className="type-body-small rounded bg-cedar/8 px-1.5 py-0.5 font-mono text-site-ink">{content}</code>;
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
            className="break-words text-cedar underline underline-offset-4 hover:text-site-ink"
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
        return <h1 key={key} style={style} className="type-section-title font-bold text-site-ink">{children}</h1>;
      }
      if (level === 3) {
        return <h3 key={key} style={style} className="type-subsection-title font-bold text-site-ink">{children}</h3>;
      }
      if (level === 4) {
        return <h4 key={key} style={style} className="type-block-title font-bold text-site-ink">{children}</h4>;
      }
      if (level === 5) {
        return <h5 key={key} style={style} className="type-card-title font-bold text-site-ink">{children}</h5>;
      }
      if (level === 6) {
        return <h6 key={key} style={style} className="type-body-strong font-bold text-site-ink">{children}</h6>;
      }
      return <h2 key={key} style={style} className="type-section-title font-bold text-site-ink">{children}</h2>;
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
            className="mt-2 h-4 w-4 rounded border-cedar/20 accent-cedar"
          />
          <div className="min-w-0 flex-1 space-y-2">{children}</div>
        </li>
      );
    case "blockquote":
      return (
        <blockquote key={key} className="border-l-4 border-cedar/35 pl-5 text-site-ink/82">
          {children}
        </blockquote>
      );
    case "codeBlock":
      return (
        <pre key={key} className="type-body-small overflow-x-auto rounded-[8px] border border-cedar/12 bg-cedar/6 px-5 py-4 text-site-ink">
          <code className="font-mono whitespace-pre-wrap">{children}</code>
        </pre>
      );
    case "horizontalRule":
      return <hr key={key} className="my-8 border-cedar/12" />;
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
        <figure key={key} className="overflow-hidden rounded-[8px] border border-cedar/12 bg-cedar/6">
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
        <div key={key} className="overflow-hidden rounded-[8px] bg-site-ink">
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

function renderBoardPostSummary(
  boardPath: string,
  post: PublicBoardPostSummary,
  number: number,
) {
  const itemClassName = post.isPinned
    ? "border-b border-cedar/14 bg-cedar/5 last:border-b-0"
    : "border-b border-cedar/12 last:border-b-0";
  const numberLabel = post.isPinned ? "공지" : String(number);
  const numberClassName = post.isPinned ? "text-cedar" : "text-site-muted";

  return (
    <li key={post.id} className={itemClassName}>
      <Link
        href={getBoardPathHref(boardPath, post.id)}
        className="group block px-3 py-4 md:grid md:grid-cols-[88px_minmax(0,1fr)_120px_132px_88px] md:items-center md:gap-3 md:px-5"
      >
        <div className="grid grid-cols-[52px_minmax(0,1fr)] gap-x-3 gap-y-1 md:hidden">
          <span
            className={`type-body-small row-span-2 flex items-start justify-start pt-0.5 font-medium ${
              post.isPinned
                ? "text-white"
                : numberClassName
            }`}
          >
            {post.isPinned ? (
              <span className="inline-flex min-h-8 items-center rounded-[6px] bg-site-ink px-2.5 text-center leading-none">
                {numberLabel}
              </span>
            ) : (
              numberLabel
            )}
          </span>
          <span className="flex min-w-0 items-center gap-1.5">
            <span className="type-body min-w-0 truncate font-semibold text-site-ink group-hover:text-cedar">
              {post.title}
            </span>
            {post.hasAttachments ? (
              <span className="shrink-0 text-site-muted" title="첨부파일 포함">
                <AttachmentIndicatorIcon />
              </span>
            ) : null}
            {post.hasInlineImage ? (
              <span className="shrink-0 text-site-muted" title="이미지 포함">
                <ImageIndicatorIcon />
              </span>
            ) : null}
            {post.hasVideoEmbed ? (
              <span className="shrink-0 text-site-muted" title="영상 포함">
                <VideoIndicatorIcon />
              </span>
            ) : null}
          </span>
          <span className="type-body-small flex min-w-0 items-center gap-1 whitespace-nowrap text-site-muted">
            <span className="truncate">{post.authorName || "-"}</span>
            <span className="text-cedar/30">/</span>
            <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
            <span className="text-cedar/30">/</span>
            <span>조회 {post.viewCount.toLocaleString("ko-KR")}</span>
          </span>
        </div>
        <span className={`hidden type-body-small text-center font-medium md:block ${numberClassName}`}>
          {numberLabel}
        </span>
        <span className="hidden min-w-0 items-center gap-2 md:flex">
          <span className="type-body min-w-0 truncate font-semibold text-site-ink group-hover:text-cedar">
            {post.title}
          </span>
            {post.hasAttachments ? (
              <span className="shrink-0 text-site-muted" title="첨부파일 포함">
                <AttachmentIndicatorIcon />
              </span>
            ) : null}
            {post.hasInlineImage ? (
              <span className="shrink-0 text-site-muted" title="이미지 포함">
                <ImageIndicatorIcon />
              </span>
            ) : null}
            {post.hasVideoEmbed ? (
            <span className="shrink-0 text-site-muted" title="영상 포함">
              <VideoIndicatorIcon />
            </span>
          ) : null}
        </span>
        <span className="hidden type-body-small truncate text-center text-site-muted md:block">
          {post.authorName || "-"}
        </span>
        <time dateTime={post.createdAt} className="hidden type-body-small text-center text-site-muted md:block">
          {formatDate(post.createdAt)}
        </time>
        <span className="hidden type-body-small text-center text-site-muted md:block">
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
          <header>
            <BoardSectionHeading id="public-board-list-title" label="BOARD" title={props.boardLabel} />
          </header>
          <PublicBoardListControls totalItems={props.totalItems} pageSize={props.pageSize} searchTitle={props.searchTitle} />
          {props.posts.length > 0 ? (
            <>
              <div className="border-b border-site-ink">
                <div className="hidden gap-3 px-3 py-3 text-center md:grid md:grid-cols-[88px_minmax(0,1fr)_120px_132px_88px] md:px-5">
                  <span className="type-label text-center font-semibold tracking-[0.08em] text-site-muted">번호</span>
                  <span className="type-label text-center font-semibold tracking-[0.08em] text-site-muted">제목</span>
                  <span className="type-label text-center font-semibold tracking-[0.08em] text-site-muted">작성자</span>
                  <span className="type-label text-center font-semibold tracking-[0.08em] text-site-muted">등록일</span>
                  <span className="type-label text-center font-semibold tracking-[0.08em] text-site-muted">조회수</span>
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
                <nav aria-label={`${props.boardLabel} 페이지 이동`} className="mt-10 flex items-center justify-center gap-2 pt-2">
                  <Link
                    href={getBoardListPageHref(props.boardPath, props.currentPage - 1)}
                    aria-disabled={props.currentPage <= 1}
                    className={`type-body-small inline-flex items-center justify-center rounded-full border px-[14px] py-[10px] leading-[1] transition ${props.currentPage <= 1
                        ? "pointer-events-none border-cedar/12 text-site-muted/60"
                        : "border-cedar/12 text-site-ink hover:bg-cedar/6"
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
                          className={`type-body-small inline-flex h-8 w-8 items-center justify-center rounded-full border leading-none transition ${isCurrent
                              ? "border-site-ink bg-site-ink text-white"
                              : "border-cedar/12 text-site-ink hover:bg-cedar/6"
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
                    className={`type-body-small inline-flex items-center justify-center rounded-full border px-[14px] py-[10px] leading-[1] transition ${props.currentPage >= props.totalPages
                        ? "pointer-events-none border-cedar/12 text-site-muted/60"
                        : "border-cedar/12 text-site-ink hover:bg-cedar/6"
                      }`}
                  >
                    다음
                  </Link>
                </nav>
              ) : null}
            </>
          ) : (
            <div className="mt-8 rounded-[4px] border border-dashed border-cedar/18 px-6 py-14 text-center">
              <p className="type-body-small text-site-muted">등록된 게시글이 없습니다.</p>
            </div>
          )}
        </section>
      </main>
    );
  }

  const fileAttachments = props.post.assets.filter((asset) => asset.kind === "FILE_ATTACHMENT");

  return (
    <main className="bg-white pb-20">
      <article className="section-shell section-shell--narrow pt-10 md:pt-16">
        <header className="border-b border-cedar/12 pb-8">
          <Link href={props.boardPath} className="type-body-small font-semibold text-cedar underline-offset-4 hover:underline">
            {props.boardLabel}
          </Link>
          <div className="mt-5">
            <BoardSectionHeading id="public-board-detail-title" label="BOARD" title={props.post.title} as="h1" />
          </div>
          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="type-body-small text-site-muted">
              {props.post.authorName || "-"} {" | "} 등록일:{" "}
              <time dateTime={props.post.createdAt}>{formatDate(props.post.createdAt)}</time>
              {" | "} 조회수: {props.post.viewCount.toLocaleString("ko-KR")}
            </p>
            {fileAttachments.length > 0 ? (
              <PublicBoardAttachmentsDropdown
                boardPath={props.boardPath}
                postId={props.post.id}
                attachments={fileAttachments.map((asset) => ({
                  id: asset.id,
                  filename: asset.originalFilename,
                  byteSize: asset.byteSize,
                }))}
              />
            ) : null}
          </div>
        </header>

        <div className="type-body prose prose-slate mt-10 max-w-none text-site-ink/82">
          {renderTiptapDocument(props.post.contentJson)}
        </div>
        <div className="mt-10 border-b border-cedar/12" />
        <PublicBoardDetailActions
          boardPath={props.boardPath}
          previousPost={props.post.previousPost}
          nextPost={props.post.nextPost}
        />
      </article>
    </main>
  );
}
