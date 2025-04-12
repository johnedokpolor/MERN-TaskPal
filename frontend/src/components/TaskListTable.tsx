import React from "react";
import { taskListTable } from "../utils/interfaces";
import moment from "moment";

const TaskListTable: React.FC<taskListTable> = ({ tableData }) => {
  const getStatusBadgeColor = (status: string) => {
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
  const getPriorityBadgeColor = (priority: string) => {
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
    <div className="overflow-x-auto p-0 rounded-lg mt-3">
      <table className="min-w-full">
        <thead>
          <tr className="text-left">
            <th className=" py-3 px-4 text-gray-800 font-medium text-sm dark:text-white">
              Name
            </th>
            <th className=" py-3 px-4 text-gray-800 font-medium text-sm dark:text-white">
              Status
            </th>
            <th className=" py-3 px-4 text-gray-800 font-medium text-sm dark:text-white">
              Priority
            </th>
            <th className=" py-3 px-4 text-gray-800 font-medium text-sm dark:text-white">
              Created On
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData?.map((task) => (
            <tr key={task._id} className="border-t border-gray-200">
              <td className="my-5 mx-4 text-gray-700 dark:text-white text-[13px] line-clamp-1 overflow-hidden">
                {task.title}
              </td>
              <td className="py-4 px-4">
                <span
                  className={`px-2 py-1 text-xs rounded text-nowrap inline-block ${getStatusBadgeColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </td>
              <td className="k">
                <span
                  className={`px-2 py-1 text-xs rounded inline-block ${getPriorityBadgeColor(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
              </td>
              {/* nowrap prevent text from wrapping onto the next line */}
              <td className="py-4 px-4 text-gray-700 dark:text-white text-[13px] text-nowrap md:table-cell">
                {task.createdAt
                  ? moment(task.createdAt).format("Do MMM YYYY")
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskListTable;
