import axios from "axios";
import { apiURL } from "./config";

const axiosAdmin = axios.create({
  baseURL: apiURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosAdmin.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosAdmin;
