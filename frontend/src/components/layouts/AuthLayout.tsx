import { ReactNode } from "react";
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
    <div className="bg-[whitesmoke] relative md:bg-white  overflow-hidden  flex items-center h-screen justify-center">
      <div className="w-screen flex  justify-center  p-3 md:p-0 items-center md:w-[45vw]">
        {props.children}
      </div>
      <div className="hidden md:flex w-[45vw] h-fit  rounded-2xl  items-center justify-center  overflow-hidden">
        <ImageSlider />
      </div>
      <p className="pb-2 absolute bottom-0 text-center text-black font-bold">
        &copy;2025 - {new Date().getFullYear()} Made with 💓 by GLtech
      </p>
    </div>
  );
};

export default AuthLayout;
