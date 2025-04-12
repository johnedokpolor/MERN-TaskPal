import React, { ReactNode } from "react";
import { ContextStore } from "../../store/ContextStore";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import LoadingSpinner from "../LoadingSpinner";

const DashboardLayout: React.FC<{
  children: ReactNode;
  activeMenu: string;
}> = ({ children, activeMenu }) => {
  const { user, isCheckingAuth } = ContextStore();

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }
  return (
    <div>
      <div className="fixed top-0 bg-white w-full z-50">
        <Navbar activeMenu={activeMenu} />
      </div>
      <div className="w-screen">
        <div className="hidden lg:flex w-[20%]  bg-white fixed top-[79px] md:top-[65px] z-50">
          <SideMenu activeMenu={activeMenu} />
        </div>
        <div className=" mx-5  mb-20 relative top-15 lg:left-[20%] lg:w-[76%]   ">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
