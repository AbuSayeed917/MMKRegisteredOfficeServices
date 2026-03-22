import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("MISSING_FIELDS");
        }

        const email = (credentials.email as string).toLowerCase().trim();
        const password = credentials.password as string;

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user) {
          throw new Error("INVALID_CREDENTIALS");
        }

        if (!user.isActive) {
          throw new Error("ACCOUNT_INACTIVE");
        }

        // Check if account is locked
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          const minutesLeft = Math.ceil(
            (user.lockedUntil.getTime() - Date.now()) / 60000
          );
          throw new Error(`ACCOUNT_LOCKED:${minutesLeft}`);
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
          // Increment failed attempts
          const failedAttempts = user.failedAttempts + 1;
          const updateData: { failedAttempts: number; lockedUntil?: Date } = {
            failedAttempts,
          };

          // Lock account after 5 failed attempts for 15 minutes
          if (failedAttempts >= 5) {
            updateData.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
            await db.user.update({
              where: { id: user.id },
              data: updateData,
            });
            throw new Error("ACCOUNT_LOCKED:15");
          }

          await db.user.update({
            where: { id: user.id },
            data: updateData,
          });

          const attemptsLeft = 5 - failedAttempts;
          throw new Error(`WRONG_PASSWORD:${attemptsLeft}`);
        }

        // Reset failed attempts and update last login
        await db.user.update({
          where: { id: user.id },
          data: {
            failedAttempts: 0,
            lockedUntil: null,
            lastLogin: new Date(),
          },
        });

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes
  },
  trustHost: true,
});
