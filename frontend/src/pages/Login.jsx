import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client.js";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin"); // ✅ lowercase default
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await api.post("/auth/login", { email, password });

      const backendRole = res.data.user.role.toLowerCase();
      const selectedRole = role.toLowerCase();

      // ✅ Proper role match check
      if (backendRole !== selectedRole) {
        setError("Selected role does not match your account role");
        return;
      }

      login(res.data.token, res.data.user);

      // ✅ Navigate based on backend role (safer)
      if (backendRole === "admin") navigate("/admin");
      else if (backendRole === "employee") navigate("/employee");
      else navigate("/client");

    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
      <div className="bg-white/95 backdrop-blur p-8 rounded-xl shadow-xl max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Login</h2>

        <form onSubmit={submit} className="space-y-4">

          {/* ✅ Lowercase values */}
          <select
            className="w-full border rounded p-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
            <option value="client">Client</option>
          </select>

          <input
            className="w-full border rounded p-2"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="w-full border rounded p-2"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded p-2">
            Login
          </button>
        </form>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => navigate("/forgot")}
            className="text-blue-700 underline text-left"
          >
            Forgot password?
          </button>

          <button
            onClick={() => navigate("/reset")}
            className="text-blue-700 underline text-right"
          >
            Reset password
          </button>
        </div>
      </div>
    </div>
  );
}
