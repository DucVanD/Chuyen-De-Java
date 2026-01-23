import axiosAdmin from "../axiosAdmin";

const apiVoucherAdmin = {
    // Get all vouchers
    getAll: () =>
        axiosAdmin.get("/admin/vouchers").then((res) => res.data),

    // Get voucher by ID
    getById: (id) =>
        axiosAdmin.get(`/admin/vouchers/${id}`).then((res) => res.data),

    // Create new voucher
    create: (data) =>
        axiosAdmin.post("/admin/vouchers", data).then((res) => res.data),

    // Update voucher
    update: (id, data) =>
        axiosAdmin.put(`/admin/vouchers/${id}`, data).then((res) => res.data),

    // Delete voucher
    delete: (id) =>
        axiosAdmin.delete(`/admin/vouchers/${id}`).then((res) => res.data),
};

export default apiVoucherAdmin;
