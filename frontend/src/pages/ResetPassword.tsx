import { useState } from "react";
import { useAuthStore, User } from "../store/authStore";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { Lock } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState(false);

  interface AuthState {
    resetPassword: (
      token: string | undefined,
      password: string
    ) => Promise<void>;
    resetpasswordError: string | null;
    message: string | null;
    user: User | null;
    isAuthenticated: boolean;
  }
  const { resetPassword, resetpasswordError, user, isAuthenticated, message } =
    useAuthStore() as AuthState;

  // Redirect authenticated users to homepage
  if (isAuthenticated && user) {
    return <Navigate to="/" replace />;
  }

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPassword(token, password);
      toast.success("Password reset successfully, redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.log(error);
      if (error.message === "Network Error") {
        toast.error(`${error.message}, connect to the internet.`);
        return;
      }
      toast.error(resetpasswordError);
    }
  };

  const togglePassword = () => {
    setVisible((prev) => !prev);
    console.log("clicked");
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
          Reset Password
        </h1>

        <form onSubmit={handleSubmit}>
          <Input
            icon={Lock}
            togglepassword={togglePassword}
            isvisible={visible}
            type={visible ? "text" : "password"}
            placeholder="Password"
            value={password}
            name="email"
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Password"
          />
          <Input
            icon={Lock}
            togglepassword={togglePassword}
            isvisible={visible}
            type={visible ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            name="confirm-password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            aria-label="Password"
          />

          {resetpasswordError && (
            <p className="text-red-500 text-sm mt-2 font-semibold">
              {resetpasswordError}
            </p>
          )}
          {message && (
            <p className="text-green-500 text-sm mt-2 font-semibold">
              {message}
            </p>
          )}
          <Button text="Set New Password" />
        </form>
      </div>
      <div className="bg-gray-900/50 flex justify-center px-8 py-4">
        <p className="text-sm text-gray-400">
          Expired link?{" "}
          <Link
            to="/forgot-password"
            className="text-green-400 hover:underline "
          >
            Forgot Password
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default ResetPassword;
