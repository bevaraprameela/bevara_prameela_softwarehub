
import { useContext } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import AuthProvider, { AuthContext } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import EmployeeDashboard from "./pages/employee/Dashboard.jsx";
import ClientDashboard from "./pages/client/Dashboard.jsx";

function Home() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow max-w-md w-full space-y-4">

        <h1 className="text-2xl font-semibold text-center">
          Role Based Access System
        </h1>

        {!user && (
          <div className="text-center">
            <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded">
              Login
            </Link>
          </div>
        )}

        {user && (
          <div className="flex items-center justify-between">
            <div>Hello {user.name} ({user.role})</div>

            <div className="space-x-2">

              {user.role === "Admin" && (
                <Link to="/admin" className="px-3 py-2 bg-gray-800 text-white rounded">
                  Admin Dashboard
                </Link>
              )}

              {user.role === "Employee" && (
                <Link to="/employee" className="px-3 py-2 bg-gray-800 text-white rounded">
                  Employee Dashboard
                </Link>
              )}

              {user.role === "Client" && (
                <Link to="/client" className="px-3 py-2 bg-gray-800 text-white rounded">
                  Client Dashboard
                </Link>
              )}

              <button
                onClick={() => { logout(); navigate("/"); }}
                className="px-3 py-2 bg-red-500 text-white rounded"
              >
                Logout
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />

        {/* ADMIN */}
        {/* <Route element={<ProtectedRoute roles={["Admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route> */}
        <Route element={<ProtectedRoute roles={["Admin"]} />}>
  <Route path="/admin/*" element={<AdminDashboard />} />
</Route>

        {/* EMPLOYEE */}
        <Route element={<ProtectedRoute roles={["Employee"]} />}>
          <Route path="/employee" element={<EmployeeDashboard />} />
        </Route>

        {/* CLIENT */}
        <Route element={<ProtectedRoute roles={["Client"]} />}>
          <Route path="/client" element={<ClientDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </AuthProvider>
  );
}