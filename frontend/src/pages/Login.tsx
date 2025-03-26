import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { motion } from "motion/react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import Button from "../components/Button";

const Login = () => {
  const navigate = useNavigate();
  // Intializes user state to store email and password
  const [user, setUser] = useState({ email: "", password: "" });

  // Handles the change by updating the user state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  console.log(user);

  interface AuthState {
    login: (email: string, password: string) => Promise<void>;
    error: string | null;
    isAuthenticated: boolean;
  }
  const { login, error, isAuthenticated } = useAuthStore() as AuthState;

  // Redirect authenticated users to homepage
  if (isAuthenticated && user) {
    return <Navigate to="/" replace />;
  }

  // Handles the signup by authenticating it with the backend API
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(user.email, user.password);
      navigate("/");
      toast.success("Logged in successfully");
    } catch (error: any) {
      if (error.message === "Network Error")
        toast.error(`${error.message}, connect to the internet.`);
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
      className="max-w-md mx-2  w-full bg-gray-800/40 rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-4 sm:p-8">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Welcome Back
        </h1>

        <form onSubmit={handleLogin}>
          <Input
            icon={Mail}
            type="text"
            placeholder="Email Address"
            value={user.email}
            name="email"
            onChange={handleChange}
            required
            aria-label="Email Address"
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={user.password}
            name="password"
            onChange={handleChange}
            required
            aria-label="Password"
          />
          <Link to="/forgot-password" className="text-green-400">
            Forgot Password?
          </Link>
          {error !== "User Already Exists" &&
            "Invalid or expired verification code" && (
              <p className="text-red-500 text-sm mt-2 font-semibold">{error}</p>
            )}
          <Button text="Login" />
        </form>
      </div>
      <div className="bg-gray-900/50 flex justify-center px-8 py-4">
        <p className="text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-green-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
