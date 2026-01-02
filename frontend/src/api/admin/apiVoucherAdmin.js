import axiosInstance from "../axios";

const apiVoucherAdmin = {
    // Get all vouchers
    getAll: () =>
        axiosInstance.get("/admin/vouchers").then((res) => res.data),

    // Get voucher by ID
    getById: (id) =>
        axiosInstance.get(`/admin/vouchers/${id}`).then((res) => res.data),

    // Create new voucher
    create: (data) =>
        axiosInstance.post("/admin/vouchers", data).then((res) => res.data),

    // Update voucher
    update: (id, data) =>
        axiosInstance.put(`/admin/vouchers/${id}`, data).then((res) => res.data),

    // Delete voucher
    delete: (id) =>
        axiosInstance.delete(`/admin/vouchers/${id}`).then((res) => res.data),
};

export default apiVoucherAdmin;
