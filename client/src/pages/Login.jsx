import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import styles from "./Login.module.css";

function Login() {
  const { loginUser } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registrationMessage = location.state?.message;

 const handleSubmit = async (event) => {
   event.preventDefault();
   setErrorMessage("");

   // 1. Check for empty fields
   if (!email.trim() && !password) {
     setErrorMessage("Please enter your email address and password.");
     return;
   }

   if (!email.trim()) {
     setErrorMessage("Please enter your email address.");
     return;
   }

   if (!password) {
     setErrorMessage("Please enter your password.");
     return;
   }

   // 2. Check email format
   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

   if (!emailPattern.test(email.trim())) {
     setErrorMessage(
       "Please enter a valid email address, such as name@example.com.",
     );
     return;
   }

   // 3. Continue with the existing login request
   setIsSubmitting(true);

   try {
     const authenticatedUser = await loginUser(email.trim(), password);

     if (!authenticatedUser) {
       setErrorMessage("We couldn't verify your login. Please try again.");
       return;
     }

     const destination = location.state?.from?.pathname || "/dashboard";

     navigate(destination, { replace: true });
   } catch (error) {
     if (error.status === 401) {
       setErrorMessage(
         "Email or password is incorrect. Please check your details and try again.",
       );
     } else if (error.status === 400) {
       setErrorMessage(
         error.message || "Please check the information you entered.",
       );
     } else if (!error.status) {
       setErrorMessage(
         "We couldn't connect to the server. Please try again later.",
       );
     } else {
       setErrorMessage(error.message || "Login failed. Please try again.");
     }
   } finally {
     setIsSubmitting(false);
   }
 };
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>Log in</h1>

        <p className={styles.description}>
          Enter your account details to continue.
        </p>

        {registrationMessage && (
          <p className={styles.success} role="status">
            {registrationMessage}
          </p>
        )}

        {errorMessage && (
          <div className={styles.errorMessage} role="alert">
            {errorMessage}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="login-email">Email</label>

            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setErrorMessage("");
              }}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="login-password">Password</label>

            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrorMessage("");
              }}
              required
            />
          </div>

          <button
            className={styles.button}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className={styles.footer}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
