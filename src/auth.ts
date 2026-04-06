import "server-only";

import { getServerSession, type NextAuthOptions } from "next-auth";
import KakaoProvider, { type KakaoProfile } from "next-auth/providers/kakao";

const DEFAULT_ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

const normalizeEmail = (value?: string | null) => value?.trim().toLowerCase() ?? "";

const parseAllowedAdminEmails = (value?: string) =>
  value
    ?.split(",")
    .map((email) => normalizeEmail(email))
    .filter(Boolean) ?? [];

const resolveSessionMaxAge = () => {
  const rawValue = Number.parseInt(
    process.env.ADMIN_SESSION_MAX_AGE_SECONDS ?? `${DEFAULT_ADMIN_SESSION_MAX_AGE_SECONDS}`,
    10,
  );

  return Number.isFinite(rawValue) && rawValue > 0
    ? rawValue
    : DEFAULT_ADMIN_SESSION_MAX_AGE_SECONDS;
};

const resolveAllowedAdminEmails = () => new Set(parseAllowedAdminEmails(process.env.ADMIN_ALLOWED_EMAILS));

const extractKakaoEmail = (profile?: KakaoProfile, fallbackEmail?: string | null) =>
  normalizeEmail(profile?.kakao_account?.email ?? fallbackEmail);

export const isAllowedAdminEmail = (email?: string | null) => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return false;
  }

  return resolveAllowedAdminEmails().has(normalizedEmail);
};

export const adminAuthOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: resolveSessionMaxAge(),
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID ?? "",
      clientSecret: process.env.KAKAO_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope: "profile_nickname account_email",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "kakao") {
        return "/admin/login?error=oauth_failed";
      }

      const kakaoProfile = profile as KakaoProfile | undefined;
      const email = extractKakaoEmail(kakaoProfile, user.email);

      if (!email) {
        return "/admin/login?error=email_required";
      }

      if (!isAllowedAdminEmail(email)) {
        return "/admin/login?error=unauthorized";
      }

      user.email = email;
      user.name = user.name ?? kakaoProfile?.properties?.nickname ?? kakaoProfile?.kakao_account?.profile?.nickname ?? email;

      return true;
    },
    async jwt({ token, user, profile, trigger }) {
      if (trigger === "signIn" || user) {
        const kakaoProfile = profile as KakaoProfile | undefined;
        const email = extractKakaoEmail(kakaoProfile, user?.email ?? token.email);

        if (email) {
          token.email = email;
        }

        token.name =
          user?.name ??
          kakaoProfile?.properties?.nickname ??
          kakaoProfile?.kakao_account?.profile?.nickname ??
          token.name;
        token.role = "admin";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = normalizeEmail(token.email) || session.user.email || "";
        session.user.name = token.name ?? session.user.name;
        session.user.role = "admin";
      }

      return session;
    },
  },
};

export const getAdminSession = () => getServerSession(adminAuthOptions);
