import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setErrorMessage("");
    setIsLoggingOut(true);

    try {
      await logoutUser();
      navigate("/login", { replace: true });
    } catch (error) {
      setErrorMessage(error.message || "Unable to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <main className={styles.dashboard}>
      <section className={styles.card}>
        <h1>Dashboard</h1>

        <p className={styles.welcome}>Welcome, {user?.name || "User"}!</p>

        <div className={styles.userDetails}>
          <p>
            <strong>Name:</strong> {user?.name}
          </p>

          <p>
            <strong>Email:</strong> {user?.email}
          </p>
        </div>

        {errorMessage && (
          <p className={styles.error} role="alert">
            {errorMessage}
          </p>
        )}

        <button
          className={styles.logoutButton}
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Logging out..." : "Log out"}
        </button>
      </section>
    </main>
  );
}

export default Dashboard;
