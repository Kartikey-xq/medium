import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

type JWTPayload = {
  id: string;
  exp: number;
};

// 👇 Make sure to export it so you can reuse it in routes
export const authMiddleware = async (
  c: Context<{
    Bindings: { JWT_SECRET: string }; // from env
    Variables: { userId: string };    // for c.set/get
  }>,
  next: Next
) => {
  const jwt = getCookie(c, "token");

  if (!jwt) {
    // ✅ Now `c.json` and `c.status` will autocomplete & typecheck
    return c.json({ success: false, message: "token not found" }, 404);
  }

  try {
    const result = await verify(jwt, c.env.JWT_SECRET) as JWTPayload;
    if (!result || !result.id) {
      return c.json({ success: false, message: "unauthenticated user" }, 401);
    }

    // ✅ `c.set` works because Variables is defined above
    c.set("userId", result.id);
    await next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return c.json({ success: false, message: "invalid token" }, 401);
  }
};
