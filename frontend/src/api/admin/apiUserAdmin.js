import axiosAdmin from "../axios";

const apiUserAdmin = {
    // GET ALL
    getAll: () =>
        axiosAdmin.get("/admin/users").then(res => res.data),

    // GET PAGE (Pagination + Search + Roles)
    getPage: (page = 0, size = 10, keyword = "", roles = []) => {
        let url = `/admin/users/page?page=${page}&size=${size}`;
        if (keyword) {
            url += `&keyword=${encodeURIComponent(keyword)}`;
        }
        if (roles && roles.length > 0) {
            url += `&roles=${roles.join(",")}`;
        }
        return axiosAdmin.get(url).then(res => res.data);
    },

    // GET BY ID
    getById: (id) =>
        axiosAdmin.get(`/admin/users/${id}`).then(res => res.data),

    // CREATE
    create: (data, password) =>
        axiosAdmin.post(`/admin/users?password=${password}`, data).then(res => res.data),

    // UPDATE
    update: (id, data) =>
        axiosAdmin.put(`/admin/users/${id}`, data).then(res => res.data),

    // DELETE
    delete: (id) =>
        axiosAdmin.delete(`/admin/users/${id}`).then(res => res.data),

    // LOCK
    lock: (id) =>
        axiosAdmin.put(`/admin/users/${id}/lock`),

    // UNLOCK
    unlock: (id) =>
        axiosAdmin.put(`/admin/users/${id}/unlock`),
};

export default apiUserAdmin;
