type heroProps = {
  id: string;
  title: string;
  authorName: string;
  description: string;
  imageUrl: string | undefined;
  content?: string;
};

import { useNavigate } from "react-router-dom";
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

        <BlogActions blogId={id} />
      </div>
    </div>
  );
};

export default BlogHero;