import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContextStore } from "../../store/ContextStore";
import { SideMenuData, SideMenuUserData } from "../../utils/data";
import { MenuItem } from "../../utils/interfaces";
import toast from "react-hot-toast";

const SideMenu: React.FC<{ activeMenu: string }> = ({ activeMenu }) => {
  const [sideMenuData, setSideMenuData] = useState<MenuItem[]>([]);
  const navigate = useNavigate();
  const { logout, user, admin } = ContextStore();
  const loggedInUser = user ? user : admin;
  const firstname = loggedInUser?.name.split(" ")[0];

  const handleClick = async (route: string) => {
    if (route === "logout") {
      try {
        await logout();
        navigate("/login");
        if (admin) {
          toast.success(`GoodBye Admin ${firstname}`);
        } else {
          toast.success(`GoodBye User ${firstname}`);
        }
      } catch (error: any) {
        if (error.message === "Network Error") {
          toast.error(`${error.message}, connect to the internet.`);
          return;
        }
      }
      return;
    }
    navigate(route);
  };
  useEffect(() => {
    if (loggedInUser) {
      setSideMenuData(
        loggedInUser?.role === "admin" ? SideMenuData : SideMenuUserData
      );
    }

    return () => {};
  }, [loggedInUser]);

  return (
    <div className="lg:w-full w-64 h-screen  dark:bg-[#1f1f1f]  dark:text-white bg-[#f0f4f994] border-r dark:border-white/20 border-gray-300 ">
      <div className="flex flex-col items-center justify-center mb-7 pt-5">
        <div className="relative">
          <img
            src={loggedInUser?.profileImageUrl}
            className="size-20 rounded-full"
            alt="Profle Image"
          />
        </div>

        {loggedInUser?.role === "admin" && (
          <div className="text-md text-white bg-green-700 px-3 py-0.5 rounded mt-3">
            Admin
          </div>
        )}
        <h5 className="text-gray-900 dark:text-white/90 leading-6 mt-3 font-medium">
          {firstname}
        </h5>
        <p className="text-sm text-gray-500 dark:text-white/90">
          {loggedInUser?.email}
        </p>
        <div className="w-full mt-3">
          {sideMenuData.map((item: MenuItem, index: number) => (
            <button
              key={`menu_${index}`}
              className={`w-full flex  items-center gap-4 text-base  py-3 px-6 mb-3 cursor-pointer${
                activeMenu === item.label
                  ? " w-full border-r-3 border-green-700  bg-gradient-to-r from-green-50/40   to-green-100/40"
                  : ""
              }`}
              onClick={() => handleClick(item.path)}
            >
              <item.icon className="size-5  inline" />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
