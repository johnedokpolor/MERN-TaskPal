import React, { ReactNode } from "react";
import { ContextStore } from "../../store/ContextStore";
import LoadingSpinner from "../../components/LoadingSpinner";
import ImageSlider from "../ImageSlider";

interface Props {
  children: ReactNode;
}
const AuthLayout = (props: Props) => {
  const { isCheckingAuth } = ContextStore();

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }
  return (
    <div className=" bg-[whitesmoke] md:bg-white  flex items-center justify-center relative  overflow-hidden">
      <div className="flex">
        <div className="w-screen flex  justify-center min-h-screen p-3 md:p-0 items-center md:w-[50vw]">
          {/* <h2 className="text-lg font-medium text-black">Task Manager</h2> */}
          {props.children}
        </div>
        <div className="hidden md:flex w-[50vw]  rounded-2xl h-screen items-center justify-center bg-green-700 overflow-hidden">
          <ImageSlider />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
