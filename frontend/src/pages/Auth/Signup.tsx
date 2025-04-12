// import React from "react";
import { useState } from "react";
import { motion } from "motion/react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { User, Mail, Lock, KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import Input from "../../components/Inputs/Input.tsx";
import PasswordStrengthMeter from "../../components/PasswordStrengthMeter";
import { ContextStore } from "../../store/ContextStore.ts";
import Button from "../../components/Button.tsx";
import AuthLayout from "../../components/layouts/AuthLayout.tsx";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector.tsx";
import uploadImage from "../../utils/uploadImage.ts";

const Signup = () => {
  // Intializes user state to store fullname, email and password
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    adminInviteToken: "",
  });
  const [profilePic, setProfilePic] = useState<string | File>("");

  const [visible, setVisible] = useState(false);

  // Handles the change by updating the user state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const togglePassword = () => {
    setVisible((prev) => !prev);
  };

  const navigate = useNavigate();
  console.log(user);

  // Initialize the signup function from the ContextStore hook
  const {
    signup,

    admin: adminDetails,
    user: userDetails,
    signupError,
    isAuthenticated,
  } = ContextStore();

  // Redirect authenticated users to homepage
  if (isAuthenticated && userDetails) {
    return <Navigate to="/user/dashboard" replace />;
  } else if (isAuthenticated && adminDetails) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Handles the signup by authenticating it with the backend API
  const handleSignUp = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!profilePic) {
      return toast.error("Please upload a profile image");
    } else if (user.password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    } else if (!/[A-Z]/.test(user.password)) {
      return toast.error("Password must contain an uppercase letter");
    } else if (!/[a-z]/.test(user.password)) {
      return toast.error("Password must contain a lowercase letter");
    } else if (!/\d/.test(user.password)) {
      return toast.error("Password must contain a number");
    } else if (!/[^A-Za-z0-9]/.test(user.password)) {
      return toast.error("Password must contain a special character");
    }
    // Upload the image to the server and get the URL
    let profileImageUrl = "";
    profileImageUrl = await uploadImage(profilePic);

    try {
      await signup(
        user.email,
        user.password,
        user.fullName,
        user.adminInviteToken,
        profileImageUrl
      );
      navigate("/verify-email");
      toast.success("Account created successfull! Verify your email");
    } catch (error: any) {
      console.log(error);
      if (error.message === "Network Error") {
        toast.error(`${error.message}, connect to the internet.`);
        return;
      }
      toast.error(signupError);
    }
  };
  return (
    <AuthLayout>
      <motion.div
        initial={{
          y: 20,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.5,
        }}
        className=" w-full bg-white shadow-xl md:shadow-none shadow-gray-400 rounded-lg overflow-auto "
      >
        <div className="p-4">
          <h1 className="text-3xl text-center font-bold mb-6 bg-gradient-to-r from-green-700 to-emerald-700 text-transparent bg-clip-text">
            Create Account
          </h1>

          <form onSubmit={handleSignUp}>
            <ProfilePhotoSelector image={profilePic} setimage={setProfilePic} />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Input
                icon={User}
                type="text"
                placeholder="John Doe"
                value={user.fullName}
                name="fullName"
                onChange={handleChange}
                required
              />
              <Input
                icon={Mail}
                type="email"
                placeholder="johndoe@example.com"
                value={user.email}
                name="email"
                onChange={handleChange}
                required
              />
              <Input
                icon={Lock}
                togglepassword={togglePassword}
                isvisible={visible}
                type={visible ? "text" : "password"}
                placeholder="********"
                value={user.password}
                name="password"
                onChange={handleChange}
                required
              />
              <Input
                icon={KeyRound}
                type="text"
                placeholder="Admin Invite Token (optional)"
                value={user.adminInviteToken}
                name="adminInviteToken"
                onChange={handleChange}
              />
            </div>
            {signupError && "Error logging in" && (
              <p className="text-red-500 font-semibold mt-2 text-sm">
                {signupError}
              </p>
            )}
            {/* Password strength meter */}
            <PasswordStrengthMeter password={user.password} />
            <Button text="Create Account" />
          </form>
        </div>
        <div className="flex justify-center px-8 py-4">
          <p className="text-sm text-black/90">
            Already have an account?{" "}
            <Link to="/login" className="text-green-700 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </AuthLayout>
  );
};

export default Signup;
