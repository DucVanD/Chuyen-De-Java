import axiosInstance from "../axios";

const apiProduct = {
  getAll: (page = 1, size = 12) =>
    axiosInstance.get("/products", {
      params: { page: page - 1, size }
    }).then(res => res.data),

  search: (keyword) =>
    axiosInstance
      .get("/products/search", { params: { keyword } })
      .then(res => res.data),

  filter: (params) => {
    const { page, size, name, ...rest } = params;
    return axiosInstance
      .get("/products/filter", {
        params: {
          ...rest,
          keyword: name || undefined,
          page: (page || 1) - 1, // Backend uses 0-based page index
          size: size || 12,
        },
        // Force axios to send arrays as ?id=1&id=2 instead of ?id[]=1
        paramsSerializer: {
          indexes: null
        }
      })
      .then(res => res.data);
  },

  getById: (id) =>
    axiosInstance.get(`/products/${id}`).then(res => res.data),

  create: (data) =>
    axiosInstance.post("/products", data).then(res => res.data),

  update: (id, data) =>
    axiosInstance.put(`/products/${id}`, data).then(res => res.data),

  delete: (id) =>
    axiosInstance.delete(`/products/${id}`),


  getLatest: (limit = 8) =>
    axiosInstance
      .get("/products/latest", { params: { limit } })
      .then(res => res.data),

  getProductBySlug: (slug) =>
    axiosInstance.get(`/products/slug/${slug}`).then((res) => res.data),

  getRelatedProducts: (productId, categoryId) =>
    axiosInstance
      .get(`/products/${productId}/related`, { params: { categoryId, limit: 4 } })
      .then((res) => res.data),


  getHomeCategories: () =>
    axiosInstance.get("/products/home-categories").then(res => res.data),

  getLatestDiscount: (limit = 8) =>
    axiosInstance.get("/products/filter", {
      params: { hasPromotion: true, page: 0, size: limit }
    }).then(res => res.data),
};

export default apiProduct;
