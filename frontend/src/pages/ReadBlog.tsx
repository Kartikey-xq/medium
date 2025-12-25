// ReadBlog.tsx
import { useLocation } from 'react-router-dom';

export function ReadBlog() {
    const location = useLocation();
    const blog = location.state; // Get the passed data

    // Fallback: if user directly visits /blog/123 without clicking (no state)
    {/* You might want to fetch the blog by ID here using useParams and an API call */}
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
            <div className="text-gray-600 mb-6">
                <span>By {blog.authorName}</span>
            </div>
            <div className="prose prose-lg">
                {blog.content}
            </div>
        </div>
    );
}