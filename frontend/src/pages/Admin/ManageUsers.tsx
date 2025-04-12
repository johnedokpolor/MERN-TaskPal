import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { BASE_URL, REPORT_URL, USER_URL } from "../../store/ContextStore";
import { User } from "../../utils/interfaces";
import { FileSpreadsheet, Loader } from "lucide-react";
import UserCard from "../../components/Cards/UserCard";
import toast from "react-hot-toast";
import ManageUsersSkeleton from "../../components/Skeletons/ManageUsersSkeleton";

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  // This should be replaced with actual user data fetching logic
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const getAllUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/${USER_URL}`);
      setAllUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.log("Error Fetching users", error);
      setLoading(false);
    }
  };
  const handleDownloadReport = async () => {
    setBtnLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/${REPORT_URL}/users`, {
        responseType: "blob",
      });
      console.log(response.data);

      // Create url for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "users_report.xlsx"); //or any other extension
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Users report downloaded successfully");
      setBtnLoading(false);
    } catch (error) {
      console.error("Error downloading users report", error);
      toast.error("Failed to download users report. Please try again");
      setBtnLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <DashboardLayout activeMenu="Team Members">
      {loading ? (
        <ManageUsersSkeleton />
      ) : (
        <div>
          <div className="my-5">
            <div className="flex  justify-between ">
              <h2 className="text-xl md:text-xl font-medium">Team Members</h2>
              <button
                className="flex   download-btn"
                onClick={handleDownloadReport}
              >
                {btnLoading ? (
                  <Loader size={20} className=" animate-spin mx-auto" />
                ) : (
                  <>
                    <FileSpreadsheet className="size-5" />
                    Download Report
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {allUsers?.map((user, index) => (
              <UserCard
                key={user._id}
                userInfo={user}
                duration={index === 0 ? 0.5 : index / 2}
              />
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManageUsers;
