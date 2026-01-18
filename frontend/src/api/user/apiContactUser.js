import axiosInstance from "../axios";

const apiContactUser = {
    // Lấy contacts theo mã đơn hàng
    getByOrderCode: (orderCode) => {
        return axiosInstance.get(`/user/contacts/order/${orderCode}`).then(res => res.data);
    }
};

export default apiContactUser;
