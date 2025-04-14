import { Task } from "../models/task/TaskModel.js";
import cron from "node-cron";

import {
  sendTaskReminderEmail,
  sendWelcomeEmail,
} from "../mailtrap/nodemailer.js";

const taskReminder = () => {
  // Run the code every 8am
  console.log("Getting ready to send mail");
  cron.schedule("* * * * *", async () => {
    // Set tomorrow to be day after today
    let tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setHours(tomorrow.getHours() + 1);
    tomorrow.setDate(tomorrow.getDate() + 1);
    console.log(tomorrow);

    // Set nextday to be a day after tomorrow
    const nextDay = new Date(tomorrow);
    nextDay.setDate(nextDay.getDate() + 1);
    // console.log(nextDay);

    // Find task that isnt completed and the dueDate is after tomorrow but less than nextDay(i.e task is due tomorrow)
    const tasks = await Task.find({
      dueDate: { $gte: tomorrow, $lt: nextDay },
      // find tasks that the status isnt completed
      status: { $ne: "Completed" },
    }).populate("assignedTo", "name email");

    //
    const dueTasks = tasks.map((task) => ({
      title: task.title,
      dueDate: task.dueDate,
      assignedTo: task.assignedTo.map((user) => ({
        name: user.name,
        email: user.email,
        title: task.title,
        description: task.description,
      })),
    }));
    const assignedUsersArray = dueTasks.map((task) => task.assignedTo);
    // Flatten all the assignedTo for each task  into a single array
    const assignedUsers = assignedUsersArray.flat();
    assignedUsers.map((user) =>
      sendTaskReminderEmail(user.email, user.name, user.title, user.description)
    );
  });
};
export default taskReminder;
