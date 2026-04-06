import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession, isAdminSession } from "@/auth";
import CredentialsLoginForm from "./credentials-login-form";
import KakaoLoginButton from "./kakao-login-button";

export const metadata: Metadata = {
  title: "관리자 로그인",
  robots: { index: false, follow: false },
};

const ERROR_MESSAGES: Record<string, string> = {
  email_required: "카카오 계정에 이메일 정보가 없습니다. 카카오 계정 설정에서 이메일을 확인해 주세요.",
  unauthorized: "접근이 허용되지 않은 계정입니다. 관리자에게 문의해 주세요.",
  oauth_failed: "카카오 로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
  CredentialsSignin: "아이디 또는 비밀번호를 다시 확인해 주세요.",
  AccessDenied: "관리자 권한이 확인되지 않았습니다.",
  Callback: "로그인 콜백 처리 중 오류가 발생했습니다.",
  OAuthAccountNotLinked: "이미 다른 방식으로 연결된 계정입니다.",
  OAuthCallback: "카카오 인증 응답을 처리하지 못했습니다.",
  OAuthSignin: "카카오 로그인 시작 중 오류가 발생했습니다.",
};

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string | string[]; error?: string | string[] }>;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const session = await getAdminSession();

  if (isAdminSession(session)) {
    redirect("/admin");
  }

  const { error, callbackUrl } = await searchParams;
  const resolvedError = Array.isArray(error) ? error[0] : error;
  const resolvedCallbackUrl = Array.isArray(callbackUrl) ? callbackUrl[0] : callbackUrl;
  const safeCallbackUrl =
    resolvedCallbackUrl && resolvedCallbackUrl.startsWith("/") && !resolvedCallbackUrl.startsWith("//")
      ? resolvedCallbackUrl
      : "/admin";
  const errorMessage = resolvedError
    ? (ERROR_MESSAGES[resolvedError] ?? "로그인 중 오류가 발생했습니다.")
    : null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      {/* 배경 글로우 */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3f74c7]/10 blur-[96px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* 로고 + 타이틀 */}
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6ca6f0]/60">
            The 제자교회
          </p>
          <h1 className="mt-3 text-2xl font-bold text-white">
            관리자 로그인
          </h1>
          <p className="mt-2 text-sm text-white/40">
            허용된 관리자 계정으로만 접근할 수 있습니다.
          </p>
        </div>

        {/* 카드 */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-8 shadow-[0_24px_64px_rgba(0,0,0,0.4)] backdrop-blur-sm">
          {/* 에러 메시지 */}
          {errorMessage && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
              <p className="text-sm leading-relaxed text-red-300">{errorMessage}</p>
            </div>
          )}

          <CredentialsLoginForm callbackUrl={safeCallbackUrl} />

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-[11px] uppercase tracking-[0.18em] text-white/25">or</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          <KakaoLoginButton callbackUrl={safeCallbackUrl} />

          {/* 구분선 */}
          <div className="mt-8 border-t border-white/[0.06]" />

          <p className="mt-6 text-center text-xs leading-relaxed text-white/25">
            이 페이지는 검색엔진에 노출되지 않습니다.
            <br />
            관리자 외 접근이 확인된 경우 즉시 차단됩니다.
          </p>

          <p className="mt-4 text-center text-[11px] text-white/25">
            로그인 후 이동 경로: {safeCallbackUrl}
          </p>
        </div>

        {/* 하단 */}
        <p className="mt-8 text-center text-xs text-white/20">
          © The 제자교회 · 관리자 전용
        </p>
      </div>
    </div>
  );
}
