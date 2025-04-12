import express from "express";
import { protect, verifyAdmin } from "../middlewares/authMiddleware.js";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
  getDashboardData,
  getUserDashboardData,
} from "../controllers/task/taskController.js";

const router = express.Router();

// Task management routes

router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/", protect, getTasks); // get all tasks, (admin:all, user:assigned)
router.get("/:id", protect, getTask); // get task by id
router.post("/", protect, createTask); // create a task
router.put("/:id", protect, updateTask); // upadate task details
router.delete("/:id", protect, verifyAdmin, deleteTask); // delete task, admin only
router.put("/:id/status", protect, updateTaskStatus); // update task status
router.put("/:id/todo", protect, updateTaskChecklist); // update Task Checklist

export default router;
