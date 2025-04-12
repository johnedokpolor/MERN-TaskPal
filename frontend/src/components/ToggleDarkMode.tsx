import { ContextStore } from "../store/ContextStore";
import { Moon, Sun } from "lucide-react";

const ToggleDarkMode = () => {
  const { setDarkMode, dark } = ContextStore();

  return (
    <div
      onClick={() => setDarkMode(dark)}
      className="relative cursor-pointer h-6 w-12 rounded-full bg-black dark:bg-white"
    >
      <div className="absolute m-1 h-4 w-4 rounded-full duration-300 dark:translate-x-6">
        {dark ? (
          <Moon className="rounded-full size-4 bg-white text-black" />
        ) : (
          <Sun className="rounded-full size-4 bg-black text-white" />
        )}
      </div>
    </div>
  );
};

export default ToggleDarkMode;
