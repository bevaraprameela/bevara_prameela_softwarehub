
import { useContext, useState } from "react";
import api from "../api/client.js";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "admin"   // ✅ default admin
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password
      });

      // 🔥 convert both to lowercase before compare
      const backendRole = res.data.user.role.toLowerCase();
      const selectedRole = form.role.toLowerCase();

      if (backendRole !== selectedRole) {
        setError("Selected role does not match your account role");
        return;
      }

      login(res.data.token, res.data.user);

      // 🔥 FORCE production redirect
      setTimeout(() => {
        if (backendRole === "admin")
          window.location.href = "/admin";
        else if (backendRole === "employee")
          window.location.href = "/employee";
        else
          window.location.href = "/client";
      }, 200);

    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
      <div className="bg-white/95 backdrop-blur p-8 rounded-xl shadow-xl max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Login</h2>

        <form onSubmit={submit} className="space-y-4">

          <select
            name="role"
            className="w-full border rounded p-2"
            value={form.role}
            onChange={handleChange}
          >
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
            <option value="client">Client</option>
          </select>

          <input
            name="email"
            className="w-full border rounded p-2"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="password"
            className="w-full border rounded p-2"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded p-2">
            Login
          </button>

        </form>
      </div>
    </div>
  );
}