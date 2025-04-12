import { TaskStatusTabsProps } from "../utils/interfaces";

const TaskStatusTabs = ({
  tabs,
  activeTab,
  setActiveTab,
}: TaskStatusTabsProps) => {
  return (
    <div>
      {tabs.map((tab) => (
        <button
          key={tab.label}
          onClick={() => setActiveTab(tab.label)}
          className={`relative px-3 md:px-4 py-2 text-sm font-medium cursor-pointer${
            activeTab === tab.label
              ? " text-green-500 border-b-2 border-green-500"
              : "text-gray-500 hover:text-gray-700 dark:"
          }`}
        >
          <div>
            <span
              className="text-xs cursor-pointer
            "
            >
              {tab.label}
              <span
                className={`text-xs ml-2 px-2 py-0.5 rounded-full cursor-pointer${
                  activeTab === tab.label
                    ? " bg-green-500 text-white"
                    : "bg-gray-200/70 text-gray-600 dark:text-white/80"
                }`}
              >
                {tab.count}
              </span>
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default TaskStatusTabs;
