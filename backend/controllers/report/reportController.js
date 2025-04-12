import { Task } from "../../models/task/TaskModel.js";
import { User } from "../../models/user/userModel.js";
import excelJS from "exceljs";
import moment from "moment";

// @desc   Export all tasks to an excel file
// @route  GET /api/reports/export/tasks
// @access Private (Admin)
const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email -_id");
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tasks Report");

    // define the excel columns
    worksheet.columns = [
      { header: "Task ID", key: "_id", width: 25 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Status", key: "status", width: 20 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Assigned To", key: "assignedTo", width: 30 },
    ];

    // loop through all tasks and populate the worksheet rows
    tasks.forEach((task) => {
      const assignedTo = task.assignedTo
        .map((user) => `${user.name} (${user.email})`)
        .join(", ");
      worksheet.addRow({
        _id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: moment(task.dueDate).format("Do MMM YYYY"),
        assignedTo: assignedTo || "Unassigned",
      });
    });

    // indicates that the response body contains an Excel file (.xlsx).
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // sets the name of the file
    res.setHeader(
      "Content-Disposition",
      ' application; filename="tasks_report.xlsx"'
    );
    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error exporting tasks",
      error: error.message,
    });
  }
};
// @desc   Export user-task report as an excel file
// @route  GET /api/reports/export/users
// @access Private (Admin)
const exportUsersReport = async (req, res) => {
  try {
    // Retrieves all the users from the db, specifically the name, email, and _id fields.
    const users = await User.find().select("name email _id").lean(); //.lean() return plain JavaScript objects instead of Mongoose documents.
    const userTasks = await Task.find().populate(
      "assignedTo",
      "name email _id"
    );

    // userTaskMap is populated with an entry for the user,
    const userTaskMap = {};
    users.forEach((user) => {
      // creates an object of userId which creates an object of userdata e.g userTaskMap[user._id] outputs all the elements of the user with that particular Id
      userTaskMap[user._id] = {
        name: user.name,
        email: user.email,
        taskCount: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
      };
    });

    userTasks.forEach((task) => {
      // loops over users assigned to a task
      if (task.assignedTo) {
        task.assignedTo.forEach((assignedUser) => {
          // increases the taskcount and task statuses i.e pending, inprogress, completed for each user
          if (userTaskMap[assignedUser._id]) {
            userTaskMap[assignedUser._id].taskCount += 1;
            if (task.status === "Pending") {
              userTaskMap[assignedUser._id].pendingTasks += 1;
            } else if (task.status === "In Progress") {
              userTaskMap[assignedUser._id].inProgressTasks += 1;
            } else if (task.status === "Completed") {
              userTaskMap[assignedUser._id].completedTasks += 1;
            }
          }
        });
      }
    });

    // Create excel workbook and worksheet
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("User Task Report");
    worksheet.columns = [
      { header: "User Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 40 },
      { header: "Total Assigned Tasks", key: "taskCount", width: 20 },
      { header: "Pending Tasks", key: "pendingTasks", width: 20 },
      { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
      { header: "Completed Tasks", key: "completedTasks", width: 20 },
      { header: "Assigned To", key: "assignedTo", width: 30 },
    ];

    // Turn an object to an array and maps through it to populate the worksheet
    Object.values(userTaskMap).forEach((user) => {
      worksheet.addRow(user);
    });

    // send excel file in the response
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // sets the name of the file
    res.setHeader(
      "Content-Disposition",
      'application; filename="users_report.xlsx"'
    );
    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error exporting tasks",
      error: error.message,
    });
  }
};

export { exportTasksReport, exportUsersReport };
