import React, { useState } from "react";
import AuthForm from "/src/components/AuthForm.jsx";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate()
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
    const res = await API.post("/login", formData);
    console.log("Logged in");
    localStorage.setItem("token", res.data.access_token); // Save JWT
    alert("Login successful!");
    navigate("/")
    
  } catch (err) {
    console.error(err);
    alert(err.response.data.detail);
  }
    
  };

  return <AuthForm formType="Login" onSubmit={handleLogin} formData={formData} setFormData={setFormData} />;
};

export default Login;
