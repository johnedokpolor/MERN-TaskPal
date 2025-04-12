import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader, Trash2 } from "lucide-react";
import moment from "moment";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { DataPriority } from "../../utils/data";
import SelectDropdown from "../../components/Inputs/SelectDropdown";
import SelectUsers from "../../components/Inputs/SelectUsers";
import TodoListInput from "../../components/Inputs/TodoListInput";
import AddAttachmentInput from "../../components/Inputs/AddAttachmentInput";
import { BASE_URL, TASK_URL } from "../../store/ContextStore";
import { Task } from "../../utils/interfaces";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
import { motion } from "motion/react";

const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || "";
  const navigate = useNavigate();
  console.log(taskId);
  console.log(typeof taskId);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "",
    dueDate: "",
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });
  const [currentTask, setCurrentTask] = useState<Task>({
    title: "",
    description: "",
    priority: "",
    dueDate: "",
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
    status: "pending",
    progress: 0,
    createdAt: new Date().toISOString(),
  });
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string | string[]) => {
    setTaskData({ ...taskData, [key]: value });
  };
  const createTask = async () => {
    setLoading(true);
    try {
      const todolist = taskData.todoChecklist.map((item) => ({
        text: item,
        completed: false,
      }));
      const task = {
        ...taskData,
        dueDate: taskData.dueDate
          ? new Date(taskData.dueDate).toISOString()
          : null,
        todoChecklist: todolist,
      };
      const response = await axios.post(`${BASE_URL}/${TASK_URL}`, task);
      console.log("Task created successfully:", response?.data);
      toast.success("Task Created Successfully!");
      setLoading(false);
      clearData();
    } catch (error) {
      console.error("Error creating task:", error);
      setError("Failed to create task. Please try again.");
      setLoading(false);
    }
  };
  const updateTask = async () => {
    setLoading(true);
    try {
      const todolist = taskData.todoChecklist?.map((item) => {
        const prevTodoChecklist = currentTask?.todoChecklist;
        const matchedTask = prevTodoChecklist.find((task) => task.text == item);

        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });

      // Update the task using the put method from axios
      await axios.put(`${BASE_URL}/${TASK_URL}/${taskId}`, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist,
      });

      toast.success("Task Updated Successfully");
      setLoading(false);
    } catch (error) {
      console.error("Error updating task", error);
      setLoading(false);
    }
  };
  const getTaskDetailsById = async (taskId: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/${TASK_URL}/${taskId}`);
      const taskInfo = response.data.task;
      console.log(taskInfo);
      if (taskInfo) {
        setCurrentTask(taskInfo);
        setTaskData({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : "",
          assignedTo: taskInfo.assignedTo?.map((item: any) => item._id) || [],
          todoChecklist: taskInfo?.todoChecklist?.map((item: any) => item.text),
          attachments: taskInfo.attachments,
        });
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };
  const deleteTask = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(`${BASE_URL}/${TASK_URL}/${taskId}`);
      setOpenDeleteAlert(false);
      toast.success(response.data.message);
      setLoading(false);
      navigate("/admin/tasks");
    } catch (error) {
      console.error("Error deleting task:", error);
      setLoading(false);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!taskData.title) {
      setError("Please assign a task title to the task!");
      return;
    }
    if (!taskData.description) {
      setError("Please assign a task description to the task!");
      return;
    }
    if (!taskData.priority) {
      setError("Please assign a priority to the task");
      return;
    }
    if (!taskData.dueDate) {
      setError("Please assign a due date to the task");
      return;
    }
    if (!taskData.assignedTo.length) {
      setError("Please assign the task to at least one user!");
      return;
    }

    if (!taskData.todoChecklist.length) {
      setError("Please add at least one item to the checklist!");
      return;
    }
    if (taskId) {
      updateTask();
      return;
    }
    createTask();
  };
  const clearData = () => {
    // Clear the task data
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: "",
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };
  console.log(taskData);
  useEffect(() => {
    if (taskId) {
      getTaskDetailsById(taskId);
    }
  }, [taskId]);
  return (
    <DashboardLayout activeMenu="Create Task">
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{
          opacity: 1,
          x: 0,
          transition: { duration: 1, delay: 0 },
        }}
        className="my-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-4">
          <div className="form-card col-span-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">
                {" "}
                {taskId ? "Update Task" : "Create Task"}
              </h2>
              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-base font-medium text-red-500 bg-red-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <Trash2 className="size-4" />
                  Delete
                </button>
              )}
            </div>
            <div className="mt-4">
              <label className="text-[13px] font-medium text-slate-800 dark:text-white/90">
                Task Title
              </label>
              <input
                className="form-input"
                type="text"
                placeholder="Task Title"
                value={taskData.title}
                onChange={({ target }) => handleChange("title", target.value)}
              />
            </div>
            <div className="mt-3">
              <label className="text-[13px] font-medium text-slate-800 dark:text-white/90">
                Description
              </label>
              <textarea
                className="form-input"
                placeholder="Describe Task Here"
                rows={4}
                value={taskData.description}
                onChange={({ target }) =>
                  handleChange("description", target.value)
                }
              />
            </div>
            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="text-[13px] font-medium text-slate-800 dark:text-white/90">
                  Priority
                </label>
                <SelectDropdown
                  options={DataPriority}
                  value={taskData.priority}
                  onChange={(value: string) => handleChange("priority", value)}
                  placeholder="Select Priority"
                />
              </div>
              <div className="col-span-6 md:col-span-4">
                <label className="text-[13px] font-medium text-slate-800 dark:text-white/90">
                  Due Date
                </label>
                <input
                  type="date"
                  className="form-input cursor-pointer"
                  value={taskData?.dueDate || ""}
                  onChange={({ target }) =>
                    handleChange("dueDate", target.value)
                  }
                />
              </div>
              <div className="col-span-12 md:col-span-3 ">
                <label className="text-[13px] font-medium text-slate-800 dark:text-white/90">
                  Assign To
                </label>

                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value: string[]) =>
                    handleChange("assignedTo", value)
                  }
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="text-xs font-medium">TODO Checklist</label>
              <TodoListInput
                todolist={taskData.todoChecklist}
                setTodoList={(value: string[]) =>
                  handleChange("todoChecklist", value)
                }
              />
            </div>
            <div className="mt-3">
              <label className="text-xs font-medium">Attachments</label>
              <AddAttachmentInput
                attachments={taskData.attachments}
                setAttachments={(value: string[]) =>
                  handleChange("attachments", value)
                }
              />
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div>
              <motion.button
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                onClick={handleSubmit}
                disabled={loading}
                className="add-btn"
              >
                {loading ? (
                  <Loader size={20} className=" animate-spin mx-auto" />
                ) : (
                  <span>{taskId ? "UPDATE TASK" : "CREATE TASK"}</span>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
      >
        <DeleteAlert
          content="Are you sure you want to delete this task?"
          onDelete={() => deleteTask()}
          loading={loading}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default CreateTask;
