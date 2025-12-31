import axiosAdmin from "../axiosAdmin";

const apiStockAdmin = {
    // Lấy tất cả (không phân trang) - Dùng cho các mục đích đặc biệt
    getAll: () => axiosAdmin.get("/admin/stock-movements").then(res => res.data),

    // Lấy có phân trang - Dùng chính cho ListInventory
    getPage: (page = 0, size = 10) =>
        axiosAdmin.get(`/admin/stock-movements/page?page=${page}&size=${size}`).then(res => res.data),

    // Lấy chi tiết
    getById: (id) => axiosAdmin.get(`/admin/stock-movements/${id}`).then(res => res.data),

    // Tạo mới phiếu nhập/xuất (Tự động cập nhật Stock & CostPrice bên Backend)
    create: (data) => axiosAdmin.post("/admin/stock-movements", data).then(res => res.data),

    // Lấy giá nhập cuối cùng của 1 sản phẩm
    getLastImportPrice: (productId) =>
        axiosAdmin.get(`/admin/stock-movements/last-import-price/${productId}`).then(res => res.data),

    // Lấy nhà cung cấp cuối cùng của 1 sản phẩm
    getLastSupplierId: (productId) =>
        axiosAdmin.get(`/admin/stock-movements/last-supplier/${productId}`).then(res => res.data),
};

export default apiStockAdmin;
