type heroProps = {
      id: string;
    title: string;
    authorName: string;
    description : string;
    imageUrl: string|undefined;
    content?: string;
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  hitLike,
  hitSave,
  likeCount,
  commentCount,
  saveCount,
} from "../api/interactions";
import { BlogActions } from "./BlogActions";

export const BlogHero = ({
  id,
  title,
  description,
  authorName,
  imageUrl,
  content,
}: heroProps) => {
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user") || "{}")?.id ?? null;

  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);
  const [saves, setSaves] = useState(0);

  const syncCounts = async () => {
    if (!id) return;

    const [l, c, s] = await Promise.all([
      likeCount(id),
      commentCount(id),
      saveCount(id),
    ]);

    setLikes(l);
    setComments(c);
    setSaves(s);
  };

  useEffect(() => {
    syncCounts();
  }, [id]);

  const handleLike = async () => {
    await hitLike(userId, id);
    await syncCounts();
  };

  const handleSave = async () => {
    await hitSave(userId, id);
    await syncCounts();
  };

  return (
    <div
      onClick={() =>
        navigate(`/blog/${id}`, {
          state: { title, authorName, description, imageUrl, content, id },
        })
      }
      className="m-4 shadow-md rounded-2xl hover:shadow-xl cursor-pointer overflow-hidden"
    >
      <img src={imageUrl} className="w-full h-64 object-cover" />

      <div className="p-6">
        <h3 className="font-semibold">{authorName}</h3>
        <h2 className="text-2xl font-bold mt-2">{title}</h2>
        <p className="text-gray-600 mt-2">{description}</p>

        <BlogActions
          likes={likes}
          comments={comments}
          isLoggedIn={userId !== null}
          saves={saves}
          onLike={handleLike}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default BlogHero;
