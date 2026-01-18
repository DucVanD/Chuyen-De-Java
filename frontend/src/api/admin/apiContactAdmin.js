import axiosAdmin from "../axiosAdmin";

const apiContactAdmin = {
    // Lấy tất cả contacts
    getAll: () => {
        return axiosAdmin.get("/contacts").then(res => res.data);
    },

    // Lấy contact theo ID
    getById: (id) => {
        return axiosAdmin.get(`/contacts/${id}`);
    },

    // Cập nhật contact (Admin trả lời)
    update: (id, data) => {
        return axiosAdmin.put(`/contacts/${id}`, data);
    },

    // Xóa contact
    delete: (id) => {
        return axiosAdmin.delete(`/contacts/${id}`);
    }
};

export default apiContactAdmin;
