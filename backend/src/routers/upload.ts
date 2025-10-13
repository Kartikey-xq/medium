import { Hono } from "hono";
import { generateS3PresignedUrl } from "../config/s3-presign";
import { authMiddleware } from "../middlewares/authMiddleware";
import { Env } from "../types";

const upload = new Hono<{ Bindings: Env }>();

upload.use("*", authMiddleware);

upload.post("/blog-image", async (c) => {
  try {
    const { fileName, fileType } = await c.req.json();

    if (!fileType.startsWith("image/")) {
      return c.json({ error: "Only images allowed" }, 400);
    }

    const { uploadUrl, publicUrl } = await generateS3PresignedUrl(
      c.env,
      fileName,
      fileType
    );

    return c.json({ uploadUrl, publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return c.json({ error: "Upload failed" }, 500);
  }
});

export default upload;