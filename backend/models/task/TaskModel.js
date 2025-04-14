import mongoose from "mongoose";
import cron from "node-cron";
import { sendWelcomeEmail } from "../../mailtrap/nodemailer.js";

// define the todo schema
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

// define the task schema
const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    dueDate: { type: Date, required: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    attachments: [{ type: String }],
    todoChecklist: [todoSchema],
    progress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

cron.schedule("* * * * *", async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  console.log(tomorrow);

  const nextDay = new Date(tomorrow);
  nextDay.setDate(nextDay.getDate() + 1);
  // console.log(nextDay);

  const tasks = await Task.find({
    dueDate: { $gte: tomorrow, $lt: nextDay },
    // find tasks that the status isnt completed
    status: { $ne: "Completed" },
  }).populate("assignedTo", "name email");
  const dueTasks = tasks.map((task) => ({
    title: task.title,
    dueDate: task.dueDate,
    assignedTo: task.assignedTo.map((user) => ({
      title: task.title,
      description: task.description,
      name: user.name,
      email: user.email,
    })),
  }));
  const assignedUsers = dueTasks.map((task) => task.assignedTo);
  console.log(assignedUsers);
});
export const Task = mongoose.model("Task", taskSchema);
