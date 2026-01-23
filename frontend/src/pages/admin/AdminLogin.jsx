import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaTimesCircle } from "react-icons/fa";
import apiAuth from "../../api/apiAuth";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("expired") === "true") {
      toast.info("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại!", {
        toastId: "admin-session-expired",
      });
      navigate("/admin/login", { replace: true });
    }
  }, [location, navigate]);

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

    // 🔹 Client-side granular check
    if (!form.email) {
      toast.error("Email không được để trống");
      return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Email không đúng định dạng");
      return;
    }

    if (!form.password) {
      toast.error("Mật khẩu không được để trống");
    }
    setLoading(true);
    try {
      const res = await apiAuth.login(form);
      const { user } = res;

      // 🔐 CHECK ROLE (ADMIN / STAFF)
      if (user.role !== "ADMIN" && user.role !== "STAFF") {
        toast.error("Tài khoản không có quyền truy cập Admin");
        return;
      }

      // 👉 Lưu thông tin Admin (Token được xử lý bằng Cookie)
      localStorage.setItem("adminUser", JSON.stringify(user));

      toast.success("Đăng nhập Admin thành công!");
      navigate("/admin");
    } catch (err) {
      // ✅ ĐỒNG BỘ BACKEND MESSAGE
      const message =
        err.response?.data?.message || "Đăng nhập thất bại";
      toast.error(message);
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

        <form onSubmit={handleSubmit} noValidate>
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
                toast.info("Vui lòng liên hệ Super Admin để đặt lại mật khẩu")
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
