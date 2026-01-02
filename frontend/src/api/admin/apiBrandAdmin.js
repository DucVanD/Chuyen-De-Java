import axiosAdmin from "../axios";

const apiBrandAdmin = {
    // GET ALL
    getAll: () =>
        axiosAdmin.get("/admin/brands").then(res => res.data),

    // GET BY ID
    getById: (id) =>
        axiosAdmin.get(`/admin/brands/${id}`).then(res => res.data),

    // CREATE
    create: (data) =>
        axiosAdmin.post("/admin/brands", data).then(res => res.data),

    // UPDATE
    update: (id, data) =>
        axiosAdmin.put(`/admin/brands/${id}`, data).then(res => res.data),

    // DELETE
    delete: (id) =>
        axiosAdmin.delete(`/admin/brands/${id}`),
};

export default apiBrandAdmin;
