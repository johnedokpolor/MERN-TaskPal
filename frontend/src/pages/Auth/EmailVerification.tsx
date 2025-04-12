import React, { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Loader } from "lucide-react";
import { AUTH_URL, BASE_URL, ContextStore } from "../../store/ContextStore.ts";
import toast from "react-hot-toast";
import AuthLayout from "../../components/layouts/AuthLayout.tsx";
import axios from "axios";

const EmailVerification = () => {
  // Intializes code state to store the 6 digit code
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  // Initializes an array of input(code) refs
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs?.current?.[0]?.focus();
  }, []);
  // AutoSubmit when all fields are filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleVerify({
        preventDefault: () => {},
      } as React.FormEvent<HTMLFormElement>);
    }
  }, [code]);

  const navigate = useNavigate();

  // Initialize the signup function from the ContextStore hook
  const {
    verifyEmail,
    admin: adminDetails,
    verifyemailError,
    isLoading,
    user: userDetails,
    isAuthenticated,
  } = ContextStore();

  // Redirect authenticated users to homepage according to roles
  if (isAuthenticated && userDetails?.isVerified) {
    return <Navigate to="/user/dashboard" replace />;
  }
  if (isAuthenticated && adminDetails?.isVerified) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Handles the change by updating the user state
  const handleChange = (index: number, value: string) => {
    const newCode = [...code];
    // Handle pasted code
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      // Focus on the last filled input or the first empty one
      const lastFilledIndex = newCode.findLastIndex(
        (digit: string) => digit !== ""
      );
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs?.current?.[focusIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      // Move focus to the next input field if value is entered
      if (value && index < 5) {
        inputRefs?.current?.[index + 1]?.focus();
      }
    }
  };

  // Focus on the previous input when Backspace key is clicked, current input has no value and you're not on the first input
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handles the signup by authenticating it with the backend API
  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Joins the verification code while removing the "" that seperated them
    const verificationCode = code.join("");

    try {
      await verifyEmail(verificationCode);
      toast.success("Email Verified Successfully");
    } catch (error: any) {
      console.log(error);
      if (error.message === "Network Error") {
        toast.error(`${error.message}, connect to the internet.`);
        return;
      }
      toast.error(verifyemailError);
    }
  };

  const handleResendToken = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/${AUTH_URL}/send-token`);
      toast.success("New Token has been sent to your mail.");
    } catch (error) {
      console.error("Error sending token", error);
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
        className="w-full  shadow-xl bg-white shadow-gray-400 md:shadow-none rounded-lg overflow-auto"
      >
        <div className="p-5">
          <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-700 to-emerald-700 text-transparent bg-clip-text">
            Verify Your Email
          </h1>
          <p className="text-center text-green-700 mb-6">
            Enter the 6-digit code sent to your email address.
          </p>

          <form onSubmit={handleVerify}>
            <div className="flex justify-between">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="number"
                  maxLength={6}
                  required
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-2xl font-bold bg-white text-black border-2 border-gray-600 rounded-lg focus:border-green-700 focus:outline-none"
                />
              ))}
            </div>
            {verifyemailError && (
              <span className="text-red-500 font-semibold text-sm">
                {verifyemailError}
              </span>
            )}

            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              className=" mt-4 w-full rounded-lg bg-gradient-to-r py-3 px-4 from-green-700 to-emerald-700 text-white font-bold rouneded-lg shadow-lg hover:from-green-600 to hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-green-700 transition duration-200"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="">
                  <Loader className="size-6 inline animate-spin mx-auto" />
                </div>
              ) : (
                "Verify Email"
              )}
            </motion.button>
          </form>
        </div>
        <div className=" flex justify-center px-8 py-4">
          <p className="text-sm text-black/90">
            Expired Token?{" "}
            <button
              className="text-green-700 hover:underline cursor-pointer"
              onClick={handleResendToken}
            >
              Resend
            </button>
          </p>
        </div>
      </motion.div>
    </AuthLayout>
  );
};

export default EmailVerification;
