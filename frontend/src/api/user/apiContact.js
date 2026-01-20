import axiosInstance from "../axios";

const apiContact = {
  // Lấy tất cả
  getAll: () => {
    return axiosInstance.get("/contacts");
  },

  // Tạo mới contact
  create: (data) => {
    return axiosInstance.post("/contacts", data);
  },

  // Xóa
  delete: (id) => {
    return axiosInstance.delete(`/contacts/${id}`);
  },

  // Cập nhật (Dùng để trả lời và đổi status)
  update: (id, data) => {
    return axiosInstance.put(`/contacts/${id}`, data);
  }
};

export default apiContact;