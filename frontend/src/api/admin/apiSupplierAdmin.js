import axiosAdmin from "../axios";

const apiSupplierAdmin = {
    // Lấy tất cả (không phân trang)
    getAll: () => axiosAdmin.get("/admin/suppliers").then(res => res.data),

    // Lấy có phân trang
    getPage: (page = 0, size = 10) =>
        axiosAdmin.get(`/admin/suppliers/page?page=${page}&size=${size}`).then(res => res.data),

    // Lấy chi tiết
    getById: (id) => axiosAdmin.get(`/admin/suppliers/${id}`).then(res => res.data),

    // Tạo mới
    create: (data) => axiosAdmin.post("/admin/suppliers", data).then(res => res.data),

    // Cập nhật
    update: (id, data) => axiosAdmin.put(`/admin/suppliers/${id}`, data).then(res => res.data),

    // Xóa
    delete: (id) => axiosAdmin.delete(`/admin/suppliers/${id}`),
};

export default apiSupplierAdmin;
