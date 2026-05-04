import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "../authContext";
import { useNavigate } from "react-router-dom";
import { me } from "../api/authApi";
import { getUserBlogs } from "../api/allblogs";
import { BlogHero } from "../components/BlogHero";

export const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const storedUser = async () => {
      const res = await me();
      if (res.success === false) {
        alert("You need to log in to access this page.");
        navigate("/signin");
        return;
      } else {
        setUser(res.user);
      }
    };
    storedUser();
  }, [setUser, navigate]);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      setLoading(true);
      const res = await getUserBlogs(page, 6); // fetch 6 blogs per page for a nice grid
      if (res.success) {
        setBlogs(res.blog);
        setTotalPages(res.totalPages || 1);
      }
      setLoading(false);
    };
    fetchUserBlogs();
  }, [page]);

  const name = user?.name;
  const email = user?.email;

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: User Profile */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white shadow-xl rounded-2xl p-8 flex flex-col items-center text-center border border-gray-100 lg:sticky lg:top-24"
          >
            {/* Profile Image */}
            <motion.img
              src="https://via.placeholder.com/150" // replace with real image URL if available
              alt="Profile"
              className="w-32 h-32 rounded-full mb-6 border-4 border-indigo-50 shadow-md object-cover"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />

            {/* Name */}
            <motion.h2
              className="text-2xl font-bold text-gray-900 mb-2"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {name || "Your Name"}
            </motion.h2>

            {/* Email */}
            <motion.p
              className="text-gray-500 text-sm font-medium"
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {email || "email@example.com"}
            </motion.p>
          </motion.div>
        </div>

        {/* Right Column: User Blogs Grid */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 flex items-center justify-between border-b pb-4 border-gray-200"
          >
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Blogs</h1>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : blogs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogs.map((blog: any, index: number) => (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="h-full"
                  >
                    <BlogHero
                      id={blog.id}
                      title={blog.title}
                      authorName={blog.authorName || name || "Unknown"}
                      description={blog.description}
                      imageUrl={blog.imageUrl || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80"}
                      content={blog.content}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12 mb-8 gap-4">
                  <button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                      page === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                    }`}
                  >
                    Previous
                  </button>
                  <span className="flex items-center px-4 font-semibold text-gray-700">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                    className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                      page === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center">
              <div className="bg-indigo-50 p-4 rounded-full mb-4">
                <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l5 5v11a2 2 0 01-2 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 2v5h5M12 11v6M9 14h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No blogs yet</h3>
              <p className="text-gray-500 mb-6">You haven't created any blogs. Share your thoughts with the world!</p>
              <button 
                onClick={() => navigate("/create")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-md"
              >
                Create your first blog
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
