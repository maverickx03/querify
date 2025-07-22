import React, { useState } from "react";
import AuthForm from "../../components/AuthForm";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";




const Register = () => {
  const [formData, setFormData] = useState({ email: "", password: "", username: ""});
  const navigate = useNavigate();
  
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
    const res = await API.post("/register", formData);
    console.log("Registered:", res.data);
    alert("Registration successful!");
    navigate("/login");
    
    
  } catch (err) {
    console.error(err);
    alert(err.response.data.detail)
    
  }
    console.log("Registering with:", formData);
  };

  return <AuthForm formType="Register" onSubmit={handleRegister} formData={formData} setFormData={setFormData} />;
};

export default Register;
