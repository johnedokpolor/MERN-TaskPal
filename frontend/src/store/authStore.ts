import { create } from "zustand";
import axios, { AxiosError } from "axios";

// export const API_URL = "http://localhost:1000/api/auth"; // development server url
export const API_URL = "https://mern-taskpal-backend.onrender.com/api/auth"; // production server url
export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  lastLoginDate: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

// Put cookies in every request header
axios.defaults.withCredentials = true;
export const useAuthStore = create((set) => ({
  user: null,
  error: null,
  signupError: null,
  loginError: null,
  verifyemailError: null,
  forgetpasswordError: null,
  resetpasswordError: null,
  isAuthenticated: false,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  login: async (email: string, password: string) => {
    set({ isLoading: true, loginError: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        loginError: null,
        isLoading: false,
      });
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      set({
        loginError: axiosError.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },
  signup: async (email: string, password: string, name: string) => {
    set({ isLoading: true, signupError: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      set({
        signupError: axiosError.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },
  verifyEmail: async (code: string) => {
    set({ isLoading: true, verifyemailError: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({
        isLoading: false,
        user: response.data.user,
        isAuthenticated: true,
      });
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
      await axios.post(`${API_URL}/logout`);
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
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({
        error: null,
        isCheckingAuth: false,
        isAuthenticated: false,
      });
    }
  },
  forgotPassword: async (email: string) => {
    set({ isLoading: true, forgotpasswordError: null, message: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({ isLoading: false, message: response?.data.message });
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      set({
        forgotpasswordError:
          axiosError.response?.data?.message || "Error sending reset link",
        isLoading: false,
      });
      throw error;
    }
  },
  resetPassword: async (token: string, password: string) => {
    set({ isLoading: true, resetpasswordError: null, message: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
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
}));
