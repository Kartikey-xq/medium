import { getAllBlogs } from "../api/allblogs";
import type{ blog } from "@kartik010700/common";
import { MotivationalLoader } from "../motion/MotivationalLoader";
import { useEffect, useState } from "react";
import { BlogHero } from "../components/BlogHero";

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