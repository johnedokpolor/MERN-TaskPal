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

// cron.schedule("0 8 * * *", async () => {
//   const tomorrow = new Date();
//   tomorrow.setDate(tomorrow.getDate() + 1);
//   tomorrow.setHours(0, 0, 0, 0);

//   const nextDay = new Date(tomorrow);
//   nextDay.setDate(nextDay.getDate() + 1);
// });
export const Task = mongoose.model("Task", taskSchema);
//
//   const tomorrow = new Date();
//   tomorrow.setDate(tomorrow.getDate() + 1);
//   tomorrow.setHours(0, 0, 0, 0);

//   const nextDay = new Date(tomorrow);
//   nextDay.setDate(nextDay.getDate() + 1);
//   const tasks = await Task.find({});
//   console.log(tasks);
// };
// sc();
