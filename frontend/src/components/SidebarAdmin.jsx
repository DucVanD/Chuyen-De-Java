import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    FaTachometerAlt,
    FaBox,
    FaTags,
    FaCopyright,
    FaNewspaper,
    FaBookmark,
    FaBars,
    FaImages,
    FaIdBadge,
    FaEnvelope,
    FaUsers,
    FaShoppingCart,
    FaUserShield,
    FaChevronDown,
    FaStore
} from "react-icons/fa";


const SidebarAdmin = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const [openMenus, setOpenMenus] = useState({});

    const menuConfig = [
        {
            label: "Bảng điều khiển",
            path: "/admin/dashboard",
            icon: <FaTachometerAlt />,
        },
        {
            label: "Quản lý sản phẩm",
            icon: <FaStore />,
            children: [
                { path: "/admin/products", label: "Tất cả sản phẩm", icon: <FaBox size={14} /> },
                { path: "/admin/inventory", label: "Kho hàng", icon: <FaBox size={14} /> },
                { path: "/admin/categories", label: "Danh mục", icon: <FaTags size={14} /> },
                { path: "/admin/brands", label: "Thương hiệu", icon: <FaCopyright size={14} /> },
            ]
        },
        {
            label: "Quản lý nội dung",
            icon: <FaNewspaper />,
            children: [
                { path: "/admin/posts", label: "Bài viết", icon: <FaNewspaper size={14} /> },
                { path: "/admin/topics", label: "Chủ đề", icon: <FaBookmark size={14} /> },
            ]
        },
        {
            label: "Quản lý khác",
            icon: <FaUserShield />,
            children: [
                { path: "/admin/employees", label: "Nhân viên", icon: <FaIdBadge size={14} /> },
                { path: "/admin/contacts", label: "Liên hệ", icon: <FaEnvelope size={14} /> },
                { path: "/admin/users", label: "Thành viên", icon: <FaUsers size={14} /> },
                { path: "/admin/orders", label: "Đơn hàng", icon: <FaShoppingCart size={14} /> },
            ]
        }
    ];

    // Tự động mở menu cha nếu có con đang được active
    useEffect(() => {
        const parentToOpen = {};
        menuConfig.forEach((item, index) => {
            if (item.children) {
                if (item.children.some(child => location.pathname.startsWith(child.path))) {
                    parentToOpen[index] = true;
                }
            }
        });
        setOpenMenus(prev => ({ ...prev, ...parentToOpen }));
    }, [location.pathname]);

    const toggleSubmenu = (index) => {
        if (!isOpen) {
            toggleSidebar(); // Mở sidebar nếu đang đóng
        }
        setOpenMenus(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const isActive = (path) => {
        if (path === "/admin/dashboard" && (location.pathname === "/admin" || location.pathname === "/admin/")) return true;
        return location.pathname.startsWith(path);
    };

    const isParentActive = (item) => {
        if (!item.children) return isActive(item.path);
        return item.children.some(child => isActive(child.path));
    };

    return (
        <aside
            className={`fixed top-0 left-0 h-full z-40 bg-[#0f172a] text-slate-300 transition-all duration-300 ease-in-out border-r border-slate-800 shadow-2xl ${isOpen ? "w-64" : "w-20"
                }`}
        >
            <div className="flex flex-col h-full">
                {/* Logo area */}
                <div className={`flex items-center h-16 px-6 border-b border-slate-800 transition-all duration-300 ${isOpen ? "justify-between" : "justify-center"}`}>
                    {isOpen && (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
                                M
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                MiniMart
                            </span>
                        </div>
                    )}
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
                    >
                        <FaBars size={18} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto custom-scrollbar py-6 px-3 space-y-2">
                    {menuConfig.map((item, index) => {
                        const hasChildren = item.children && item.children.length > 0;
                        const isMenuOpen = openMenus[index];
                        const activeParent = isParentActive(item);

                        return (
                            <div key={index} className="space-y-1">
                                {hasChildren ? (
                                    <>
                                        <button
                                            onClick={() => toggleSubmenu(index)}
                                            className={`w-full flex items-center h-11 px-3 rounded-lg transition-all duration-200 group ${activeParent && !isMenuOpen ? "bg-indigo-600/10 text-indigo-400" : "hover:bg-slate-800/50 text-slate-400 hover:text-slate-200"
                                                } ${!isOpen ? "justify-center" : ""}`}
                                        >
                                            <span className={`text-lg transition-colors ${activeParent ? "text-indigo-400" : "group-hover:text-white"}`}>
                                                {item.icon}
                                            </span>
                                            {isOpen && (
                                                <>
                                                    <span className="ml-3 font-medium text-sm flex-1 text-left">{item.label}</span>
                                                    <FaChevronDown
                                                        size={10}
                                                        className={`transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`}
                                                    />
                                                </>
                                            )}
                                        </button>

                                        {isOpen && isMenuOpen && (
                                            <div className="ml-4 pl-4 border-l border-slate-800 space-y-1 mt-1 animate-fadeIn">
                                                {item.children.map((child, childIdx) => (
                                                    <Link
                                                        key={childIdx}
                                                        to={child.path}
                                                        className={`flex items-center h-10 px-3 rounded-lg transition-all duration-200 ${isActive(child.path)
                                                            ? "text-indigo-400 font-semibold bg-indigo-600/5"
                                                            : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/30"
                                                            }`}
                                                    >
                                                        <span className="text-xs mr-3 opacity-70">•</span>
                                                        <span className="text-[13px]">{child.label}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        to={item.path}
                                        className={`flex items-center h-11 px-3 rounded-lg transition-all duration-200 group ${isActive(item.path)
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                            : "hover:bg-slate-800/50 text-slate-400 hover:text-slate-200"
                                            } ${!isOpen ? "justify-center" : ""}`}
                                    >
                                        <span className={`text-lg transition-colors ${isActive(item.path) ? "text-white" : "group-hover:text-white"}`}>
                                            {item.icon}
                                        </span>
                                        {isOpen && (
                                            <span className="ml-3 font-medium text-sm">{item.label}</span>
                                        )}
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                {isOpen && (
                    <div className="p-4 mt-auto border-t border-slate-800">
                        <div className="bg-slate-800/50 rounded-xl p-3">
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Hệ thống</p>
                            <p className="text-[10px] text-slate-400 leading-relaxed">Phiên bản 2.0 - 2026 Admin Pro Interface</p>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default SidebarAdmin;
