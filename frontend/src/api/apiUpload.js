import axiosInstance from "./axios";

const apiUpload = {

  uploadCategoryImage: async (file) => {
    axiosInstance.enableUploadFile();
    const formData = new FormData();
    formData.append("file", file);
    const res = await axiosInstance.post("/upload/category", formData);
    axiosInstance.enableJson();
    return res.data;
  },

  uploadProductImage: async (file) => {
    axiosInstance.enableUploadFile();
    const formData = new FormData();
    formData.append("file", file);
    const res = await axiosInstance.post("/upload/product", formData);
    axiosInstance.enableJson();
    return res.data;
  },

  uploadBrandImage: async (file) => {
    axiosInstance.enableUploadFile();
    const formData = new FormData();
    formData.append("file", file);
    const res = await axiosInstance.post("/upload/brand", formData);
    axiosInstance.enableJson();
    return res.data;
  },

  uploadUserAvatar: async (file) => {
    axiosInstance.enableUploadFile();
    const formData = new FormData();
    formData.append("file", file);
    const res = await axiosInstance.post("/upload/user", formData);
    axiosInstance.enableJson();
    return res.data;
  }

};

export default apiUpload;
