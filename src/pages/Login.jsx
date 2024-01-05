import React, {  useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authSignIn, authSignInComplete, authSignInRejected } from "../redux/userSlice";
import axios from "axios";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.user)|| {};

  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(authSignIn());
      const res = await axios.post("https://gpt-backend-mrz4.onrender.com/user/login", formData);
      const data = await res.data;
      if (data.success === false) {
        dispatch(authSignInRejected(data.message));
        return;
      } else {
        dispatch(authSignInComplete(data));
        localStorage.setItem("current_user", data._id);
        e.target.reset();
        navigate("/chat")
      }
    } catch (error) {
      dispatch(authSignInRejected(error.message));
    }
  };



  return (
    <div className="login-container" style={{ backgroundColor: "#f5f5f5", display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div className="card" style={{ marginTop: "50px", padding: "20px", borderRadius: "10px", backgroundColor: "#fff", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <h1 style={{ color: "#333" }}>Login</h1>
        <form method="POST" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            autoComplete="on"
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
            value={formData.confirm}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <button type="submit" className="login-btn" style={{ width: "100%", padding: "10px", backgroundColor: "#3498db", color: "#fff", borderRadius: "5px", border: "none", cursor: "pointer" }}>
            Login
          </button>
          {error && (
            <p style={{ color: "#ff0000", textAlign: "center" }}>
              Wrong Password or Email Id
            </p>
          )}
        </form>
        <div className="navigation" style={{ marginTop: "10px", textAlign: "center" }}>
          <p style={{ color: "#666" }}>
            Don't have an account? <NavLink to="/signup" style={{ color: "#3498db", textDecoration: "none" }}>{` SignUp Here`}</NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
