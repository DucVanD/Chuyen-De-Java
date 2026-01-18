import axiosAdmin from "../axiosAdmin";

const apiCustomerAdmin = {
    // Lấy danh sách khách hàng đã mua hàng
    getAll: () => {
        return axiosAdmin.get("/admin/customers").then(res => res.data);
    }
};

export default apiCustomerAdmin;
