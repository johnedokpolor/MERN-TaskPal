import express from "express";
import {
  checkAuth,
  delUser,
  forgotPassword,
  getUsers,
  login,
  logout,
  resetPassword,
  sendToken,
  signup,
  verifyEmail,
} from "../controllers/authControllers.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// All the Authentication Routes
router.get("/check-auth", verifyToken, checkAuth);
router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/send-token", sendToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/users", getUsers);
router.delete("/users/:id", delUser);

export default router;
