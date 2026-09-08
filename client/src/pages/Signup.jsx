import { useState } from "react";
import {
  useNavigate,
  Link
} from "react-router-dom";

import {
  signup,
  login
} from "../services/api";

function Signup() {

  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setLoading(true);

    try {

      // Create account
      await signup(
        name,
        email,
        password
      );

      // Login immediately
      const data = await login(
        email,
        password
      );

      // Save JWT
      localStorage.setItem(
        "token",
        data.token
      );

      // Save user
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      navigate("/wallet");

    } catch (error) {

      setError(
        error.message ||
        "Signup failed"
      );

    } finally {

      setLoading(false);
    }
  };


  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>Create Account</h1>

        <p>
          Create your Crypto Wallet account
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Sign Up"}
          </button>

        </form>

        <p>
          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Signup;