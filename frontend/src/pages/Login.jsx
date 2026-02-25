import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client.js";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await api.post("/auth/login", { email, password });

      // Save token and user
      login(res.data.token, res.data.user);

      // Get role from backend
      const role = res.data.user.role.toLowerCase();

      // Navigate based on backend role
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "employee") {
        navigate("/employee");
      } else {
        navigate("/client");
      }

    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
      <div className="bg-white/95 backdrop-blur p-8 rounded-xl shadow-xl max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Login</h2>

        <form onSubmit={submit} className="space-y-4">
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
      </div>
    </div>
  );
}
