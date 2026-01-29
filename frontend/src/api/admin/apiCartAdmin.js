import axiosAdmin from "../axiosAdmin";

const apiCartAdmin = {
    getAll: (page = 1) => {
        return axiosAdmin.get(`/admin/carts`);
    },
    getById: (id) => {
        return axiosAdmin.get(`/admin/carts/${id}`);
    }
};

export default apiCartAdmin;
