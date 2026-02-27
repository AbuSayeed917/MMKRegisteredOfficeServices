import { headers } from "next/headers";
import { jwtVerify } from "jose";
import { auth } from "@/lib/auth";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "fallback-secret"
);

interface AuthUser {
  id: string;
  email: string;
  role: string;
}

/**
 * Get authenticated user from NextAuth session OR mobile JWT Bearer token.
 * Use this instead of `auth()` in API routes to support both web and mobile.
 */
export async function getUser(): Promise<AuthUser | null> {
  // Try NextAuth session first (web)
  const session = await auth();
  if (session?.user?.id) {
    return {
      id: session.user.id as string,
      email: session.user.email!,
      role: (session.user as { role: string }).role,
    };
  }

  // Try Bearer token (mobile)
  try {
    const headersList = await headers();
    const authHeader = headersList.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const { payload } = await jwtVerify(token, JWT_SECRET);
      return {
        id: payload.id as string,
        email: payload.email as string,
        role: payload.role as string,
      };
    }
  } catch {
    // Invalid token
  }

  return null;
}
