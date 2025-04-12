import bcryptjs from "bcryptjs";
import { User } from "../../models/user/userModel.js";

// update user details
export const updateUser = async (req, res) => {
  const { name, bio, email, profileImageUrl } = req.body;

  try {
    // find user by using user._id saved in the request
    const user = await User.findById(req.user._id).select("-password");

    // return error if user not found
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    // Check if email Exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res
        .status(400)
        .json({ success: false, message: "Email Already Exists" });
    }
    // update user details and save to db
    user.name = name || user.name;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.profileImageUrl = profileImageUrl || user.profileImageUrl;

    await user.save();

    res.status(201).json({
      success: true,
      message: "Details Updated successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

// change password
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    // check if password and current password is sent in the request
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //find user by id saved in the request
    const user = await User.findById(req.user._id);

    // compare current password with the hashed password in the database
    const isMatch = await bcryptjs.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password!" });
    }

    // Hashes users password for security
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // reset password if it matches
    if (isMatch) {
      user.password = hashedPassword;
      await user.save();
      res.status(201).json({
        success: true,
        message: "Password changed successfully",
        user: {
          ...user._doc,
          password: undefined,
        },
      });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
