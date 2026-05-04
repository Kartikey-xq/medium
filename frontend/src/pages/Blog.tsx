import { getAllBlogs } from "../api/allblogs";
import type{ blog } from "@kartik010700/common";
import { MotivationalLoader } from "../motion/MotivationalLoader";
import { useEffect, useState } from "react";
import { BlogHero } from "../components/BlogHero";

export const Blog = () => {
    const [blogs, setBlogs] = useState<blog[]>([]); // Ensure it's always an array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
    async function fetchAllBlogs() {
        try {
            setLoading(true);
            const res = await getAllBlogs(currentPage);
            
            console.log("API Response:", res); // 🔍 Add this to see what you're getting
            
            if (!res || res.success === false) {
                setError(res?.message || "Failed to fetch blogs");
                return;
            }
            
            if (res.blog && Array.isArray(res.blog)) {
                setBlogs(res.blog);
                setTotalPages(res.totalPages || 1);
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
}, [currentPage]);

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
        <div className="pb-12 max-w-4xl mx-auto px-4">
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 gap-4">
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className={`px-5 py-2 border rounded-full font-medium transition ${
                            currentPage === 1 
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" 
                            : "bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300"
                        }`}
                    >
                        Previous
                    </button>
                    <span className="text-gray-600 font-medium px-4">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage >= totalPages}
                        className={`px-5 py-2 border rounded-full font-medium transition ${
                            currentPage >= totalPages 
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" 
                            : "bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300"
                        }`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}