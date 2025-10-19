/*import { useEffect, useState } from "react";
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
    const storedUser = async()=>{
    const res = await me();
    if(res.success===false){
      alert("You need to log in to access this page.");
      navigate("/signin");
      return;
    }else{
      setUser(res.user);
    }

    storedUser();
}
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
      console.log("Image uploaded to:", imageUrl);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center px-4 sm:px-6 py-10">
      <Toaster position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-10 border border-gray-100"
      >
        <motion.h2
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-400 bg-clip-text text-transparent mb-8 text-center"
        >
          Create Your Blog
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title 
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter a captivating title..."
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 sm:p-4 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
              required
            />
          </div>

          {/* Description *
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              name="description"
              placeholder="A short teaser for your post..."
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 sm:p-4 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
              required
            />
          </div>

          {/* Content *
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              name="content"
              placeholder="Write your blog content here..."
              value={formData.content}
              onChange={handleChange}
              rows={6}
              className="w-full p-3 sm:p-4 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none shadow-sm"
              required
            />
          </div>

          {/* Image Upload *
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image
            </label>
            <input
              type="file"
              name="imageFile"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
            />
            {formData.imageFile && (
              <img
                src={URL.createObjectURL(formData.imageFile)}
                alt="Preview"
                className="w-full h-48 object-cover rounded-xl mt-4 shadow-md"
              />
            )}
            {uploading && (
              <p className="text-sm text-indigo-600 mt-2 animate-pulse">
                Uploading image…
              </p>
            )}
          </div>

          {/* Submit Button *
          <motion.button
            whileHover={!uploading ? { scale: 1.02 } : {}}
            whileTap={!uploading ? { scale: 0.98 } : {}}
            disabled={uploading}
            type="submit"
            className={`w-full py-3 px-6 rounded-xl font-semibold text-lg shadow-lg transition-all duration-200 ${
              uploading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-400 text-white hover:shadow-xl"
            }`}
          >
            {uploading ? "Uploading..." : "Publish Post"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};*/
import { MusicTab } from "../components/editor/MusicTab";
import { Tools } from "../components/editor/Tools";
import { TypingArea } from "../components/editor/TypingArea";
import { Tags } from "../components/editor/Tags";
import { SubmitButton } from "../components/editor/SubmitButton";
export const CreateBlog = () => {
  return <div className="min-h-screen flex flex-col items-center">
    <MusicTab></MusicTab>
        <SubmitButton></SubmitButton>
    <Tools></Tools>
    <TypingArea></TypingArea>
    <Tags></Tags>
  </div>;
}
