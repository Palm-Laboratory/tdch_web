"use client";

import { useState } from "react";

function fallbackCopyText(value: string) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export default function CopyAccountButton({
  value,
}: {
  value: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        fallbackCopyText(value);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      try {
        fallbackCopyText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      } catch {
        setCopied(false);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="type-body-small relative z-10 inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center border border-black/10 px-5 py-2 font-semibold text-ink transition hover:bg-ink hover:text-white"
      aria-label="계좌번호 복사하기"
    >
      {copied ? "복사됨" : "복사하기"}
    </button>
  );
}
