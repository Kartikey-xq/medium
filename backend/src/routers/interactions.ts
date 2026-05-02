import { Hono } from "hono";
import type { Env } from "../types";
import { getPrisma } from "../prisma-helper.js";
import { z } from "zod";
import { authMiddleware } from "../middlewares/authMiddleware";

const interactions = new Hono<{
  Bindings: {// Environment variables/bindings
    JWT_SECRET: string;
    DATABASE_URL: string;
  },
  Variables: {// Context variables you set during request
    userId: string;
  }
}>();

/* =======================
   PUBLIC ROUTES (NO AUTH)
======================= */
/*----isLiked-----*/
interactions.get("/isLiked/:blogId/:userId", async (c) => {
  const blogId = c.req.param("blogId");
  const userId = c.req.param("userId");
  const prisma = getPrisma(c.env.DATABASE_URL);

  const existing = await prisma.like.findFirst({
    where: { blogId, userId },
  });

  return c.json({ success: true, isLiked: !!existing });
});

/*----isSaved-----*/
interactions.get("/isSaved/:blogId/:userId", async (c) => {
  const blogId = c.req.param("blogId");
  const userId = c.req.param("userId");
  const prisma = getPrisma(c.env.DATABASE_URL);

  const existing = await prisma.save.findFirst({
    where: { blogId, userId },
  });

  return c.json({ success: true, isSaved: !!existing });
});

/* ---------- LIKE COUNT ---------- */
interactions.get("/like/:id", async (c) => {
  const blogId = c.req.param("id");
  const prisma = getPrisma(c.env.DATABASE_URL);


  const count = await prisma.like.count({
    where: { blogId },
  });

  return c.json({ success: true, count });
});

/* ---------- SAVE COUNT ---------- */
interactions.get("/save/:id", async (c) => {
  const blogId = c.req.param("id");
  const prisma = getPrisma(c.env.DATABASE_URL);

  const count = await prisma.save.count({
    where: { blogId },
  });

  return c.json({ success: true, count });
});

/* ---------- COMMENT COUNT ---------- */
interactions.get("/comment/:id", async (c) => {
  const blogId = c.req.param("id");
  const prisma = getPrisma(c.env.DATABASE_URL);

  const count = await prisma.comment.count({
    where: { blogId },
  });

  return c.json({ success: true, count });
});

/* =======================
   PROTECTED ROUTES (AUTH)
======================= */

// interactions.ts (protected routes section)
interactions.use("/*", authMiddleware); // Already good

/* ---------- LIKE (TOGGLE) ---------- */
interactions.post("/like", async (c) => {
  const userId = c.get("userId"); // 🔥 Use authenticated userId
  const { blogId } = await c.req.json(); // Only blogId from body
  
  // Add Zod validation
  const schema = z.object({ blogId: z.string().uuid() });
  const validated = schema.safeParse({ blogId });
  if (!validated.success) {
    return c.json({ success: false, message: "Invalid blogId" }, 400);
  }

  const prisma = getPrisma(c.env.DATABASE_URL);
  const existing = await prisma.like.findFirst({
    where: { blogId, userId },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return c.json({ success: true, liked: false });
  }

  await prisma.like.create({ data: { blogId, userId } });
  return c.json({ success: true, liked: true });
});

/* ---------- SAVE (TOGGLE) ---------- */
interactions.post("/save", async (c) => {
  const userId = c.get("userId"); // 🔥 Use authenticated userId
  const { blogId } = await c.req.json();
  
  const schema = z.object({ blogId: z.string().uuid() });
  const validated = schema.safeParse({ blogId });
  if (!validated.success) {
    return c.json({ success: false, message: "Invalid blogId" }, 400);
  }

  const prisma = getPrisma(c.env.DATABASE_URL);
  const existing = await prisma.save.findFirst({
    where: { blogId, userId },
  });

  if (existing) {
    await prisma.save.delete({ where: { id: existing.id } });
    return c.json({ success: true, saved: false });
  }

  await prisma.save.create({ data: { blogId, userId } });
  return c.json({ success: true, saved: true });
});

/* ---------- COMMENT ---------- */
interactions.post("/comment", async (c) => {
  const userId = c.get("userId"); // 🔥 Use authenticated userId
  const { blogId, content } = await c.req.json();
  
  const schema = z.object({
    blogId: z.string().uuid(),
    content: z.string().min(1).max(1000).trim(),
  });
  const validated = schema.safeParse({ blogId, content });
  if (!validated.success) {
    return c.json({ success: false, message: "Invalid input" }, 400);
  }

  const prisma = getPrisma(c.env.DATABASE_URL);
  await prisma.comment.create({
    data: { blogId, userId, content: validated.data.content },
  });

  return c.json({ success: true });
});

export default interactions;