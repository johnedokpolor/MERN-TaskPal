import React from "react";
import { Paperclip } from "lucide-react";
import moment from "moment";
import { motion } from "motion/react";
import Progress from "../Progress";
import AvatarGroup from "../AvatarGroup";
import { TaskCardProps } from "../../utils/interfaces";
const TaskCard: React.FC<TaskCardProps> = ({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  duration,
  assignedTo,
  attachmentCount,
  completedTodoCount,
  todoChecklist,
  onClick,
}) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-[#4CAF50] border border-[#4CAF50]";
      case "Pending":
        return "bg-orange-100 text-[#FFC107] border border-[#FFC107]";
      case "In Progress":
        return "bg-blue-100 text-[#03A9F4] border border-[#03A9F4]";

      default:
        return "bg-gray-100 text-gray-500 border border-gray-200";

        break;
    }
  };
  const getPriorityTagColor = () => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-[#FF0000] border border-[#FF0000]";
      case "Medium":
        return "bg-yellow-100 text-[#FFD700] border border-[#FFD700]";
      case "Low":
        return "bg-green-100 text-[#00FF00] border border-[#00FF00]";

      default:
        return "bg-gray-100 text-gray-500 border border-gray-200";

        break;
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: duration, delay: 0 },
      }}
      className="bg-[#f0f4f994] dark:shadow-gray-900 dark:bg-[#1f1f1f] dark:border-white/20 rounded-xl py-4 shadow-md shadow-gray-100 border border-gray-200/50 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-end gap-3 px-4">
        <div
          className={` ${getStatusTagColor()}text-[11px] font-medium px-4 py-0.5 rounded`}
        >
          {status}
        </div>
        <div
          className={` ${getPriorityTagColor()}text-[11px] font-medium px-4 py-0.5 rounded`}
        >
          {priority} Priority
        </div>
      </div>
      <div
        className={`px-4 border-l-3 ${
          status === "In Progress"
            ? "border-blue-500"
            : status === "Completed"
            ? "border-green-500"
            : "border-[#FFC107]"
        }`}
      >
        <p className="text-base font-medium dark:text-white text-gray-800 mt-4 line-clamp-2">
          {title}
        </p>
        <p className="text-xs text-gray-500 dark:text-white/80 mt-1.5 line-clamp-2 leaing-[18px]">
          {description}
        </p>
        <p className="text-base text-gray-700/80 dark:text-white  font-medium mt-2 mb-2 leading-[18px]">
          Task Done{" "}
          <span className="font-semibold text-gray-700 dark:text-white">
            {`${completedTodoCount} / ${todoChecklist}`}
          </span>
        </p>

        <Progress progress={progress} status={status} />
      </div>
      <div className="px-4">
        <div className="flex items-center justify-between my-1">
          <div>
            <label className="text-xs text-gray-500 dark:text-white/80">
              Start Date
            </label>
            <p className="text-base font-medium text-gray-900 dark:text-white">
              {moment(createdAt).format("Do MMM YYYY")}
            </p>
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-white/80">
              Due Date
            </label>
            <p className="text-base font-medium text-gray-900 dark:text-white">
              {moment(dueDate).format("Do MMM YYYY")}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <AvatarGroup avatars={assignedTo} maxVisible={3} />
          {attachmentCount > 0 && (
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-100/40 px-2.5 py-1.5 rounded-lg">
              <Paperclip className="text-green-500 size-4" />
              <span className="text-xs text-gray-900 dark:text-white">
                {attachmentCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
