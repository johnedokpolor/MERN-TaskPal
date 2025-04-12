import express from "express";
import {
  changePassword,
  updateUser,
} from "../controllers/user/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import {
  deleteUser,
  getAllUsers,
  getUser,
} from "../controllers/user/adminController.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// User management routes
router.get("/", protect, verifyAdmin, getAllUsers); // get all users (admin only)
router
  .route("/:id")
  .get(protect, getUser) // get single user
  .delete(protect, verifyAdmin, deleteUser); // delete single user (admin only)

// User must be logged in
router.patch("/update-profile", protect, updateUser);
router.patch("/change-password", protect, changePassword);

router.delete("/admin/users/:id", protect, verifyAdmin, deleteUser);
export default router;
