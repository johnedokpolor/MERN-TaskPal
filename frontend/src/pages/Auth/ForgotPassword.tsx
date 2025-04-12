import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Mail } from "lucide-react";
import Input from "../../components/Inputs/Input";
import { ContextStore } from "../../store/ContextStore";
import toast from "react-hot-toast";
import Button from "../../components/Button";
import AuthLayout from "../../components/layouts/AuthLayout";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { forgotPassword, forgetpasswordError, isAuthenticated, user, admin } =
    ContextStore();

  // Redirect authenticated users to homepage according to roles
  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/user/dashboard" replace />;
  }
  if (isAuthenticated && admin?.isVerified) {
    return <Navigate to="/admin/dashboard" replace />;
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
      toast.error(forgetpasswordError);
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
        className="w-full bg-white  shadow-md shadow-gray-400 md:shadow-none rounded-lg overflow-auto"
      >
        <div className="p-5">
          <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-700 to-emerald-700 text-transparent bg-clip-text">
            Forgot Password
          </h1>

          {!isSubmitted ? (
            <div>
              <p className="text-center text-green-700 mb-6">
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

                {forgetpasswordError && (
                  <span className="text-red-500 font-semibold text-sm">
                    {forgetpasswordError}
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
                className="size-16 bg-green-700 rounded-full flex mx-auto items-center justify-center mb-4 "
              >
                <Mail className="size-8 text-white " />
              </motion.div>
              <p className="text-center text-green-700 mb-6">
                If an account exist for {email}, we'll send you a password reset
                link shortly.
              </p>
            </div>
          )}
        </div>
        <div className=" flex justify-center px-8 py-4">
          <Link
            to="/login"
            className="text-green-700 flex items-center hover:underline"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back to login
          </Link>
        </div>
      </motion.div>
    </AuthLayout>
  );
};

export default ForgotPassword;
