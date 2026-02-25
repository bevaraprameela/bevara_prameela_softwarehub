import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ roles = [] }) {

  const { user } = useContext(AuthContext);

  // 🚨 Fix for page refresh issue after login
  const storedUser = localStorage.getItem("user");
  const currentUser = user || (storedUser ? JSON.parse(storedUser) : null);

  // ❌ Not logged in
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Role not allowed
  if (roles.length > 0 && !roles.includes(currentUser.role)) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Allow access to dashboard
  return <Outlet />;
}
