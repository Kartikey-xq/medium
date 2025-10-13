import axios from "axios";

export const getAllBlogs = async()=>{
    try{
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/blog/bulk`,
            {withCredentials:true}
        );
        return response.data;
    }catch(error){
        console.error("Error fetching blogs:", error);
        return {success:false, message:"Error fetching blogs", blogs:[]};
    }
};
export const createBlog = async (title: string, content: string, description: string, imageUrl :string ) => {
        const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/blog/create`,
            { title, content, description,imageUrl },
            { withCredentials: true }
        );
        return response.data;
}