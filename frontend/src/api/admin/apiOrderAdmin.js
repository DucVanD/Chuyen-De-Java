import axiosAdmin from "../axiosAdmin";

const apiOrderAdmin = {
    // Paginated list with filters
    getPage: (page = 0, size = 10, filters = {}) => {
        const params = new URLSearchParams({ page, size, ...filters });
        return axiosAdmin.get(`/admin/orders/page?${params}`).then(res => res.data);
    },

    // Get all orders (no pagination)
    getAll: () =>
        axiosAdmin.get("/admin/orders").then(res => res.data),

    // Get order by ID
    getById: (id) =>
        axiosAdmin.get(`/admin/orders/${id}`).then(res => res.data),

    // Update order status
    updateStatus: (id, data) =>
        axiosAdmin.put(`/admin/orders/${id}/status`, data).then(res => res.data),

    // Delete order (admin only)
    delete: (id) =>
        axiosAdmin.delete(`/admin/orders/${id}`).then(res => res.data),

    // Trash management
    getTrash: () =>
        axiosAdmin.get("/admin/orders/trash").then(res => res.data),

    restore: (id) =>
        axiosAdmin.post(`/admin/orders/${id}/restore`).then(res => res.data),

    permanentDelete: (id) =>
        axiosAdmin.delete(`/admin/orders/${id}/permanent`).then(res => res.data),
};

export default apiOrderAdmin;
