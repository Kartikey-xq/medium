import { Heart, MessageCircle, Bookmark, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  isLiked,
  isSaved,
  hitLike,
  hitSave,
  likeCount,
  commentCount,
  saveCount,
} from "../api/interactions";

type Props = {
  blogId: string;
  onComment?: () => void;
};

export const BlogActions = ({ blogId, onComment }: Props) => {
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user") || "{}")?.id ?? null;

  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);
  const [saves, setSaves] = useState(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const [saveAnim, setSaveAnim] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch initial counts and states
  const syncData = useCallback(async () => {
    if (!blogId) return;

    try {
      setLoading(true);
      const [l, c, s] = await Promise.all([
        likeCount(blogId),
        commentCount(blogId),
        saveCount(blogId),
      ]);

      setLikes(l);
      setComments(c);
      setSaves(s);

      if (userId) {
        const [likedStatus, savedStatus] = await Promise.all([
          isLiked(userId, blogId),
          isSaved(userId, blogId),
        ]);
        setLiked(likedStatus);
        setSaved(savedStatus);
      }
    } catch (error) {
      console.error("Failed to sync data:", error);
    } finally {
      setLoading(false);
    }
  }, [blogId, userId]);

  useEffect(() => {
    syncData();
  }, [syncData]);


  const handleLike = () => {
    // Check guard BEFORE creating the async action
    if (!userId) {
      toast.error("Please login to continue", {
        duration: 4000,
      });
      setTimeout(() => navigate("/signin"), 1500);
      return;
    }

    // Only execute if logged in
    (async () => {
      const wasLiked = liked;
      setLiked((prev) => !prev);
      setLikes((prev) => (wasLiked ? prev - 1 : prev + 1));
      setLikeAnim(true);

      try {
        await hitLike(userId, blogId);
        await syncData();
      } catch (error) {
        // Revert on error
        setLiked(wasLiked);
        setLikes((prev) => (wasLiked ? prev + 1 : prev - 1));
        toast.error("Failed to update like");
        console.error(error);
      } finally {
        setTimeout(() => setLikeAnim(false), 150);
      }
    })();
  };

  const handleSave = () => {
    // Check guard BEFORE creating the async action
    if (!userId) {
      toast.error("Please login to continue", {
        duration: 4000,
      });
      setTimeout(() => navigate("/signin"), 1500);
      return;
    }

    // Only execute if logged in
    (async () => {
      const wasSaved = saved;
      setSaved((prev) => !prev);
      setSaves((prev) => (wasSaved ? prev - 1 : prev + 1));
      setSaveAnim(true);

      try {
        await hitSave(userId, blogId);
        await syncData();
      } catch (error) {
        // Revert on error
        setSaved(wasSaved);
        setSaves((prev) => (wasSaved ? prev + 1 : prev - 1));
        toast.error("Failed to update save");
        console.error(error);
      } finally {
        setTimeout(() => setSaveAnim(false), 150);
      }
    })();
  };

  const handleComment = () => {
    if (!userId) {
      toast.error("Please login to continue", {
        duration: 4000,
      });
      setTimeout(() => navigate("/login"), 1500);
      return;
    }
    onComment?.();
  };

  return (
    <div
      className="flex items-center justify-between text-gray-500 mt-4"
      onClick={(e) => e.stopPropagation()}
    >
      {loading ? (
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              disabled={loading}
              className={`flex items-center gap-1 transition disabled:opacity-50
                ${liked ? "text-red-500" : "hover:text-red-500"}
                ${likeAnim ? "scale-125" : "scale-100"}
              `}
            >
              <Heart size={20} className={liked ? "fill-red-500" : ""} />
              <span className="text-sm">{likes}</span>
            </button>

            <button
              onClick={handleComment}
              disabled={loading}
              className="flex items-center gap-1 hover:text-gray-800 transition disabled:opacity-50"
            >
              <MessageCircle size={20} />
              <span className="text-sm">{comments}</span>
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className={`flex items-center gap-1 transition disabled:opacity-50
              ${saved ? "text-gray-900" : "hover:text-gray-800"}
              ${saveAnim ? "scale-125" : "scale-100"}
            `}
          >
            <Bookmark size={18} className={saved ? "fill-gray-900" : ""} />
            <span className="text-sm">{saves}</span>
          </button>
        </>
      )}
    </div>
  );
};