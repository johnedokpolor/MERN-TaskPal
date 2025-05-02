import React from "react";
import { AvatarGroupProps } from "../utils/interfaces";
// import { ContextStore } from "../store/ContextStore";

const AvatarGroup: React.FC<AvatarGroupProps> = ({ avatars, maxVisible }) => {
  // const { user, admin } = ContextStore();
  // const loggedInUser = user ? user : admin;
  // const firstname = loggedInUser?.name.split(" ")[0];
  // const lastname = loggedInUser?.name.split(" ")[1];
  // const acronym =
  //   (firstname?.charAt(0).toUpperCase() ?? "") +
  //   (lastname?.charAt(0).toUpperCase() ?? "");
  console.log(avatars, "avatars");
  return (
    <div className="flex items-center">
      {avatars.slice(0, maxVisible).map((avatar, index) => (
        <div
          key={index}
          className=" bg-green-700 text-white rounded-full size-11 flex items-center justify-center text-2xl font-bold"
        >
          <p>{avatar.split(" ")[0].charAt(0).toUpperCase()}</p>
          <p>{avatar.split(" ")[1]?.charAt(0).toUpperCase()}</p>
          {/* {avatar.split(" ")[1].charAt(0).toUpperCase()} */}
        </div>
        // <img
        //   key={index}
        //   src={avatar}
        //   alt={`Avatar ${index + 1}`}
        //   className="size-11 rounded-full border-2 border-white -ml-3 first:-ml-0"
        // />
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
