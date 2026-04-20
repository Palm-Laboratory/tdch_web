"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useState } from "react";

import {
  createEmptyTiptapDocument,
  createImageNode,
  createYoutubeEmbedNode,
  extractYouTubeVideoId,
  type TiptapDocument,
} from "@/lib/admin-board-editor-content";
import type { AdminUploadAssetMetadata } from "@/lib/admin-upload-client";

interface BoardPostEditorProps {
  value: TiptapDocument | Record<string, unknown>;
  onChange: (value: TiptapDocument | Record<string, unknown>, html: string) => void;
  onImageUpload: (file: File) => Promise<AdminUploadAssetMetadata>;
  disabled?: boolean;
}

const YoutubeEmbed = Node.create({
  name: "youtubeEmbed",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      videoId: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-youtube-embed]" }];
  },

  renderHTML({ HTMLAttributes }) {
    const videoId = typeof HTMLAttributes.videoId === "string" ? HTMLAttributes.videoId : "";
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-youtube-embed": videoId,
        class: "tdch-youtube-embed",
      }),
      [
        "iframe",
        {
          src: `https://www.youtube.com/embed/${videoId}`,
          title: "YouTube video",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          allowfullscreen: "true",
        },
      ],
    ];
  },
});

export default function BoardPostEditor({
  value,
  onChange,
  onImageUpload,
  disabled = false,
}: BoardPostEditorProps) {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            assetId: { default: null },
            storedPath: { default: null },
            alt: { default: "" },
          };
        },
      }),
      YoutubeEmbed,
    ],
    content: value,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getJSON() as TiptapDocument, currentEditor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[320px] rounded-lg border border-[#d5deea] bg-white px-4 py-3 text-[14px] leading-7 text-[#132033] outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    editor.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentValue = editor.getJSON();
    if (JSON.stringify(currentValue) !== JSON.stringify(value)) {
      editor.commands.setContent(value || createEmptyTiptapDocument(), { emitUpdate: false });
    }
  }, [editor, value]);

  const handleImageChange = async (file: File | undefined) => {
    if (!file || !editor) {
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const asset = await onImageUpload(file);
      editor.chain().focus().insertContent(createImageNode({
        assetId: asset.assetId,
        storedPath: asset.storedPath,
        alt: asset.originalFilename,
      })).run();
      setMessage("이미지를 본문에 삽입했습니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const handleYoutubeInsert = () => {
    if (!editor) {
      return;
    }

    const videoId = extractYouTubeVideoId(youtubeUrl);

    if (!videoId) {
      setMessage("유효한 유튜브 URL 또는 영상 ID를 입력해 주세요.");
      return;
    }

    editor.chain().focus().insertContent(createYoutubeEmbedNode(videoId)).run();
    setYoutubeUrl("");
    setMessage("유튜브 동영상을 본문에 삽입했습니다.");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex cursor-pointer items-center rounded-lg border border-[#d7e3f4] bg-white px-3 py-2 text-[12px] font-semibold text-[#334155]">
          이미지 삽입
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="sr-only"
            disabled={disabled || uploading}
            onChange={(event) => {
              void handleImageChange(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </label>
        <input
          value={youtubeUrl}
          onChange={(event) => setYoutubeUrl(event.target.value)}
          placeholder="YouTube URL 또는 영상 ID"
          className="min-w-[240px] flex-1 rounded-lg border border-[#d5deea] px-3 py-2 text-[13px]"
          disabled={disabled}
        />
        <button
          type="button"
          onClick={handleYoutubeInsert}
          disabled={disabled}
          className="rounded-lg border border-[#d7e3f4] bg-white px-3 py-2 text-[12px] font-semibold text-[#334155] disabled:opacity-60"
        >
          유튜브 삽입
        </button>
        {uploading && <span className="text-[12px] text-[#6d7f95]">업로드 중...</span>}
      </div>

      {message && <p className="text-[12px] text-[#2d5da8]">{message}</p>}

      <EditorContent editor={editor} />
    </div>
  );
}
