import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Mail } from "lucide-react";
import Input from "../components/Input";
import { useAuthStore, User } from "../store/authStore";
import toast from "react-hot-toast";
import Button from "../components/Button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  interface AuthState {
    forgotPassword: (email: string) => Promise<void>;
    forgotpasswordError: string | null;
    user: User | null;
    isAuthenticated: boolean;
  }
  const { forgotPassword, forgotpasswordError, isAuthenticated, user } =
    useAuthStore() as AuthState;

  if (isAuthenticated && user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
      toast.success("Password reset link sent to your email");
    } catch (error: any) {
      if (error.message === "Network Error") {
        toast.error(`${error.message}, connect to the internet.`);
        return;
      }
      toast.error(forgotpasswordError);
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
          Forgot Password
        </h1>

        {!isSubmitted ? (
          <div>
            <p className="text-center text-gray-300 mb-6">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            <form onSubmit={handleSubmit}>
              <Input
                icon={Mail}
                type="email"
                placeholder="johndoe@example.com"
                value={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {forgotpasswordError && (
                <span className="text-red-500 font-semibold text-sm">
                  {forgotpasswordError}
                </span>
              )}

              <Button text="Send Reset Link" />
            </form>
          </div>
        ) : (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 50,
              }}
              className="size-16 bg-green-500 rounded-full flex mx-auto items-center justify-center mb-4 "
            >
              <Mail className="size-8 text-white " />
            </motion.div>
            <p className="text-center text-gray-300 mb-6">
              If an account exist for {email}, we'll send you a password reset
              link shortly.
            </p>
          </div>
        )}
      </div>
      <div className="bg-gray-900/50 flex justify-center px-8 py-4">
        <Link
          to="/login"
          className="text-green-400 flex items-center hover:underline"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to login
        </Link>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
