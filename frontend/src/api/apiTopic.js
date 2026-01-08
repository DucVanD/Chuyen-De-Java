import axiosInstance from "./axios";

const apiTopic = {
  // Lấy danh sách
  getAll: async () => {
    const res = await axiosInstance.get("/topics");
    return res.data;
  },

  // Lấy chi tiết (Dùng cho cả nút con mắt và trang Edit)
  getTopicById: async (id) => {
    const res = await axiosInstance.get(`/topics/${id}`);
    return res.data;
  },

  // Thêm mới
  create: async (data) => {
    const res = await axiosInstance.post("/topics", data);
    return res.data;
  },

  // Cập nhật
  update: async (id, data) => {
    const res = await axiosInstance.put(`/topics/${id}`, data);
    return res.data;
  },

  // Toggle trạng thái (Sửa lỗi 404)
  toggleStatus: async (id) => {
    const res = await axiosInstance.get(`/topics/${id}/toggle`);
    return res.data;
  },

  // Xóa
  delete: async (id) => {
    const res = await axiosInstance.delete(`/topics/${id}`);
    return res.data;
  }
};

export default apiTopic;