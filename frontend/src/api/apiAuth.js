import axiosInstance from "./axios";

const apiAuth = {
  register: async (data) => {
    /**
     * data = {
     *   name,
     *   email,
     *   phone,
     *   password,
     *   confirmPassword
     * }
     */
    const res = await axiosInstance.post("/auth/register", data);
    return res.data;
  },
  login: (data) =>
    axiosInstance.post("/auth/login", data).then((res) => res.data),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
  },

  // Forgot Password Flow
  forgotPassword: async (email) => {
    const res = await axiosInstance.post("/auth/forgot-password", { email });
    return res.data;
  },

  verifyCode: async (email, code) => {
    const res = await axiosInstance.post("/auth/verify-code", { email, code });
    return res.data;
  },

  resetPassword: async (email, code, newPassword) => {
    const res = await axiosInstance.post("/auth/reset-password", {
      email,
      code,
      newPassword
    });
    return res.data;
  },
};

export default apiAuth;
export const { forgotPassword, verifyCode, resetPassword } = apiAuth;

