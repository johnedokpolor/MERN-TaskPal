import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { BASE_URL, TASK_URL } from "../../store/ContextStore";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";
import ManageTaskSkeleton from "../../components/Skeletons/ManageTaskSkeleton";

const MyTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState<{ label: string; count: number }[]>([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  const getAllTasks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/${TASK_URL}`, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });
      setAllTasks(response.data.tasks);
      console.log(response.data.tasks);

      // Map status summary data with labels and order

      const statusSummary = response.data.statusSummary || {};
      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ];

      setTabs(statusArray);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks", error);
      setLoading(false);
    }
  };

  const handleClick = (taskId: string) => {
    navigate(`/user/task-details/${taskId}`);
  };

  // filters books according to the status
  const filteredTasks = allTasks.filter((task: any) => {
    return filterStatus === "All" ? true : task.status.includes(filterStatus);
  });

  useEffect(() => {
    getAllTasks();

    return () => {};
  }, []);

  const navigate = useNavigate();
  return (
    <DashboardLayout activeMenu="My Tasks">
      {loading ? (
        <ManageTaskSkeleton />
      ) : (
        <div className="my-5">
          {allTasks.length > 0 ? (
            <div>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between ">
                <h2 className="text-xl md:text-xl font-medium">My Tasks</h2>

                {allTasks.length > 0 && (
                  <TaskStatusTabs
                    tabs={tabs}
                    activeTab={filterStatus}
                    setActiveTab={setFilterStatus}
                  />
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {filteredTasks.map((item: any, index) => (
                  <TaskCard
                    key={item._id}
                    title={item.title}
                    description={item.description}
                    priority={item.priority}
                    duration={index === 0 ? 0.5 : index / 2}
                    status={item.status}
                    progress={item.progress}
                    createdAt={item.createdAt}
                    dueDate={item.dueDate}
                    assignedTo={item.assignedTo.map((item: any) => item.name)}
                    // assignedTo={item.assignedTo.map(
                    //   (item: any) => item.profileImageUrl
                    // )}
                    attachmentCount={item.attachments.length}
                    completedTodoCount={item.completedTodoCount}
                    todoChecklist={item.todoChecklist.length}
                    onClick={() => handleClick(item._id)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p>No task has been assigned to you yet</p>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyTasks;
