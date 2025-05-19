import {
  sendCompleteTaskUserEmail,
  sendTaskEmail,
} from "../../mailtrap/nodemailer.js";
import { Task } from "../../models/task/TaskModel.js";
import moment from "moment";

// @desc   Get all tasks (admin:all, user:assigned)
// @route  GET /api/tasks
// @access Private
const getTasks = async (req, res) => {
  try {
    // Gets the status value from the query e.g /tasks?status=Pending, status = "Pending"
    const { status } = req.query;
    let filter = {};
    if (status) {
      // Declares that filter is an object containing status as an item
      filter.status = status;
    }
    let tasks;

    // if Admin tasks with the filter and object and then populate the tasks assignedTo object with the name, email e.t.c of who the task was assigned to e.g Task.find({status:"Pending"})
    if (req.user.role === "admin") {
      tasks = await Task.find(filter).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    } else {
      // if not admim i.e "user" find tasks with the filter and store only tasks assigned to that particular user
      tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    }

    // Add completed todochecklist count field to each task
    tasks = await Promise.all(
      tasks.map(async (task) => {
        // Count tasks that are completed and  adds it to a completedTodoCount field in the when returned
        const completedCount = task.todoChecklist.filter(
          (todo) => todo.completed
        ).length;
        return { ...task._doc, completedTodoCount: completedCount };
      })
    );

    // Status Summary Count

    // Counts all tasks for logged in user and counts the tasks of every user if admin
    const allTasks = await Task.countDocuments(
      req.user.role === "admin" ? {} : { assignedTo: req.user._id }
    );

    // Counts the tasks with a status of "Pending" and applies the filter for the logged-in user if not an admin.
    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: "Pending",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    // Counts the tasks with a status of "In Progress" and applies the filter for the logged-in user if not an admin.
    const inProgressTasks = await Task.countDocuments({
      ...filter,
      status: "In Progress",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    // Counts the tasks with a status of "Completed" and applies the filter for the logged-in user if not an admin.
    const completedTasks = await Task.countDocuments({
      ...filter,
      status: "Completed",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    res.status(200).json({
      success: true,
      tasks,
      statusSummary: {
        all: allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc   Get task by id
// @route  GET /api/tasks/:id
// @access Private (Admin)
const getTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );
    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }
    res.status(200).json({ success: true, task });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc   Create a new task
// @route  GET /api/tasks
// @access Public
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todoChecklist,
    } = req.body;

    // Ensures that the assignedTo object is an array of Objects:userIDs
    if (!Array.isArray(assignedTo)) {
      return res.status(400).json({
        success: false,
        message: "assignedTo must be an array of userIDs",
      });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user._id, // created by the current admin logged in
      attachments,
      todoChecklist,
    });

    // Get taskDetails while populating the assignedTo and createdBy arrays
    const taskDetails = await Task.findById(task._id)
      .populate("createdBy", " name")
      .populate("assignedTo", "name email");

    console.log(taskDetails);

    const admin = taskDetails.createdBy.map((admin) => admin.name);
    const assignedUsers = taskDetails.assignedTo;
    const formatedDate = moment(task.dueDate).format("dddd Do MMM YYYY");
    // Send task email to the user
    assignedUsers.map(async (user) => {
      return sendTaskEmail(
        user.email,
        user.name,
        task.title,
        task.description,
        task.status,
        task.priority,
        formatedDate,
        process.env.CLIENT_URL,
        admin
      );
    });

    res
      .status(201)
      .json({ success: true, message: "Task created successfully", task });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc   Update Task details
// @route  PUT /api/tasks/:id
// @access Private (Admin)
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      priority,
      dueDate,
      todoChecklist,
      assignedTo,
      attachments,
    } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }
    if (assignedTo) {
      if (!Array.isArray(assignedTo)) {
        return res.status(400).json({
          success: false,
          message: "assignedTo must be an array of user IDs",
        });
      }
    }
    task.title = title;
    task.description = description;
    task.priority = priority;
    task.dueDate = dueDate;
    task.todoChecklist = todoChecklist;
    task.attachments = attachments;
    task.assignedTo = assignedTo;

    const updatedTask = await task.save();
    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      updatedTask,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc   Delete a task (Admin only)
// @route  GET /api/tasks/:id
// @access Private (Admin)
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    // Deletes the particular task
    await task.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully", task });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc   Update task status
// @route  GET /api/tasks/:id/status
// @access Private
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }
    if (!status) {
      res.status(404).json({ success: false, message: "Provide the status" });
      return;
    }

    // Checks if user is assigned to task and is admin using the .some() method
    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );
    if (!isAssigned && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Not Authorized" });
    }
    task.status = status;

    // Checks if status is  "Completed" and mark all todos as completed
    if (task.status === "Completed") {
      task.todoChecklist.map((todo) => (todo.completed = true));
      task.progress = 100;
    }
    await task.save();
    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc   Update task checklist
// @route  GET /api/tasks/todo
// @access Private
const updateTaskChecklist = async (req, res) => {
  try {
    const { todoChecklist } = req.body;
    const { id } = req.params;
    const task = await Task.findById(id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name");

    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }
    if (!todoChecklist) {
      res
        .status(404)
        .json({ success: false, message: "Provide the todoChecklist array!" });
      return;
    }

    // Checks if user is assigned to task and is admin
    if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not Authorized to upadate checklist",
      });
    }
    task.todoChecklist = todoChecklist; // Replace with updated checklist

    // Auto update progress based on checklist completion
    const completedCount = task.todoChecklist.filter(
      (todo) => todo.completed
    ).length;
    const totalTodos = task.todoChecklist.length;
    task.progress =
      totalTodos > 0 ? Math.round((completedCount / totalTodos) * 100) : 0;

    // Get the admin and the formatted date from the task details
    const admin = taskDetails.createdBy.map((admin) => admin.name);
    const formatedDate = moment(task.dueDate).format("dddd Do MMM YYYY");

    // Auto-mark all tasks as completed if all todos are checked
    if (task.progress === 100) {
      task.status = "Completed";
      task.assignedTo.map((user) =>
        sendCompleteTaskUserEmail(
          user.email,
          user.name,
          task.title,
          task.description,
          task.priority,
          formatedDate,
          process.env.CLIENT_URL,
          admin
        )
      );
    } else if (task.progress > 0) {
      task.status = "In Progress";
    } else {
      task.status = "Pending";
    }

    await task.save();

    // Populate assignedTo with users name,email and profileImageUrl
    const updatedTask = await Task.findById(id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    res.status(200).json({
      success: true,
      message: "Task checklist updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc   Dashboard Data (Admin only)
// @route  GET /api/tasks/dashboard-data
// @access Private (Admin)
const getDashboardData = async (req, res) => {
  try {
    // Fetch Statistics
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: "Pending" });
    const completedTasks = await Task.countDocuments({ status: "Completed" });
    const overdueTasks = await Task.countDocuments({
      status: { $ne: "Completed" }, // includes tasks that arent completed
      dueDate: { $lt: new Date() }, // includes tasks that the due date is lesser than the current date i.e in the past
    });

    // Ensure all possible statuses are included
    const taskStatuses = ["Pending", "In Progress", "Completed"];

    // Uses MongoDB's aggregation pipeline to group tasks by their status and calculate the count for each status.
    const taskDistrubutionRaw = await Task.aggregate([
      {
        $group: {
          _id: "$status", // groups tasks by status
          count: { $sum: 1 }, // counts each tasks in the group
        },
      },
    ]);

    // Looks for the count of tasks in that status. If no tasks are found, it defaults to 0.
    const taskDistrubution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, ""); //  Removes spaces from the status keys to ensure they are formatted correctly (e.g., "In Progress" becomes "InProgress")
      acc[formattedKey] =
        taskDistrubutionRaw.find((task) => task._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistrubution["All"] = totalTasks; // Add totol count to task distrubution

    // Ensure all priority levels are included
    const taskPriorites = ["Low", "Medium", "High"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);
    const taskPriorityLevels = taskPriorites.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelsRaw.find((task) => task._id === priority)?.count || 0;
      return acc;
    }, {});

    // Fetch 10 recent tasks
    const recentTasks = await Task.find()
      .sort({ createdAt: -1 }) // sorting task in descending order i.e latest to earliest.
      .limit(10) // limits it to 10 tasks only
      .select("title status priority dueDate createdAt"); // add necessary fields to the tasks

    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistrubution,
        taskPriorityLevels,
      },
      recentTasks,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc   Dashboard Data (User-specific)
// @route  GET /api/tasks/user-dashboard-data
// @access Private (Admin)
const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user._id; // only fetch data for logged in user
    // Fetch user statistics
    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const pendingTasks = await Task.countDocuments({
      status: "Pending",
      assignedTo: userId,
    });
    const completedTasks = await Task.countDocuments({
      status: "Completed",
      assignedTo: userId,
    });
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: "Completed" }, // includes tasks that arent completed
      dueDate: { $lt: new Date() }, // includes tasks that the due date is lesser than the current date i.e in the past
    });

    // Task distrubution by status
    const taskStatuses = ["Pending", "In Progress", "Completed"];

    // Uses MongoDB's aggregation pipeline to group tasks by their status and calculate the count for each status.
    const taskDistrubutionRaw = await Task.aggregate([
      {
        $match: {
          assignedTo: userId,
        },
      },
      {
        $group: {
          _id: "$status", // groups tasks by status
          count: { $sum: 1 }, // counts each tasks in the group
        },
      },
    ]);

    // Looks for the count of tasks in that status. If no tasks are found, it defaults to 0.
    const taskDistrubution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, ""); //  Removes spaces from the status keys to ensure they are formatted correctly (e.g., "In Progress" becomes "InProgress")
      acc[formattedKey] =
        taskDistrubutionRaw.find((task) => task._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistrubution["All"] = totalTasks; // Add totol count to task distrubution

    // Ensure all priority levels are included
    const taskPriorites = ["Low", "Medium", "High"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      {
        $match: {
          assignedTo: userId,
        },
      },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);
    const taskPriorityLevels = taskPriorites.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelsRaw.find((task) => task._id === priority)?.count || 0;
      return acc;
    }, {});

    // Fetch 10 recent tasks for logged in user
    const recentTasks = await Task.find({ assignedTo: userId })
      .sort({ createdAt: -1 }) // sorting task in descending order i.e latest to earliest.
      .limit(10) // limits it to 10 tasks only
      .select("title status priority dueDate createdAt"); // add necessary fields to the tasks

    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistrubution,
        taskPriorityLevels,
      },
      recentTasks,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
  getDashboardData,
  getUserDashboardData,
};
