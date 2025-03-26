import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { User } from "../models/userModel.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
  sendLoginEmail,
} from "../mailtrap/nodemailer.js";
import { formatDate } from "../utils/date.js";
// import {
//   sendPasswordResetEmail,
//   sendResetSuccessEmail,
//   sendVerificationEmail,
//   sendWelcomeEmail,
// } from "../mailtrap/emails.js";

export const checkAuth = async (req, res) => {
  try {
    // Query database for user and exclude the "password"
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error in checkAuth", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const signup = async (req, res) => {
  try {
    //   Checks For All Input Fields
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields are Required" });
    }

    // Check if User Exists
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User Already Exists" });
    }
    // Hashes the User's Password using bcryptsjs for security
    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const tokenExpiry = formatDate(Date.now() + 15 * 60 * 1000);

    //Creates a User Object Using the User Model
    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 15 * 60 * 1000, // token expires after 15 minutes
    });

    //Generates jsonwebtoken
    generateTokenAndSetCookie(res, user._id);

    // Await to Send VerificationToken to User Email
    await sendVerificationEmail(
      user.email,
      user.name,
      verificationToken,
      tokenExpiry
    );

    // Saves user to the Database
    await user.save();

    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
export const sendToken = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email Required" });
    }

    // Check if User Exists
    const user = await User.findOne({ email });
    // if (user.isVerified) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "User Already Verified" });
    // }

    // Generates token for user
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const tokenExpiry = formatDate(Date.now() + 15 * 60 * 1000);

    // Sets verification token to Database
    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = Date.now() + 15 * 60 * 1000;

    // Await to Send VerificationToken to User Email
    await sendVerificationEmail(
      user.email,
      user.name,
      verificationToken,
      tokenExpiry
    );

    // Saves user to the Database
    await user.save();

    res.status(201).json({
      success: true,
      message: "Token Sent Successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All Fields are Required" });
  }
  try {
    // Check if User Exists
    const user = await User.findOne({ email });

    // Checks if password and email are correct
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    //Generates jsonwebtoken
    generateTokenAndSetCookie(res, user._id);

    const lastLoginDate = new Date(Date.now()).toString().slice(0, 25);
    // Updates user's last login and saves to the database
    user.lastLoginDate = lastLoginDate;

    await sendLoginEmail(user.email, user.name, lastLoginDate);

    await user.save();

    res.status(201).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
export const logout = async (req, res) => {
  // Clears the cookie and logs out the user
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const verifyEmail = async (req, res) => {
  // Takes Input from Request Body
  const { code } = req.body;
  try {
    // Finds the User with Verification Code and Expiry
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    // Return Error if User Doesn't exist
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    //  Update User When Found
    user.isVerified = true;
    (user.verificationToken = undefined),
      (user.verificationTokenExpiresAt = undefined);

    // Send Welcome Mail to User and Saves Updated User To Database
    await sendWelcomeEmail(user.email, user.name);
    await user.save();
    res.status(200).json({
      success: true,
      message: "Email Verified Successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    // Check if User Exists
    const user = await User.findOne({ email });

    // Checks if password and email are correct
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Email doesn't exist" });
    }
    const resetPasswordToken = crypto.randomBytes(50).toString("hex");
    const resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
    const tokenExpiry = formatDate(resetPasswordExpiresAt);

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpiresAt = resetPasswordExpiresAt;

    await sendPasswordResetEmail(
      user.email,
      user.name,
      `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`,
      tokenExpiry
    );

    await user.save();
    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    // Finds the User with Verification Code and Expiry
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    // Return Error if User Doesn't exist
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link",
      });
    }

    // Update user password and delete token
    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    // Send password reset success email
    await sendResetSuccessEmail(user.email, user.name);
    // Save user to Database
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};
export const delUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  res.json(user);
};
