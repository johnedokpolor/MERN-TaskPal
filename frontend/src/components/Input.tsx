import React from "react";

interface Props {
  // Allows us to use an icon as a prop
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  type: string;
  placeholder: string;
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const Input: React.FC<Props> = ({ icon: Icon, ...props }) => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0  left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="size text-green-500" />
      </div>
      <input
        // Import all the props
        {...props}
        className="w-full pl-10 pr-3 py-2 bg-gray-800/50 border  border-gray-700 focus:border-green-500 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200 focus:ring-2 rounded-lg"
      />
    </div>
  );
};

export default Input;
