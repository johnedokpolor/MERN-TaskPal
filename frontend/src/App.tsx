import { FloatingShape } from "./components/FloatingShape";
import { Route, Routes } from "react-router-dom";
import {
  Login,
  Signup,
  EmailVerification,
  ForgotPassword,
  ResetPassword,
  UserDashboard,
  PrivateRoute,
  AdminDashboard,
  LandingPage,
  ManageTasks,
  CreateTask,
  ManageUsers,
  ViewTaskDetails,
  UserTasks,
} from "./pages/pages";
import { Toaster } from "react-hot-toast";
import { ContextStore } from "./store/ContextStore";
import { useEffect, useState } from "react";

function App() {
  const {
    user,
    admin,
    error,
    dark,
    isAuthenticated,
    checkAuth,
    isCheckingAuth,
  } = ContextStore();

  useEffect(() => {
    localStorage.setItem("dark", JSON.stringify(dark));
  }, [dark]);

  useEffect(() => {
    console.log("checking auth");
    checkAuth();
  }, [checkAuth]);
  console.log(
    "user",
    user,
    "admin",
    admin,
    isAuthenticated,
    isCheckingAuth,
    error
  );
  return (
    <div className={dark ? "dark" : "light"}>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Admin Routes */}
        {/* <Route element={<PrivateRoute allowedRoles={"admin"} />} /> */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/tasks" element={<ManageTasks />} />
        <Route path="/admin/create-task" element={<CreateTask />} />
        <Route path="/admin/users" element={<ManageUsers />} />

        {/* User Routes */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/tasks" element={<UserTasks />} />
        <Route path="/user/task-details/:id" element={<ViewTaskDetails />} />
      </Routes>
      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </div>
  );
}

export default App;
