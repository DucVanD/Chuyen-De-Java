import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminPrivateRoute({ children, requiredRoles }) {
  const user = JSON.parse(localStorage.getItem("adminUser"));

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // General admin/staff check
  if (!["ADMIN", "STAFF"].includes(user.role)) {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    return <Navigate to="/admin/login" replace />;
  }

  // Granular role check
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    // If not authorized for this specific route, redirect to dashboard
    toast.error("Bạn không có quyền truy cập vào mục này!", {
      toastId: "unauthorized_access"
    });
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
