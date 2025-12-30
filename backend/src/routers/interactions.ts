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

//zod schema for like validation(move this to common later and response type also):
    const likeSchema = z.object({
        blogId: z.string().min(1),
        userId: z.string().min(1)
    });
    type LikeParams = z.infer<typeof likeSchema>;
//schema for comment validation(move this to common later and response type also):
  const commentSchema = z.object({
        blogId: z.string().min(1),
        userId: z.string().min(1),
        content: z.string().min(1).max(1000)
    });
    type CommentParams = z.infer<typeof commentSchema>;


//<------route 1 get like count-------->
interactions.get("/:id", async (c) => {
  const blogId = c.req.param("id").trim(); // remove newline/whitespace
  const prisma = getPrisma(c.env.DATABASE_URL);

  const likes = await prisma.like.findMany({
    where: { blogId } // or post: { id: blogId }
  });

  return c.json({ success: true, count: likes.length });
});
//<------route 2: like a blog post-------->
interactions.use("/*", authMiddleware);
interactions.post("/like", async (c) => {
    const { blogId, userId } = await c.req.json();

    const parseResult = likeSchema.safeParse({ blogId, userId });
    if (!parseResult.success) {
        c.status(400);
        return c.json({ success: false, message: "Invalid input", errors: parseResult.error.format() });
    }
    // For demonstration, we'll just return a success message
    const prisma = getPrisma(c.env.DATABASE_URL);

    //check if already liked
    const existingLike = await prisma.like.findFirst({
        where: {
            blogId: blogId,
            userId: userId
        }
    });
    if(existingLike){
        //delete entry from likes table(unlike)
        await prisma.like.delete({
            where: {
                id: existingLike.id
            }
        });
        c.status(200);
        return c.json({ success: true, message: `User ${userId} has unliked post ${blogId}` });
    }
    
    const like : LikeParams = await prisma.like.create({
        data: {
            blogId: blogId,
            userId: userId
        }
    });
    c.status(200);
    return c.json({ success: true, message: `User ${userId} liked post ${blogId}` });
})

//<------route 3: save a blog post-------->
interactions.post("/save", async (c) => {
    const { blogId, userId } = await c.req.json();

    const parseResult = likeSchema.safeParse({ blogId, userId });
    if (!parseResult.success) {
        c.status(400);
        return c.json({ success: false, message: "Invalid input", errors: parseResult.error.format() });
    }

    const prisma = getPrisma(c.env.DATABASE_URL);

    //check if already saved
    const existingSave = await prisma.save.findFirst({
        where: {
            blogId: blogId,
            userId: userId
        }
    });
    if(existingSave){
        //delete entry from saves table(unsave)
        await prisma.save.delete({
            where: {
                id: existingSave.id
            }
        });
        c.status(200);
        return c.json({ success: true, message: `User ${userId} has unsaved post ${blogId}` });
    }

    const save = await prisma.save.create({
        data: {
            blogId: blogId,
            userId: userId
        }
    });
    c.status(200);
    return c.json({ success: true, message: `User ${userId} saved post ${blogId}` });
})

//<------route 4: get no of saves for a post-------->
interactions.get("/save/:id", async (c) => {
    const blogId = c.req.param("id").trim(); // remove newline/whitespace
    const prisma = getPrisma(c.env.DATABASE_URL);
  
    const saves = await prisma.save.findMany({
      where: { blogId } // or post: { id: blogId }
    });
  
    return c.json({ success: true, count: saves.length });
  });

//<-----route 5: comment on a blog post--------->
interactions.post("/comment", async (c) => {
  
    const { blogId, userId, content } = await c.req.json();

    const parseResult = commentSchema.safeParse({ blogId, userId, content });
    if (!parseResult.success) {
        c.status(400);
        return c.json({ success: false, message: "Invalid input", errors: parseResult.error.format() });
    }

    const prisma = getPrisma(c.env.DATABASE_URL);

    const comment : CommentParams = await prisma.comment.create({
        data: {
            blogId: blogId,
            userId: userId,
            content: content
        }
    });
    c.status(200);
    return c.json({ success: true, message: `User ${userId} commented on post ${blogId}`, comment });
});

//<-----route 6: get comments on a blog post--------->
interactions.get("/comment/:id", async (c) => {
    const blogId = c.req.param("id").trim(); // remove newline/whitespace
    const prisma = getPrisma(c.env.DATABASE_URL);
  
    const comments = await prisma.comment.findMany({
      where: { blogId } // or post: { id: blogId }
    });
  //log the comments retrieved
    console.log("GET /comment/:id response:", JSON.stringify(comments, null, 2));
    return c.json({ success: true, message: "Comments retrieved successfully", comments });
  });

//<---route 7: author and commentor can remove comment----->
interactions.delete("/comment/:id", async (c) => {
  const commentId = c.req.param("id").trim();
  const prisma = getPrisma(c.env.DATABASE_URL);

  // Fetch the comment along with its parent post and author
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      post: {
        include: { author: true }, // gives you full User object of the post author
      },
    },
  });

  if (!comment || !comment.post) {
    c.status(404);
    return c.json({ success: false, message: "Comment or associated blog post not found" });
  }

  const userId = c.get("userId");

  // Permission check: only the comment owner OR the post author can delete
  if (userId !== comment.userId && userId !== comment.post.authorId) {
    c.status(403);
    return c.json({ success: false, message: "You do not have permission to delete this comment" });
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });

  c.status(200);
  return c.json({ success: true, message: "Comment deleted successfully" });
});

export default interactions;

