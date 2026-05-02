import { useLocation } from "react-router-dom";
import { BlogActions } from "../components/BlogActions";

export function ReadBlog() {
  const { state: blog } = useLocation();

  if (!blog) return null;

  return (
    <article className="max-w-4xl mx-auto p-6">
      <img src={blog.imageUrl} className="rounded-xl mb-6 w-full" />

      <h1 className="text-4xl font-bold">{blog.title}</h1>
      <p className="text-gray-500 mb-4">By {blog.authorName}</p>

      <BlogActions blogId={blog.id} />

      <div className="prose max-w-none mt-8">{blog.content}</div>
    </article>
  );
}