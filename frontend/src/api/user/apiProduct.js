import axiosInstance from "../axios";

const apiProduct = {
  getAll: () =>
    axiosInstance.get("/products").then(res => res.data),

  search: (keyword) =>
    axiosInstance
      .get("/products/search", { params: { keyword } })
      .then(res => res.data),

  filter: (categoryId, brandId, status, minPrice, maxPrice, hasPromotion) =>
    axiosInstance
      .get("/products/filter", {
        params: {
          categoryId: categoryId || undefined,
          brandId: brandId || undefined,
          status: status ?? undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          hasPromotion: hasPromotion ?? undefined,
        },
      })
      .then(res => res.data),

  getById: (id) =>
    axiosInstance.get(`/products/${id}`).then(res => res.data),

  create: (data) =>
    axiosInstance.post("/products", data).then(res => res.data),

  update: (id, data) =>
    axiosInstance.put(`/products/${id}`, data).then(res => res.data),

  delete: (id) =>
    axiosInstance.delete(`/products/${id}`),
};

export default apiProduct;
