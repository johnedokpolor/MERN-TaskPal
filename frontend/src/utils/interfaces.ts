export interface tableDataItem {
  _id: string;
  title: string;
  priority: string;
  status: string;
  dueDate: Date;
  createdAt: Date;
}
export interface taskListTable {
  tableData: tableDataItem[] | undefined;
}
export interface DashboardData {
  statistics: {
    totalTasks: number;
    pendingTasks: number;
    completedTasks: number;
    overdueTasks: number;
  };
  charts: {
    taskDistrubution: {
      Pending: number;
      InProgress: number;
      Completed: number;
      All: number;
    };
    taskPriorityLevels: {
      Low: number;
      Medium: number;
      High: number;
    };
  };
  recentTasks:
    | [
        {
          _id: string;
          title: string;
          priority: string;
          status: string;
          dueDate: Date;
          createdAt: Date;
        }
      ]
    | [];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  lastLoginDate: Date | undefined;
  profileImageUrl: string;
  bio: string;
  role: string;
  password: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
}
export interface ContextState {
  user: User | null;
  error: null;
  admin: User | null;
  signupError: null;
  dark: boolean;
  imageurl: string | null;
  loginError: string | null;
  verifyemailError: string | null;
  forgetpasswordError: string | null;
  resetpasswordError: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCheckingAuth: boolean;
  message: string | null;
  dashboardData: DashboardData | null;
  pieChartData: string | null;
  barChartData: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    adminInviteToken: string,
    profileImageUrl: File | string
  ) => Promise<void>;
  verifyEmail: (code: string) => Promise<any>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string | undefined, password: string) => Promise<void>;
  setDarkMode: (dark: boolean) => Promise<void>;
  getDashboardData: () => Promise<void>;
  getUserDashboardData: () => Promise<void>;
}
export interface InfoCard {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  color: string;
}
export interface ChartData {
  taskDistrubution: {
    Pending: number;
    InProgress: number;
    Completed: number;
    All: number;
  };
  taskPriorityLevels: {
    Low: number;
    Medium: number;
    High: number;
  };
}
export interface pieChart {
  data: Array<{ status: string; count: number }>;
  colors: string[];
}
export interface barChart {
  data: Array<{ priority: string; count: number }>;
}
export interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  path: string;
}
export interface SelectDropdownProps {
  options: Array<{ id: string; label: string; value: string }>;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}
export interface SelectUsersProps {
  selectedUsers: string[];
  setSelectedUsers: (value: string[]) => void;
}
export interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}
export interface AvatarGroupProps {
  avatars: string[];
  maxVisible: number;
}

export interface TodoListInputProps {
  todolist: string[];
  setTodoList: (todolist: string[]) => void;
}
export interface AddAttachmentInputProps {
  attachments: string[];
  setAttachments: (attachments: string[]) => void;
}

export interface TaskStatusTabsProps {
  tabs: Array<{ label: string; count: number }>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
export interface TaskCardProps {
  title: string;
  description: string;
  priority: string;
  status: string;
  progress: number;
  createdAt: string;
  duration: number;
  dueDate: string;
  assignedTo: any[];
  attachmentCount: number;
  completedTodoCount: number;
  todoChecklist: any[];
  onClick: () => void;
}
export interface Task {
  title: string;
  description: string;
  priority: string;
  status: string;
  progress: number;
  createdAt: string;
  dueDate: string;
  assignedTo: any[];
  attachments: any[];
  todoChecklist: any[];
}
export interface StatCardProps {
  label: string;
  count: number;
  status: string;
}
