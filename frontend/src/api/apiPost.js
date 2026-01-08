import axiosInstance from "./axios";

const apiPost = {
  // 1. Lấy danh sách tất cả bài viết
  // Khớp với @GetMapping trong Controller
  getAll: async () => {
    const res = await axiosInstance.get("/posts");
    return res.data;
  },

  // 2. Lấy chi tiết bài viết theo ID
  // Khớp với @GetMapping("/{id}")
  getById: async (id) => {
    const res = await axiosInstance.get(`/posts/${id}`);
    return res.data;
  },

  // 3. Cập nhật bài viết (QUAN TRỌNG NHẤT)
  // - Sử dụng phương thức PUT khớp với @PutMapping("/{id}")
  // - Gửi dữ liệu dưới dạng multipart/form-data để xử lý file thumbnail
  update: async (id, data) => {
    const res = await axiosInstance.put(`/posts/${id}`, data, {
      headers: { 
        "Content-Type": "multipart/form-data" 
      },
    });
    return res.data;
  },

  // 4. Tạo mới bài viết
  // Khớp với @PostMapping và nhận FormData
  create: async (data) => {
    const res = await axiosInstance.post("/posts", data, {
      headers: { 
        "Content-Type": "multipart/form-data" 
      },
    });
    return res.data;
  },

  // 5. Xóa bài viết
  // Khớp với @DeleteMapping("/{id}")
  delete: async (id) => {
    const res = await axiosInstance.delete(`/posts/${id}`);
    return res.data;
  }
};

export default apiPost;