import express from "express";
import {
  exportTasksReport,
  exportUsersReport,
} from "../controllers/report/reportController.js";
import { protect, verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All the Report Routes
router.get("/export/tasks", protect, verifyAdmin, exportTasksReport); // export all tasks as excel/pdf
router.get("/export/users", protect, verifyAdmin, exportUsersReport); // export user-task report

export default router;
