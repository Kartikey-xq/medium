import axios from "axios";

const API_BASE = import.meta.env.VITE_BASE_URL;

/* ---------- LIKE ---------- */
export const hitLike = async (userId: string | null, blogId: string | null) => {
  if (!userId) throw new Error("User not authenticated");
  if (!blogId) throw new Error("Blog ID missing");

  try {
    return await axios.post(
      `${API_BASE}/interactions/like`,
      { userId, blogId },
      { withCredentials: true }
    );
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || "Failed to like blog");
  }
};

export const likeCount = async (blogId: string | null) => {
  if (!blogId) throw new Error("Blog ID missing");

  try {
    const res = await axios.get(
      `${API_BASE}/interactions/like/${blogId}`,
      { withCredentials: true }
    );
    return res.data.count;
  } catch {
    throw new Error("Failed to fetch like count");
  }
};

/* ---------- SAVE ---------- */
export const hitSave = async (userId: string | null, blogId: string | null) => {
  if (!userId) throw new Error("User not authenticated");
  if (!blogId) throw new Error("Blog ID missing");

  try {
    return await axios.post(
      `${API_BASE}/interactions/save`,
      { userId, blogId },
      { withCredentials: true }
    );
  } catch {
    throw new Error("Failed to save blog");
  }
};

export const saveCount = async (blogId: string | null) => {
  if (!blogId) throw new Error("Blog ID missing");

  try {
    const res = await axios.get(
      `${API_BASE}/interactions/save/${blogId}`,
      { withCredentials: true }
    );
    return res.data.count;
  } catch {
    throw new Error("Failed to fetch save count");
  }
};

/* ---------- COMMENT ---------- */
export const hitComment = async (
  blogId: string | null,
  userId: string | null,
  content: string | null
) => {
  if (!userId) throw new Error("User not authenticated");
  if (!blogId) throw new Error("Blog ID missing");
  if (!content?.trim()) throw new Error("Comment cannot be empty");

  try {
    return await axios.post(
      `${API_BASE}/interactions/comment`,
      { userId, blogId, content },
      { withCredentials: true }
    );
  } catch {
    throw new Error("Failed to post comment");
  }
};

export const commentCount = async (blogId: string | null) => {
  if (!blogId) throw new Error("Blog ID missing");

  try {
    const res = await axios.get(
      `${API_BASE}/interactions/comment/${blogId}`,
      { withCredentials: true }
    );
    return res.data.count;
  } catch {
    throw new Error("Failed to fetch comment count");
  }
};
