 
 
 import axios from "axios";
 import type {SignupApiResponse} from "@kartik010700/common"
 export const me = async () : Promise<SignupApiResponse> => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/user/me`,
        { withCredentials: true }  
      );
      

      return response.data;
    } catch {
      return { success: false, message: "Not authenticated", user: { id: "", name: "", email: "" } };
    }
  };

export const signOut = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/user/sign-out`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    return { success: false, message: "Sign out failed" };
  }
};