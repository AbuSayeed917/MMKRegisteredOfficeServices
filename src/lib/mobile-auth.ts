import { jwtVerify } from "jose";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "fallback-secret"
);

interface MobileUser {
  id: string;
  email: string;
  role: string;
}

/**
 * Get the authenticated user from either:
 * 1. NextAuth session (web cookies)
 * 2. Mobile JWT Bearer token
 */
export async function getAuthUser(req?: NextRequest): Promise<MobileUser | null> {
  // Try NextAuth session first
  const session = await auth();
  if (session?.user) {
    return {
      id: (session.user as { id: string }).id,
      email: session.user.email!,
      role: (session.user as { role: string }).role,
    };
  }

  // Try Bearer token (mobile app)
  if (req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.slice(7);
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return {
          id: payload.id as string,
          email: payload.email as string,
          role: payload.role as string,
        };
      } catch {
        return null;
      }
    }
  }

  return null;
}
