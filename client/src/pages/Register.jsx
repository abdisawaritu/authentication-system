import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import styles from "./Register.module.css";

function Register() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    // Check required fields
    if (!name.trim() && !email.trim() && !password) {
      setErrorMessage(
        "Please complete all required fields: full name, email address, and password.",
      );
      return;
    }

    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter a password.");
      return;
    }

    // Check email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setErrorMessage(
        "Please enter a valid email address, such as name@example.com.",
      );
      return;
    }


    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const data = await registerUser(name, email, password);

      navigate("/login", {
        replace: true,
        state: {
          message:
            data.message || "Registration successful. You can now log in.",
        },
      });
    } catch (error) {
      if (error.status === 409) {
        setErrorMessage(
          "An account with this email already exists. Please log in or use another email address.",
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
        setErrorMessage(
          error.message || "Registration failed. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>Create an account</h1>

        <p className={styles.description}>Register to get started.</p>

        {errorMessage && (
          <div className={styles.errorMessage} role="alert">
            {errorMessage}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="register-name">Full name</label>

            <input
              id="register-name"
              type="text"
              autoComplete="name"
              minLength={2}
              maxLength={100}
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setErrorMessage("");
              }}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="register-email">Email</label>

            <input
              id="register-email"
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
            <label htmlFor="register-password">Password</label>

            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
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
            {isSubmitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}

export default Register;
