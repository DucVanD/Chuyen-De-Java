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
};

export default apiAuth;
