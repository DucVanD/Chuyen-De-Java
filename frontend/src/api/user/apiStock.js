import axiosInstance from "../axios";

const apiStock = {
  // Danh sách biến động kho
  getAll: () =>
    axiosInstance.get("/stock-movements").then(res => res.data),

  // Tạo biến động kho (IN / OUT / RETURN / ADJUSTMENT)
  create: (data) =>
    axiosInstance.post("/stock-movements", data).then(res => res.data),

  getLastImportPrice: (productId) =>
    axiosInstance
      .get(`/stock-movements/last-import-price/${productId}`)
      .then(res => res.data),

};


export default apiStock;
