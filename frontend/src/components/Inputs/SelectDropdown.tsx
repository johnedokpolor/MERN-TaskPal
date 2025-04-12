import React, { useState } from "react";
import { SelectDropdownProps } from "../../utils/interfaces";
import { ChevronDown, ChevronUp } from "lucide-react";

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  options,
  onChange,
  placeholder,
  value,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="form-input flex relative justify-between cursor-pointer items-center w-full"
      >
        {value
          ? options.find((option) => option.value === value)?.label
          : placeholder}
        <span>
          {isOpen ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronDown className="size-4" />
          )}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className=" bg-[#f0f4f994] dark:bg-[#1f1f1f] border border-gray-300 rounded shadow-lg mt-1 w-full">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.value)}
              className="block w-full text-sm text-left px-3 py-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectDropdown;
