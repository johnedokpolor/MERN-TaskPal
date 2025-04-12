import jwt from "jsonwebtoken";
import { User } from "../models/user/userModel.js";

// Middleware to protect routes
export const protect = async (req, res, next) => {
  // Extracts token and checks whether it's available
  const token = req.cookies.token;
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorised - no token provided" });

  try {
    // Verifies token with signature and saves  payload in "decoded" after it's verified
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorised - Invalid token" });
    }

    // get user details from the token ----> exclude password
    const user = await User.findById(decoded.userId).select("-password");

    // Assigns token userId to req.userId
    req.user = user;

    // calls next function to proceed to next middleware or route
    next();
  } catch (error) {
    console.log("Error in verify token", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Middleware for Admin-only access
export const verifyAdmin = async (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      // if user is admin, move to the next middleware/controller
      next();
      return;
    }
    // if not admin, send 403 Forbidden --> terminate the request
    res.status(403).json({ message: "Only admins can do this!" });
  } catch (error) {
    throw new Error(error.message);
  }
};

//
