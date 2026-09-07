import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../services/api";
import Toast from "../components/Toast";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");

    if (!form.email || !form.password) {
      setMessageType("error");
      setMessage("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const user = await login(
        form.email,
        form.password
      );

      localStorage.setItem("user", JSON.stringify(user));

      setMessageType("success");
      setMessage("Login successful.");

      setTimeout(() => {
        navigate("/wallet");
      }, 700);

    } catch (error) {
      setMessageType("error");
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Login to your crypto wallet
        </p>

        <Toast
          message={message}
          type={messageType}
          onClose={() => setMessage("")}
        />

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="primary-button full-width"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/signup">
            Create Account
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;