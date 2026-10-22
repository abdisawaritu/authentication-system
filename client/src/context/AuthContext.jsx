import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { apiRequest } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  // Verify the current session with Express.
  const refreshUser = useCallback(async () => {
    setLoading(true);
    setAuthError("");

    try {
      const data = await apiRequest("/auth/me");

      setUser(data.user);
      return data.user;
    } catch (error) {
      if (error.status === 401) {
        // The backend confirms that no valid session exists.
        setUser(null);
        return null;
      }

      // A network or server error is not proof of logout.
      setAuthError(
        error.message || "Unable to verify your session. Please try again.",
      );

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Check the session when the app starts.
  useEffect(() => {
    refreshUser().catch((error) => {
      console.error("Authentication check failed:", error);
    });
  }, [refreshUser]);

  // Authenticate with the backend, then retrieve the current user.
  const loginUser = async (email, password) => {
    setAuthError("");

    await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    return refreshUser();
  };

  // Register an account; the user must log in separately.
  const registerUser = async (name, email, password) => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  };

  // Destroy the backend session and clear local authentication state.
  const logoutUser = async () => {
    await apiRequest("/auth/logout", {
      method: "POST",
    });

    setUser(null);
    setAuthError("");
  };

  const value = {
    user,
    loading,
    authError,
    refreshUser,
    loginUser,
    registerUser,
    logoutUser,
    isAuthenticated: Boolean(user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }

  return context;
}
