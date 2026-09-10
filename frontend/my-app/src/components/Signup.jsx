
import { useState } from "react";
import "./Auth.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3070";

function Signup({ onSwitch }) {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword
  ] = useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/register`,
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
          "Registration failed"
        );
        return;
      }

      onSwitch();

    } catch (error) {
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

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Create your account and start organizing
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
            placeholder="Create a password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <label>
            Confirm Password
          </label>

          <input
            className="auth-input"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
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
              ? "Creating..."
              : "Sign Up"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?

          <button
            type="button"
            onClick={onSwitch}
          >
            Login
          </button>
        </p>

      </div>
    </div>
  );
}

export default Signup;

