import axiosInstance from "./axios";

const apiCategory = {
  getPage: (page = 0, size = 8) =>
    axiosInstance
      .get("/categories/page", {
        params: { page, size }
      })
      .then(res => res.data),

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
