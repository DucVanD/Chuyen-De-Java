import axiosAdmin from "../axiosAdmin";

const apiTopicAdmin = {
    getAll: () =>
        axiosAdmin.get("/admin/topic").then(res => res.data),

    getPage: (page = 0, size = 8) =>
        axiosAdmin.get("/admin/topic/page", { params: { page, size } }).then(res => res.data),

    getById: (id) =>
        axiosAdmin.get(`/admin/topic/${id}`).then(res => res.data),

    create: (data) =>
        axiosAdmin.post("/admin/topic", data).then(res => res.data),

    update: (id, data) =>
        axiosAdmin.put(`/admin/topic/${id}`, data).then(res => res.data),

    toggleStatus: (id) =>
        axiosAdmin.put(`/admin/topic/${id}/status`).then(res => res.data),

    delete: (id) =>
        axiosAdmin.delete(`/admin/topic/${id}`).then(res => res.data),
};

export default apiTopicAdmin;
