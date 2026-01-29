import axiosInstance from "../axios";

const apiCart = {
    getMyCart: () => {
        return axiosInstance.get("/cart");
    },
    addToCart: (productId, quantity) => {
        return axiosInstance.post(`/cart/add?productId=${productId}&quantity=${quantity}`);
    },
    updateItem: (itemId, quantity) => {
        return axiosInstance.put(`/cart/update/${itemId}?quantity=${quantity}`);
    },
    removeItem: (itemId) => {
        return axiosInstance.delete(`/cart/remove/${itemId}`);
    },
    clearCart: () => {
        return axiosInstance.delete("/cart/clear");
    }
};

export default apiCart;
