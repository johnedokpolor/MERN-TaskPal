import { useEffect, useState } from "react";
import { Mail, Lock } from "lucide-react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { ContextStore } from "../../store/ContextStore";
import toast from "react-hot-toast";
import Button from "../../components/Button";
import AuthLayout from "../../components/layouts/AuthLayout";

const Login = () => {
  // Intializes user state to store email and password
  const [user, setUser] = useState({ email: "", password: "" });
  const [visible, setVisible] = useState(false);

  // Handles the change by updating the user state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const {
    login,
    loginError,
    user: userDetails,
    admin: adminDetails,
    isAuthenticated,
  } = ContextStore();

  const navigate = useNavigate();

  // Redirect authenticated users to homepage according to the roles
  useEffect(() => {
    if (isAuthenticated && userDetails) {
      navigate("/user/dashboard", { replace: true });
      toast.success(`Welcome User ${userDetails?.name.split(" ")[0]} `);
    } else if (isAuthenticated && adminDetails) {
      navigate("/admin/dashboard", { replace: true });
      toast.success(`Welcome Admin ${adminDetails?.name.split(" ")[0]} `);
    }
  }, [userDetails, adminDetails]);

  // Handles the signup by authenticating it with the backend API
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(user.email, user.password);
    } catch (error: any) {
      if (error.message === "Network Error") {
        toast.error(`${error.message}, connect to the internet.`);
        return;
      }
      console.error(loginError);
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
        className="w-full bg-white  p-5 shadow-xl shadow-gray-400 md:shadow-none rounded-lg overflow-hidden"
      >
        <div className="w-full">
          <h1 className="text-3xl font-bold text-green-700">Welcome Back</h1>
          <p className="text-xs  mt-[5px] mb-6 text-green-700">
            Please enter your details to login
          </p>

          <form onSubmit={handleLogin}>
            <div className="grid grid-cols-1 gap-5">
              <Input
                icon={Mail}
                type="email"
                placeholder="johndoe@example.com"
                value={user.email}
                name="email"
                onChange={handleChange}
                required
                aria-label="Email Address"
              />
              <Input
                icon={Lock}
                type={visible ? "text" : "password"}
                isvisible={visible}
                togglepassword={togglePassword}
                placeholder="********"
                value={user.password}
                name="password"
                onChange={handleChange}
                required
                aria-label="Password"
              />
              <Link to="/forgot-password" className="text-green-700 ml-auto">
                Forgot Password?
              </Link>
            </div>
            {loginError && (
              <p className="text-red-500 text-sm mt-2 font-semibold">
                {loginError}
              </p>
            )}
            <Button text="Login" />
          </form>
        </div>
        <div className=" flex justify-center px-8 py-4">
          <p className="text-sm text-black/90">
            Don't have an account?{" "}
            <Link to="/signup" className="text-green-700 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </AuthLayout>
  );
};

export default Login;
