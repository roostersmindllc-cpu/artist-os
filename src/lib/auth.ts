import { PrismaAdapter } from "@auth/prisma-adapter";
import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { redirect } from "next/navigation";

import { getUserByEmail, getUserById } from "@/db/queries/users";
import { prisma } from "@/db/prisma";
import { verifyPassword } from "@/lib/password";
import { getClientIp } from "@/lib/request-context";
import { enforceRateLimit } from "@/lib/rate-limit";
import { serverEnv } from "@/lib/server-env";
import { signInSchema } from "@/lib/validations/auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/sign-in"
  },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, request) {
        await enforceRateLimit({
          scope: "auth.sign-in",
          maxHits: serverEnv.AUTH_SIGN_IN_RATE_LIMIT_MAX,
          windowMs: serverEnv.AUTH_SIGN_IN_RATE_LIMIT_WINDOW_MS,
          identifiers: [
            getClientIp(request?.headers),
            typeof credentials?.email === "string" ? credentials.email : undefined
          ]
        });

        const parsed = signInSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const user = await getUserByEmail(parsed.data.email);

        if (!user?.passwordHash) {
          return null;
        }

        const isValidPassword = await verifyPassword(
          parsed.data.password,
          user.passwordHash
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? "Artist OS User"
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      return session;
    }
  }
};

export async function getServerAuthSession() {
  return getServerSession(authOptions);
}

export async function requireUser() {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const user = await getUserById(session.user.id);

  if (!user) {
    redirect("/sign-in");
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image
  };
}
