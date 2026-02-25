
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client.js";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Login() {

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin"); // ✅ Default Admin
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {

      const res = await api.post("/auth/login", {
        email,
        password
      });

      const backendRole = res.data.user.role.toLowerCase();
      const selectedRole = role.toLowerCase();

      if (backendRole !== selectedRole) {
        setError("Selected role does not match your account role");
        return;
      }

      login(res.data.token, res.data.user);

      alert("Login Successful");

      if (backendRole === "admin") navigate("/admin");
      else if (backendRole === "employee") navigate("/employee");
      else navigate("/client");

    } catch (err) {
      setError("Invalid Email or Password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">

      <div className="bg-white/95 backdrop-blur p-8 rounded-xl shadow-xl max-w-md w-full">

        <h2 className="text-xl font-semibold mb-6 text-center">
          Welcome Back
        </h2>

        <form onSubmit={submit} className="space-y-4">

          <div>
            <label className="text-sm font-medium">
              Email Address
            </label>
            <input
              className="w-full border rounded p-2 mt-1"
              type="email"
              required
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Password
            </label>
            <input
              className="w-full border rounded p-2 mt-1"
              type="password"
              required
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Select Role
            </label>
            <select
              className="w-full border rounded p-2 mt-1"
              value={role}
              onChange={(e)=>setRole(e.target.value)}
            >
              <option value="Admin">Admin</option>
              <option value="Employee">Employee</option>
              <option value="Client">Client</option>
            </select>
          </div>

          {error && (
            <p className="text-red-600 text-sm">
              {error}
            </p>
          )}

          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded p-2">
            Login
          </button>

        </form>

        <p className="text-center mt-4 text-sm">
          OR
        </p>

        <button
          onClick={async ()=>{
            try {
              await api.get("/auth/google/init");
              alert("Google signup not configured yet");
            } catch {
              alert("Google signup not configured");
            }
          }}
          className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white rounded p-2"
        >
          Sign in with Google
        </button>

      </div>

    </div>
  );
}