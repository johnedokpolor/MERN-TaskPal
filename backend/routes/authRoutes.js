import express from "express";
import {
  checkAuth,
  forgotPassword,
  login,
  logout,
  resetPassword,
  sendToken,
  signup,
  uploadImage,
  verifyEmail,
} from "../controllers/auth/authController.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All the Authentication Routes
router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/send-token", protect, sendToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/upload-image", upload.single("image"), uploadImage);
router.get("/check-auth", protect, checkAuth);

export default router;
