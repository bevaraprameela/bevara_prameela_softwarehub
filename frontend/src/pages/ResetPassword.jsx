import { useState } from "react";
import api from "../api/client.js";

export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post("/auth/reset", { token, password });
      setDone(true);
    } catch {
      setError("Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
      <div className="bg-white/95 backdrop-blur p-8 rounded-xl shadow-xl max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
        <form onSubmit={submit} className="space-y-4">
          <input className="w-full border rounded p-2" placeholder="Reset Token" value={token} onChange={(e)=>setToken(e.target.value)} />
          <input className="w-full border rounded p-2" placeholder="New Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded p-2">Reset Password</button>
        </form>
        {done && <div className="mt-4 text-green-700">Password has been reset. Please return to login.</div>}
      </div>
    </div>
  );
}
