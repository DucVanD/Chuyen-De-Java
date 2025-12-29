import axiosInstance from "../axios";

const apiBrand = {
  // GET ALL
  getAll: () =>
    axiosInstance.get("/brands").then(res => res.data),

  // GET BY ID
  getById: (id) =>
    axiosInstance.get(`/brands/${id}`).then(res => res.data),

  // CREATE
  create: (data) =>
    axiosInstance.post("/brands", data).then(res => res.data),

  // UPDATE
  update: (id, data) =>
    axiosInstance.put(`/brands/${id}`, data).then(res => res.data),

  // DELETE
  delete: (id) =>
    axiosInstance.delete(`/brands/${id}`),
};

export default apiBrand;
