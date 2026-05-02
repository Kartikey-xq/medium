// authMiddleware.ts
import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { getPrisma } from "../prisma-helper.js"; // Add this import

type JWTPayload = {
  id: string;
  exp: number;
  iat?: number; // Add issued-at for rotation checks
};

export const authMiddleware = async (
  c: Context<{
    Bindings: { JWT_SECRET: string; DATABASE_URL: string };
    Variables: { userId: string };
  }>,
  next: Next
) => {
  const jwt = getCookie(c, "token");

  if (!jwt) {
    return c.json({ success: false, message: "Authentication required" }, 401);
  }

  try {
    const payload = await verify(jwt, c.env.JWT_SECRET) as JWTPayload;
    
    // Check expiration explicitly
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return c.json({ success: false, message: "Token expired" }, 401);
    }

    // Validate user exists in DB (prevents stale tokens)
    const prisma = getPrisma(c.env.DATABASE_URL);
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) {
      return c.json({ success: false, message: "User not found" }, 401);
    }

    c.set("userId", payload.id);
    await next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return c.json({ success: false, message: "Invalid authentication" }, 401);
  }
};