import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaTimesCircle } from "react-icons/fa";
import apiAuth from "../../api/apiAuth"; // ⚠️ dùng API CHUNG /auth/login

const AdminLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const clearField = (name) => {
    setForm({ ...form, [name]: "" });
  };

  // =========================
  // SUBMIT LOGIN
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiAuth.login(form);
      const { user, token } = res;

      // ❌ Không phải ADMIN / STAFF → cấm vào admin
      if (!["ADMIN", "STAFF"].includes(user.role)) {
        toast.error("❌ Tài khoản không có quyền truy cập trang quản trị!");
        return;
      }

      // ✅ Lưu riêng cho ADMIN
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(user));

      toast.success("✅ Đăng nhập quản trị thành công!");
      navigate("/admin/dashboard");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          toast.error("❌ Sai email hoặc mật khẩu!");
        } else if (error.response.status === 403) {
          toast.error("❌ Không có quyền truy cập!");
        } else {
          toast.error("❌ Lỗi hệ thống, vui lòng thử lại!");
        }
      } else {
        toast.error("❌ Không thể kết nối tới máy chủ!");
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg')",
      }}
    >
      <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md border border-white/30">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-amber-700">
          🛒 Siêu Thị Mini – Admin
        </h2>

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div className="mb-5 relative">
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Nhập email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg pr-10 focus:ring-2 focus:ring-amber-500 outline-none"
              required
            />
            {form.email && (
              <FaTimesCircle
                className="absolute right-3 top-11 text-gray-400 hover:text-red-500 cursor-pointer"
                onClick={() => clearField("email")}
              />
            )}
          </div>

          {/* PASSWORD */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 font-medium mb-2">
              Mật khẩu
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg pr-12 focus:ring-2 focus:ring-pink-400 outline-none"
              required
            />
            {form.password && (
              <div className="absolute right-3 top-11 flex gap-2">
                <FaTimesCircle
                  className="text-gray-400 hover:text-red-500 cursor-pointer"
                  onClick={() => clearField("password")}
                />
                {showPassword ? (
                  <FaEyeSlash
                    className="text-gray-500 hover:text-pink-500 cursor-pointer"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <FaEye
                    className="text-gray-500 hover:text-pink-500 cursor-pointer"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
            )}
          </div>

          {/* FORGOT */}
          <div className="text-right mb-6">
            <button
              type="button"
              className="text-sm text-indigo-700 hover:text-pink-500"
              onClick={() =>
                toast.info("Vui lòng liên hệ ADMIN để đặt lại mật khẩu")
              }
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-pink-400 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} Siêu Thị Mini — Admin Portal
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
