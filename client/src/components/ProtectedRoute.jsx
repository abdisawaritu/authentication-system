import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait for the backend session check to finish.
  if (loading) {
    return <p className="text-center mt-5">Checking your session...</p>;
  }

  // Send unauthenticated users to login.
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Render the protected page.
  return <Outlet />;
}

export default ProtectedRoute;
