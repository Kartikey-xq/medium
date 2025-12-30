import { useEffect, useState } from "react"
import { getAllBlogs } from "../api/allblogs";
import type{ blog } from "@kartik010700/common";
import { MotivationalLoader } from "../motion/MotivationalLoader";
import { useNavigate } from "react-router-dom";

type heroProps = {
    title: string;
    authorName: string;
    description : string;
    imageUrl: string|undefined;
    id: string|undefined;
    content?: string;
}


const BlogHero = ({
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
          state: { title, authorName, description, imageUrl, content },
        })
      }
      className="m-4 shadow-md rounded-2xl cursor-pointer hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      {/* Image spans top of card */}
      <div className="w-full h-48 sm:h-64 md:h-72 lg:h-80">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content section */}
      <div className="p-4 sm:p-6">
        <header className="flex items-center gap-2 mb-3">
          <img
            src="https://picsum.photos/300/200"
            alt="author avatar"
            className="w-9 h-9 rounded-full"
          />
          <h3 className="text-sm sm:text-base font-medium">{authorName}</h3>
        </header>

        {/* Title & description */}
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-snug line-clamp-2">
          {title}
        </p>
        <p className="mt-2 text-sm sm:text-base text-gray-600 line-clamp-3">
          {description}
        </p>
      </div>
    </div>
  );
};


export const Blog = () => {
    const [blogs, setBlogs] = useState<blog[]>([]); // Ensure it's always an array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    async function fetchAllBlogs() {
        try {
            setLoading(true);
            const res = await getAllBlogs();
            
            console.log("API Response:", res); // 🔍 Add this to see what you're getting
            
            if (!res || res.success === false) {
                setError(res?.message || "Failed to fetch blogs");
                return;
            }
            
            if (res.blog && Array.isArray(res.blog)) {
                setBlogs(res.blog);
            } else {
                console.log("blogs is not an array:", res.blog); // 🔍 Add this too
                setBlogs([]);
                setError("Invalid response format");
            }
        } catch (err) {
            setError("An error occurred while fetching blogs");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    fetchAllBlogs();
}, []);

  if (loading) {
    return (
        <MotivationalLoader />
    )
}

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (blogs.length === 0) {
        return <div>No blogs found</div>;
    }

    return (
        <>
            {blogs.map((blog) => (
                <BlogHero 
                    key={blog.id} 
                    id={blog.id}
                    title={blog.title} 
                    authorName={blog.authorName} 
                    description={blog.description}
                    imageUrl={blog.imageUrl}
                    content={blog.content}
                />
            ))}
        </>
    )
}