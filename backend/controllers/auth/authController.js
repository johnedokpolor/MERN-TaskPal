import bcryptjs from "bcryptjs";
import { randomBytes } from "node:crypto";
import { User } from "../../models/user/userModel.js";
import { generateTokenAndSetCookie } from "../../utils/generateTokenAndSetCookie.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
  sendLoginEmail,
} from "../../mailtrap/nodemailer.js";
import { formatDate } from "../../utils/date.js";
// import {
//   sendPasswordResetEmail,
//   sendResetSuccessEmail,
//   sendVerificationEmail,
//   sendWelcomeEmail,
// } from "../mailtrap/emails.js";

// check if user is  authenticated
export const checkAuth = async (req, res) => {
  try {
    // Query database for user and exclude the "password"
    const user = await User.findById(req.user._id).select("-password");
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

//signup user
export const signup = async (req, res) => {
  try {
    //   Checks For All Input Fields
    const { email, name, password, adminInviteToken, profileImageUrl } =
      req.body;
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

    // Set verification token and expiry
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const tokenExpiry = formatDate(Date.now() + 15 * 60 * 1000); // expires in 15 minutes

    //determine user role: Admin if correct token is provided otherwise user
    let role = "user";
    if (
      adminInviteToken &&
      adminInviteToken === process.env.ADMIN_INVITE_TOKEN
    ) {
      role = "admin";
    }

    //Creates a User Object Using the User Model
    const user = new User({
      email,
      password: hashedPassword,
      name,
      role,
      profileImageUrl,
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
        // returns everything in the user model except password
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

//resend email verification token
export const sendToken = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    // Check if User Exists
    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "User Already Verified" });
    }

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
    console.log(error.message);
    throw new Error(error.message);
  }
};

//login user
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

    const lastLoginDate = formatDate(Date.now());

    // Updates user's last login and saves to the database
    user.lastLoginDate = lastLoginDate;

    // send login email to user
    await sendLoginEmail(user.email, user.name, lastLoginDate);

    // save user to db
    await user.save();

    // return response to client
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

// logout
export const logout = async (req, res) => {
  // Clears the cookie and logs out the user
  res.clearCookie("token", {
    httpOnly: true, // Ensure the cookie is not accessible via JavaScript
    secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
    sameSite: "none", // Same attribute as when the cookie was set
    path: "/", // Specify the same path used for the cookie
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// verify email
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

// forgot password
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

    // define necessary variables
    const resetPasswordToken = randomBytes(50).toString("hex");
    const resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // expires in an hour
    const tokenExpiry = formatDate(resetPasswordExpiresAt);

    // update user
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

// reset password
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

// upload image
export const uploadImage = async (req, res) => {
  // Check if the file was uploaded
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" }); // Respond with an error if no file
  }

  // Generate the image URL
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;

  // Send the URL of the uploaded image back to the client
  res.status(200).json({ imageUrl });
};
