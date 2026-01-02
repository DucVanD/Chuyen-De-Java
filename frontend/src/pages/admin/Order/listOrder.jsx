import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import apiOrderAdmin from "../../../api/admin/apiOrderAdmin";
import {
  FaTrash,
  FaEye,
  FaEdit,
  FaSearch,
} from "react-icons/fa";
import { toast } from "react-toastify";
const ListOrder = () => {
  const { page } = useParams();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(Number(page) || 1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // 🔹 Tiêu chí lọc
  const [filters, setFilters] = useState({
    status: "",
    payment: "",
    order_code: "",
  });

  // Danh sách trạng thái đơn hàng (Backend Enum)
  const statusLabels = {
    PENDING: { text: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" },
    CONFIRMED: { text: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
    SHIPPING: { text: "Đang giao", color: "bg-teal-100 text-teal-800" },
    COMPLETED: { text: "Hoàn thành", color: "bg-green-100 text-green-800" },
    CANCELLED: { text: "Đã hủy", color: "bg-red-100 text-red-800" },
  };

  // 🔹 Lấy danh sách đơn hàng
  const fetchOrders = async (page = 0) => {
    setLoading(true);
    try {
      const res = await apiOrderAdmin.getPage(page, 10, filters);
      setOrders(res.content || []);
      setCurrentPage(res.number);
      setLastPage(res.totalPages - 1);
    } catch (err) {
      console.error("Lỗi khi lấy đơn hàng:", err);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const pageNumber = Number(page) || 0;
    fetchOrders(pageNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Phân trang
  const goToPage = (pageNumber) => {
    if (pageNumber >= 0 && pageNumber <= lastPage) {
      localStorage.setItem("currentOrderPage", pageNumber);
      navigate(`/admin/orders/${pageNumber}`);
    }
  };


  // Áp dụng bộ lọc
  const handleFilter = () => {
    navigate(`/admin/orders/0`);
    fetchOrders(0);
  };

  // Xóa đơn hàng
  const deleteOrder = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa đơn hàng này không?")) {
      try {
        await apiOrderAdmin.delete(id);
        toast.success("✅ Đã xóa đơn hàng thành công!");
        setTimeout(() => fetchOrders(currentPage), 1000);
      } catch (error) {
        const message = error.response?.data?.message || "Đã xảy ra lỗi. Không thể xóa đơn hàng.";
        toast.error("⚠️ " + message);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-6 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-0">
          Danh sách đơn hàng
        </h3>
        <div className="flex space-x-3">
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center transition duration-200">
            <FaTrash className="mr-2" /> Thùng rác
          </button>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="p-4 flex flex-col md:flex-row md:items-end gap-4 border-b border-gray-200 bg-gray-50">
        {/* Trạng thái */}
        <div>
          <label className="text-sm text-gray-600 block mb-1">Trạng thái</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="border rounded-md p-2 text-sm w-48"
          >
            <option value="">Tất cả</option>
            <option value="PENDING">Chờ xử lý</option>
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="SHIPPING">Đang giao</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>

        {/* Phương thức thanh toán */}
        <div>
          <label className="text-sm text-gray-600 block mb-1">Phương thức</label>
          <select
            value={filters.payment}
            onChange={(e) => setFilters({ ...filters, payment: e.target.value })}
            className="border rounded-md p-2 text-sm w-48"
          >
            <option value="">Tất cả</option>
            <option value="COD">Tiền mặt (COD)</option>
            <option value="BANK">Chuyển khoản</option>
            <option value="VNPAY">VNPAY</option>
          </select>
        </div>

        {/* Mã hóa đơn */}
        <div>
          <label className="text-sm text-gray-600 block mb-1">Mã hóa đơn</label>
          <input
            type="text"
            placeholder="Nhập mã đơn..."
            value={filters.order_code}
            onChange={(e) =>
              setFilters({ ...filters, order_code: e.target.value })
            }
            className="border rounded-md p-2 text-sm w-48"
          />
        </div>

        <button
          onClick={handleFilter}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
        >
          <FaSearch /> {loading ? "Đang lọc..." : "Lọc"}
        </button>
      </div>

      {/* Bảng đơn hàng */}
      <div className="p-6 overflow-x-auto">
        <table className="w-full border-collapse text-center">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Mã đơn</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Thanh toán</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Chức năng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.length > 0 ? (
              orders.map((order) => {
                const status = statusLabels[order.status] || {
                  text: "Không xác định",
                  color: "bg-gray-100 text-gray-800",
                };
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{order.id}</td>
                    <td className="px-4 py-3 text-sm font-mono">{order.orderCode}</td>
                    <td className="px-4 py-3 text-sm">{order.receiverName}</td>
                    <td className="px-4 py-3 text-sm">
                      {Number(order.totalAmount).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm">{order.paymentMethod}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${status.color}`}
                      >
                        {status.text}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <div className="flex items-center justify-center gap-3 text-lg">
                        <button
                          onClick={() =>
                            navigate(`/admin/order/detail/${order.id}`)
                          }
                          className="text-indigo-500 hover:text-indigo-700"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/admin/order/edit/${order.id}`)
                          }
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  Không có đơn hàng phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Phân trang */}
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Trước
          </button>
          {Array.from({ length: lastPage }, (_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === lastPage}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>
    </div >
  );
};

export default ListOrder;
