// ─── src/lib/response.ts ──────────────────────────────────────────────────────
// Consistent JSON envelope for every API response.
// Usage:
//   return ok(c, { token })
//   return err(c, "Invalid credentials", 401)
import { Context } from "hono";
/** Success envelope */
export function ok<T>(c: Context, data: T, status: 200 | 201 = 200) {
  return c.json({ success: true, data }, status);
}

/** Error envelope */
export function err(
  c: Context,
  message: string,
  status: 400 | 401 | 403 | 404 | 409 | 500 = 400
) {
  return c.json({ success: false, error: message }, status);
}