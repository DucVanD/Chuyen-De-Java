import axiosInstance from "../axios";

const apiUser = {
  // =====================
  // GET
  // =====================
  getAll: () =>
    axiosInstance.get("/users").then((res) => res.data),

  getById: (id) =>
    axiosInstance.get(`/users/${id}`).then((res) => res.data),

  // =====================
  // CREATE
  // =====================
  create: (data, password) =>
    axiosInstance
      .post(`users?password=${password}`, data)
      .then((res) => res.data),

  // =====================
  // UPDATE
  // =====================
  update: (id, data) =>
    axiosInstance
      .put(`users/${id}`, data)
      .then((res) => res.data),

  // =====================
  // STATUS
  // =====================
  lock: (id) =>
    axiosInstance.put(`users/${id}/lock`),

  unlock: (id) =>
    axiosInstance.put(`users/${id}/unlock`),
};

export default apiUser;
