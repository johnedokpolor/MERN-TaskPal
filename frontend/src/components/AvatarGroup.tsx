import React from "react";
import { AvatarGroupProps } from "../utils/interfaces";

const AvatarGroup: React.FC<AvatarGroupProps> = ({ avatars, maxVisible }) => {
  return (
    <div className="flex items-center">
      {avatars.slice(0, maxVisible).map((avatar, index) => (
        <img
          key={index}
          src={avatar}
          alt={`Avatar ${index + 1}`}
          className="size-11 rounded-full border-2 border-white -ml-3 first:-ml-0"
        />
      ))}
      {avatars.length > maxVisible && (
        <div className="size-11 flex items-center justify-center text-sm font-medium rounded-full dark:bg-[#1f1f1f] bg-green-50 border-2 border-white -ml-3">
          +{avatars.length - maxVisible}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
