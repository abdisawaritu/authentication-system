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

  // Check the current user's session with the backend.
  const refreshUser = useCallback(async () => {
    try {
      const data = await apiRequest("/auth/me");

      setUser(data.user);
      return data.user;
    } catch (error) {
      // A 401 means there is no valid logged-in session.
      if (error.status === 401) {
        setUser(null);
        return null;
      }

      // Network or server errors are different from a 401.
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Run once when the authentication provider is mounted.
  useEffect(() => {
    refreshUser().catch((error) => {
      console.error("Unable to check authentication:", error);
      setUser(null);
    });
  }, [refreshUser]);

  // Log in and retrieve the authenticated user.
  const loginUser = async (email, password) => {
    await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await apiRequest("/auth/me");

    setUser(data.user);
    return data.user;
  };

  // Register an account. Registration does not automatically log in.
  const registerUser = async (name, email, password) => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  };

  // Log out through Express, then clear React's shared user state.
  const logoutUser = async () => {
    await apiRequest("/auth/logout", {
      method: "POST",
    });

    setUser(null);
  };

  const value = {
    user,
    loading,
    refreshUser,
    loginUser,
    registerUser,
    logoutUser,
    isAuthenticated: Boolean(user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// A convenient way for any component to access authentication.
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }

  return context;
}
