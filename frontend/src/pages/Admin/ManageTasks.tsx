import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { BASE_URL, REPORT_URL, TASK_URL } from "../../store/ContextStore";
import { FileSpreadsheet, Loader } from "lucide-react";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";
import toast from "react-hot-toast";
import ManageTaskSkeleton from "../../components/Skeletons/ManageTaskSkeleton";

const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState<{ label: string; count: number }[]>([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [btnloading, setBtnLoading] = useState(false);
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

  const handleClick = (taskData: any) => {
    navigate("/admin/create-task", { state: { taskId: taskData._id } });
  };

  // download task report
  const handleDownloadReport = async () => {
    setBtnLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/${REPORT_URL}/tasks`, {
        responseType: "blob",
      });
      console.log(response.data);

      // Create url for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tasks_report.xlsx"); //or any other extension
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Tasks report downloaded successfully");
      setBtnLoading(false);
    } catch (error) {
      console.error("Error downloading tasks report", error);
      toast.error("Failed to download tasks report. Please try again");
      setBtnLoading(false);
    }
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
    <DashboardLayout activeMenu="Manage Tasks">
      {loading ? (
        <ManageTaskSkeleton />
      ) : (
        <div className="my-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between ">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl md:text-xl font-medium">Manage Tasks</h2>
              <button
                className="flex lg:hidden  download-btn"
                onClick={handleDownloadReport}
              >
                {btnloading ? (
                  <Loader size={20} className=" animate-spin mx-auto" />
                ) : (
                  <>
                    <FileSpreadsheet className="size-5" />
                    Download Report
                  </>
                )}
              </button>
            </div>
            {allTasks.length > 0 && (
              <div className="flex items-center  gap-3">
                <TaskStatusTabs
                  tabs={tabs}
                  activeTab={filterStatus}
                  setActiveTab={setFilterStatus}
                />
                <button
                  className="lg:flex hidden  download-btn"
                  onClick={handleDownloadReport}
                >
                  {btnloading ? (
                    <Loader size={20} className=" animate-spin mx-auto" />
                  ) : (
                    <>
                      <FileSpreadsheet className="size-5" />
                      Download Report
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {filteredTasks.map((item: any, index) => (
              <TaskCard
                key={item._id}
                title={item.title}
                duration={index === 0 ? 0.5 : index / 2}
                description={item.description}
                priority={item.priority}
                status={item.status}
                progress={item.progress}
                createdAt={item.createdAt}
                dueDate={item.dueDate}
                assignedTo={item.assignedTo.map(
                  (item: any) => item.profileImageUrl
                )}
                attachmentCount={item.attachments.length}
                completedTodoCount={item.completedTodoCount}
                todoChecklist={item.todoChecklist.length}
                onClick={() => handleClick(item)}
              />
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManageTasks;
