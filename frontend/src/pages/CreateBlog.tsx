import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { createBlog } from "../api/allblogs";
import { useAuth } from "../authContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { me } from "../api/authApi";

export const CreateBlog = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    imageFile: null as File | null,
  });
  const [uploading, setUploading] = useState(false);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "imageFile" && files) {
      setFormData((prev) => ({ ...prev, imageFile: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    let imageUrl = "";

    try {
      if (formData.imageFile) {
        setUploading(true);

        const presignRes = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/upload/blog-image`,
          {
            fileName: formData.imageFile.name,
            fileType: formData.imageFile.type,
          },
          { withCredentials: true }
        );

        const { uploadUrl, publicUrl } = presignRes.data;
        await axios.put(uploadUrl, formData.imageFile);
        imageUrl = publicUrl;
      }

      const response = await createBlog(
        formData.title,
        formData.content,
        formData.description,
        imageUrl
      );

      if (response.success) {
        toast.success("🎉 Blog created successfully!");
        setFormData({
          title: "",
          description: "",
          content: "",
          imageFile: null,
        });
        navigate("/blogs");
      } else if (response.message === "invalid token") {
        toast.error("Session expired. Please sign in again.");
        navigate("/signin");
      } else {
        toast.error("Failed to create blog: " + response.message);
      }
    } catch (error) {
      console.error("Error uploading image or creating blog:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start px-4 sm:px-6 py-10">
      <Toaster position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl bg-white rounded-xl shadow-md border border-gray-200"
      >
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-blue-800">
            New Blog Post
          </h2>
          <button
            onClick={() => navigate("/blogs")}
            className="text-sm text-gray-500 hover:text-indigo-600 transition"
          >
            Back
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Blog Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full text-lg font-semibold border-b border-gray-300 focus:border-indigo-500 outline-none py-2"
            required
          />

          {/* Description */}
          <input
            type="text"
            name="description"
            placeholder="Short description"
            value={formData.description}
            onChange={handleChange}
            className="w-full text-base border-b border-gray-300 focus:border-indigo-500 outline-none py-2"
            required
          />

          {/* Content */}
          <textarea
            name="content"
            placeholder="Write your blog content here..."
            value={formData.content}
            onChange={handleChange}
            rows={10}
            className="w-full text-base border border-gray-300 rounded-lg focus:border-indigo-500 outline-none p-4 resize-y min-h-[200px]"
            required
          />

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <label className="flex items-center justify-center w-full sm:w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition">
                <span className="text-gray-500 text-sm">Tap to upload</span>
                <input
                  type="file"
                  name="imageFile"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
              {formData.imageFile && (
                <img
                  src={URL.createObjectURL(formData.imageFile)}
                  alt="Preview"
                  className="w-full sm:w-48 h-32 object-cover rounded-lg shadow-md"
                />
              )}
            </div>
            {uploading && (
              <p className="text-sm text-indigo-600 mt-2 animate-pulse">
                Uploading image…
              </p>
            )}
          </div>

          {/* Submit */}
          <motion.button
            whileHover={!uploading ? { scale: 1.02 } : {}}
            whileTap={!uploading ? { scale: 0.98 } : {}}
            disabled={uploading}
            type="submit"
            className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
              uploading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {uploading ? "Uploading..." : "Publish Post"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};