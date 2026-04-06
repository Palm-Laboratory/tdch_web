"use client";

import { useState, useTransition } from "react";
import { signOut } from "next-auth/react";

interface SignOutButtonProps {
  authProvider: "kakao" | "credentials";
}

export default function SignOutButton({ authProvider }: SignOutButtonProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const loading = hasStarted || isPending;

  const handleSignOut = () => {
    setHasStarted(true);

    startTransition(() => {
      void (async () => {
        try {
          await signOut({ redirect: false, callbackUrl: "/admin/login" });
          if (authProvider === "kakao") {
            window.location.assign("/api/auth/kakao/logout?callbackUrl=/admin/login");
            return;
          }

          window.location.assign("/admin/login");
        } catch {
          window.location.assign("/admin/login");
        }
      })();
    });
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "로그아웃 중..." : "로그아웃"}
    </button>
  );
}
