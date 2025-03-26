import { FloatingShape } from "./components/FloatingShape";
import { Navigate, replace, Route, Routes } from "react-router-dom";
import {
  Login,
  Signup,
  EmailVerification,
  ForgotPassword,
  ResetPassword,
  Dashboard,
} from "./pages/pages";
import { Toaster } from "react-hot-toast";
import { useAuthStore, User } from "./store/authStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  interface AuthState {
    checkAuth: () => Promise<void>;
    user: User | null;
    isLoading: boolean;
    error: string;
    isAuthenticated: boolean;
    isCheckingAuth: boolean;
  }
  const { user, error, isAuthenticated, checkAuth, isCheckingAuth } =
    useAuthStore() as AuthState;

  // Protect routes that require authentication
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    if (!user?.isVerified) {
      return <Navigate to="/verify-email" replace />;
    }
    return children;
  };

  // Redirect authenticated users to homepage
  const RedirectAuthenticatedUser: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    if (isAuthenticated && user) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(user, isAuthenticated, isCheckingAuth, error);
  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to bg-emerald-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape
        color="bg-green-500"
        size="size-64"
        top="top-[-5%]"
        left="left-[10%]"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        size="size-48"
        top="top-[70%]"
        left="left-[80%]"
        delay={5}
      />
      <FloatingShape
        color="bg-lime-500"
        size="size-32"
        top="top-[40%]"
        left="left-[-10%]"
        delay={2}
      />

      <Routes>
        <Route
          path="/"
          element={
            <Dashboard />
            // <ProtectedRoute>
            // </ProtectedRoute>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/login"
          element={
            <Login />
            // <RedirectAuthenticatedUser>
            // </RedirectAuthenticatedUser>
          }
        />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route
          path="/forgot-password"
          element={
            <ForgotPassword />
            // <RedirectAuthenticatedUser>
            // </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <ResetPassword />
            // <RedirectAuthenticatedUser>
            // </RedirectAuthenticatedUser>
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
