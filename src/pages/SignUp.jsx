import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const [confirmPasswordError, setConfirmPasswordError] = useState(true);
  const [validData, setValidData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (formData.password.toString() === formData.confirm.toString()) {
      setConfirmPasswordError(false);
    } else {
      setConfirmPasswordError(true);
    }
  }, [formData.confirm, formData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (confirmPasswordError) {
      setValidData(false);
    } else {
      try {
        setValidData(true);
        setLoading(true);

        const res = await axios.post("https://gpt-backend-mrz4.onrender.com/user/register", formData);

        const data = await res.data;
        if (res.status === 500 || !data) {
          setError(data.message);
          setLoading(false);
          return;
        } else {
          setError(null);
          setLoading(false);
          e.target.reset();
          navigate("/");
        }
      } catch (error) {
        setLoading(false);
        setError(error.message);
      }
    }
  };

  return (
    <div className="register-container" style={{ backgroundColor: "#f5f5f5", display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div
        className="card"
        style={{ marginTop: "50px", padding: "20px", borderRadius: "10px", backgroundColor: "#fff", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
      >
        <h1
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
            color: "#333",
          }}
        >
          SignUp
        </h1>
        <form method="POST" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Full name"
            autoComplete="on"
            required
            value={formData.name}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            autoComplete="on"
            required
            value={formData.email}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            autoComplete="on"
            value={formData.password}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <input
            type="confirm"
            name="confirm"
            id="password"
            placeholder="Confirm Password"
            autoComplete="on"
            value={formData.confirm}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          {confirmPasswordError && (
            <p style={{ color: "#ff0000" }}>Password did not match!</p>
          )}
          <button type="submit" className="login-btn" style={{ width: "100%", padding: "10px", backgroundColor: "#3498db", color: "#fff", borderRadius: "5px", border: "none", cursor: "pointer" }}>
            {loading ? "Singing Up..." : "SignUp"}
          </button>
          {!validData && (
            <p style={{ color: "#ff0000", textAlign: "center" }}>
              Error, can't proceed further
            </p>
          )}
        </form>
        <div className="navigation" style={{ marginTop: "10px", textAlign: "center" }}>
          <p style={{ color: "#666" }}>
            Already have an account? <NavLink to="/" style={{ color: "#3498db", textDecoration: "none" }}>- Login</NavLink>
          </p>
        </div>
        {error && (
          <p style={{ color: "#ff0000", marginTop: "10px" }}>{error}</p>
        )}
      </div>
    </div>
  );
};

export default SignUp;
