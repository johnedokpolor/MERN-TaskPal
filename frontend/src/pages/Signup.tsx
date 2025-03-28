// import React from "react";
import { motion } from "motion/react";
import Input from "../components/Input";
import { User, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore.ts";
import toast from "react-hot-toast";
import Button from "../components/Button.tsx";

const Signup = () => {
  // Intializes user state to store fullname, email and password
  const [user, setUser] = useState({ fullName: "", email: "", password: "" });
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
    console.log("clicked");
  };

  const navigate = useNavigate();
  console.log(user);

  interface AuthState {
    signup: (
      email: string,
      password: string,
      fullName: string
    ) => Promise<void>;
    signupError: string | null;
    isAuthenticated: boolean;
  }
  // Initialize the signup function from the useAuthStore hook
  const { signup, signupError, isAuthenticated } = useAuthStore() as AuthState;

  // Redirect authenticated users to homepage
  if (isAuthenticated && user) {
    return <Navigate to="/" replace />;
  }

  // Handles the signup by authenticating it with the backend API
  const handleSignUp = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (user.password.length < 8) {
      return toast.error("Password must be at least 8 characters long");
    }
    try {
      await signup(user.email, user.password, user.fullName);
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
      className="max-w-md mx-5  w-full bg-gray-800/40 rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-4 sm:p-8">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Create Account
        </h1>

        <form onSubmit={handleSignUp}>
          <Input
            icon={User}
            type="text"
            placeholder="Full Name"
            value={user.fullName}
            name="fullName"
            onChange={handleChange}
            required
          />
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
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
            placeholder="Password"
            value={user.password}
            name="password"
            onChange={handleChange}
            required
          />
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
      <div className="bg-gray-900/50 flex justify-center px-8 py-4">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Signup;
