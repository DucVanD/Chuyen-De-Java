import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaFacebookF,
  FaGoogle,
  FaTimesCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import API và Redux Action
import apiAuth from "../../api/apiAuth"; // Sử dụng apiAuth từ code logic
import { loginSuccess } from "../../Redux/authSlice";

const Registered = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // State quản lý UI và Dữ liệu
  const [activeTab, setActiveTab] = useState("login"); // 'login' hoặc 'register'
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: "", // Đổi fullName thành name để khớp với API Logic
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xóa nhanh nội dung input
  const clearField = (field) => {
    setFormData((prev) => ({ ...prev, [field]: "" }));
  };

  // Xử lý Submit Form (Logic chính)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ================= LOGIN LOGIC =================
      if (activeTab === "login") {
        const res = await apiAuth.login({
          email: formData.email,
          password: formData.password,
        });

        // Kiểm tra quyền (Logic từ code 2)
        if (res.user.role !== "CUSTOMER") {
          toast.error("Tài khoản không dành cho trang người dùng");
          setLoading(false);
          return;
        }

        dispatch(loginSuccess({ user: res.user, token: res.token }));
        toast.success("Đăng nhập thành công!");
        
        // Quay lại trang trước đó hoặc về trang chủ
        navigate(location.state?.from || "/");
      } 
      
      // ================= REGISTER LOGIC =================
      else {
        if (formData.password !== formData.confirmPassword) {
          toast.error("Mật khẩu và xác nhận không khớp!");
          setLoading(false);
          return;
        }

        // Gọi API Đăng ký
        await apiAuth.register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        });

        toast.success("Đăng ký thành công!");

        // 👉 Auto Login sau khi đăng ký (Logic từ code 2)
        const loginRes = await apiAuth.login({
          email: formData.email,
          password: formData.password,
        });

        dispatch(
          loginSuccess({
            user: loginRes.user,
            token: loginRes.token,
          })
        );

        navigate("/");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.response?.data?.errors &&
          Object.values(err.response.data.errors).flat().join("\n")) ||
        "Có lỗi xảy ra, vui lòng thử lại!";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-green-600">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700 font-semibold">
          {activeTab === "login" ? "Đăng nhập" : "Đăng ký"}
        </span>
      </nav>

      <div className="flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Tabs Switcher */}
          <div className="flex justify-center space-x-8 border-b border-gray-200 mb-6">
            {["login", "register"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-base font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "login" ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
              </button>
            ))}
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              {activeTab === "login"
                ? "Đăng nhập tài khoản"
                : "Tạo tài khoản mới"}
            </h3>

            <form onSubmit={handleSubmit} noValidate className="space-y-4 relative">
              {/* Các trường chỉ hiện khi Đăng ký */}
              {activeTab === "register" && (
                <>
                  {/* Họ tên */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên
                    </label>
                    <input
                      name="name" // Map với formData.name
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none pr-8"
                      placeholder="Nhập họ và tên"
                    />
                    {formData.name && (
                      <FaTimesCircle
                        onClick={() => clearField("name")}
                        className="absolute right-3 top-9 text-gray-400 hover:text-red-500 cursor-pointer transition"
                      />
                    )}
                  </div>

                  {/* SĐT */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none pr-8"
                      placeholder="Nhập số điện thoại"
                    />
                    {formData.phone && (
                      <FaTimesCircle
                        onClick={() => clearField("phone")}
                        className="absolute right-3 top-9 text-gray-400 hover:text-red-500 cursor-pointer transition"
                      />
                    )}
                  </div>
                </>
              )}

              {/* Email (Dùng chung) */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none pr-8"
                  placeholder="Nhập email của bạn"
                />
                {formData.email && (
                  <FaTimesCircle
                    onClick={() => clearField("email")}
                    className="absolute right-3 top-9 text-gray-400 hover:text-red-500 cursor-pointer transition"
                  />
                )}
              </div>

              {/* Mật khẩu (Dùng chung) */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none pr-16"
                  placeholder="Nhập mật khẩu"
                />
                {formData.password && (
                  <div className="absolute right-3 top-9 flex items-center gap-2">
                    <FaTimesCircle
                      onClick={() => clearField("password")}
                      className="text-gray-400 hover:text-red-500 cursor-pointer transition"
                    />
                    {showPassword ? (
                      <FaEyeSlash
                        onClick={() => setShowPassword(false)}
                        className="text-gray-500 hover:text-green-600 cursor-pointer transition"
                      />
                    ) : (
                      <FaEye
                        onClick={() => setShowPassword(true)}
                        className="text-gray-500 hover:text-green-600 cursor-pointer transition"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Xác nhận mật khẩu (Chỉ hiện khi Đăng ký) */}
              {activeTab === "register" && (
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none pr-16"
                    placeholder="Nhập lại mật khẩu"
                  />
                  {formData.confirmPassword && (
                    <div className="absolute right-3 top-9 flex items-center gap-2">
                      <FaTimesCircle
                        onClick={() => clearField("confirmPassword")}
                        className="text-gray-400 hover:text-red-500 cursor-pointer transition"
                      />
                      {showConfirm ? (
                        <FaEyeSlash
                          onClick={() => setShowConfirm(false)}
                          className="text-gray-500 hover:text-green-600 cursor-pointer transition"
                        />
                      ) : (
                        <FaEye
                          onClick={() => setShowConfirm(true)}
                          className="text-gray-500 hover:text-green-600 cursor-pointer transition"
                        />
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 mt-4 rounded-md font-semibold text-white transition-all ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-400"
                }`}
              >
                {loading
                  ? activeTab === "login"
                    ? "Đang đăng nhập..."
                    : "Đang đăng ký..."
                  : activeTab === "login"
                  ? "Đăng nhập"
                  : "Đăng ký"}
              </button>

              {/* Forgot Password Link */}
              {activeTab === "login" && (
                <div className="text-center mt-3">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-gray-600 hover:text-green-600 transition-all"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              )}

              {/* Social Login Section */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="text-sm text-gray-500">
                  hoặc {activeTab === "login" ? "đăng nhập" : "đăng ký"} bằng
                </span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="flex items-center justify-center py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">
                  <FaFacebookF className="mr-2" /> Facebook
                </button>
                <button type="button" className="flex items-center justify-center py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition">
                  <FaGoogle className="mr-2" /> Google
                </button>
              </div>
            </form>

            {/* Footer Terms */}
            <p className="text-xs sm:text-sm text-center text-gray-500 mt-6">
              Bằng cách {activeTab === "login" ? "đăng nhập" : "đăng ký"}, bạn đồng ý với{" "}
              <Link to="/terms" className="text-green-600 hover:text-green-700">
                Điều khoản
              </Link>{" "}
              và{" "}
              <Link to="/privacy" className="text-green-600 hover:text-green-700">
                Chính sách bảo mật
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registered;