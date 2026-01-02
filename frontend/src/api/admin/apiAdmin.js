import axiosAdmin from "../axios";

const apiAdmin = {
  getUsers: () =>
    axiosAdmin.get("/admin/users").then((res) => res.data),

  getProducts: () =>
    axiosAdmin.get("/admin/products").then((res) => res.data),
};

export default apiAdmin;
