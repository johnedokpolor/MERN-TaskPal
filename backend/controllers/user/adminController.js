import { User } from "../../models/user/userModel.js";
import { Task } from "../../models/task/TaskModel.js";

export const getAllUsers = async (req, res) => {
  try {
    // Get all users that have the role 'user', excluding their password
    const users = await User.find({}).select("-password");
    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No users found" });
    }

    // Add task counts to each user
    const userWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        // Count tasks that are assigned to a paricular userId and status
        const pendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Pending",
        });
        const inProgressTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "In Progress",
        });
        const completedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Completed",
        });

        return {
          ...user._doc,
          pendingTasks,
          inProgressTasks,
          completedTasks,
        };
      })
    );

    // Send the response with the user data and task counts
    res.status(200).json(userWithTaskCounts);
  } catch (error) {
    // Return error response to the client instead of throwing the error
    console.error(error); // Log the error for debugging
    res.status(500).json({ success: false, message: error.message });
  }
};
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // attempt to find and delete the user
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    throw new Error(error.message);
  }
};
export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    // attempt to find and delete the user
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log(error.message);
    // throw new Error(error.message);
  }
};
