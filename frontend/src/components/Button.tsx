import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const Button: React.FC<{ text: string }> = ({ text }) => {
  const { isLoading, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <motion.button
      whileHover={{
        scale: 1.05,
      }}
      whileTap={{
        scale: 0.95,
      }}
      className=" mt-4 w-full rounded-lg bg-gradient-to-r py-3 px-4 from-green-500 to-emerald-600 text-white font-bold rouneded-lg shadow-lg hover:from-green-600 to hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
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
