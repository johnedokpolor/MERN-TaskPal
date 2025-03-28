import { useAuthStore, User } from "../store/authStore";
import { Navigate } from "react-router-dom";

export const redirectAuthenticatedUsers = () => {
  interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
  }
  const { user, isAuthenticated } = useAuthStore() as AuthState;

  if (isAuthenticated && user) {
    return <Navigate to="/" replace />;
  }
};
