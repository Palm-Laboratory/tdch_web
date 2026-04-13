"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";

interface CredentialsLoginFormProps {
  callbackUrl: string;
}

export default function CredentialsLoginForm({ callbackUrl }: CredentialsLoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fallbackError, setFallbackError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFallbackError(null);

    startTransition(() => {
      void (async () => {
        const result = await signIn("credentials", {
          redirect: false,
          callbackUrl,
          username,
          password,
        });

        if (!result || result.error) {
          setFallbackError("아이디 또는 비밀번호를 다시 확인해 주세요.");
          return;
        }

        window.location.assign(result.url || callbackUrl);
      })().catch(() => {
        setFallbackError("로그인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      });
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div
        className={`overflow-hidden rounded-full border border-white/10 bg-white/[0.04] transition-all ${
          isPending ? "h-2 opacity-100" : "h-0 opacity-0"
        }`}
        aria-hidden={!isPending}
      >
        <div className="h-full w-full animate-pulse rounded-full bg-[#6ca6f0]" />
      </div>

      <div>
        <label className="mb-1.5 block text-[12px] font-semibold text-white/70">아이디</label>
        <input
          type="text"
          name="username"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          disabled={isPending}
          className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/25 focus:border-[#6ca6f0]/60 focus:outline-none"
          placeholder="super-admin"
          required
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[12px] font-semibold text-white/70">비밀번호</label>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isPending}
          className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/25 focus:border-[#6ca6f0]/60 focus:outline-none"
          placeholder="비밀번호 입력"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex h-11 w-full items-center justify-center rounded-xl bg-[#6ca6f0] text-sm font-semibold text-[#08121f] transition hover:bg-[#82b4f3] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <>
            <LoadingSpinner />
            <span>로그인 중...</span>
          </>
        ) : (
          "관리자 계정 로그인"
        )}
      </button>

      {fallbackError ? (
        <p className="text-center text-xs leading-5 text-red-300">{fallbackError}</p>
      ) : null}
    </form>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="mr-2 h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V4C7.582 4 4 7.582 4 12Z"
      />
    </svg>
  );
}
