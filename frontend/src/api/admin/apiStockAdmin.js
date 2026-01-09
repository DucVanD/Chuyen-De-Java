import axiosAdmin from "../axios";

const apiStockAdmin = {
    // Lấy tất cả (không phân trang) - Dùng cho các mục đích đặc biệt
    getAll: () => axiosAdmin.get("/admin/stock-movements").then(res => res.data),

    // Lấy có phân trang - Dùng chính cho ListInventory
    getPage: (page = 0, size = 10, excludeType = "") =>
        axiosAdmin.get(`/admin/stock-movements/page?page=${page}&size=${size}&excludeType=${excludeType}`).then(res => res.data),

    // Lấy chi tiết
    getById: (id) => axiosAdmin.get(`/admin/stock-movements/${id}`).then(res => res.data),

    // Tạo mới phiếu nhập/xuất (Tự động cập nhật Stock & CostPrice bên Backend)
    create: (data) => axiosAdmin.post("/admin/stock-movements", data).then(res => res.data),

    // Lấy giá nhập cuối cùng của 1 sản phẩm
    getLastImportPrice: (productId) =>
        axiosAdmin.get(`/admin/stock-movements/last-import-price/${productId}`).then(res => res.data),

    // Lấy nhà cung cấp cuối cùng của 1 sản phẩm
    getLastSupplierId: async (productId) => {
        const res = await axiosAdmin.get(`/admin/stock-movements/last-supplier/${productId}`);
        return res.data;
    },

    getByType: async (type) => {
        const res = await axiosAdmin.get(`/admin/stock-movements/by-type/${type}`);
        return res.data;
    },
};

export default apiStockAdmin;
