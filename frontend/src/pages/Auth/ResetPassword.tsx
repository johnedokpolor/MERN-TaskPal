import { useState } from "react";
import { Lock } from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import { ContextStore } from "../../store/ContextStore";
import Input from "../../components/Inputs/Input";
import Button from "../../components/Button";
import AuthLayout from "../../components/layouts/AuthLayout";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const {
    resetPassword,
    resetpasswordError,
    user,
    admin,
    isAuthenticated,
    message,
  } = ContextStore();

  // Redirect authenticated users to homepage according to roles
  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/user/dashboard" replace />;
  }
  if (isAuthenticated && admin?.isVerified) {
    return <Navigate to="/admin/dashboard" replace />;
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
        className="w-full  shadow-md bg-white shadow-gray-400 md:shadow-none rounded-lg overflow-auto"
      >
        <div className="p-5">
          <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-700 to-emerald-700 text-transparent bg-clip-text">
            Reset Password
          </h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
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
        <div className=" flex justify-center px-8 py-4">
          <p className="text-sm text-black/90">
            Expired link?{" "}
            <Link
              to="/forgot-password"
              className="text-green-700 hover:underline "
            >
              Forgot Password
            </Link>
          </p>
        </div>
      </motion.div>
    </AuthLayout>
  );
};

export default ResetPassword;
