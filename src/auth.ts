import "server-only";

import { getServerSession, type NextAuthOptions, type Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  authenticateAdminCredentials,
  type AdminAccountRole,
} from "@/lib/admin-accounts-api";
import { AdminApiError } from "@/lib/admin-api";

const DEFAULT_ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

const normalizeUsername = (value?: string | null) => value?.trim().toLowerCase() ?? "";

const resolveSessionMaxAge = () => {
  const rawValue = Number.parseInt(
    process.env.ADMIN_SESSION_MAX_AGE_SECONDS ?? `${DEFAULT_ADMIN_SESSION_MAX_AGE_SECONDS}`,
    10,
  );

  return Number.isFinite(rawValue) && rawValue > 0
    ? rawValue
    : DEFAULT_ADMIN_SESSION_MAX_AGE_SECONDS;
};

const hasAdminIdentity = (user?: { username?: string | null }) =>
  normalizeUsername(user?.username).length > 0;

interface CredentialsAdminUser {
  id: string;
  name: string;
  username: string;
  adminAccountRole: AdminAccountRole;
}

export const isAdminSession = (session?: Session | null): session is Session =>
  Boolean(session?.user?.role === "admin" && hasAdminIdentity(session.user));

export const isAdminToken = (token?: JWT | null) =>
  Boolean(token?.role === "admin" && hasAdminIdentity(token));

export const adminAuthOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
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
          } satisfies CredentialsAdminUser;
        } catch (error) {
          if (error instanceof AdminApiError && error.status >= 400 && error.status < 500) {
            return null;
          }

          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "credentials" && user) {
        const credentialsUser = user as typeof user & CredentialsAdminUser;
        token.sub = credentialsUser.id;
        token.name = credentialsUser.name;
        token.email = "";
        token.username = normalizeUsername(credentialsUser.username);
        token.role = "admin";
        token.accountRole = credentialsUser.adminAccountRole;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const normalizedUsername = normalizeUsername(token.username);

        session.user.id = token.sub;
        session.user.email = "";
        session.user.username = normalizedUsername || undefined;
        session.user.name =
          token.name ??
          session.user.name ??
          normalizedUsername;
        session.user.role = "admin";
        session.user.accountRole = (token.accountRole as AdminAccountRole | undefined) ?? "ADMIN";
      }

      return session;
    },
  },
};

export const getAdminSession = () => getServerSession(adminAuthOptions);
