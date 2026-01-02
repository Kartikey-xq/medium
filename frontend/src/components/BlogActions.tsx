import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { toast } from "react-hot-toast";

type Props = {
  likes: number;
  comments: number;
  saves: number;
  isLoggedIn: boolean;
  onLike: () => void;
  onSave: () => void;
  onComment?: () => void;
};

export const BlogActions = ({
  likes,
  comments,
  saves,
  isLoggedIn,
  onLike,
  onSave,
  onComment,
}: Props) => {
  const guard = (action?: () => void) => {
    if (!isLoggedIn) {
      toast.error("Login required");
      return;
    }
    action?.();
  };

  return (
    <div
      className="flex items-center justify-between text-gray-500 mt-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-6">
        <button
          onClick={() => guard(onLike)}
          className="flex items-center gap-1 hover:text-red-500 transition"
        >
          <Heart size={20} />
          <span className="text-sm">{likes}</span>
        </button>

        <button
          onClick={() => guard(onComment)}
          className="flex items-center gap-1 hover:text-gray-800 transition"
        >
          <MessageCircle size={20} />
          <span className="text-sm">{comments}</span>
        </button>
      </div>

      <button
        onClick={() => guard(onSave)}
        className="flex items-center gap-1 hover:text-gray-800 transition"
      >
        <Bookmark size={18} />
        <span className="text-sm">{saves}</span>
      </button>
    </div>
  );
};
