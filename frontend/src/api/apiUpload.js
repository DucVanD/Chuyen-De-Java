import axiosInstance from "./axios";

const apiUpload = {

  uploadCategoryImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axiosInstance.post("/upload/category", formData);
    return res.data;
  },

  uploadProductImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axiosInstance.post("/upload/product", formData);
    return res.data;
  },

  uploadBrandImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axiosInstance.post("/upload/brand", formData);
    return res.data;
  },

  uploadUserAvatar: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axiosInstance.post("/upload/user", formData);
    return res.data;
  },

  uploadPostImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axiosInstance.post("/upload/post", formData);
    return res.data;
  }

};

export default apiUpload;
