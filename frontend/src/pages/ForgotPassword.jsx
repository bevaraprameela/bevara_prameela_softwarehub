import { useState } from "react";
import api from "../api/client.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(null);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post("/auth/forgot", { email });
      setSent(res.data.tokenDemo || "Token sent (demo)");
    } catch {
      setError("Failed to request reset");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
      <div className="bg-white/95 backdrop-blur p-8 rounded-xl shadow-xl max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
        <form onSubmit={submit} className="space-y-4">
          <input className="w-full border rounded p-2" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded p-2">Send Reset Link</button>
        </form>
        {sent && <div className="mt-4 text-sm text-gray-700">Demo reset token: <span className="font-mono">{sent}</span></div>}
      </div>
    </div>
  );
}
