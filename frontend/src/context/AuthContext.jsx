
import { createContext, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {

  // 🚀 Load user directly from localStorage initially
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  const login = (t, u) => {
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));

    // 🔥 Important: Update state BEFORE navigation happens
    setToken(t);
    setUser(u);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}