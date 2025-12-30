import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAuth } from "../authContext";
import { useNavigate } from "react-router-dom";
import { me } from "../api/authApi";

export const Profile = () => {
  const { user,setUser } = useAuth();
  const navigate = useNavigate();
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
  
  }
        storedUser();

  }, [setUser, navigate]);
  const name = user?.name;
  const email = user?.email;
  return (
    <div className="md:h-full flex items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm flex flex-col items-center text-center border border-gray-200"
      >
        {/* Profile Image */}
        <motion.img
          src="https://via.placeholder.com/120" // replace with real image URL if available
          alt="Profile"
          className="w-28 h-28 rounded-full mb-4 border-2 border-gray-300"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />

        {/* Name */}
        <motion.h2
          className="text-xl font-bold text-gray-900 mb-2"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {name || "Your Name"}
        </motion.h2>

        {/* Email */}
        <motion.p
          className="text-gray-600 text-sm"
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {email || "email@example.com"}
        </motion.p>
      </motion.div>
    </div>
  );
};
