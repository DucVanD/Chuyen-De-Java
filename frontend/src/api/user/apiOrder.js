// import { Edit } from "lucide-react";
import axiosInstance from "../axios";
import { apiURL } from "../config"; // nếu cần dùng URL đầy đủ

const apiOrder = {
  getAllPage: async (page = 1) => {
    const res = await axiosInstance.get(`/orders?page=${page}`);
    return res.data;
  },

  //
  getAllFilter: async (page = 1, filters = {}) => {
    const params = new URLSearchParams({ page, ...filters }).toString();
    const res = await axiosInstance.get(`/orders?${params}`);
    return res.data;
  },
  //

  getOrderId: async (id) => {
    const res = await axiosInstance.get(`/orders/${id}`);
    return res.data;
  },

  editOrder: async (id, orderData) => {
    const res = await axiosInstance.put(`/orders/${id}`, orderData);
    return res.data;
  },
  checkout: async (orderData) => {
    const token = localStorage.getItem("token");
    const res = await axiosInstance.post("/orders", orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },

  exportInvoice: async (id) => {
    window.open(`${apiURL}/orders/${id}/invoice`, "_blank");
  },


  createVnpayPayment: async (amount) => {
    const token = localStorage.getItem("token");
    const res = await axiosInstance.post(
      "/vnpay/create",
      { amount },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  },


  delete: async (id) => {
    const res = await axiosInstance.get(`/order/delete/${id}`); // dùng GET như route
    return res.data;
  },
  //  
  cancelOrder: async (id, reason) => {
    // Backend: @PutMapping("/{id}/cancel") in @RequestMapping("/api/orders")
    // Request param 'reason' is expected, not body JSON
    const res = await axiosInstance.put(`/orders/${id}/cancel?reason=${encodeURIComponent(reason)}`);
    return res.data;
  },

  // cancelOrder: async (id, reason) => {
  //   const res = await axiosInstance.put(`/order/${id}`, {
  //     status: 7, // Đã hủy
  //     note: reason,
  //   });
  //   return res.data;
  // },

  // Get user's order history with filters
  getMyOrders: async (page = 1, filters = {}) => {
    const params = new URLSearchParams({ page, ...filters }).toString();
    const res = await axiosInstance.get(`/orders/my-orders?${params}`);
    return res.data;
  },

};

export default apiOrder;
