import axiosAdmin from "../axiosAdmin";

const apiProductAdmin = {
    // GET ALL (List)
    getAll: () =>
        axiosAdmin.get("/admin/products").then(res => res.data),

    // GET PAGE (Pagination)


    getPage: async (page = 0, size = 8) => {
        const res = await axiosAdmin.get("/admin/products/page", {
            params: { page, size },
        });
        return res.data;
    },


    // GET BY ID
    getById: (id) =>
        axiosAdmin.get(`/admin/products/${id}`).then(res => res.data),

    // CREATE
    create: (data) =>
        axiosAdmin.post("/admin/products", data).then(res => res.data),

    // UPDATE
    update: (id, data) =>
        axiosAdmin.put(`/admin/products/${id}`, data).then(res => res.data),

    // DELETE
    delete: (id) =>
        axiosAdmin.delete(`/admin/products/${id}`),

    // SEARCH (Paginated)
    search: (keyword, page = 0, size = 8) =>
        axiosAdmin.get(`/admin/products/search?keyword=${keyword}&page=${page}&size=${size}`).then(res => res.data),

    // FILTER (Paginated)
    filter: (categoryId, brandId, status, minPrice, maxPrice, hasPromotion, page = 0, size = 8) => {
        const params = new URLSearchParams();
        if (categoryId) params.append("categoryId", categoryId);
        if (brandId) params.append("brandId", brandId);
        if (status) params.append("status", status);
        if (minPrice) params.append("minPrice", minPrice);
        if (maxPrice) params.append("maxPrice", maxPrice);
        if (hasPromotion) params.append("hasPromotion", hasPromotion);

        params.append("page", page);
        params.append("size", size);

        return axiosAdmin.get(`/admin/products/filter?${params.toString()}`).then(res => res.data);
    }
};

export default apiProductAdmin;
