import { Navigate } from "react-router-dom";

export default function AdminPrivateRoute({ children }) {
  const token = localStorage.getItem("adminToken");
  const user = JSON.parse(localStorage.getItem("adminUser"));

  if (!token || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!["ADMIN", "STAFF"].includes(user.role)) {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
