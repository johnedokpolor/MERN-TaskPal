import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { ContextStore } from "../store/ContextStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Button: React.FC<{ text: string }> = ({ text }) => {
  const { isLoading, logout } = ContextStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error: any) {
      if (error.message === "Network Error") {
        toast.error(`${error.message}, connect to the internet.`);
        return;
      }
    }
  };
  return (
    <motion.button
      whileHover={{
        scale: 1.05,
      }}
      whileTap={{
        scale: 0.95,
      }}
      className=" mt-4 w-full rounded-lg bg-gradient-to-r py-3 px-4 from-green-700 to-emerald-700 text-white font-bold rouneded-lg shadow-lg hover:from-green-600 to hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
      type="submit"
      disabled={isLoading}
      onClick={text === "Logout" ? handleLogout : undefined}
    >
      {isLoading ? (
        <Loader size={24} className=" animate-spin mx-auto" />
      ) : (
        `${text}`
      )}
    </motion.button>
  );
};

export default Button;
