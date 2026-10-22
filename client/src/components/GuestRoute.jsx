import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function GuestRoute({ children }) {
  const { user, loading, authError, refreshUser } = useAuth();

  if (loading) {
    return <p className="text-center mt-5">Checking your session...</p>;
  }

  if (authError) {
    return (
      <div className="container mt-5 text-center">
        <p role="alert">We could not verify your session.</p>

        <button
          className="btn btn-primary"
          type="button"
          onClick={() => refreshUser().catch(() => {})}
        >
          Try again
        </button>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default GuestRoute;
