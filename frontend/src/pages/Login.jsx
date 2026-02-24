import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client.js";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post("/auth/login", { email, password });
      // Enforce selected role matches account role
      if (res.data.user.role !== role) {
        setError("Selected role does not match your account role");
        return;
      }
      login(res.data.token, res.data.user);
      if (role === "Admin") navigate("/admin");
      else if (role === "Employee") navigate("/employee");
      else navigate("/client");
    } catch (e) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
      <div className="bg-white/95 backdrop-blur p-8 rounded-xl shadow-xl max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <form onSubmit={submit} className="space-y-4">
          <select className="w-full border rounded p-2" value={role} onChange={(e)=>setRole(e.target.value)}>
            <option value="Admin">Admin</option>
            <option value="Employee">Employee</option>
            <option value="Client">Client</option>
          </select>
          <input className="w-full border rounded p-2" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full border rounded p-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded p-2">Login</button>
        </form>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={async ()=>{ try { await api.get("/auth/google/init"); alert("Google signup not configured yet. Please contact admin to enable."); } catch { alert("Google signup not configured."); }}}
            className="col-span-2 bg-red-500 hover:bg-red-600 text-white rounded p-2"
          >
            Continue with Google
          </button>
          <button onClick={()=>navigate("/forgot")} className="text-blue-700 underline text-left">Forgot password?</button>
          <button onClick={()=>navigate("/reset")} className="text-blue-700 underline text-right">Reset password</button>
        </div>
      </div>
    </div>
  );
}
