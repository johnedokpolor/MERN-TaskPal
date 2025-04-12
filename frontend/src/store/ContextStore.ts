import { create } from "zustand";
import axios, { AxiosError } from "axios";
import { ContextState } from "../utils/interfaces";

// export const BASE_URL = "http://localhost:1000"; // development server url
export const BASE_URL = "https://mern-taskpal-backend.onrender.com"; // production server url
export const AUTH_URL = "api/auth";
export const TASK_URL = "api/tasks";
export const USER_URL = "api/users";
export const REPORT_URL = "api/reports/export"; // development server url

// Put cookies in every request header
axios.defaults.withCredentials = true;
export const ContextStore = create<ContextState>((set) => ({
  user: null,
  error: null,
  admin: null,
  imageurl: null,
  dark: localStorage.getItem("dark")
    ? JSON.parse(localStorage.getItem("dark") ?? "false")
    : false,
  signupError: null,
  loginError: null,
  verifyemailError: null,
  forgetpasswordError: null,
  resetpasswordError: null,
  isAuthenticated: false,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  dashboardData: null,
  pieChartData: null,
  barChartData: null,
  login: async (email: string, password: string) => {
    set({ isLoading: true, loginError: null, admin: null, user: null });
    try {
      const response = await axios.post(` ${BASE_URL}/${AUTH_URL}/login`, {
        email,
        password,
      });
      // checks if user is admin and populates the admin object else updates the user object
      if (response.data.user.role === "admin") {
        set({
          admin: response.data.user,
          isAuthenticated: true,
          loginError: null,
          isLoading: false,
        });
      } else {
        set({
          user: response.data.user,
          isAuthenticated: true,
          loginError: null,
          isLoading: false,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      set({
        loginError: axiosError.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },
  signup: async (email, password, name, adminInviteToken, profileImageUrl) => {
    set({ isLoading: true, signupError: null });
    try {
      const response = await axios.post(` ${BASE_URL}/${AUTH_URL}/signup`, {
        email,
        password,
        name,
        adminInviteToken,
        profileImageUrl,
      });
      if (response.data.user.role === "admin") {
        set({
          admin: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      set({
        signupError: axiosError.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },
  verifyEmail: async (code) => {
    set({ isLoading: true, verifyemailError: null });
    try {
      const response = await axios.post(
        ` ${BASE_URL}/${AUTH_URL}/verify-email`,
        { code }
      );
      if (response.data.user.role === "admin") {
        set({
          isLoading: false,
          admin: response.data.user,
          isAuthenticated: true,
        });
      } else {
        set({
          isLoading: false,
          user: response.data.user,
          isAuthenticated: true,
        });
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      set({
        verifyemailError:
          axiosError.response?.data?.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(` ${BASE_URL}/${AUTH_URL}/logout`);
      set({
        isLoading: false,
        error: null,
        user: null,
        isAuthenticated: false,
      });
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      set({
        error: axiosError.response?.data?.message || "Error logging out ",
        isLoading: false,
      });
      throw error;
    }
  },
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(` ${BASE_URL}/${AUTH_URL}/check-auth`);
      if (response.data.user.role === "admin") {
        set({
          admin: response.data.user,
          isAuthenticated: true,
          isCheckingAuth: false,
        });
      } else {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isCheckingAuth: false,
        });
      }
    } catch (error) {
      set({
        error: null,
        isCheckingAuth: false,
        isAuthenticated: false,
      });
    }
  },
  forgotPassword: async (email) => {
    set({ isLoading: true, forgetpasswordError: null, message: null });
    try {
      const response = await axios.post(
        ` ${BASE_URL}/${AUTH_URL}/forgot-password`,
        {
          email,
        }
      );
      set({ isLoading: false, message: response?.data.message });
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      set({
        forgetpasswordError:
          axiosError.response?.data?.message || "Error sending reset link",
        isLoading: false,
      });
      throw error;
    }
  },
  resetPassword: async (token, password) => {
    set({ isLoading: true, resetpasswordError: null, message: null });
    try {
      const response = await axios.post(
        ` ${BASE_URL}/${AUTH_URL}/reset-password/${token}`,
        {
          password,
        }
      );
      set({ isLoading: false, message: response?.data.message });
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      set({
        resetpasswordError:
          axiosError.response?.data?.message || "Error resetting password",
        isLoading: false,
      });
      throw error;
    }
  },
  setDarkMode: async (dark) => {
    if (dark) {
      set({
        dark: false,
      });
    } else {
      set({
        dark: true,
      });
    }
  },
  getDashboardData: async () => {
    set({ error: null, isLoading: true, dashboardData: null });
    try {
      const response = await axios.get(
        ` ${BASE_URL}/${TASK_URL}/dashboard-data`
      );
      set({
        dashboardData: response.data,
        pieChartData: response.data.charts,
        isLoading: false,
      });
    } catch (error) {
      const axiosError = error as AxiosError<any>;

      set({
        error: axiosError.response?.data?.message,
        isLoading: false,
      });
    }
  },
  getUserDashboardData: async () => {
    set({ error: null, isLoading: true, dashboardData: null });
    try {
      const response = await axios.get(
        ` ${BASE_URL}/${TASK_URL}/user-dashboard-data`
      );
      set({
        dashboardData: response.data,
        isLoading: false,
      });
    } catch (error) {
      const axiosError = error as AxiosError<any>;

      set({
        error: axiosError.response?.data?.message,
        isLoading: false,
      });
    }
  },
}));
