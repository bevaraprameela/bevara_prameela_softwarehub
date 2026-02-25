
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "admin@prameela.com",
    password: "Admin12345",
    role: "admin"
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await api.post("/auth/login", form);

      const actualRole = res.data.user.role;
      const selectedRole = form.role;

      // ❌ Wrong role selected
      if (actualRole !== selectedRole) {
        alert("Please select correct role!");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ Navigate based on role
      if (actualRole === "admin") {
        navigate("/admin");
      } 
      else if (actualRole === "employee") {
        navigate("/employee");
      } 
      else if (actualRole === "client") {
        navigate("/client");
      }

    } catch (err) {
      alert("Login Failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <input
        name="email"
        type="email"
        placeholder="Enter Email"
        onChange={handleChange}
        required
      />

      <input
        name="password"
        type="password"
        placeholder="Enter Password"
        onChange={handleChange}
        required
      />

      {/* 🔽 ROLE DROPDOWN */}
      <select name="role" onChange={handleChange} value={form.role}>
        <option value="admin">Admin</option>
        <option value="employee">Employee</option>
        <option value="client">Client</option>
      </select>

      <button type="submit">Login</button>

    </form>
  );
}