import axiosInstance from "./axios";

const apiCategory = {
  // ✅ 1. Lấy tất cả (Spring Boot trả về mảng [])
  getAll: async () => {
    const res = await axiosInstance.get("/categories");
    return res.data; 
  },

  // ⚠️ Lưu ý: Backend hiện tại của bạn chưa viết phân trang (Pagination), 
  // nên tạm thời hàm này sẽ lấy tất cả dữ liệu luôn.
  getAllPage: async (page = 1) => {
    const res = await axiosInstance.get(`/categories`); 
    return res.data; 
  },

  getCategoryById: async (id) => {
    const res = await axiosInstance.get(`/categories/${id}`);
    return res.data;
  },

  // ✅ 2. Thêm mới
  create: async (formData) => {
    // Nếu có upload file thì giữ enableUploadFile, không thì bỏ
    // axiosInstance.enableUploadFile(); 
    const res = await axiosInstance.post("/categories", formData);
    // axiosInstance.enableJson();
    return res.data;
  },

  // ✅ 3. Cập nhật (Dùng method PUT chuẩn của Spring)
  update: async (id, formData) => {
    // axiosInstance.enableUploadFile();
    const res = await axiosInstance.put(`/categories/${id}`, formData);
    // axiosInstance.enableJson();
    return res.data;
  },

  // ✅ 4. Xóa
  delete: async (id) => {
    const res = await axiosInstance.delete(`/categories/${id}`);
    return res; // Trả về nguyên object để check status 204
  }
};

export default apiCategory;