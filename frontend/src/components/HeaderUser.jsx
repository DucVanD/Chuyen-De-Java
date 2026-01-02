import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

// Icons
import { 
  CiSearch, 
  CiUser, 
  CiShoppingCart, 
  CiMenuBurger 
} from "react-icons/ci";
import { 
  FaUser, 
  FaSortDown, 
  FaStore, 
  FaHistory, 
  FaPhoneAlt, 
  FaSignOutAlt,
  FaChevronRight,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { BiAlignLeft } from "react-icons/bi";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import { LuShuffle, LuShoppingBag } from "react-icons/lu";
import { TbBrandShopee } from "react-icons/tb";

// API & Redux
import apiCategory from "../api/user/apiCategory";
import { getImageUrl } from "../api/config";
import { logout } from "../Redux/authSlice";
import logo from "/src/assets/images/logo.png"; // Đảm bảo đường dẫn đúng

const HeaderUser = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false); // Dropdown user

  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.qty, 0);
  const user = useSelector((state) => state.auth.user);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // --- API LOAD CATEGORIES ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiCategory.getParentsWithChildren();
        // Kiểm tra cấu trúc data trả về (res.data hoặc res trực tiếp tùy backend)
        const data = res.data || res; 
        if (Array.isArray(data)) setCategories(data);
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  // --- HANDLERS ---
  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${keyword}`);
      setKeyword("");
      setOpenMenu(false); // Đóng menu mobile nếu đang mở
    }
  };

  const handleCategoryClick = (slug, name) => {
    navigate(`/products?category=${slug}`, {
      state: { categorySlug: slug, categoryName: name },
    });
    setShowDropdown(false);
    setOpenMenu(false);
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      dispatch(logout());
      toast.success("Đăng xuất thành công!", { theme: "colored" });
      navigate("/");
      setShowUserMenu(false);
    }
  };

  const handleQuickCheckout = () => {
    if (!user) {
      toast.warn("Vui lòng đăng nhập để thanh toán!");
      navigate("/registered");
      return;
    }
    navigate("/checkout");
  };

  // --- TYPING EFFECT FOR SEARCH ---
  const placeholders = ["Hôm nay bạn muốn ăn gì?", "Rau củ tươi sạch...", "Trái cây nhập khẩu..."];
  const [typing, setTyping] = useState("");
  const [phIndex, setPhIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = placeholders[phIndex];
    const speed = isDeleting ? 50 : 100;
    
    const timer = setTimeout(() => {
      if (!isDeleting && typing.length < currentText.length) {
        setTyping(currentText.substring(0, typing.length + 1));
      } else if (isDeleting && typing.length > 0) {
        setTyping(currentText.substring(0, typing.length - 1));
      } else if (!isDeleting && typing.length === currentText.length) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && typing.length === 0) {
        setIsDeleting(false);
        setPhIndex((prev) => (prev + 1) % placeholders.length);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [typing, isDeleting, phIndex]);

  // --- MENU CONFIG ---
  const menuItems = [
    { label: "Cửa hàng", icon: <FaStore size={18} />, href: "/system" },
    { label: "Hồ sơ", icon: <FaUser size={16} />, href: "/profile" },
    { label: "Đơn hàng", icon: <FaHistory size={16} />, href: "/history-bought" },
  ];

  const isActive = (path) => {
      if (path === "/products" && location.pathname.startsWith("/products")) return true;
      return location.pathname === path;
  };

  return (
    <header className="w-full bg-white shadow-sm z-50 relative font-sans">
      
      {/* ================= TOP BAR (Desktop & Mobile) ================= */}
      <div className="bg-emerald-700 text-white text-xs sm:text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <p className="hidden sm:block opacity-90">🌱 Bean Farm - Nông sản sạch cho mọi nhà</p>
          <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
             {/* Hotline */}
             <a href="tel:19006750" className="flex items-center gap-2 hover:text-amber-300 transition">
                <FaPhoneAlt size={12} /> <span>1900 6750</span>
             </a>

             {/* User Auth */}
             <div className="relative">
                {user ? (
                  <div 
                    className="flex items-center gap-2 cursor-pointer hover:text-amber-300 transition"
                    onMouseEnter={() => setShowUserMenu(true)}
                    onMouseLeave={() => setShowUserMenu(false)}
                  >
                     <img 
                        src={getImageUrl(user.avatar, 'avatar')} 
                        alt="avatar" 
                        className="w-6 h-6 rounded-full border border-white object-cover"
                        onError={(e) => e.target.src = "https://via.placeholder.com/150"}
                     />
                     <span className="font-medium max-w-[100px] truncate">{user.name}</span>
                     <FaSortDown className="mb-1"/>

                     {/* Dropdown User */}
                     {showUserMenu && (
                        <div className="absolute top-full right-0 pt-2 w-48 z-50">
                           <div className="bg-white text-gray-800 rounded-lg shadow-xl border border-gray-100 overflow-hidden">
                              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-50 hover:text-emerald-600">Hồ sơ cá nhân</Link>
                              <Link to="/history-bought" className="block px-4 py-2 hover:bg-gray-50 hover:text-emerald-600">Lịch sử mua hàng</Link>
                              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">Đăng xuất</button>
                           </div>
                        </div>
                     )}
                  </div>
                ) : (
                  <Link to="/registered" className="flex items-center gap-1 hover:text-amber-300 font-medium">
                     <CiUser size={18} /> Đăng nhập / Đăng ký
                  </Link>
                )}
             </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN HEADER (Desktop) ================= */}
      <div className="hidden md:block border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-8">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
               <img src={logo} alt="Bean Farm" className="h-12 w-auto object-contain" />
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl relative">
               <form onSubmit={handleSearch} className="relative group">
                  <input 
                    type="text" 
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder={typing}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-full pl-5 pr-12 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-sm"
                  />
                  <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 bg-emerald-600 text-white p-1.5 rounded-full hover:bg-emerald-700 transition">
                     <CiSearch size={20} />
                  </button>
               </form>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
                {menuItems.map((item, idx) => (
                   <Link key={idx} to={item.href} className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-emerald-600 transition group">
                      <div className="p-2 rounded-full group-hover:bg-emerald-50 transition">{item.icon}</div>
                      <span className="text-[10px] font-medium uppercase tracking-wide">{item.label}</span>
                   </Link>
                ))}

                {/* Cart */}
                <Link to="/cart" className="relative flex flex-col items-center gap-0.5 text-gray-500 hover:text-emerald-600 transition group">
                   <div className="p-2 rounded-full group-hover:bg-emerald-50 transition relative">
                      <CiShoppingCart size={24} />
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                   </div>
                   <span className="text-[10px] font-medium uppercase tracking-wide">Giỏ hàng</span>
                </Link>
            </div>
        </div>
      </div>

      {/* ================= NAVIGATION BAR (Desktop) ================= */}
      <div className="hidden md:block bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-12">
           
           {/* Category Dropdown */}
           <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
           >
              <button className="flex items-center gap-2 bg-amber-400 text-gray-900 px-6 h-full font-bold uppercase text-sm tracking-wide hover:bg-amber-500 transition rounded-t-sm">
                 <BiAlignLeft size={20} /> Danh mục sản phẩm
              </button>

              {/* Mega Menu */}
              {showDropdown && (
                 <div className="absolute top-full left-0 w-[800px] bg-white shadow-xl border border-gray-100 rounded-b-xl p-6 grid grid-cols-3 gap-6 animate-fade-in-up z-50">
                    {categories.length > 0 ? categories.map((cat) => (
                       <div key={cat.id} className="group">
                          <div 
                            onClick={() => handleCategoryClick(cat.slug, cat.name)}
                            className="flex items-center gap-3 cursor-pointer mb-2 p-2 rounded-lg hover:bg-gray-50 transition"
                          >
                             <img src={getImageUrl(cat.image, 'category')} alt={cat.name} className="w-10 h-10 rounded-full object-cover border" onError={(e) => e.target.style.display='none'} />
                             <h5 className="font-bold text-emerald-800 group-hover:text-emerald-600 transition">{cat.name}</h5>
                          </div>
                          <ul className="pl-14 space-y-1">
                             {cat.children?.map(child => (
                                <li key={child.id}>
                                   <span 
                                     onClick={() => handleCategoryClick(child.slug, child.name)}
                                     className="text-sm text-gray-500 hover:text-emerald-600 hover:translate-x-1 transition-all cursor-pointer block py-0.5"
                                   >
                                      {child.name}
                                   </span>
                                </li>
                             ))}
                          </ul>
                       </div>
                    )) : (
                       <p className="text-gray-400 col-span-3 text-center py-4">Đang cập nhật danh mục...</p>
                    )}
                 </div>
              )}
           </div>

           {/* Main Links */}
           <ul className="flex items-center gap-1 h-full">
              {[
                 { label: "Trang chủ", path: "/" },
                 { label: "Giới thiệu", path: "/about" },
                 { label: "Sản phẩm", path: "/products" },
                 { label: "Tin tức", path: "/posts" },
                 { label: "Liên hệ", path: "/contact" },
                 { label: "Câu hỏi", path: "/request" },
              ].map((link, idx) => (
                 <li key={idx} className="h-full">
                    <Link 
                       to={link.path}
                       className={`h-full px-5 flex items-center text-sm font-semibold transition-colors border-b-2 
                       ${isActive(link.path) 
                          ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50' 
                          : 'border-transparent text-gray-600 hover:text-emerald-600 hover:bg-gray-50'}`}
                    >
                       {link.label}
                    </Link>
                 </li>
              ))}
           </ul>

           {/* Quick Action */}
           <button 
              onClick={handleQuickCheckout}
              className="flex items-center gap-2 text-red-600 font-bold text-sm bg-red-50 px-4 py-1.5 rounded-full hover:bg-red-600 hover:text-white transition-all duration-300 animate-pulse"
           >
              <TbBrandShopee size={20} /> Mua hàng nhanh
           </button>
        </div>
      </div>

      {/* ================= MOBILE HEADER ================= */}
      <div className="md:hidden bg-white sticky top-0 z-40 shadow-sm">
         <div className="px-4 py-3 flex justify-between items-center">
            {/* Hamburger */}
            <button onClick={() => setOpenMenu(true)} className="text-gray-700 p-1">
               <BiAlignLeft size={28} />
            </button>

            {/* Logo */}
            <Link to="/">
               <img src={logo} alt="Bean Farm" className="h-8 w-auto" />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative text-gray-700 p-1">
               <LuShoppingBag size={24} />
               <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
               </span>
            </Link>
         </div>

         {/* Mobile Search */}
         <div className="px-4 pb-3">
            <form onSubmit={handleSearch} className="relative">
               <input 
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="w-full bg-gray-100 border-none rounded-lg py-2 pl-4 pr-10 text-sm focus:ring-1 focus:ring-emerald-500"
               />
               <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <CiSearch size={20} />
               </button>
            </form>
         </div>
      </div>

      {/* ================= MOBILE MENU DRAWER (Slide in) ================= */}
      {/* Overlay */}
      {openMenu && (
         <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={() => setOpenMenu(false)}></div>
      )}
      
      {/* Drawer Content */}
      <div className={`fixed top-0 left-0 h-full w-[280px] bg-white z-[60] shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${openMenu ? 'translate-x-0' : '-translate-x-full'}`}>
         
         <div className="p-4 bg-emerald-700 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
               {user ? (
                  <>
                     <img src={getImageUrl(user.avatar, 'avatar')} className="w-10 h-10 rounded-full border-2 border-white" alt="avatar"/>
                     <div>
                        <p className="font-bold text-sm truncate w-[140px]">{user.name}</p>
                        <p className="text-xs opacity-80">Thành viên</p>
                     </div>
                  </>
               ) : (
                  <Link to="/registered" onClick={() => setOpenMenu(false)} className="flex items-center gap-2 font-bold">
                     <CiUser size={24} /> Đăng nhập
                  </Link>
               )}
            </div>
            <button onClick={() => setOpenMenu(false)}><FaTimes size={20}/></button>
         </div>

         <div className="overflow-y-auto h-[calc(100%-80px)] p-4">
            <h6 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Menu Chính</h6>
            <ul className="space-y-1">
               {[
                  { l: "Trang chủ", i: <FaStore/>, to: "/" },
                  { l: "Sản phẩm", i: <LuShoppingBag/>, to: "/products" },
                  { l: "Tin tức", i: <HiOutlineClipboardDocumentCheck/>, to: "/posts" },
                  { l: "Liên hệ", i: <FaPhoneAlt/>, to: "/contact" },
               ].map((m, idx) => (
                  <li key={idx}>
                     <Link 
                        to={m.to} 
                        onClick={() => setOpenMenu(false)}
                        className={`flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(m.to) ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'}`}
                     >
                        <span className={`${isActive(m.to) ? 'text-emerald-600' : 'text-gray-400'}`}>{m.i}</span>
                        {m.l}
                     </Link>
                  </li>
               ))}
            </ul>

            <div className="mt-6 pt-6 border-t border-gray-100">
               <h6 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Tài khoản</h6>
               <ul className="space-y-1">
                  <li>
                     <Link to="/profile" onClick={() => setOpenMenu(false)} className="flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <span className="text-gray-400"><FaUser/></span> Hồ sơ cá nhân
                     </Link>
                  </li>
                  <li>
                     <Link to="/history-bought" onClick={() => setOpenMenu(false)} className="flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <span className="text-gray-400"><FaHistory/></span> Lịch sử đơn hàng
                     </Link>
                  </li>
                  {user && (
                     <li>
                        <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
                           <span className="text-red-400"><FaSignOutAlt/></span> Đăng xuất
                        </button>
                     </li>
                  )}
               </ul>
            </div>
         </div>
      </div>
    </header>
  );
};

export default HeaderUser;