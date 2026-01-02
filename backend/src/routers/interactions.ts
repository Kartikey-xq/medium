import { Hono } from "hono";
import type { Env } from "../types";
import { getPrisma } from "../prisma-helper.js";
import { z } from "zod";
import { authMiddleware } from "../middlewares/authMiddleware";

const interactions = new Hono<{
  Bindings: {        // Environment variables/bindings
    JWT_SECRET: string;
    DATABASE_URL: string;
  },
  Variables: {       // Context variables you set during request
    userId: string;
  }
}>();

/* =======================
   PUBLIC ROUTES (NO AUTH)
======================= */

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

interactions.use(authMiddleware);

/* ---------- LIKE (TOGGLE) ---------- */
interactions.post("/like", async (c) => {
  const { blogId, userId } = await c.req.json();
  const prisma = getPrisma(c.env.DATABASE_URL);

  const existing = await prisma.like.findFirst({
    where: { blogId, userId },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return c.json({ success: true, liked: false });
  }

  await prisma.like.create({
    data: { blogId, userId },
  });

  return c.json({ success: true, liked: true });
});

/* ---------- SAVE (TOGGLE) ---------- */
interactions.post("/save", async (c) => {
  const { blogId, userId } = await c.req.json();
  const prisma = getPrisma(c.env.DATABASE_URL);

  const existing = await prisma.save.findFirst({
    where: { blogId, userId },
  });

  if (existing) {
    await prisma.save.delete({ where: { id: existing.id } });
    return c.json({ success: true, saved: false });
  }

  await prisma.save.create({
    data: { blogId, userId },
  });

  return c.json({ success: true, saved: true });
});

/* ---------- COMMENT ---------- */
interactions.post("/comment", async (c) => {
  const { blogId, userId, content } = await c.req.json();
  const prisma = getPrisma(c.env.DATABASE_URL);

  if (!content?.trim()) {
    return c.json(
      { success: false, message: "Comment cannot be empty" },
      400
    );
  }

  await prisma.comment.create({
    data: {
      blogId,
      userId,
      content,
    },
  });

  return c.json({ success: true });
});

export default interactions;
