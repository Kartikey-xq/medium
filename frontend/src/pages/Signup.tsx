import { Quote } from "../components/Quote"
import { motion } from "motion/react"
import { SignupForm } from "../components/SingupForm";

export const Signup = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <motion.div
        animate={{ scale: 1 }}
        initial={{ scale: 0 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
        className="flex justify-center items-center p-4"
      >
        <SignupForm />
      </motion.div>

      <div className="hidden md:block">
        <Quote />
      </div>
    </div>
  );
};
