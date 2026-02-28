
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ roles = [] }) {

  const { user } = useContext(AuthContext);

  const storedUser = localStorage.getItem("user");
  const currentUser = user || (storedUser ? JSON.parse(storedUser) : null);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // ✅ FIX ROLE CASE ISSUE
  const userRole = currentUser.role.toLowerCase();
  const allowedRoles = roles.map(r => r.toLowerCase());

  if (roles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}