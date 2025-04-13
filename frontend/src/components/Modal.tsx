import React from "react";
import { ModalProps } from "../utils/interfaces";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose, title }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -40, x: -40 }}
          whileInView={{
            opacity: 1,
            y: 0,
            x: 0,
            transition: { duration: 0.3, delay: 0 },
          }}
          exit={{
            opacity: 1,
            y: -40,
            x: 40,
            transition: { duration: 0.3, delay: 0 },
          }}
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full backdrop-blur-xs overflow-y-auto overflow-x-hidden bg-black/10"
        >
          <div className="p-4 relative max-w-2xl w-full h-fit">
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow-sm dark:bg-[#1f1f1f]">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {title}
                </h3>
                <button onClick={onClose}>
                  <X className="size-5 text-gray-500 dark:text-white cursor-pointer" />
                </button>
              </div>
              {/* Modal body */}
              <div className="p-4 md:p-5 space-y-4">{children}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
