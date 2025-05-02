import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link2 } from "lucide-react";
import moment from "moment";
import { motion } from "motion/react";
import { Task } from "../../utils/interfaces";
import axios from "axios";
import { BASE_URL, TASK_URL } from "../../store/ContextStore";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import AvatarGroup from "../../components/AvatarGroup";
import ViewTaskDetailsSkeleton from "../../components/Skeletons/ViewTaskDetailsSkeleton";

const ViewTaskDetails = () => {
  const { id } = useParams();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  const getStatusBadgeColor = (status: string | undefined) => {
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
  const getTaskDetailsById = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/${TASK_URL}/${id}`);
      setTask(response.data.task);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching task details", error);
      setLoading(false);
    }
  };
  const updateTodoChecklist = async (index: number) => {
    const todoChecklist = task?.todoChecklist ? [...task.todoChecklist] : [];
    if (todoChecklist && todoChecklist[index]) {
      todoChecklist[index].completed = !todoChecklist[index].completed;
    }

    try {
      const response = await axios.put(`${BASE_URL}/${TASK_URL}/${id}/todo`, {
        todoChecklist,
      });
      console.log(response);
      if (response.status === 200) {
        setTask(response.data.task);
      } else {
        // revert back if the api call fails
        todoChecklist[index].completed = !todoChecklist[index].completed;
      }
    } catch (error) {
      todoChecklist[index].completed = !todoChecklist[index].completed;
      console.error("Error updating todo checklist", error);
    }
  };
  const handleLinkClick = (link: string) => {
    // check if the link is a valid URL
    if (!/^https?:\/\//i.test(link)) {
      link = `https://${link}`;
      // opens url in a new window tab
      window.open(link, "_blank");
    }
  };

  useEffect(() => {
    if (id) {
      getTaskDetailsById();
    }
  }, [id]);
  return (
    <DashboardLayout activeMenu="My Tasks">
      {loading ? (
        <ViewTaskDetailsSkeleton />
      ) : (
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{
            opacity: 1,
            x: 0,
            transition: { duration: 0.5, delay: 0 },
          }}
          className="mt-5"
        >
          {task && (
            <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
              <div className="form-card col-span-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-medium truncate">
                    {task?.title}
                  </h2>
                  <div
                    className={`text-base font-medium px-4 py-0.5 text-nowrap rounded ${getStatusBadgeColor(
                      task?.status
                    )}`}
                  >
                    {task?.status}
                  </div>
                  <div
                    className={`text-base hidden md:flex font-medium px-4 py-0.5 rounded ${getPriorityBadgeColor(
                      task?.priority
                    )}`}
                  >
                    {task?.priority}
                  </div>
                </div>
                <div className="mt-4">
                  <InfoBox label="Description" value={task?.description} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <div className="">
                    <InfoBox label="Priority" value={task?.priority} />
                  </div>
                  <div className="">
                    <InfoBox
                      label="Due Date"
                      value={
                        task?.dueDate
                          ? moment(task.dueDate).format("dddd Do MMM YYYY")
                          : "N/A"
                      }
                    />
                  </div>
                  <div className="">
                    <label className="font-medium text-sm text-slate-500 dark:text-white/80">
                      Assigned To
                    </label>

                    {/* <AvatarGroup
                      avatars={task?.assignedTo.map(
                        (user) => user.profileImageUrl
                      )}
                      maxVisible={5}
                    /> */}
                  </div>
                </div>
                <div className="mt-2">
                  <label className="font-medium text-sm text-slate-500 dark:text-white/80">
                    Todo Checklist
                  </label>
                  {task.todoChecklist.map((todo, index) => (
                    <TodoCheckList
                      key={index}
                      text={todo.text}
                      isChecked={todo?.completed}
                      onChange={() => updateTodoChecklist(index)}
                    />
                  ))}
                </div>
                {task.attachments.length > 0 && (
                  <div className="mt-2">
                    <label className="font-medium text-sm text-slate-500 dark:text-white/80">
                      Attachments
                    </label>
                    {task?.attachments.map((link, index) => (
                      <Attachment
                        key={index}
                        link={link}
                        index={index}
                        onClick={() => handleLinkClick(link)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default ViewTaskDetails;

const InfoBox = ({ label, value }: { label: string; value?: string }) => {
  return (
    <div className="mt-4">
      <p className="font-medium text-sm text-slate-500 dark:text-white/80">
        {label}
      </p>
      <p className="mt-1 text-base text-gray-700 dark:text-white">{value}</p>
    </div>
  );
};
const TodoCheckList = ({
  text,
  isChecked,
  onChange,
}: {
  text: string;
  isChecked: boolean;
  onChange: () => void;
}) => {
  return (
    <div className=" flex items-center gap-3 p-3">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="size-4 text-green-500 bg-gray-100 dark:bg-transparent border-gray-300 rounded-sm outline-0 cursor-pointer"
      />
      <p className="text-base text-gray-700 dark:text-white">{text}</p>
    </div>
  );
};
const Attachment = ({
  link,
  index,
  onClick,
}: {
  link: string;
  index: number;
  onClick: () => void;
}) => {
  return (
    <div
      className=" flex items-center  bg-gray-50 border dark:bg-[#1f1f1f] border-gray-100 px-3 py-2 rounded-md mb-3 cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-100"
      onClick={onClick}
    >
      <div className="flex flex-1 items-center gap-3  border-border-gray-100">
        <span className="text-xs text-gray-400 dark:text-white/80  font-semibold mr-2">
          {index < 9 ? `0${index + 1}` : index + 1}
        </span>
        <p className="text-xs">{link}</p>
      </div>
      <Link2 className="size-5 text-gray-500 dark:text-white/80" />
    </div>
  );
};
