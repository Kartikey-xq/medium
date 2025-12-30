import { useLocation } from "react-router-dom";

export function ReadBlog() {
  const location = useLocation();
  const blog = location.state; // Get the passed data

  // Fallback: if user directly visits /blog/:id without state
  // You might want to fetch the blog by ID here using useParams + API

  return (
    <article className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Blog Image */}
      {blog?.imageUrl && (
        <div className="w-full mb-6">
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-xl shadow-md"
          />
        </div>
      )}

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
        {blog.title}
      </h1>

      {/* Author */}
      <div className="flex items-center gap-3 text-gray-600 mb-6">
        <img
          src="https://picsum.photos/100/100"
          alt="author avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="text-sm sm:text-base">By {blog.authorName}</span>
      </div>

      {/* Content */}
      <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
        {blog.content}
      </div>
    </article>
  );
}