// src/api/axiosInstance.js
import axios from "axios";
import { apiURL } from "./config";

// === Tạo instance chung ===
const axiosInstance = axios.create({
  baseURL: apiURL,
  timeout: 20000, // tăng lên 20s vì Render cold-start chậm
  withCredentials: true, // ✅ Quan trọng: Cho phép gửi/nhận Cookie
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ Interceptor: Request (Dùng Cookie nên không cần gắn Header Authorization)
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// === Chế độ upload ===
axiosInstance.enableUploadFile = () => {
  axiosInstance.defaults.headers["Content-Type"] = "multipart/form-data";
};

// === Chế độ JSON ===
axiosInstance.enableJson = () => {
  axiosInstance.defaults.headers["Content-Type"] = "application/json";
};

// === Response Interceptor: Xử lý Refresh Token & Retry ===
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // 1. Nếu lỗi 401 (Unauthorized) - Thử Refresh Token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Gọi endpoint refresh (Backend sẽ đọc refreshToken từ cookie)
        await axios.post(`${apiURL}/auth/refresh`, {}, { withCredentials: true });

        // Nếu refresh thành công, thực hiện lại request gốc
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Nếu refresh cũng fail -> Token hết hạn hoàn toàn -> Logout sạch sẽ
        console.error("Phiên làm việc hết hạn, vui lòng đăng nhập lại.");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/registered?expired=true"; // Chuyển về trang đăng nhập/đăng ký với cờ thông báo
        return Promise.reject(refreshError);
      }
    }

    // 2. Retry khi timeout (Render bị ngủ)
    if (error.code === "ECONNABORTED" && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn("⏳ Retry request sau khi Render khởi động lại...");
      return axiosInstance.request(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
