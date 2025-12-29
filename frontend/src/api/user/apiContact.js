import axiosClient from "./axiosClient"; // Config axios của bạn

const apiContact = {
  // Lấy tất cả
  getAll: () => {
    return axiosClient.get("/contacts");
  },
  
  // Xóa
  delete: (id) => {
    return axiosClient.delete(`/contacts/${id}`);
  },

  // Cập nhật (Dùng để trả lời và đổi status)
  update: (id, data) => {
    return axiosClient.put(`/contacts/${id}`, data);
  }
};

export default apiContact;