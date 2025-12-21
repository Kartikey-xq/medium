import {Hono} from "hono";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getPrisma } from "../prisma-helper.js"; 
import { BlogPostParams, blogPostSchema, UpdateBlogParams, updateBlogSchema } from "@kartik010700/common";

const blog = new Hono<{
  Bindings: {        // Environment variables/bindings
    JWT_SECRET: string;
    DATABASE_URL: string;
  },
  Variables: {       // Context variables you set during request
    userId: string;
  }
}>();

blog.get("/bulk", async (c)=>{
    try{
        const prisma = getPrisma(c.env.DATABASE_URL);
        const blogs = await prisma.post.findMany();
                console.log("GET /bulk response:", JSON.stringify(blogs, null, 2));

        c.status(200);
        return c.json({
            success: true,
            message:"getting all blogs!",
            blog: blogs
        });
    }
    catch(err: any){
        c.status(404);
        return c.json({
            success:false,
            message:err.message
        });
    }
    
})
blog.use("/*", authMiddleware);

blog.get("/:id" ,async(c)=>{
    const blog_id =c.req.param('id');
    const Prisma = getPrisma(c.env.DATABASE_URL);
    const blog = await Prisma.post.findUnique({
        where: {
            id: blog_id
        }
    })
    if(!blog){
        c.status(404);
        return c.json({success:false, message:"not found"});
    }
    c.status(200);
    return c.json({success: true, message: `blog found`, blog});
});

blog.put("/:id" ,async (c) => {
    try {
        const blogId = c.req.param('id');
        const userId = c.get('userId'); 
        
        const prisma = getPrisma(c.env.DATABASE_URL);
        const body : UpdateBlogParams = await c.req.json();
        const validatedBody = updateBlogSchema.safeParse(body);

        if(!validatedBody.success){
            c.status(400);
            return c.json({
                success: false,
                message: "Invalid inputs fileds",
                error : validatedBody.error.format()
            });
        }
        const data = validatedBody.data;
        const existingBlog = await prisma.post.findUnique({
            where: {
                id: blogId
            }
        });

        if (!existingBlog) {
            c.status(404);
            return c.json({
                success: false,
                message: "Blog not found"
            });
        }

        // Check if the user owns this blog
        if (existingBlog.authorId !== userId) {
            c.status(403);
            return c.json({
                success: false,
                message: "You can only update your own blogs"
            });
        }

        const updatedBlog = await prisma.post.update({
            where: {
                id: blogId
            },
            data: {
                title: data.title,
                content: data.content,
                published: data.published
            }
        });

        c.status(200);
        return c.json({
            success: true,
            message: "Blog updated successfully",
            blog: updatedBlog
        });

    } catch (error) {
        c.status(500);
        return c.json({
            success: false,
            message: "Error updating blog"
        });
    }
});
blog.delete("/:id", async (c) => {
    try {
        const blogId = c.req.param('id');
        const userId = c.get('userId');
        const prisma = getPrisma(c.env.DATABASE_URL);

        const existingBlog = await prisma.post.findUnique({
            where: { id: blogId }
        });

        if (!existingBlog) {
            c.status(404);
            return c.json({ success: false, message: "Blog not found" });
        }

        if (existingBlog.authorId !== userId) {
            c.status(403);
            return c.json({ success: false, message: "You can only delete your own blogs" });
        }

        await prisma.post.delete({
            where: { id: blogId }
        });

        c.status(200);
        return c.json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
        c.status(500);
        return c.json({ success: false, message: "Error deleting blog" });
    }
});
blog.post("/create", async (c) => {
  const userId = c.get("userId");
  const body: BlogPostParams = await c.req.json();
  const prisma = getPrisma(c.env.DATABASE_URL);

  const validatedBody = blogPostSchema.safeParse(body);

  if (!validatedBody.success) {
    c.status(400);
    return c.json({
      success: false,
      message: "Invalid inputs!",
      errors: validatedBody.error.format(),
    });
  }

  const data = validatedBody.data;

  // Get author details
  const author = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!author) {
    c.status(404);
    return c.json({
      success: false,
      message: "User not found",
    });
  }

  // Validate required fields
  if (!data.title || !data.content) {
    c.status(400);
    return c.json({
      success: false,
      message: "Title and content are required",
    });
  }

  // Create blog with optional cover image
  const blog = await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      description: data.description,
      imageUrl: data.imageUrl, // Add this
      published: false,
      authorId: userId,
      authorName: author.name || "Unknown",
    },
  });

  return c.json({
    success: true,
    message: "Blog created successfully",
    blog,
  });
});

export default blog;
