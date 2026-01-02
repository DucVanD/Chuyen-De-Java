import axiosInstance from "../axios";

const apiCategory = {
  // USER chỉ cần danh sách đầy đủ
  getAll: async () => {
    const res = await axiosInstance.get("/categories");
    return res.data;
  },

  getById: async (id) => {
    const res = await axiosInstance.get(`/categories/${id}`);
    return res.data;
  },

  getParentsWithChildren: async () => {
    const res = await axiosInstance.get("/categories/parents-with-children");
    return res.data;
  },
};

export default apiCategory;
