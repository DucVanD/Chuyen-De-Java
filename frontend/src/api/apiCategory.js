import axiosInstance from "./axios";

const apiCategory = {
  getAll: async () => {
    const res = await axiosInstance.get("/categories");
    return res.data;
  },

  getAllPage: async () => {
    const res = await axiosInstance.get("/categories");
    return res.data;
  },

  getCategoryById: async (id) => {
    const res = await axiosInstance.get(`/categories/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await axiosInstance.post("/categories", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await axiosInstance.put(`/categories/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    await axiosInstance.delete(`/categories/${id}`);
    return true;
  }
};

export default apiCategory;
