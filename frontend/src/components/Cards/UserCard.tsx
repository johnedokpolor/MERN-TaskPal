import { motion } from "motion/react";
import { StatCardProps, User } from "../../utils/interfaces";

const UserCard = ({
  userInfo,
  duration,
}: {
  userInfo: User;
  duration: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: duration, delay: 0 },
      }}
      className="user-card p-2 mb-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={userInfo?.profileImageUrl}
            alt={userInfo?.name}
            className="size-15 rounded-full "
          />
          <div>
            <p className="text-base font-medium">{userInfo?.name}</p>
            <p className="text-sm text-gray-700 dark:text-white/80">
              {userInfo?.email}
            </p>
          </div>
        </div>
        {userInfo.role === "admin" && (
          <div className="bg-green-700 text-white rounded-md px-3 py-0.5 justify-end">
            Admin
          </div>
        )}
      </div>

      {userInfo.role !== "admin" && (
        <div className="flex items-end gap-3 mt-5">
          <StatCard
            label="Pending"
            count={userInfo?.pendingTasks}
            status="Pending"
          />
          <StatCard
            label="In Progress"
            count={userInfo?.inProgressTasks}
            status="In Progress"
          />
          <StatCard
            label="Completed"
            count={userInfo?.completedTasks}
            status="Completed"
          />
        </div>
      )}
    </motion.div>
  );
};

export default UserCard;

const StatCard = ({ label, count, status }: StatCardProps) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-[#4CAF50] border border-[#4CAF50]";
      case "Pending":
        return "bg-orange-100 text-[#FFC107] border border-[#FFC107]";
      case "In Progress":
        return "bg-blue-100 text-[#03A9F4] border border-[#03A9F4]";

      default:
        return "bg-gray-100 text-gray-500 border border-gray-200";

        break;
    }
  };
  return (
    <div
      className={`flex-1 text-xs font-medium px-4 py-0.5 rounded ${getStatusTagColor()} `}
    >
      <span className="text-sm font-semibold">{count}</span> <br /> {label}
    </div>
  );
};
