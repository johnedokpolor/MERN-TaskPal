import bcryptjs from "bcryptjs";
import { User } from "../../models/user/userModel.js";

// update user details
export const updateUser = async (req, res) => {
  console.log(req.body);
  const { name, bio, email, profileImageUrl } = req.body;
  if (!name || !bio || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

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

    // update user details and save to db
    user.name = name;
    user.email = email;
    user.bio = bio;
    // user.profileImageUrl = profileImageUrl ;

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
  const { oldPassword, newPassword } = req.body;
  try {
    // check if password and current password is sent in the request
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //find user by id saved in the request
    const user = await User.findById(req.user._id);

    // compare current password with the hashed password in the database
    const isMatch = await bcryptjs.compare(oldPassword, user.password);
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
