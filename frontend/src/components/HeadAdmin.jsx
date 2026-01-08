import { FaSearch, FaBell, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import apiAdmin from "../api/apiAdmin";

const HeaderAdmin = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  // ✅ Lấy thông tin admin từ localStorage
  useEffect(() => {
    const userData = localStorage.getItem("adminUser");
    if (userData) {
      const user = JSON.parse(userData);
      if (user.roles !== "admin") {
        toast.error("⚠️ Bạn không có quyền truy cập Admin!");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate("/admin/login");
      } else {
        setAdmin(user);
      }
    }
  }, []);


  // 🔒 Đăng xuất
  const handleLogout = async () => {
    try {
      await apiAdmin.logout();
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      toast.success("Đăng xuất thành công!");
      navigate("/admin/login");
    } catch (error) {
      toast.error("Lỗi khi đăng xuất!");
      console.error(error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 h-16">
      <div className="h-full flex items-center justify-between px-6">
        {/* Left side: Search or Breadcrumbs */}
        <div className="flex items-center gap-4 flex-1">
          <div className="hidden md:block w-96 relative">
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full h-10 px-4 pl-10 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-gray-50 text-sm transition-all"
            />
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Right side: Notifications, User, Logout */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
            <FaBell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
              3
            </span>
          </button>

          <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden sm:block"></div>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-700 leading-tight">
                {admin?.name || "Administrator"}
              </p>
              <p className="text-xs text-gray-500 capitalize">{admin?.roles || "Admin"}</p>
            </div>
            <img
              src={
                admin?.avatar
                  ? `/assets/images/avatar/${admin.avatar}`
                  : "/assets/images/avatar/admin-avatar.png"
              }
              alt="Admin"
              className="w-10 h-10 rounded-full border-2 border-indigo-100 shadow-sm"
            />
          </div>

          <button
            onClick={handleLogout}
            className="ml-2 h-10 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-all shadow-md group"
          >
            <FaSignOutAlt className="group-hover:translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );

};

export default HeaderAdmin;
