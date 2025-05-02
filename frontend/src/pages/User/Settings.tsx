// /* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";

import { BASE_URL, ContextStore, USER_URL } from "../../store/ContextStore";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
import { motion } from "motion/react";

const CreateTask = () => {
  const navigate = useNavigate();

  const { user } = ContextStore();
  const User = user as any;
  const [userDetails, setUserDetails] = useState({
    name: User?.name,
    email: User?.email,
    bio: User?.bio,
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passloading, setPassLoading] = useState(false);

  const handleChange = (key: string, value: string | string[]) => {
    setUserDetails({ ...userDetails, [key]: value });
    console.log(userDetails);
  };

  const deleteAccount = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${BASE_URL}/${USER_URL}/${user?._id}`
      );
      setOpenDeleteAlert(false);
      toast.success(response.data.message);
      setLoading(false);
      navigate("/user/settings");
    } catch (error) {
      console.error("Error deleting account:", error);
      setLoading(false);
    }
  };
  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      return toast.error("Password must be at least 8 characters");
    } else if (!/[A-Z]/.test(newPassword)) {
      return toast.error("Password must contain an uppercase letter");
    } else if (!/[a-z]/.test(newPassword)) {
      return toast.error("Password must contain a lowercase letter");
    } else if (!/\d/.test(newPassword)) {
      return toast.error("Password must contain a number");
    } else if (!/[^A-Za-z0-9]/.test(newPassword)) {
      return toast.error("Password must contain a special character");
    }
    setPassLoading(true);
    setError("");
    try {
      const response = await axios.patch(
        `${BASE_URL}/${USER_URL}/change-password`,
        { oldPassword, newPassword }
      );
      toast.success(response.data.message);
      setPassLoading(false);
      setNewPassword("");
      setOldPassword("");
    } catch (error: any) {
      toast.error(error.response.data.message);
      setPassLoading(false);
    }
  };
  const updateDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.patch(
        `${BASE_URL}/${USER_URL}/update-profile`,
        userDetails
      );
      toast.success(response.data.message);
      setLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <DashboardLayout activeMenu="Settings">
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{
          opacity: 1,
          x: 0,
          transition: { duration: 1, delay: 0 },
        }}
        className="my-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-4">
          <div className="form-card col-span-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl text-center font-medium">Profile</h2>
            </div>
            <div className="mt-4">
              <label className="text-[13px] font-medium text-slate-800 dark:text-white/90">
                Name
              </label>
              <input
                className="form-input"
                type="text"
                placeholder="John Doe"
                value={userDetails?.name}
                onChange={({ target }) => handleChange("name", target.value)}
              />
            </div>
            <div className="mt-4">
              <label className="text-[13px] font-medium text-slate-800 dark:text-white/90">
                Email
              </label>
              <input
                className="form-input"
                type="text"
                placeholder="johndoe@gmail.com"
                value={userDetails?.email}
                onChange={({ target }) => handleChange("email", target.value)}
              />
            </div>
            <div className="mt-3">
              <label className="text-[13px] font-medium text-slate-800 dark:text-white/90">
                Bio
              </label>
              <textarea
                className="form-input"
                placeholder="A Short Biography About You"
                rows={4}
                value={userDetails?.bio}
                onChange={({ target }) => handleChange("bio", target.value)}
              />
            </div>

            <div className="mt-2">
              <label className="text-[13px] font-medium text-slate-800 dark:text-white/90">
                Old Password
              </label>
              <input
                className="form-input"
                type="text"
                placeholder="********"
                value={oldPassword}
                onChange={({ target }) => setOldPassword(target.value)}
              />
            </div>
            <div className="mt-4">
              <label className="text-[13px] font-medium text-slate-800 dark:text-white/90">
                New Password
              </label>
              <input
                className="form-input"
                type="text"
                placeholder="********"
                value={newPassword}
                onChange={({ target }) => setNewPassword(target.value)}
              />
            </div>
            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              onClick={changePassword}
              disabled={loading}
              className="py-1 px-2 bg-green-700 mt-3 text-sm rounded-md text-white cursor-pointer"
            >
              {passloading ? (
                <Loader size={20} className=" animate-spin mx-auto" />
              ) : (
                <span>CHANGE PASSWORD</span>
              )}
            </motion.button>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div>
              <motion.button
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                onClick={updateDetails}
                disabled={loading}
                className="add-btn"
              >
                {loading ? (
                  <Loader size={20} className=" animate-spin mx-auto" />
                ) : (
                  <span>UPDATE DETAILS</span>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
      >
        <DeleteAlert
          content="Are you sure you want to delete your account?"
          onDelete={() => deleteAccount()}
          loading={loading}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default CreateTask;
