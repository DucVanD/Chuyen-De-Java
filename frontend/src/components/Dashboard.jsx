import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaSearch, FaBell, FaThLarge } from "react-icons/fa";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const isActive = (path) =>
    pathname.startsWith(path)
      ? "bg-red-50 text-[#e74c3c] font-semibold"
      : "text-gray-600 hover:bg-gray-50 hover:text-[#e74c3c]";

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans">
      {/* ===== HEADER ===== */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b z-40 flex items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-[#e74c3c] sm:w-56">
            KeroUI
          </h1>

          <div className="hidden md:flex items-center bg-gray-50 px-3 py-1.5 rounded-full border">
            <FaSearch size={14} className="mr-2 text-gray-400" />
            <input
              className="bg-transparent outline-none text-sm w-48"
              placeholder="Search..."
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-500">
          <FaThLarge className="cursor-pointer hover:text-[#e74c3c]" />
          <div className="relative cursor-pointer">
            <FaBell />
            <span className="absolute -top-1 -right-1 bg-[#e74c3c] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </div>
          <img
            src="https://via.placeholder.com/35"
            className="rounded-full border"
          />
        </div>
      </header>

      {/* ===== BODY ===== */}
      <div className="flex pt-16">
        {/* ===== SIDEBAR ===== */}
        <aside
          className={`fixed top-16 left-0 h-[calc(100vh-64px)] bg-white border-r w-64 z-50 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0 transition-transform`}
        >
          <nav className="px-3 py-4 space-y-1 text-[13px]">
            <p className="menu-title">Menu</p>

            <Link to="/admin/dashboard" className={`menu-item ${isActive("/admin/dashboard")}`}>
              <i className="fas fa-tachometer-alt w-5 mr-3" />
              Bảng điều khiển
            </Link>

            <p className="menu-title mt-6">Quản lý sản phẩm</p>
            <Link to="/admin/inventory" className={`menu-item ${isActive("/admin/inventory")}`}>
              <i className="fas fa-box w-5 mr-3" /> Kho hàng
            </Link>
            <Link to="/admin/products" className={`menu-item ${isActive("/admin/products")}`}>
              <i className="fas fa-layer-group w-5 mr-3" /> Sản phẩm
            </Link>
            <Link to="/admin/categories" className={`menu-item ${isActive("/admin/categories")}`}>
              <i className="fas fa-tags w-5 mr-3" /> Danh mục
            </Link>
            <Link to="/admin/brands" className={`menu-item ${isActive("/admin/brands")}`}>
              <i className="fas fa-copyright w-5 mr-3" /> Thương hiệu
            </Link>

            <p className="menu-title mt-6">Quản lý khác</p>
            <Link to="/admin/employees" className={`menu-item ${isActive("/admin/employees")}`}>
              <i className="fas fa-id-badge w-5 mr-3" /> Nhân viên
            </Link>
            <Link to="/admin/vouchers" className={`menu-item ${isActive("/admin/vouchers")}`}>
              <i className="fas fa-ticket-alt w-5 mr-3" /> Voucher
            </Link>
            <Link to="/admin/contacts" className={`menu-item ${isActive("/admin/contacts")}`}>
              <i className="fas fa-envelope w-5 mr-3" /> Liên hệ
            </Link>
            <Link to="/admin/orders" className={`menu-item ${isActive("/admin/orders")}`}>
              <i className="fas fa-shopping-cart w-5 mr-3" /> Đơn hàng
            </Link>
          </nav>
        </aside>

        {/* ===== CONTENT ===== */}
        <section className={`flex-1 p-6 ${isSidebarOpen ? "ml-64" : "sm:ml-64"}`}>
          <button
            className="sm:hidden mb-4 border px-3 py-2 rounded flex items-center"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FaBars className="mr-2" /> Menu
          </button>

          <div className="bg-white p-6 rounded-lg shadow-sm min-h-[80vh]">
            <Outlet />
          </div>
        </section>
      </div>

      {/* ===== TAILWIND UTILS ===== */}
      <style>
        {`
          .menu-title {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: #9ca3af;
            padding: 0 16px;
            margin-bottom: 6px;
            letter-spacing: 0.1em;
          }
          .menu-item {
            display: flex;
            align-items: center;
            padding: 10px 16px;
            border-radius: 6px;
            transition: all .2s;
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;
