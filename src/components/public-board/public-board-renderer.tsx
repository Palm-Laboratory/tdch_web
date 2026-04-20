import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import {
  type PublicBoardPostAsset,
  type PublicBoardPostDetail,
  type PublicBoardPostListResponse,
  type PublicBoardPostSummary,
} from "@/lib/public-board-api";
import { PUBLIC_MEDIA_API_BASE_URL } from "@/lib/site-config";

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

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function composePublicMediaUrl(storedPath: string) {
  const cleanPath = storedPath.replace(/^\/+/, "");
  return cleanPath ? `${trimTrailingSlash(PUBLIC_MEDIA_API_BASE_URL)}/media/${cleanPath}` : "";
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

  const videoId = value.trim();
  return /^[a-zA-Z0-9_-]{11}$/.test(videoId) ? videoId : null;
}

function getAttachmentUrl(asset: PublicBoardPostAsset) {
  return asset.publicUrl || composePublicMediaUrl(asset.storedPath);
}

function getBoardPathHref(boardPath: string, postId: string) {
  return `${boardPath.replace(/\/+$/, "")}/${postId}`;
}

function renderInlineText(text: string, key: string): ReactNode {
  return <span key={key}>{text}</span>;
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
  };

  if (typeof candidate.text === "string" && (!candidate.type || candidate.type === "text")) {
    return renderInlineText(candidate.text, key);
  }

  const children = Array.isArray(candidate.content)
    ? candidate.content.map((child, childIndex) => renderTiptapNode(child, `${key}:${childIndex}`))
    : [];

  switch (candidate.type) {
    case "doc":
      return <div key={key} className="space-y-5">{children}</div>;
    case "paragraph":
      return <p key={key}>{children.length > 0 ? children : <br />}</p>;
    case "heading": {
      const levelValue = candidate.attrs?.level;
      const level = typeof levelValue === "number" && levelValue >= 1 && levelValue <= 6 ? levelValue : 2;
      if (level === 1) {
        return <h1 key={key} className="text-[28px] font-bold leading-[1.3] text-[#10213f]">{children}</h1>;
      }
      if (level === 3) {
        return <h3 key={key} className="text-[22px] font-bold leading-[1.35] text-[#10213f]">{children}</h3>;
      }
      if (level === 4) {
        return <h4 key={key} className="text-[19px] font-bold leading-[1.4] text-[#10213f]">{children}</h4>;
      }
      if (level === 5) {
        return <h5 key={key} className="text-[17px] font-bold leading-[1.45] text-[#10213f]">{children}</h5>;
      }
      if (level === 6) {
        return <h6 key={key} className="text-[15px] font-bold leading-[1.5] text-[#10213f]">{children}</h6>;
      }
      return <h2 key={key} className="text-[25px] font-bold leading-[1.35] text-[#10213f]">{children}</h2>;
    }
    case "bulletList":
      return <ul key={key} className="list-disc space-y-2 pl-6">{children}</ul>;
    case "orderedList":
      return <ol key={key} className="list-decimal space-y-2 pl-6">{children}</ol>;
    case "listItem":
      return <li key={key}>{children}</li>;
    case "blockquote":
      return (
        <blockquote key={key} className="border-l-4 border-[#9bb6de] pl-5 text-[#334155]">
          {children}
        </blockquote>
      );
    case "hardBreak":
      return <br key={key} />;
    case "image": {
      const storedPathValue = candidate.attrs?.storedPath;
      const storedPath = typeof storedPathValue === "string" ? storedPathValue : "";
      const src = composePublicMediaUrl(storedPath);
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
    case "youtubeEmbed": {
      const videoId = normalizeYouTubeVideoId(candidate.attrs?.videoId);

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
        return renderInlineText(candidate.text, key);
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
      <span className="text-[12px] text-[#64748b]">{asset.mimeType}</span>
      <span className="text-[12px] text-[#64748b]">{sizeLabel}</span>
      {dimensions ? <span className="text-[12px] text-[#64748b]">{dimensions}</span> : null}
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
        <span className="min-w-0 flex-1 truncate text-[16px] font-semibold text-[#10213f] group-hover:text-[#2a4f8f]">
          {post.title}
        </span>
        <time dateTime={post.createdAt} className="shrink-0 text-[13px] text-[#64748b]">
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
        <section className="section-shell pt-12">
          <header className="border-b border-[#10213f] pb-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#64748b]">Board</p>
            <h1 className="mt-2 text-[34px] font-bold leading-tight text-[#10213f]">{props.boardLabel}</h1>
          </header>
          {props.posts.length > 0 ? (
            <ul>{props.posts.map((post) => renderBoardPostSummary(props.boardPath, post))}</ul>
          ) : (
            <p className="py-16 text-center text-[15px] text-[#64748b]">등록된 게시글이 없습니다.</p>
          )}
        </section>
      </main>
    );
  }

  const fileAttachments = props.post.assets.filter((asset) => asset.kind === "FILE_ATTACHMENT");

  return (
    <main className="bg-white pb-20">
      <article className="section-shell pt-12">
        <header className="border-b border-[#e2e8f0] pb-8">
          <Link href={props.boardPath} className="text-[13px] font-semibold text-[#2a4f8f] underline-offset-4 hover:underline">
            {props.boardLabel}
          </Link>
          <h1 className="mt-4 text-[32px] font-bold leading-tight text-[#10213f] md:text-[28px]">
            {props.post.title}
          </h1>
          <time dateTime={props.post.createdAt} className="mt-3 block text-[14px] text-[#64748b]">
            {formatDate(props.post.createdAt)}
          </time>
        </header>

        <div className="prose prose-slate mt-10 max-w-none text-[16px] leading-8 text-[#334155]">
          {renderTiptapDocument(props.post.contentJson)}
        </div>

        {fileAttachments.length > 0 ? (
          <section className="mt-12 border-t border-[#10213f] pt-6">
            <h2 className="text-[18px] font-bold text-[#10213f]">첨부 파일</h2>
            <ul className="mt-4">{fileAttachments.map(renderAttachment)}</ul>
          </section>
        ) : null}
      </article>
    </main>
  );
}
