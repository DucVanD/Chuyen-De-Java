import axiosInstance from "./axios";

const apiSupplier = {
  getAll: () =>
    axiosInstance.get("/suppliers").then(res => res.data),

  getById: (id) =>
    axiosInstance.get(`/suppliers/${id}`).then(res => res.data),

  create: (data) =>
    axiosInstance.post("/suppliers", data).then(res => res.data),

  update: (id, data) =>
    axiosInstance.put(`/suppliers/${id}`, data).then(res => res.data),

  delete: (id) =>
    axiosInstance.delete(`/suppliers/${id}`),
};

export default apiSupplier;
