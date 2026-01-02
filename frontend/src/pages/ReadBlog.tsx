import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { BlogActions } from "../components/BlogActions";
import {
  hitLike,
  hitSave,
  likeCount,
  commentCount,
  saveCount,
} from "../api/interactions";

export function ReadBlog() {
  const { state: blog } = useLocation();
  const userId =
    JSON.parse(localStorage.getItem("user") || "{}")?.id ?? null;

  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);
  const [saves, setSaves] = useState(0);

  const syncCounts = async () => {
    if (!blog?.id) return;

    const [l, c, s] = await Promise.all([
      likeCount(blog.id),
      commentCount(blog.id),
      saveCount(blog.id),
    ]);

    setLikes(l);
    setComments(c);
    setSaves(s);
  };

  useEffect(() => {
    syncCounts();
  }, [blog?.id]);

  if (!blog) return null;

  return (
    <article className="max-w-4xl mx-auto p-6">
      <img src={blog.imageUrl} className="rounded-xl mb-6 w-full" />

      <h1 className="text-4xl font-bold">{blog.title}</h1>
      <p className="text-gray-500 mb-4">By {blog.authorName}</p>

      <BlogActions
        likes={likes}
        comments={comments}
        isLoggedIn={userId !== null}
        saves={saves}
        onLike={async () => {
          await hitLike(userId, blog.id);
          await syncCounts();
        }}
        onSave={async () => {
          await hitSave(userId, blog.id);
          await syncCounts();
        }}
      />

      <div className="prose max-w-none mt-8">{blog.content}</div>
    </article>
  );
}
