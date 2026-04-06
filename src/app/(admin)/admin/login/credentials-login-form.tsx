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
      <div>
        <label className="mb-1.5 block text-[12px] font-semibold text-white/70">아이디</label>
        <input
          type="text"
          name="username"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
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
        {isPending ? "로그인 중..." : "관리자 계정 로그인"}
      </button>

      {fallbackError ? (
        <p className="text-center text-xs leading-5 text-red-300">{fallbackError}</p>
      ) : null}
    </form>
  );
}
