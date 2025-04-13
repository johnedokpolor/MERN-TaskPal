import React, { useState } from "react";
import SideMenu from "./SideMenu";
import { ListTodo, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import ToggleDarkMode from "../ToggleDarkMode";

const Navbar: React.FC<{ activeMenu: string }> = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  return (
    <div className="w-full bg-[#f0f4f994] px-5 md:px-10 py-4 flex items-center justify-between border-b border-gray-300 dark:bg-[#1f1f1f] dark:border-white/20">
      <div className="flex items-center gap-1">
        <button
          className="block text-lg lg:hidden text-black"
          onClick={() => {
            setOpenSideMenu(!openSideMenu);
          }}
        >
          {openSideMenu ? (
            <X className="dark:text-white" />
          ) : (
            <Menu className="dark:text-white" />
          )}
        </button>
        {/* <img src={logo} className="bg-black rounded-full size-13" alt="Logo" />
         */}
        <ListTodo className="bg-green-700 p-1 text-white rounded size-8" />
        <h1 className="font-medium text-2xl ">Nexa</h1>
      </div>
      <ToggleDarkMode />

      <AnimatePresence>
        {openSideMenu && (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{
              opacity: 1,
              x: 0,
              transition: { duration: 0.5, delay: 0 },
            }}
            exit={{
              opacity: 0,
              x: -40,
              transition: { duration: 1, delay: 0 },
            }}
            className="fixed left-0 lg:hidden backdrop-blur-[1px] w-full top-[65px] z-50"
            onClick={() => {
              setOpenSideMenu(!openSideMenu);
            }}
          >
            <SideMenu activeMenu={activeMenu} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
