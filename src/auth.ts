import "server-only";

import { getServerSession, type NextAuthOptions, type Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import KakaoProvider, { type KakaoProfile } from "next-auth/providers/kakao";
import {
  authenticateAdminCredentials,
  type AdminAccountRole,
} from "@/lib/admin-accounts-api";
import { AdminApiError } from "@/lib/admin-api";

const DEFAULT_ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

const normalizeEmail = (value?: string | null) => value?.trim().toLowerCase() ?? "";
const normalizeUsername = (value?: string | null) => value?.trim().toLowerCase() ?? "";

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

const resolveAllowedAdminEmails = () =>
  new Set(parseAllowedAdminEmails(process.env.ADMIN_ALLOWED_EMAILS));

const extractKakaoEmail = (profile?: KakaoProfile, fallbackEmail?: string | null) =>
  normalizeEmail(profile?.kakao_account?.email ?? fallbackEmail);

const hasAdminIdentity = (user?: { email?: string | null; username?: string | null }) =>
  normalizeEmail(user?.email).length > 0 || normalizeUsername(user?.username).length > 0;

type AdminAuthProvider = "kakao" | "credentials";

interface CredentialsAdminUser {
  id: string;
  name: string;
  username: string;
  adminAccountRole: AdminAccountRole;
  adminAuthProvider: AdminAuthProvider;
}

export const isAllowedAdminEmail = (email?: string | null) => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return false;
  }

  return resolveAllowedAdminEmails().has(normalizedEmail);
};

export const isAdminSession = (session?: Session | null): session is Session =>
  Boolean(session?.user?.role === "admin" && hasAdminIdentity(session.user));

export const isAdminToken = (token?: JWT | null) =>
  Boolean(token?.role === "admin" && hasAdminIdentity(token));

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
    CredentialsProvider({
      name: "관리자 계정",
      credentials: {
        username: { label: "아이디", type: "text" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        const username = normalizeUsername(credentials?.username);
        const password = typeof credentials?.password === "string" ? credentials.password : "";

        if (!username || !password) {
          return null;
        }

        try {
          const account = await authenticateAdminCredentials(username, password);
          return {
            id: String(account.id),
            name: account.displayName,
            username: account.username,
            adminAccountRole: account.role,
            adminAuthProvider: "credentials",
          } satisfies CredentialsAdminUser;
        } catch (error) {
          if (
            error instanceof AdminApiError &&
            (error.status === 400 || error.status === 401 || error.status === 403)
          ) {
            return null;
          }

          throw error;
        }
      },
    }),
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
      if (account?.provider === "credentials") {
        return true;
      }

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
      user.name =
        user.name ??
        kakaoProfile?.properties?.nickname ??
        kakaoProfile?.kakao_account?.profile?.nickname ??
        email;

      return true;
    },
    async jwt({ token, user, profile, account, trigger }) {
      if (account?.provider === "credentials" && user) {
        const credentialsUser = user as typeof user & CredentialsAdminUser;
        token.sub = credentialsUser.id;
        token.name = credentialsUser.name;
        token.email = "";
        token.username = normalizeUsername(credentialsUser.username);
        token.role = "admin";
        token.accountRole = credentialsUser.adminAccountRole;
        token.authProvider = credentialsUser.adminAuthProvider;
        return token;
      }

      if ((trigger === "signIn" || user) && account?.provider === "kakao") {
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
        token.username = undefined;
        token.role = "admin";
        token.accountRole = "ADMIN";
        token.authProvider = "kakao";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const normalizedEmail = normalizeEmail(token.email);
        const normalizedUsername = normalizeUsername(token.username);

        session.user.id = token.sub;
        session.user.email = normalizedEmail;
        session.user.username = normalizedUsername || undefined;
        session.user.name =
          token.name ??
          session.user.name ??
          normalizedUsername ??
          normalizedEmail;
        session.user.role = "admin";
        session.user.accountRole = (token.accountRole as AdminAccountRole | undefined) ?? "ADMIN";
        session.user.authProvider = (token.authProvider as AdminAuthProvider | undefined) ?? "kakao";
      }

      return session;
    },
  },
};

export const getAdminSession = () => getServerSession(adminAuthOptions);
