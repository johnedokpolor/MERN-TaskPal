import React from "react";
import { InfoCard as infoCard } from "../../utils/interfaces";

const InfoCard: React.FC<infoCard> = ({ label, value, color }) => {
  return (
    <div className="flex items-center gap-2 md:gap-3">
      <div className={`w-2 h-3 md:h-5 ${color} rounded-full`} />
      <p className="text-sm text-black dark:text-white md:text-base  font-semibold">
        {value}{" "}
        <span className="text-gray-500 dark:text-white/80 text-xs md:text-base">
          {label}
        </span>
      </p>
    </div>
  );
};

export default InfoCard;
