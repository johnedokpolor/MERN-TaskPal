import React, { useState } from "react";
import { SelectDropdownProps } from "../../utils/interfaces";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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
      <AnimatePresence>
        {isOpen && (
          <div className="   border border-gray-300 rounded shadow-lg  w-full">
            {options.map((option, index: number) => (
              <motion.button
                initial={{ opacity: 0, y: -40 }}
                whileInView={{
                  opacity: 1,
                  y: 0,

                  transition: { duration: index > 1 ? 1.3 : index, delay: 0 },
                }}
                exit={{
                  opacity: 0,
                  y: -40,

                  transition: { duration: index > 1 ? 1.3 : index, delay: 0 },
                }}
                key={option.id}
                onClick={() => handleSelect(option.value)}
                className="block w-full text-sm text-left px-3 py-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700"
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SelectDropdown;
