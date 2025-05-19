import React from "react";
import { EyeClosed, Eye } from "lucide-react";

interface Props {
  // Allows us to use an icon as a prop
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  type: string;
  placeholder: string;
  value: string;
  name: string;
  required?: boolean;
  isvisible?: boolean;
  onKeyDown?: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  togglepassword?: () => void;
}

const Input: React.FC<Props> = ({
  icon: Icon,
  togglepassword,
  isvisible,
  ...props
}) => {
  return (
    <div className="relative w-full bg-white border border-green-700 rounded-lg">
      <div className=" inset-y-0 absolute left-2 flex items-center pointer-events-none">
        <Icon className="size text-green-700" />
      </div>
      <input
        // Import all the props
        {...props}
        className="w-full pl-10 pr-3 py-4 outline-0 text-black placeholder-black/60 border-gray-700 focus:border-green-700 transition duration-200 focus:ring-2 rounded-lg focus:ring-green-700 "
      />

      {togglepassword &&
        (isvisible ? (
          <Eye
            onClick={togglepassword}
            className="size-6 absolute right-2 md:right-5 top-4  cursor-pointer text-green-700"
          />
        ) : (
          <EyeClosed
            onClick={togglepassword}
            className="size-6 absolute right-2 md:right-5 top-4 cursor-pointer text-green-700"
          />
        ))}
    </div>
  );
};

export default Input;
