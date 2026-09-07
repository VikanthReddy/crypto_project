import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { signup } from "../services/api";
import Toast from "../components/Toast";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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

    if (!form.name || !form.email || !form.password) {
      setMessageType("error");
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const user = await signup(
        form.name,
        form.email,
        form.password
      );

      localStorage.setItem("user", JSON.stringify(user));

      setMessageType("success");
      setMessage("Account created successfully.");

      setTimeout(() => {
        navigate("/wallet");
      }, 800);
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

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Create your crypto wallet account
        </p>

        <Toast
          message={message}
          type={messageType}
          onClose={() => setMessage("")}
        />

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

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
            {loading ? "Creating..." : "Create Account"}
          </button>

        </form>

        <p className="auth-footer">
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