import { motion } from "motion/react";
import icon from "../../public/nexa-icon.png";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-[whitesmoke] dark:bg-[#1f1f1f] flex items-center justify-center relative overflow-hidden">
      {/* Simple Loading Spinner */}
      <motion.div>
        <img
          src={icon}
          className="size-18  animate-pulse  rounded-full"
          alt=""
        />
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
