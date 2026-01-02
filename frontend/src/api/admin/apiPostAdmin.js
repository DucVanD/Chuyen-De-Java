import axiosAdmin from "../axios";

const apiPostAdmin = {
    getAll: () =>
        axiosAdmin.get("/admin/post").then(res => res.data),

    getPage: (page = 0, size = 8, type = 'POST') =>
        axiosAdmin.get("/admin/post/page", { params: { page, size, type } }).then(res => res.data),

    uploadImage: (formData) =>
        axiosAdmin.post("/upload/image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }).then(res => res.data),

    getById: (id) =>
        axiosAdmin.get(`/admin/post/${id}`).then(res => res.data),

    create: (data) =>
        axiosAdmin.post("/admin/post", data).then(res => res.data),

    update: (id, data) =>
        axiosAdmin.put(`/admin/post/${id}`, data).then(res => res.data),

    toggleStatus: (id) =>
        axiosAdmin.put(`/admin/post/${id}/status`).then(res => res.data),

    delete: (id) =>
        axiosAdmin.delete(`/admin/post/${id}`).then(res => res.data),
};

export default apiPostAdmin;
