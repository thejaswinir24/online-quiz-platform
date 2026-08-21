import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post(
        "/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      if (response.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Login failed"
      );
    }
  };

  return (
  <div className="auth-container">

    <div className="auth-card">

      <h1 className="app-title">QuizMaster</h1>

      <p className="app-subtitle">
        Online Quiz Platform
      </p>

      <h2>Welcome Back</h2>

      <p>Login to continue</p>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">
          Login
        </button>

      </form>

      {message && (
        <p className="error">
          {message}
        </p>
      )}

      <p>
        Don't have an account?{" "}
        <Link to="/register">
          Register
        </Link>
      </p>

    </div>

  </div>
);
}

export default Login;