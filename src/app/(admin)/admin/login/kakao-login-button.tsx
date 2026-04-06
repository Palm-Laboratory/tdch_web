"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";

interface KakaoLoginButtonProps {
  callbackUrl: string;
}

export default function KakaoLoginButton({ callbackUrl }: KakaoLoginButtonProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [fallbackError, setFallbackError] = useState<string | null>(null);
  const loading = hasStarted || isPending;

  const handleLogin = async () => {
    setFallbackError(null);
    setHasStarted(true);

    startTransition(() => {
      void signIn("kakao", { callbackUrl }).catch(() => {
        setHasStarted(false);
        setFallbackError("카카오 로그인 시작 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      });
    });
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleLogin}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#FEE500] px-5 py-3.5 text-sm font-semibold text-[#191919] transition-all duration-150 hover:bg-[#f5dc00] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <LoadingSpinner />
            <span>카카오로 이동 중...</span>
          </>
        ) : (
          <>
            <KakaoIcon />
            <span>카카오로 로그인</span>
          </>
        )}
      </button>

      {fallbackError ? (
        <p className="text-center text-xs leading-5 text-red-300">{fallbackError}</p>
      ) : null}
    </div>
  );
}

function KakaoIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 1C4.582 1 1 3.79 1 7.225c0 2.21 1.468 4.147 3.688 5.27l-.94 3.503a.25.25 0 0 0 .385.27L8.08 13.7c.305.03.614.046.921.046 4.418 0 8-2.79 8-6.521C17 3.79 13.418 1 9 1Z"
        fill="#191919"
      />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
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
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
