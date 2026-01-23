import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminPrivateRoute({ children, requiredRoles }) {
  const user = JSON.parse(localStorage.getItem("adminUser"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.info("Vui lòng đăng nhập quản trị!", {
        toastId: "admin-auth-required",
      });
      navigate("/admin/login", { replace: true });
      return;
    }

    // General admin/staff check
    if (!["ADMIN", "STAFF"].includes(user.role)) {
      toast.error("Bạn không có quyền truy cập vùng này!");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      navigate("/admin/login", { replace: true });
      return;
    }

    // Granular role check
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      toast.error("Bạn không có quyền truy cập vào mục này!", {
        toastId: "unauthorized_access"
      });
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, navigate, requiredRoles]);

  if (!user || !["ADMIN", "STAFF"].includes(user.role) || (requiredRoles && !requiredRoles.includes(user.role))) {
    return null;
  }

  return children;
}
