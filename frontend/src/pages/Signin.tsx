import { Quote } from "../components/Quote"
import { LoginForm } from "../components/LoginForm"
import { motion } from "motion/react"

export const Signin = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <motion.div
        animate={{ scale: 1 }}
        initial={{ scale: 0 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
        className="flex justify-center items-center p-4"
      >
        <LoginForm />
      </motion.div>

      <div className="hidden md:block">
        <Quote />
      </div>
    </div>
  );
};
