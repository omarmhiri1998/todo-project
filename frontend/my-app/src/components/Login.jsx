
import { useState } from "react";
import "./Auth.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3070";

function Login({
  onSwitch,
  onLogin
}) {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
          "Login failed"
        );

        return;
      }

      localStorage.setItem(
        "token",
        data.token
      );

      onLogin();

    } catch {
      setError(
        "Could not connect to server"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <img
            src="/images/Gemini_Generated_Image_gnely6gnely6gnel-removebg-preview.png"
            alt="Todo Logo"
          />
        </div>

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Log in to manage your todos
        </p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <label>Email</label>

          <input
            className="auth-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <label>Password</label>

          <input
            className="auth-input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          <button
            className="auth-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?

          <button
            type="button"
            onClick={onSwitch}
          >
            Sign Up
          </button>
        </p>

      </div>
    </div>
  );
}

export default Login;

