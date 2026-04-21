import Link from "next/link";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
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

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(date);
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

function renderBoardPostSummary(boardPath: string, post: PublicBoardPostSummary) {
  return (
    <li key={post.id} className="border-b border-[#e2e8f0] last:border-b-0">
      <Link
        href={getBoardPathHref(boardPath, post.id)}
        className="group flex items-center justify-between gap-4 py-5"
      >
        <span className="type-body-strong min-w-0 flex-1 truncate font-semibold text-[#10213f] group-hover:text-[#2a4f8f]">
          {post.isPinned ? <span className="mr-2 text-[#c2410c]">상단</span> : null}
          {post.title}
        </span>
        <time dateTime={post.createdAt} className="type-body-small shrink-0 text-[#64748b]">
          {formatDate(post.createdAt)}
        </time>
      </Link>
    </li>
  );
}

export default function PublicBoardRenderer(props: PublicBoardRendererProps) {
  if (props.mode === "list") {
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
            <ul>{props.posts.map((post) => renderBoardPostSummary(props.boardPath, post))}</ul>
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
