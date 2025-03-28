import React from "react";
import { EyeClosed, Eye } from "lucide-react";

interface Props {
  // Allows us to use an icon as a prop
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  type: string;
  placeholder: string;
  value: string;
  name: string;
  required: boolean;
  isvisible?: boolean;
  ref?: React.Ref<HTMLInputElement>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  togglepassword?: () => void;
}

const Input: React.FC<Props> = ({ icon: Icon, ...props }) => {
  return (
    <div className="relative mb-6  w-full  bg-gray-800/50  rounded-lg">
      <div className=" inset-y-0 absolute left-2 flex items-center   pointer-events-none">
        <Icon className="size text-green-500" />
      </div>
      <input
        // Import all the props
        {...props}
        className="w-full pl-10 pr-3 py-4 outline-0 text-white placeholder-gray-400 border-gray-700 focus:border-green-500 transition duration-200 focus:ring-2 rounded-lg focus:ring-green-500 "
      />

      {props.togglepassword &&
        (props.isvisible ? (
          <Eye
            onClick={props.togglepassword}
            className="size-6 absolute right-5 top-4  cursor-pointer text-green-500"
          />
        ) : (
          <EyeClosed
            onClick={props.togglepassword}
            className="size-6 absolute right-5 top-4 cursor-pointer text-green-500"
          />
        ))}
    </div>
  );
};

export default Input;
