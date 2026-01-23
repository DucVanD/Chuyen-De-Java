import axiosInstance from "../axios";

const apiOrderAdmin = {
    // Paginated list with filters
    getPage: (page = 0, size = 10, filters = {}) => {
        const params = new URLSearchParams({ page, size, ...filters });
        return axiosInstance.get(`/admin/orders/page?${params}`).then(res => res.data);
    },

    // Get all orders (no pagination)
    getAll: () =>
        axiosInstance.get("/admin/orders").then(res => res.data),

    // Get order by ID
    getById: (id) =>
        axiosInstance.get(`/admin/orders/${id}`).then(res => res.data),

    // Update order status
    updateStatus: (id, data) =>
        axiosInstance.put(`/admin/orders/${id}/status`, data).then(res => res.data),

    // Delete order (admin only)
    delete: (id) =>
        axiosInstance.delete(`/admin/orders/${id}`).then(res => res.data),

    // Trash management
    getTrash: () =>
        axiosInstance.get("/admin/orders/trash").then(res => res.data),

    restore: (id) =>
        axiosInstance.post(`/admin/orders/${id}/restore`).then(res => res.data),

    permanentDelete: (id) =>
        axiosInstance.delete(`/admin/orders/${id}/permanent`).then(res => res.data),
};

export default apiOrderAdmin;
