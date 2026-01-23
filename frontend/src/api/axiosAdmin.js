import axios from "axios";
import { apiURL } from "./config";

const axiosAdmin = axios.create({
  baseURL: apiURL,
  withCredentials: true, // ✅ Cho phép gửi/nhận Cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Response Interceptor: Xử lý Refresh Token cho Admin
axiosAdmin.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 (Unauthorized) - Thử Refresh Token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Gọi endpoint refresh
        await axios.post(`${apiURL}/auth/refresh`, {}, { withCredentials: true });

        // Nếu refresh thành công, thực hiện lại request gốc
        return axiosAdmin(originalRequest);
      } catch (refreshError) {
        console.error("Phiên quản trị hết hạn, vui lòng đăng nhập lại.");
        localStorage.removeItem("adminUser");
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login"; // Chuyển về trang đăng nhập admin
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosAdmin;
