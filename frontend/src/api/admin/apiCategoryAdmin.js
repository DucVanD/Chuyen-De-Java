import axiosAdmin from "../axios";

const apiCategoryAdmin = {
  // ✅ Phân trang
  getPage: async (page = 0, size = 8) => {
    const res = await axiosAdmin.get("/admin/categories/page", {
      params: { page, size },
    });
    return res.data;
  },

  // ✅ Lấy tất cả (dùng cho dropdown cha)
  getAll: async () => {
    const res = await axiosAdmin.get("/admin/categories");
    return res.data;
  },

  // ✅ Lấy chi tiết theo ID (MỚI THÊM)
  getById: async (id) => {
    const res = await axiosAdmin.get(`/admin/categories/${id}`);
    return res.data;
  },

  // ✅ Tạo mới
  create: async (data) => {
    const res = await axiosAdmin.post("/admin/categories", data);
    return res.data;
  },

  // ✅ Cập nhật
  update: async (id, data) => {
    const res = await axiosAdmin.put(`/admin/categories/${id}`, data);
    return res.data;
  },

  // 🔁 Toggle status
  toggleStatus: async (id) => {
    await axiosAdmin.put(`/admin/categories/${id}/status`);
  },

  // ❌ Xóa
  delete: async (id) => {
    await axiosAdmin.delete(`/admin/categories/${id}`);
    return true;
  },
};

export default apiCategoryAdmin;