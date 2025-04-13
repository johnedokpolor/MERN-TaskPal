import React, { useEffect, useState } from "react";
import { BASE_URL, USER_URL } from "../../store/ContextStore";
import { SelectUsersProps, User } from "../../utils/interfaces";
import axios from "axios";
import { Users } from "lucide-react";
import Modal from "../Modal";
import AvatarGroup from "../AvatarGroup";

const SelectUsers: React.FC<SelectUsersProps> = ({
  selectedUsers,
  setSelectedUsers,
}) => {
  const [allUsers, setAllUsers] = useState<User[]>([]); // This should be replaced with actual user data fetching logic
  const [tempSelectedUsers, setTempSelectedUsers] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getAllUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/${USER_URL}`);
      setAllUsers(response.data.filter((user: any) => user.role !== "admin"));
    } catch (error) {
      console.log("Error Fetching users", error);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  const selectedUsersAvatars = allUsers
    .filter((user) => selectedUsers.includes(user._id))
    .map((user) => user.profileImageUrl);

  useEffect(() => {
    getAllUsers();
  }, []);
  useEffect(() => {
    if (selectedUsers.length === 0) {
      setTempSelectedUsers([]);
    }
  }, [selectedUsers]);
  return (
    <div className="space-y-4 mt-2">
      {selectedUsersAvatars.length === 0 ? (
        <button className="card-btn py-3" onClick={() => setIsModalOpen(true)}>
          <Users className="size-3" /> Add Members
        </button>
      ) : (
        <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <AvatarGroup avatars={selectedUsersAvatars} maxVisible={3} />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Users"
      >
        <div className="space-y-4 h-[60vh] overflow-y-auto">
          {allUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-3 border-b border-gray-200"
            >
              <img
                src={user?.profileImageUrl}
                alt={user.name}
                className="size-10 rounded-full"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800 dark:text-white">
                  {user.name}
                </p>
                <p className="text-base text-gray-500 dark:text-white/60">
                  {user.email}
                </p>
              </div>
              <input
                type="checkbox"
                checked={tempSelectedUsers.includes(user._id)}
                onChange={() => toggleUserSelection(user._id)}
                className="size-4 bg-gray-100 border-gray-300 cursor-pointer rounded-sm outline-0"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button className="card-btn" onClick={() => setIsModalOpen(false)}>
            CANCEL
          </button>
          <button className="card-btn-fill" onClick={handleAssign}>
            DONE
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SelectUsers;
