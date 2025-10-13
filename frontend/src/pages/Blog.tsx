import { useEffect, useState } from "react"
import { getAllBlogs } from "../api/allblogs";
import type{ blog } from "@kartik010700/common";
import { MotivationalLoader } from "../motion/MotivationalLoader";

type heroProps = {
    title: string;
    authorName: string;
    description : string;
    imageUrl: string|undefined;

}

const BlogHero = ({title, description, authorName, imageUrl} : heroProps)=>{
    return (
        <div className="p-8 m-6 shadow-md rounded-2xl">
            <header className="flex gap-2 mb-3">
                <img src="https://picsum.photos/300/200" alt="circle" className="w-9 h-9 rounded-full"></img>
                <h3 className ="inline">{authorName}</h3>
            </header>
            <div className="flex justify-between gap-4" >
                <div>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold"><strong> {title} </strong> </p>
            <h3>{description}</h3>
                </div>
            <img src= {imageUrl}alt="circle" className="h-29 w-29 p-2"></img>         
            </div>
        </div>
    )
}

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
                    title={blog.title} 
                    authorName={blog.authorName} 
                    description={blog.description}
                    imageUrl={blog.imageUrl}
                />
            ))}
        </>
    )
}