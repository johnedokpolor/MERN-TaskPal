import {
  LayoutDashboard,
  SquareCheck,
  SquarePlus,
  Users,
  LogOut,
  Settings
} from "lucide-react";
export const SideMenuUserData = [
  {
    id: "01",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/user/dashboard",
  },
  {
    id: "02",
    label: "My Tasks",
    icon: SquareCheck,
    path: "/user/tasks",
  },
  {
    id: "03",
    label: "Settings",
    icon: Settings,
    path: "/user/settings",
  },
  {
    id: "04",
    label: "Logout",
    icon: LogOut,
    path: "logout",
  },
];
export const SideMenuData = [
  {
    id: "01",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    id: "02",
    label: "Manage Tasks",
    icon: SquareCheck,
    path: "/admin/tasks",
  },
  {
    id: "03",
    label: "Create Task",
    icon: SquarePlus,
    path: "/admin/create-task",
  },
  {
    id: "04",
    label: "Team Members",
    icon: Users,
    path: "/admin/users",
  },
  {
    id: "05",
    label: "Settings",
    icon: Settings,
    path: "/admin/settings",
  },
  {
    id: "06",
    label: "Logout",
    icon: LogOut,
    path: "logout",
  },
];
export const DataPriority = [
  {
    id: "01",
    label: "Low",
    value: "Low",
  },
  {
    id: "02",
    label: "Medium",
    value: "Medium",
  },
  {
    id: "03",
    label: "High",
    value: "High",
  },
];
export const DataStatus = [
  {
    id: "01",
    label: "Pending",
    value: "Pending",
  },
  {
    id: "02",
    label: "In Progress",
    value: "In Progress",
  },
  {
    id: "03",
    label: "Completed",
    value: "Completed",
  },
];
