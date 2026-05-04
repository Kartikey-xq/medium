import axios from "axios";

export const getAllBlogs = async(page = 1, limit = 5)=>{
    try{
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/blog/bulk?page=${page}&limit=${limit}`,
            {withCredentials:true}
        );
        return response.data;
    }catch(error){
        console.error("Error fetching blogs:", error);
        return {success:false, message:"Error fetching blogs", blogs:[]};
    }
};

export const getUserBlogs = async(page = 1, limit = 5)=>{
    try{
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/blog/my-blogs?page=${page}&limit=${limit}`,
            {withCredentials:true}
        );
        return response.data;
    }catch(error){
        console.error("Error fetching user blogs:", error);
        return {success:false, message:"Error fetching user blogs", blog:[]};
    }
};
export const createBlog = async (title: string, content: string, description: string, imageUrl :string ) => {
        const payload: Record<string, unknown> = { title, content, description };
        if (imageUrl) {
            payload.imageUrl = imageUrl;
        }

        const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/blog/create`,
            payload,
            {headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
        return response.data;
}